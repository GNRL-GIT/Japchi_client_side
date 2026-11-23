<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Services\Supabase;
use App\Services\SupabaseException;
use App\Services\SupabaseLocalUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(): Response
    {
        return Inertia::render('settings/profile');
    }

    /**
     * Update the user's profile information.
     */
    public function update(
        ProfileUpdateRequest $request,
        Supabase $supabase,
        SupabaseLocalUser $localUser,
    ): RedirectResponse {
        try {
            $data = $request->validated();
            $supabase->updateCustomerProfile($data['name']);
            $profile = $supabase->profile();
            if (! $profile) {
                throw new SupabaseException('Your profile could not be refreshed. Please sign in again.');
            }
            $localUser->sync($profile);
        } catch (SupabaseException $exception) {
            throw ValidationException::withMessages(['name' => $exception->getMessage()]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }
}
