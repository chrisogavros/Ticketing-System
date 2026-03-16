import { useState, useEffect } from "react";
import axiosClient from "../lib/axios";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
    const { user } = useStateContext();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState({});
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleDesc, setNewRoleDesc] = useState("");
    const [roleError, setRoleError] = useState("");
    const [toast, setToast] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Redirect non-admins
    useEffect(() => {
        if (user && user.id && !user.is_admin) {
            navigate("/", { replace: true });
        }
    }, [user]);

    // Fetch users + roles
    useEffect(() => {
        Promise.all([
            axiosClient.get("/admin/users"),
            axiosClient.get("/admin/roles"),
        ]).then(([u, r]) => {
            setUsers(u.data);
            setRoles(r.data);
            const initialSelected = {};
            u.data.forEach((usr) => {
                initialSelected[usr.id] = usr.roles?.map((rl) => rl.id) || [];
            });
            setSelectedRoles(initialSelected);
        }).catch(console.error)
          .finally(() => setLoading(false));
    }, []);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const toggleRoleForUser = (userId, roleId) => {
        setSelectedRoles((prev) => {
            const current = prev[userId] || [];
            return {
                ...prev,
                [userId]: current.includes(roleId)
                    ? current.filter((id) => id !== roleId)
                    : [...current, roleId],
            };
        });
    };

    const saveRoles = (userId) => {
        setSavingId(userId);
        axiosClient.put(`/admin/users/${userId}/roles`, { role_ids: selectedRoles[userId] || [] })
            .then(({ data }) => {
                setUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
                showToast("Roles updated successfully!");
            })
            .catch(() => showToast("Failed to update roles.", "error"))
            .finally(() => setSavingId(null));
    };

    const toggleAdmin = (userId) => {
        axiosClient.put(`/admin/users/${userId}/toggle-admin`)
            .then(({ data }) => {
                setUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
                showToast("Admin status updated!");
            })
            .catch(() => showToast("Failed to update admin status.", "error"));
    };

    const deleteUser = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        axiosClient.delete(`/admin/users/${userId}`)
            .then(() => {
                setUsers((prev) => prev.filter((u) => u.id !== userId));
                showToast("User deleted.");
            })
            .catch(() => showToast("Failed to delete user.", "error"));
    };

    const createRole = () => {
        setRoleError("");
        if (!newRoleName.trim()) { setRoleError("Role name is required."); return; }
        axiosClient.post("/admin/roles", { name: newRoleName, description: newRoleDesc })
            .then(({ data }) => {
                setRoles((prev) => [...prev, data]);
                setNewRoleName("");
                setNewRoleDesc("");
                showToast(`Role "${data.name}" created!`);
            })
            .catch(() => showToast("Failed to create role.", "error"));
    };

    const deleteRole = (roleId) => {
        if (!window.confirm("Delete this role? It will be removed from all users.")) return;
        axiosClient.delete(`/admin/roles/${roleId}`)
            .then(() => {
                setRoles((prev) => prev.filter((r) => r.id !== roleId));
                showToast("Role deleted.");
            })
            .catch(() => showToast("Failed to delete role.", "error"));
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold transition-all ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}>
                    {toast.msg}
                </div>
            )}

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">User Management</h1>
                        <p className="text-gray-500 mt-1">Manage users and assign roles across the system.</p>
                    </div>
                    <span className="bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-full text-sm">
                        {users.length} users total
                    </span>
                </div>

                {/* Role Management Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Roles</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {roles.map((role) => (
                            <div key={role.id} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                                {role.name}
                                <button
                                    onClick={() => deleteRole(role.id)}
                                    className="ml-1 text-indigo-400 hover:text-red-500 transition-colors"
                                    title="Delete role"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {roles.length === 0 && <p className="text-gray-400 text-sm">No roles created yet.</p>}
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Role name (e.g. editor)"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={newRoleDesc}
                            onChange={(e) => setNewRoleDesc(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={createRole}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors"
                        >
                            + Add Role
                        </button>
                    </div>
                    {roleError && <p className="text-red-500 text-sm mt-2">{roleError}</p>}
                </div>

                {/* User Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        <input
                            type="text"
                            placeholder="Search users by name or email…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 text-sm focus:outline-none"
                        />
                    </div>

                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="text-left px-6 py-4 font-semibold">User</th>
                                        <th className="text-left px-6 py-4 font-semibold">Provider</th>
                                        <th className="text-left px-6 py-4 font-semibold">Roles</th>
                                        <th className="text-left px-6 py-4 font-semibold">Admin</th>
                                        <th className="text-right px-6 py-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                                            {/* User Info */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {u.avatar ? (
                                                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"/>
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                            {u.name?.charAt(0)?.toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{u.name}</p>
                                                        <p className="text-gray-400 text-xs">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Provider */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                                    u.provider ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                                                }`}>
                                                    {u.provider || "native"}
                                                </span>
                                            </td>
                                            {/* Roles */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {roles.map((role) => {
                                                        const active = (selectedRoles[u.id] || []).includes(role.id);
                                                        return (
                                                            <button
                                                                key={role.id}
                                                                onClick={() => toggleRoleForUser(u.id, role.id)}
                                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                                                                    active
                                                                        ? "bg-indigo-600 border-indigo-600 text-white"
                                                                        : "border-gray-200 text-gray-500 hover:border-indigo-400"
                                                                }`}
                                                            >
                                                                {role.name}
                                                            </button>
                                                        );
                                                    })}
                                                    {roles.length === 0 && <span className="text-gray-400 text-xs">No roles</span>}
                                                </div>
                                            </td>
                                            {/* Admin toggle */}
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleAdmin(u.id)}
                                                    disabled={u.id === user?.id}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-40 ${
                                                        u.is_admin ? "bg-purple-600" : "bg-gray-300"
                                                    }`}
                                                    title={u.id === user?.id ? "Cannot change your own admin status" : "Toggle admin"}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${u.is_admin ? "translate-x-6" : "translate-x-1"}`}/>
                                                </button>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        onClick={() => saveRoles(u.id)}
                                                        disabled={savingId === u.id}
                                                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg disabled:opacity-50 transition-colors"
                                                    >
                                                        {savingId === u.id ? "Saving…" : "Save roles"}
                                                    </button>
                                                    {u.id !== user?.id && (
                                                        <button
                                                            onClick={() => deleteUser(u.id)}
                                                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
