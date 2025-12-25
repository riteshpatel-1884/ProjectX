"use client";

import { useEffect, useState } from "react";
import { getRankedUsers } from "../dashboard/getRankedUsers";
import { Users } from "lucide-react";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  rank: number | null;
};

const maskEmail = (email?: string | null) => {
  if (!email) return "";
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}******@${domain}`;
};

export function TopRankedUsers({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const LIMIT = 10;

  useEffect(() => {
    loadUsers(1);
  }, []);

  const loadUsers = async (newPage: number) => {
    if (loading) return;
    setLoading(true);

    const data = await getRankedUsers(newPage, LIMIT);

    setUsers(data);     // 🔥 replace list
    setPage(newPage);

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
    <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-xl flex items-center justify-center">
      <Users className="w-6 h-6 text-white" />
    </div>
    Top Ranked Users
  </h2>
      {users.map((user) => {
        const isCurrentUser = user.id === currentUserId;

        return (
          <div
          
            key={user.id}
            className={`group flex items-center justify-between p-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl cursor-pointer ${ isCurrentUser ? "bg-purple-500/30 border-purple-400 hover:shadow-purple-500/30" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20" }`}
          >
            {/* Left */}
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {user.name?.slice(0, 2).toUpperCase() || "U"}
              </div>

              <div>
                <p className="text-white font-semibold leading-tight">
                  {user.name || "Anonymous"}
                </p>
                <p className="text-purple-200/70 text-sm">
                  {maskEmail(user.email)}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {isCurrentUser && (
                <span className="px-3 py-1 text-xs rounded-full bg-white/20 text-white">
                  You
                </span>
              )}
              <span className="px-3 py-1 text-sm rounded-xl bg-white/10 text-white font-semibold">
                #{user.rank}
              </span>
            </div>
          </div>
        );
      })}

      {/* Pagination (no layout shift) */}
      <div className="flex justify-between pt-4">
        <button
          disabled={page === 1 || loading}
          onClick={() => loadUsers(page - 1)}
          className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-40"
        >
          Prev
        </button>

        <button
          disabled={loading || users.length < LIMIT}
          onClick={() => loadUsers(page + 1)}
          className="px-4 py-2 rounded-lg bg-purple-500/30 text-white disabled:opacity-40"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
