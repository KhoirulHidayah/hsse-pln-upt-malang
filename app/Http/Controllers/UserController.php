<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\GarduInduk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Tampilkan daftar user dengan search, sort, dan pagination.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $role = $request->input('role');
        $garduIndukId = $request->input('gardu_induk_id');
        $sortField = $request->input('sortField', 'created_at');
        $sortDirection = $request->input('sortDirection', 'desc');

        $allowedSortFields = ['name', 'username', 'email', 'role', 'created_at'];

        if (! in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }

        if (! in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        $query = User::with('garduInduk')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhereHas('garduInduk', function ($gardu) use ($search) {
                            $gardu->where('nama_gardu_induk', 'like', "%{$search}%");
                        });
                });
            })
            ->when($role, fn ($q) => $q->where('role', $role))
            ->when($garduIndukId, fn ($q) => $q->where('gardu_induk_id', $garduIndukId))
            ->orderBy($sortField, $sortDirection);

        $users = $query->paginate(10)->withQueryString();

        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'gardu_induk_id' => $user->gardu_induk_id,
                'gardu_induk_nama' => optional($user->garduInduk)->nama_gardu_induk ?? '-',
                'created_at' => optional($user->created_at)->format('Y-m-d H:i:s'),
                'updated_at' => optional($user->updated_at)->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('User/Index', [
            'users' => $users,
            'garduList' => GarduInduk::select('gardu_induk_id', 'nama_gardu_induk')->orderBy('nama_gardu_induk')->get(),
            'filters' => [
                'search' => $search,
                'role' => $role,
                'gardu_induk_id' => $garduIndukId,
                'sortField' => $sortField,
                'sortDirection' => $sortDirection,
            ],
        ]);
    }

    /**
     * Form tambah user.
     */
    public function create()
    {
        return Inertia::render('User/Create', [
            'garduList' => GarduInduk::select('gardu_induk_id', 'nama_gardu_induk')->orderBy('nama_gardu_induk')->get(),
        ]);
    }

    /**
     * Simpan user baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in(['admin', 'pemeriksa'])],
            'gardu_induk_id' => ['nullable', 'exists:gardu_induks,gardu_induk_id'],
        ]);

        if ($validated['role'] === 'admin') {
            $validated['gardu_induk_id'] = null;
        }

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->route('user.index')
            ->with('success', 'Data user berhasil ditambahkan.');
    }

    /**
     * Detail user.
     */
    public function show(User $user)
    {
        $user->load('garduInduk');

        return Inertia::render('User/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'gardu_induk_id' => $user->gardu_induk_id,
                'gardu_induk' => $user->garduInduk ? [
                    'gardu_induk_id' => $user->garduInduk->gardu_induk_id,
                    'nama_gardu_induk' => $user->garduInduk->nama_gardu_induk,
                ] : null,
                'created_at' => optional($user->created_at)->format('Y-m-d H:i:s'),
                'updated_at' => optional($user->updated_at)->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    /**
     * Form edit user.
     */
    public function edit(User $user)
    {
        return Inertia::render('User/Edit', [
            'userData' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'gardu_induk_id' => $user->gardu_induk_id,
            ],
            'garduList' => GarduInduk::select('gardu_induk_id', 'nama_gardu_induk')->orderBy('nama_gardu_induk')->get(),
        ]);
    }

    /**
     * Update user.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in(['admin', 'pemeriksa'])],
            'gardu_induk_id' => ['nullable', 'exists:gardu_induks,gardu_induk_id'],
        ]);

        if ($validated['role'] === 'admin') {
            $validated['gardu_induk_id'] = null;
        }

        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('user.index')
            ->with('success', 'Data user berhasil diperbarui.');
    }

    /**
     * Hapus user.
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->route('user.index')
                ->with('error', 'Anda tidak dapat menghapus akun yang sedang digunakan.');
        }

        $user->delete();

        return redirect()->route('user.index')
            ->with('success', 'Data user berhasil dihapus.');
    }
}
