<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class Supabase
{
    private string $url;

    private string $publishableKey;

    public function __construct()
    {
        $this->url = rtrim((string) config('services.supabase.url'), '/');
        $this->publishableKey = (string) config('services.supabase.publishable_key');
    }

    public function signUp(string $name, string $email, string $password): bool
    {
        $response = $this->http()->post("{$this->url}/auth/v1/signup", [
            'email' => $email,
            'password' => $password,
            'data' => ['full_name' => $name, 'privacy_consent' => true],
        ]);
        if ($response->failed()) {
            $this->fail($response);
        }

        $body = $response->json() ?? [];
        if (empty($body['access_token'])) {
            return false;
        }

        $this->storeSession($body);

        return true;
    }

    public function signIn(string $email, string $password): void
    {
        $response = $this->http()->post("{$this->url}/auth/v1/token?grant_type=password", [
            'email' => $email,
            'password' => $password,
        ]);
        if ($response->failed()) {
            $this->fail($response);
        }

        $this->storeSession($response->json() ?? []);
    }

    public function signOut(): void
    {
        $token = $this->accessToken();
        if ($token) {
            $this->http($token)->post("{$this->url}/auth/v1/logout");
        }

        session()->forget('supabase');
    }

    public function updatePassword(string $password): void
    {
        $response = $this->http($this->requireToken())->put("{$this->url}/auth/v1/user", [
            'password' => $password,
        ]);
        if ($response->failed()) {
            $this->fail($response);
        }
    }

    public function updateCustomerProfile(string $fullName): void
    {
        $this->rpc('update_customer_profile', ['p_full_name' => $fullName], true);
    }

    public function user(): ?array
    {
        return session('supabase.user');
    }

    public function profile(): ?array
    {
        $token = $this->accessToken();
        $user = $this->user();
        if (! $token || empty($user['id'])) {
            return null;
        }

        $response = $this->http($token)->get("{$this->url}/rest/v1/profiles", [
            'select' => 'id,full_name,role,is_active,branch_id',
            'id' => 'eq.'.$user['id'],
            'limit' => 1,
        ]);
        if ($response->failed()) {
            $this->fail($response);
        }

        $profile = ($response->json() ?? [])[0] ?? null;
        if ($profile) {
            $profile['email'] = $user['email'] ?? null;
        }

        return $profile;
    }

    public function accessToken(): ?string
    {
        $session = session('supabase');
        if (! $session) {
            return null;
        }

        if (($session['expires_at'] ?? 0) - 60 > time()) {
            return $session['access_token'] ?? null;
        }
        if (empty($session['refresh_token'])) {
            session()->forget('supabase');

            return null;
        }

        $response = $this->http()->post("{$this->url}/auth/v1/token?grant_type=refresh_token", [
            'refresh_token' => $session['refresh_token'],
        ]);
        if ($response->failed()) {
            session()->forget('supabase');

            return null;
        }

        $this->storeSession($response->json() ?? []);

        return session('supabase.access_token');
    }

    public function publicMenu(): array
    {
        return $this->rpc('get_public_menu') ?? [
            'store' => ['is_open' => true, 'closed_message' => ''],
            'categories' => [],
            'items' => [],
        ];
    }

    public function placeOrder(
        string $orderId,
        string $orderType,
        array $items,
        ?string $courierName = null,
        ?string $courierRef = null,
        ?string $notes = null,
    ): array {
        return $this->rpc('create_customer_order', [
            'p_order_id' => $orderId,
            'p_order_type' => $orderType,
            'p_items' => array_values($items),
            'p_courier_name' => $courierName,
            'p_courier_ref' => $courierRef,
            'p_notes' => $notes,
        ], true) ?? [];
    }

    public function myOrders(int $limit = 20): array
    {
        $response = $this->http($this->requireToken())->get("{$this->url}/rest/v1/orders", [
            'select' => 'id,order_no,status,order_type,total,notes,created_at,courier_name,courier_ref,order_items(id,menu_item_id,name_snapshot,qty,unit_price,order_item_modifiers(id,modifier_id,name_snapshot,price_delta))',
            'channel' => 'eq.app',
            'order' => 'created_at.desc',
            'limit' => max(1, min($limit, 100)),
        ]);
        if ($response->failed()) {
            $this->fail($response);
        }

        return $response->json() ?? [];
    }

    public function myOrder(string $orderId): ?array
    {
        $response = $this->http($this->requireToken())->get("{$this->url}/rest/v1/orders", [
            'select' => 'id,order_no,status,order_type,total,notes,created_at,courier_name,courier_ref,order_items(id,menu_item_id,name_snapshot,qty,unit_price,order_item_modifiers(id,modifier_id,name_snapshot,price_delta))',
            'id' => 'eq.'.$orderId,
            'channel' => 'eq.app',
            'limit' => 1,
        ]);
        if ($response->failed()) {
            $this->fail($response);
        }

        return ($response->json() ?? [])[0] ?? null;
    }

    public function cancelOrder(string $orderId): void
    {
        $this->rpc('cancel_my_order', ['p_order_id' => $orderId], true);
    }

    public static function photoUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return rtrim((string) config('services.supabase.url'), '/').'/storage/v1/object/public/menu-photos/'.$path;
    }

    private function http(?string $token = null): PendingRequest
    {
        if ($this->url === '' || $this->publishableKey === '') {
            throw new SupabaseException('Supabase is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.');
        }

        $request = Http::withHeaders([
            'apikey' => $this->publishableKey,
        ])->acceptJson()->asJson()->timeout(15);

        return $token ? $request->withToken($token) : $request;
    }

    private function requireToken(): string
    {
        $token = $this->accessToken();
        if (! $token) {
            throw new SupabaseException('Please sign in to continue.', 401);
        }

        return $token;
    }

    private function rpc(string $function, array $arguments = [], bool $asUser = false): mixed
    {
        $token = $asUser ? $this->requireToken() : null;
        $response = $this->http($token)->post("{$this->url}/rest/v1/rpc/{$function}", (object) $arguments);
        if ($response->failed()) {
            $this->fail($response);
        }

        return $response->json();
    }

    private function storeSession(array $session): void
    {
        if (empty($session['access_token'])) {
            throw new SupabaseException('Supabase did not return a signed-in session.');
        }

        session(['supabase' => [
            'access_token' => $session['access_token'],
            'refresh_token' => $session['refresh_token'] ?? null,
            'expires_at' => $session['expires_at'] ?? (time() + (int) ($session['expires_in'] ?? 3600)),
            'user' => [
                'id' => $session['user']['id'] ?? null,
                'email' => $session['user']['email'] ?? null,
                'name' => $session['user']['user_metadata']['full_name'] ?? null,
            ],
        ]]);
    }

    private function fail(Response $response): never
    {
        $body = $response->json() ?? [];
        $message = (string) ($body['message'] ?? $body['msg'] ?? $body['error_description'] ?? $body['error'] ?? 'Something went wrong. Please try again.');
        throw new SupabaseException(self::friendly($message), $response->status());
    }

    private static function friendly(string $message): string
    {
        return match (true) {
            str_contains($message, 'Invalid login credentials') => 'Incorrect email or password.',
            str_contains($message, 'already registered'), str_contains($message, 'already been registered') => 'That email already has an account. Please sign in instead.',
            str_contains($message, 'Email not confirmed') => 'Please confirm your email first. Check your inbox.',
            str_contains($message, 'Password should be at least') => 'Use a longer password (at least 8 characters).',
            default => $message,
        };
    }
}
