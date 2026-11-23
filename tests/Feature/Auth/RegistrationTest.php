<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register()
    {
        config([
            'services.supabase.url' => 'https://supabase.test',
            'services.supabase.publishable_key' => 'sb_publishable_test',
        ]);
        Http::fake([
            'https://supabase.test/auth/v1/signup' => Http::response([
                'access_token' => 'customer-access-token',
                'refresh_token' => 'customer-refresh-token',
                'expires_in' => 3600,
                'user' => [
                    'id' => '22222222-2222-4222-8222-222222222222',
                    'email' => 'test@example.com',
                    'user_metadata' => ['full_name' => 'Test User'],
                ],
            ]),
            'https://supabase.test/rest/v1/profiles*' => Http::response([[
                'id' => '22222222-2222-4222-8222-222222222222',
                'full_name' => 'Test User',
                'role' => 'customer',
                'is_active' => true,
                'branch_id' => null,
            ]]),
        ]);

        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'privacy_consent' => '1',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'supabase_id' => '22222222-2222-4222-8222-222222222222',
        ]);
    }
}
