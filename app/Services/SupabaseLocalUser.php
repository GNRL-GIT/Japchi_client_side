<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SupabaseLocalUser
{
    public function sync(array $profile): User
    {
        $id = (string) ($profile['id'] ?? '');
        $email = strtolower((string) ($profile['email'] ?? ''));
        if ($id === '' || $email === '') {
            throw new SupabaseException('Supabase returned an incomplete account profile.');
        }

        $user = User::query()->where('supabase_id', $id)->first()
            ?? User::query()->where('email', $email)->first()
            ?? new User;

        if ($user->supabase_id && $user->supabase_id !== $id) {
            throw new SupabaseException('That email is already linked to a different account.');
        }

        $user->name = (string) ($profile['full_name'] ?? $email);
        $user->email = $email;
        $user->supabase_id = $id;
        $user->email_verified_at ??= now();
        $user->is_admin = ($profile['role'] ?? null) === 'admin';
        if (! $user->exists) {
            $user->password = Hash::make(Str::random(64));
        }
        $user->save();

        return $user;
    }
}
