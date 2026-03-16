<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    protected array $allowedProviders = ['google', 'github', 'facebook', 'linkedin'];

    /**
     * Redirect to OAuth provider.
     */
    public function redirect(string $provider)
    {
        if (!in_array($provider, $this->allowedProviders)) {
            return response()->json(['message' => 'Unsupported provider.'], 422);
        }

        return Socialite::driver($provider)->stateless()->redirect();
    }

    /**
     * Handle OAuth provider callback.
     */
    public function callback(string $provider)
    {
        if (!in_array($provider, $this->allowedProviders)) {
            return response()->json(['message' => 'Unsupported provider.'], 422);
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to authenticate with ' . $provider . '.'], 422);
        }

        // Find existing user by provider_id & provider, or by email
        $user = User::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if (!$user) {
            // Try to find by email (link social to existing account)
            $user = User::where('email', $socialUser->getEmail())->first();

            if ($user) {
                // Link social provider to existing account
                $user->update([
                    'provider'    => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar'      => $socialUser->getAvatar(),
                ]);
            } else {
                // Create a brand new user
                $user = User::create([
                    'name'        => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
                    'email'       => $socialUser->getEmail(),
                    'provider'    => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar'      => $socialUser->getAvatar(),
                    'password'    => null,
                    'is_admin'    => false,
                ]);
            }
        }

        $token = $user->createToken('social_auth_token')->plainTextToken;

        // Redirect to frontend with token
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');

        return redirect("{$frontendUrl}/oauth/callback?token={$token}");
    }
}
