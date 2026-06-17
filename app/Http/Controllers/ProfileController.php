<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            // Mengirimkan role ke frontend untuk pengkondisian UI
            'userRole' => $request->user()->role ?? ($request->user()->email ? 'admin' : 'pemeriksa'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        // Menggunakan helper dari model User secara langsung
        $isAdmin = $user->isAdmin(); 

        $rules = [
            'name' => ['required', 'string', 'max:255'],
        ];

        if ($isAdmin) {
            $rules['email'] = ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,' . $user->id];
        } else {
            $rules['username'] = ['required', 'string', 'max:255', 'unique:users,username,' . $user->id];
        }

        $validated = $request->validate($rules);
        
        // Ambil data secara spesifik agar field lain tidak ter-overwrite secara tidak sengaja
        $user->fill($validated);

        if ($isAdmin && $user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}