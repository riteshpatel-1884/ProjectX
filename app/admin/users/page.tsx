






"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  clerkUserId: string;
  email: string | null;
  name: string | null;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  totalCredit: number;
  userCredit: number;
  isSubscribed: boolean;
  role: string;
  phoneNo: string | null;
  rank: number | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortField, setSortField] = useState<"name" | "credits" | "joined" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSort = (field: "name" | "credits" | "joined") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    let comparison = 0;
    
    if (sortField === "name") {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      comparison = nameA.localeCompare(nameB);
    } else if (sortField === "credits") {
      comparison = a.userCredit - b.userCredit;
    } else if (sortField === "joined") {
      comparison = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2d1b69] via-[#4a2b7c] to-[#6b3fa0]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
          <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d1b69] via-[#4a2b7c] to-[#6b3fa0] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in pt-24">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-2xl shadow-lg shadow-pink-500/50">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-purple-200/80 mt-1 text-sm flex items-center gap-2">
               
                Manage all users in your system
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="p-6 mb-6 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="relative w-full px-5 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-purple-300/60 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-5 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all backdrop-blur-sm cursor-pointer"
            >
              <option value="all" className="bg-[#4a2b7c] text-white">All Roles</option>
              <option value="admin" className="bg-[#4a2b7c] text-white">Admin</option>
              <option value="user" className="bg-[#4a2b7c] text-white">User</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
                    >
                      User
                      <div className="flex flex-col">
                        <svg 
                          className={`w-3 h-3 -mb-1 transition-colors ${sortField === "name" && sortDirection === "asc" ? "text-pink-400" : "text-purple-300/40 group-hover:text-purple-200"}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                        </svg>
                        <svg 
                          className={`w-3 h-3 -mt-1 transition-colors ${sortField === "name" && sortDirection === "desc" ? "text-pink-400" : "text-purple-300/40 group-hover:text-purple-200"}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                        </svg>
                      </div>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort("credits")}
                      className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
                    >
                      Credits
                      <div className="flex flex-col">
                        <svg 
                          className={`w-3 h-3 -mb-1 transition-colors ${sortField === "credits" && sortDirection === "asc" ? "text-pink-400" : "text-purple-300/40 group-hover:text-purple-200"}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                        </svg>
                        <svg 
                          className={`w-3 h-3 -mt-1 transition-colors ${sortField === "credits" && sortDirection === "desc" ? "text-pink-400" : "text-purple-300/40 group-hover:text-purple-200"}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                        </svg>
                      </div>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort("joined")}
                      className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
                    >
                      Joined
                      <div className="flex flex-col">
                        <svg 
                          className={`w-3 h-3 -mb-1 transition-colors ${sortField === "joined" && sortDirection === "asc" ? "text-pink-400" : "text-purple-300/40 group-hover:text-purple-200"}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                        </svg>
                        <svg 
                          className={`w-3 h-3 -mt-1 transition-colors ${sortField === "joined" && sortDirection === "desc" ? "text-pink-400" : "text-purple-300/40 group-hover:text-purple-200"}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                        </svg>
                      </div>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 cursor-pointer">
                {sortedUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-white/5 transition-colors group"
                    style={{ animationDelay: `${index * 50}ms` }}
                   >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/30">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm font-semibold text-white">
                            {user.name || "N/A"}
                          </div>
                          <div className="text-xs text-purple-300/70">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                            : "bg-white/10 text-purple-200 border border-white/20"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-white">
                          {user.userCredit}
                        </div>
                        <div className="text-xs text-purple-300/70">
                          / {user.totalCredit}
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-purple-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${(user.userCredit / user.totalCredit) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full ${
                          user.isSubscribed
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isSubscribed ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        {user.isSubscribed ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                      {new Date(user.joinedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors flex items-center gap-1 group/btn"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className="group-hover/btn:underline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-400 cursor-pointer hover:text-red-300 transition-colors flex items-center gap-1 group/btn"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="group-hover/btn:underline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0  bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in ">
            <div className="bg-gradient-to-br  from-[#3d2669] to-[#5a3a8c] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl animate-scale-in">
              <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-purple-600  p-6 border-b border-white/10 backdrop-blur-xl">
                <h2 className="text-2xl font-bold  text-white flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  Edit User
                </h2>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingUser.name || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingUser.email || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editingUser.phoneNo || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phoneNo: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all backdrop-blur-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Total Credit
                    </label>
                    <input
                      type="number"
                      value={editingUser.totalCredit}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          totalCredit: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      User Credit
                    </label>
                    <input
                      type="number"
                      value={editingUser.userCredit}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          userCredit: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Role
                    </label>
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, role: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all backdrop-blur-sm cursor-pointer"
                    >
                      <option value="user" className="bg-[#4a2b7c]">User</option>
                      <option value="admin" className="bg-[#4a2b7c]">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Rank
                    </label>
                    <input
                      type="number"
                      value={editingUser.rank || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          rank: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <input
                    type="checkbox"
                    checked={editingUser.isSubscribed}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        isSubscribed: e.target.checked,
                      })
                    }
                    className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-white/30 rounded bg-white/10 cursor-pointer"
                  />
                  <label className="ml-3 text-sm font-semibold text-white cursor-pointer">
                    Active Subscription
                  </label>
                </div>
              </div>
 <div className="sticky bottom-0 flex justify-end gap-3 p-6 bg-gradient-to-t from-[#3d2669] to-transparent border-t border-white/10 backdrop-blur-xl">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-6 cursor-pointer py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ec4899, #a855f7);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #db2777, #9333ea);
        }
      `}</style>
    </div>
  );
}




