<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Services\Supabase;
use App\Services\SupabaseException;
use App\Services\SupabaseLocalUser;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'privacy_consent' => 'accepted',
        ])->validate();

        try {
            if (! app(Supabase::class)->signUp($input['name'], $input['email'], $input['password'])) {
                throw ValidationException::withMessages([
                    'email' => 'Account created. Confirm your email, then sign in.',
                ]);
            }

            $profile = app(Supabase::class)->profile();
            if (! $profile || ($profile['role'] ?? null) !== 'customer' || ! ($profile['is_active'] ?? false)) {
                throw new SupabaseException('Your account could not be prepared for customer ordering.');
            }

            return app(SupabaseLocalUser::class)->sync($profile);
        } catch (SupabaseException $exception) {
            throw ValidationException::withMessages(['email' => $exception->getMessage()]);
        }
    }
}
