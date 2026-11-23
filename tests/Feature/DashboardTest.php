<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        $this->actingAs($user)->withSession([
            'supabase' => [
                'access_token' => 'customer-access-token',
                'refresh_token' => 'customer-refresh-token',
                'expires_at' => time() + 3600,
                'user' => [
                    'id' => '33333333-3333-4333-8333-333333333333',
                    'email' => $user->email,
                    'name' => $user->name,
                ],
            ],
        ]);
        config([
            'services.supabase.url' => 'https://supabase.test',
            'services.supabase.publishable_key' => 'sb_publishable_test',
        ]);
        Http::fake([
            'https://supabase.test/rest/v1/profiles*' => Http::response([[
                'id' => '33333333-3333-4333-8333-333333333333',
                'full_name' => $user->name,
                'role' => 'customer',
                'is_active' => true,
                'branch_id' => null,
            ]]),
        ]);

        $response = $this->get(route('dashboard'));
        $response->assertRedirect('/shop');
    }
}
