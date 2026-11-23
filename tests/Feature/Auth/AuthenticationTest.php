<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Features;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered()
    {
        $response = $this->get(route('login'));

        $response->assertOk();
    }

    public function test_users_can_authenticate_using_the_login_screen()
    {
        $this->fakeCustomerSignIn();

        $response = $this->post(route('login.store'), [
            'email' => 'customer@example.com',
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseHas('users', [
            'email' => 'customer@example.com',
            'supabase_id' => '11111111-1111-4111-8111-111111111111',
        ]);
    }

    public function test_users_with_two_factor_enabled_are_redirected_to_two_factor_challenge()
    {
        $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

        Features::twoFactorAuthentication([
            'confirm' => true,
            'confirmPassword' => true,
        ]);

        $user = User::factory()->withTwoFactor()->create();

        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('two-factor.login'));
        $response->assertSessionHas('login.id', $user->id);
        $this->assertGuest();
    }

    public function test_users_can_not_authenticate_with_invalid_password()
    {
        config([
            'services.supabase.url' => 'https://supabase.test',
            'services.supabase.publishable_key' => 'sb_publishable_test',
        ]);
        Http::fake([
            'https://supabase.test/auth/v1/token*' => Http::response([
                'message' => 'Invalid login credentials',
            ], 400),
        ]);

        $this->post(route('login.store'), [
            'email' => 'customer@example.com',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('logout'));

        $response->assertRedirect(route('home'));

        $this->assertGuest();
    }

    public function test_users_are_rate_limited()
    {
        $user = User::factory()->create();

        RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertTooManyRequests();
    }

    private function fakeCustomerSignIn(): void
    {
        config([
            'services.supabase.url' => 'https://supabase.test',
            'services.supabase.publishable_key' => 'sb_publishable_test',
        ]);
        Http::fake([
            'https://supabase.test/auth/v1/token*' => Http::response([
                'access_token' => 'customer-access-token',
                'refresh_token' => 'customer-refresh-token',
                'expires_in' => 3600,
                'user' => [
                    'id' => '11111111-1111-4111-8111-111111111111',
                    'email' => 'customer@example.com',
                    'user_metadata' => ['full_name' => 'Test Customer'],
                ],
            ]),
            'https://supabase.test/rest/v1/profiles*' => Http::response([[
                'id' => '11111111-1111-4111-8111-111111111111',
                'full_name' => 'Test Customer',
                'role' => 'customer',
                'is_active' => true,
                'branch_id' => null,
            ]]),
        ]);
    }
}
