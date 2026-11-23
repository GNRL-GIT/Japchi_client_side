<?php

namespace App\Http\Middleware;

use App\Services\Supabase;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureCustomerSignedIn
{
    public function handle(Request $request, Closure $next)
    {
        $supabase = app(Supabase::class);
        if (! Auth::check()) {
            $supabase->signOut();

            return redirect()->route('login');
        }

        $profile = $supabase->profile();
        if (! $profile || ! ($profile['is_active'] ?? false) || ($profile['role'] ?? null) !== 'customer') {
            $supabase->signOut();
            Auth::logout();

            return redirect()->route('login');
        }

        return $next($request);
    }
}
