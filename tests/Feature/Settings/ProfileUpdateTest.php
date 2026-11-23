<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get(route('profile.edit'));

        $response->assertOk();
    }

    public function test_profile_name_is_updated_in_supabase_and_the_local_shadow_user()
    {
        $user = User::factory()->create();
        $supabaseId = '44444444-4444-4444-8444-444444444444';
        $this->authenticateWithSupabase($user, $supabaseId);
        Http::fake([
            'https://supabase.test/rest/v1/rpc/update_customer_profile' => Http::response(null, 204),
            'https://supabase.test/rest/v1/profiles*' => Http::response([[
                'id' => $supabaseId,
                'full_name' => 'Test User',
                'role' => 'customer',
                'is_active' => true,
                'branch_id' => null,
            ]]),
        ]);

        $response = $this
            ->from(route('profile.edit'))
            ->patch(route('profile.update'), [
                'name' => 'Test User',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        Http::assertSent(fn ($request) => $request->method() === 'POST'
            && $request->url() === 'https://supabase.test/rest/v1/rpc/update_customer_profile'
            && $request['p_full_name'] === 'Test User');
    }

    public function test_supabase_profile_update_errors_are_reported()
    {
        $user = User::factory()->create();
        $this->authenticateWithSupabase($user, '55555555-5555-4555-8555-555555555555');
        Http::fake([
            'https://supabase.test/rest/v1/rpc/update_customer_profile' => Http::response([
                'message' => 'Customer profile unavailable',
            ], 400),
        ]);

        $response = $this
            ->from(route('profile.edit'))
            ->patch(route('profile.update'), [
                'name' => 'Test User',
            ]);

        $response
            ->assertSessionHasErrors(['name' => 'Customer profile unavailable'])
            ->assertRedirect(route('profile.edit'));

        $this->assertSame($user->name, $user->fresh()->name);
    }

    private function authenticateWithSupabase(User $user, string $supabaseId): void
    {
        $user->forceFill(['supabase_id' => $supabaseId])->save();
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
                    'id' => $supabaseId,
                    'email' => $user->email,
                    'name' => $user->name,
                ],
            ],
        ]);
    }
}
