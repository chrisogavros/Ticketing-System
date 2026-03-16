<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * List all users with their roles.
     */
    public function index()
    {
        $users = User::with('roles')->orderBy('created_at', 'desc')->get();

        return response()->json($users);
    }

    /**
     * Get a single user with roles.
     */
    public function show(int $id)
    {
        $user = User::with('roles')->findOrFail($id);

        return response()->json($user);
    }

    /**
     * Assign roles to a user (replaces current roles).
     */
    public function updateRoles(Request $request, int $id)
    {
        $request->validate([
            'role_ids'   => 'required|array',
            'role_ids.*' => 'integer|exists:roles,id',
        ]);

        $user = User::findOrFail($id);
        $user->roles()->sync($request->role_ids);

        return response()->json([
            'message' => 'Roles updated successfully.',
            'user'    => $user->load('roles'),
        ]);
    }

    /**
     * Toggle admin flag.
     */
    public function toggleAdmin(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        // Prevent admin from removing their own admin right
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot change your own admin status.'], 403);
        }

        $user->update(['is_admin' => !$user->is_admin]);

        return response()->json([
            'message' => 'Admin status updated.',
            'user'    => $user->load('roles'),
        ]);
    }

    /**
     * Delete a user.
     */
    public function destroy(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete your own account.'], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    /**
     * List all roles (for the role picker UI).
     */
    public function roles()
    {
        return response()->json(Role::all());
    }

    /**
     * Create a new role.
     */
    public function createRole(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100|unique:roles,name',
            'description' => 'nullable|string|max:255',
        ]);

        $role = Role::create($validated);

        return response()->json($role, 201);
    }

    /**
     * Delete a role.
     */
    public function deleteRole(int $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Role deleted.']);
    }
}
