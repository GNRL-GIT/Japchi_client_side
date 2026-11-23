<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use App\Services\Supabase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_page_is_displayed()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('security.edit'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/security')
                ->has('passwordRules'),
            );
    }

    public function test_security_page_does_not_require_a_local_password_confirmation()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get(route('security.edit'));

        $response->assertOk();
    }

    public function test_password_update_is_sent_to_supabase_without_changing_the_shadow_password()
    {
        $user = User::factory()->create();
        $oldPasswordHash = $user->password;
        $this->authenticateWithSupabase($user);
        Http::fake([
            'https://supabase.test/auth/v1/user' => Http::response([
                'id' => 'customer-id',
            ]),
        ]);

        $response = $this
            ->from(route('security.edit'))
            ->put(route('user-password.update'), [
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('security.edit'));

        Http::assertSent(fn ($request) => $request->method() === 'PUT'
            && $request->url() === 'https://supabase.test/auth/v1/user'
            && $request->hasHeader('apikey', 'sb_publishable_test')
            && $request->hasHeader('Authorization', 'Bearer customer-access-token')
            && $request['password'] === 'new-password');
        $this->assertSame($oldPasswordHash, $user->refresh()->password);
    }

    public function test_public_supabase_requests_send_the_publishable_key_without_a_bearer_token()
    {
        config([
            'services.supabase.url' => 'https://supabase.test',
            'services.supabase.publishable_key' => 'sb_publishable_test',
        ]);
        Http::fake([
            'https://supabase.test/rest/v1/rpc/get_public_menu' => Http::response([
                'store' => ['is_open' => true, 'closed_message' => ''],
                'categories' => [],
                'items' => [],
            ]),
        ]);

        app(Supabase::class)->publicMenu();

        Http::assertSent(fn ($request) => $request->method() === 'POST'
            && $request->url() === 'https://supabase.test/rest/v1/rpc/get_public_menu'
            && $request->hasHeader('apikey', 'sb_publishable_test')
            && ! $request->hasHeader('Authorization'));
    }

    public function test_supabase_password_update_errors_are_reported()
    {
        $user = User::factory()->create();
        $this->authenticateWithSupabase($user);
        Http::fake([
            'https://supabase.test/auth/v1/user' => Http::response([
                'message' => 'Password update rejected',
            ], 400),
        ]);

        $response = $this
            ->from(route('security.edit'))
            ->put(route('user-password.update'), [
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response
            ->assertSessionHasErrors(['password' => 'Password update rejected'])
            ->assertRedirect(route('security.edit'));
    }

    private function authenticateWithSupabase(User $user): void
    {
        config([
            'services.supabase.url' => 'https://supabase.test',
            'services.supabase.publishable_key' => 'sb_publishable_test',
        ]);

        $this->actingAs($user)->withSession([
            'supabase' => [
                'access_token' => 'customer-access-token',
                'refresh_token' => 'customer-refresh-token',
                'expires_at' => time() + 3600,
                'user' => [
                    'id' => 'customer-id',
                    'email' => $user->email,
                    'name' => $user->name,
                ],
            ],
        ]);
    }
}
