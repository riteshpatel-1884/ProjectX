// import { auth } from "@clerk/nextjs/server";
// import { prisma } from "@/lib/prisma";
// import { syncUserWithDB } from "@/lib/syncUser";
// import { UserCircle, Mail, Calendar, Users, Activity, TrendingUp } from "lucide-react";

// export default async function DashboardPage() {
//   const { userId } = await auth();
//   if (!userId) return null;

//   await syncUserWithDB();

//   const user = await prisma.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   // Get all users count and recent users
//   const [totalUsers, recentUsers] = await Promise.all([
//     prisma.user.count(),
//     prisma.user.findMany({
//       orderBy: { createdAt: 'desc' },
//       take: 5,
//     }),
//   ]);

//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     }).format(new Date(date));
//   };

//   const getInitials = (name: string | null | undefined) => {
//     if (!name) return 'U';
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute top-1/2 -left-40 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
//         <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
//       </div>

//       {/* Header */}
//       <header className="relative border-b border-white/10 backdrop-blur-sm pt-24">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
//                 <span className="text-white font-bold text-xl">{getInitials(user?.name)}</span>
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
//                   Welcome back, {user?.name?.split(' ')[0] || 'User'}
//                 </h1>
//                 <p className="text-purple-300/70 text-sm mt-1">
//                   Here's what's happening with your account
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//               <span className="text-purple-200 text-sm font-medium">Active</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="relative max-w-7xl mx-auto px-6 py-12">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           {/* Current User Card */}
//           <div className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-purple-500/30 rounded-2xl backdrop-blur-sm">
//                 <UserCircle className="w-6 h-6 text-purple-200" />
//               </div>
//               <TrendingUp className="w-5 h-5 text-green-400" />
//             </div>
//             <div>
//               <p className="text-purple-300 text-sm font-medium mb-1">Your Profile</p>
//               <h3 className="text-3xl font-bold text-white mb-2">{user?.name || 'N/A'}</h3>
              
//               <p className="text-purple-200/60 text-sm">Account Active</p>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-3xl transition-all duration-300" />
//           </div>

//           {/* Email Card */}
//           <div className="group relative bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-violet-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/25 hover:-translate-y-1">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-violet-500/30 rounded-2xl backdrop-blur-sm">
//                 <Mail className="w-6 h-6 text-violet-200" />
//               </div>
//               <Activity className="w-5 h-5 text-violet-400" />
//             </div>
//             <div>
//               <p className="text-violet-300 text-sm font-medium mb-1">Email Address</p>
//               <h3 className="text-lg font-bold text-white mb-2 truncate">{user?.email || 'Not provided'}</h3>
//               <p className="text-violet-200/60 text-sm">Verified</p>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-purple-500/0 group-hover:from-violet-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all duration-300" />
//           </div>

//           {/* Join Date Card */}
//           <div className="group relative bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-fuchsia-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-500/25 hover:-translate-y-1">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-fuchsia-500/30 rounded-2xl backdrop-blur-sm">
//                 <Calendar className="w-6 h-6 text-fuchsia-200" />
//               </div>
//               <TrendingUp className="w-5 h-5 text-fuchsia-400" />
//             </div>
//             <div>
//               <p className="text-fuchsia-300 text-sm font-medium mb-1">Member Since</p>
//               <h3 className="text-xl font-bold text-white mb-2">{formatDate(user?.joinedAt || new Date())}</h3>
//               <p className="text-fuchsia-200/60 text-sm">
//                 {Math.ceil((Date.now() - new Date(user?.joinedAt || new Date()).getTime()) / (1000 * 60 * 60 * 24))} days
//               </p>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/0 to-purple-500/0 group-hover:from-fuchsia-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all duration-300" />
//           </div>

//           {/* Total Users Card */}
//           <div className="group relative bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-pink-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25 hover:-translate-y-1">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-pink-500/30 rounded-2xl backdrop-blur-sm">
//                 <Users className="w-6 h-6 text-pink-200" />
//               </div>
//               <TrendingUp className="w-5 h-5 text-pink-400" />
//             </div>
//             <div>
//               <p className="text-pink-300 text-sm font-medium mb-1">Total Users</p>
//               <h3 className="text-3xl font-bold text-white mb-2">{totalUsers}</h3>
//               <p className="text-pink-200/60 text-sm">Platform Members</p>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all duration-300" />
//           </div>
//         </div>

//         {/* User Details Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Profile Details */}
//           <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
//             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
//                 <UserCircle className="w-6 h-6 text-white" />
//               </div>
//               Profile Details
//             </h2>
            
//             <div className="space-y-6">

//               <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
//                 <div className="p-3 bg-fuchsia-500/20 rounded-xl">
//                   <Calendar className="w-6 h-6 text-fuchsia-300" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-fuchsia-300 text-sm font-medium mb-1">Account Created</p>
//                   <p className="text-white text-lg font-semibold">{formatDate(user?.joinedAt || new Date())}</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
//                 <div className="p-3 bg-pink-500/20 rounded-xl">
//                   <Activity className="w-6 h-6 text-pink-300" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-pink-300 text-sm font-medium mb-1">Account ID</p>
//                   <p className="text-white text-sm font-mono">{user?.id}</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
//                 <div className="p-3 bg-pink-500/20 rounded-xl">
//                   <Activity className="w-6 h-6 text-pink-300" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-pink-300 text-sm font-medium mb-1">Profile ID</p>
//                   <p className="text-white text-sm font-mono">{user?.clerkUserId}</p>
//                 </div>
//               </div>

//             </div>
//           </div>

//           {/* Recent Users */}
//           <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
//             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-xl flex items-center justify-center">
//                 <Users className="w-6 h-6 text-white" />
//               </div>
//               Recent Users
//             </h2>
            
//             <div className="space-y-4">
//               {recentUsers.map((recentUser, index) => (
//                 <div
//                   key={recentUser.id}
//                   className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
//                     {getInitials(recentUser.name)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-white font-semibold text-sm truncate">
//                       {recentUser.name || 'Anonymous'}
//                     </p>
//                     <p className="text-purple-300/60 text-xs truncate">
//                       {recentUser.email || 'No email'}
//                     </p>
//                   </div>
//                   {recentUser.id === user?.id && (
//                     <span className="px-2 py-1 bg-purple-500/30 rounded-lg text-purple-200 text-xs font-medium">
//                       You
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }




// import { auth } from "@clerk/nextjs/server";
// import { prisma } from "@/lib/prisma";
// import { syncUserWithDB } from "@/lib/syncUser";
// import { UserCircle, Mail, Calendar, Users, Activity, TrendingUp } from "lucide-react";
// import { EditFieldButton } from "./EditProfileButton";

// export default async function DashboardPage() {
//   const { userId } = await auth();
//   if (!userId) return null;

//   // Check if user exists first
//   let user = await prisma.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   // Only sync if user doesn't exist (first time login)
//   if (!user) {
//     await syncUserWithDB();
//     user = await prisma.user.findUnique({
//       where: { clerkUserId: userId },
//     });
//   }

//   // Get all users count and recent users
//   const [totalUsers, recentUsers] = await Promise.all([
//     prisma.user.count(),
//     prisma.user.findMany({
//       orderBy: { createdAt: 'desc' },
//       take: 5,
//     }),
//   ]);

//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//     }).format(new Date(date));
//   };

//   const getInitials = (name: string | null | undefined) => {
//     if (!name) return 'U';
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute top-1/2 -left-40 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
//         <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
//       </div>

//       {/* Header */}
//       <header className="relative border-b border-white/10 backdrop-blur-sm pt-24">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
//                 <span className="text-white font-bold text-xl">{getInitials(user?.name)}</span>
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
//                   Welcome back, {user?.name?.split(' ')[0] || 'User'}
//                 </h1>
//                 <p className="text-purple-300/70 text-sm mt-1">
//                   Here's what's happening with your account
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//               <span className="text-purple-200 text-sm font-medium">Active</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="relative max-w-7xl mx-auto px-6 py-12">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           {/* Current User Card */}
//           <div className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-purple-500/30 rounded-2xl backdrop-blur-sm">
//                 <UserCircle className="w-6 h-6 text-purple-200" />
//               </div>
//               <TrendingUp className="w-5 h-5 text-green-400" />
//             </div>
//             <div>
//               <p className="text-purple-300 text-sm font-medium mb-1">Your Profile</p>
//               <h3 className="text-3xl font-bold text-white mb-2">{user?.name || 'N/A'}</h3>
//               <p className="text-purple-200/60 text-sm">Account Active</p>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-3xl transition-all duration-300" />
//           </div>

//           {/* Email Card */}
//           <div className="group relative bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-violet-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/25 hover:-translate-y-1">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-violet-500/30 rounded-2xl backdrop-blur-sm">
//                 <Mail className="w-6 h-6 text-violet-200" />
//               </div>
//               <Activity className="w-5 h-5 text-violet-400" />
//             </div>
//             <div>
//               <p className="text-violet-300 text-sm font-medium mb-1">Email Address</p>
//               <h3 className="text-lg font-bold text-white mb-2 truncate">{user?.email || 'Not provided'}</h3>
//               <p className="text-violet-200/60 text-sm">Verified</p>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-purple-500/0 group-hover:from-violet-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all duration-300" />
//           </div>

//           {/* Join Date Card */}
//           <div className="group relative bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-fuchsia-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-500/25 hover:-translate-y-1">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-fuchsia-500/30 rounded-2xl backdrop-blur-sm">
//                 <Calendar className="w-6 h-6 text-fuchsia-200" />
//               </div>
//               <TrendingUp className="w-5 h-5 text-fuchsia-400" />
//             </div>
//             <div>
//               <p className="text-fuchsia-300 text-sm font-medium mb-1">Member Since</p>
//               <h3 className="text-xl font-bold text-white mb-2">{formatDate(user?.joinedAt || new Date())}</h3>
//               <p className="text-fuchsia-200/60 text-sm">
//                 {Math.ceil((Date.now() - new Date(user?.joinedAt || new Date()).getTime()) / (1000 * 60 * 60 * 24))} days
//               </p>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/0 to-purple-500/0 group-hover:from-fuchsia-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all duration-300" />
//           </div>

//           {/* Total Users Card */}
//           <div className="group relative bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-pink-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25 hover:-translate-y-1">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-pink-500/30 rounded-2xl backdrop-blur-sm">
//                 <Users className="w-6 h-6 text-pink-200" />
//               </div>
//               <TrendingUp className="w-5 h-5 text-pink-400" />
//             </div>
//             <div>
//               <p className="text-pink-300 text-sm font-medium mb-1">Total Users</p>
//               <h3 className="text-3xl font-bold text-white mb-2">{totalUsers}</h3>
//               <p className="text-pink-200/60 text-sm">Platform Members</p>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all duration-300" />
//           </div>
//         </div>

//         {/* User Details Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Profile Details */}
//           <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
//             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
//                 <UserCircle className="w-6 h-6 text-white" />
//               </div>
//               Profile Details
//             </h2>
            
//             <div className="space-y-6">
//               <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
//                 <div className="p-3 bg-purple-500/20 rounded-xl">
//                   <UserCircle className="w-6 h-6 text-purple-300" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-purple-300 text-sm font-medium mb-1">Full Name</p>
//                   <p className="text-white text-lg font-semibold">{user?.name || 'Not provided'}</p>
//                 </div>
//                 <EditFieldButton 
//                   fieldName="name"
//                   currentValue={user?.name || null}
//                   otherFieldValue={user?.email || null}
//                   label="Full Name"
//                   placeholder="Enter your full name"
//                   type="text"
//                 />
//               </div>

//               <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
//                 <div className="p-3 bg-violet-500/20 rounded-xl">
//                   <Mail className="w-6 h-6 text-violet-300" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-violet-300 text-sm font-medium mb-1">Email Address</p>
//                   <p className="text-white text-lg font-semibold break-all">{user?.email || 'Not provided'}</p>
//                 </div>
//                 <EditFieldButton 
//                   fieldName="email"
//                   currentValue={user?.email || null}
//                   otherFieldValue={user?.name || null}
//                   label="Email Address"
//                   placeholder="Enter your email address"
//                   type="email"
//                 />
//               </div>

//               <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
//                 <div className="p-3 bg-fuchsia-500/20 rounded-xl">
//                   <Calendar className="w-6 h-6 text-fuchsia-300" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-fuchsia-300 text-sm font-medium mb-1">Account Created</p>
//                   <p className="text-white text-lg font-semibold">{formatDate(user?.joinedAt || new Date())}</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
//                 <div className="p-3 bg-pink-500/20 rounded-xl">
//                   <Activity className="w-6 h-6 text-pink-300" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-pink-300 text-sm font-medium mb-1">Account ID</p>
//                   <p className="text-white text-sm font-mono">{user?.id}</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
//                 <div className="p-3 bg-cyan-500/20 rounded-xl">
//                   <Activity className="w-6 h-6 text-cyan-300" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-cyan-300 text-sm font-medium mb-1">Clerk ID</p>
//                   <p className="text-white text-sm font-mono break-all">{user?.clerkUserId}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Users */}
//           <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
//             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-xl flex items-center justify-center">
//                 <Users className="w-6 h-6 text-white" />
//               </div>
//               Recent Users
//             </h2>
            
//             <div className="space-y-4">
//               {recentUsers.map((recentUser, index) => (
//                 <div
//                   key={recentUser.id}
//                   className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
//                     {getInitials(recentUser.name)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-white font-semibold text-sm truncate">
//                       {recentUser.name || 'Anonymous'}
//                     </p>
//                     <p className="text-purple-300/60 text-xs truncate">
//                       {recentUser.email || 'No email'}
//                     </p>
//                   </div>
//                   {recentUser.id === user?.id && (
//                     <span className="px-2 py-1 bg-purple-500/30 rounded-lg text-purple-200 text-xs font-medium">
//                       You
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { syncUserWithDB } from "@/lib/syncUser";
import { UserCircle, Mail, Calendar, Users, Activity, TrendingUp,Coins,
  Crown,
  Phone,
  Trophy,
  Code2,
  Code,
  Terminal,
  Linkedin, 
  CoinsIcon,
  ConeIcon} from "lucide-react";
import { EditFieldButton } from "./EditProfileButton";
import { TopRankedUsers } from "../components/TopRankedUsers";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  // Check if user exists first
  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  // Only sync if user doesn't exist (first time login)
  if (!user) {
    await syncUserWithDB();
    user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
  }

  // Get all users count and recent users
  const [totalUsers, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    }),
  ]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const maskEmail = (email: string | null, isCurrentUser: boolean) => {
    if (!email) return 'No email';
    if (isCurrentUser) return email; // Show full email for current user
    
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return 'No email';
    
    // Show first 2 characters, mask the rest, show domain
    const visibleChars = Math.min(2, localPart.length);
    const maskedLocal = localPart.slice(0, visibleChars) + '*'.repeat(Math.max(3, localPart.length - visibleChars));
    
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 backdrop-blur-sm pt-24">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-white font-bold text-xl">{getInitials(user?.name)}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}
                </h1>
                <p className="text-purple-300/70 text-sm mt-1">
                  Here's what's happening with your account
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-purple-200 text-sm font-medium">Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-12 cursor-pointer">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Current User Card */}
          <div className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/30 rounded-2xl backdrop-blur-sm">
                <UserCircle className="w-6 h-6 text-purple-200" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-purple-300 text-sm font-medium mb-1">Your Profile</p>
              <h3 className="text-3xl font-bold text-white mb-2">{user?.name || 'N/A'}</h3>
              <p className="text-purple-200/60 text-sm">Account Active</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-3xl transition-all duration-300" />
          </div>

          {/* Email Card */}
          <div className="group relative bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-violet-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/25 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-violet-500/30 rounded-2xl backdrop-blur-sm">
                <Mail className="w-6 h-6 text-violet-200" />
              </div>
              <Activity className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-violet-300 text-sm font-medium mb-1">Email Address</p>
              <h3 className="text-lg font-bold text-white mb-2 truncate">{user?.email || 'Not provided'}</h3>
              <p className="text-violet-200/60 text-sm">Verified</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-purple-500/0 group-hover:from-violet-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all duration-300" />
          </div>

          {/* Join Date Card */}
          <div className="group relative bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-fuchsia-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-500/25 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-fuchsia-500/30 rounded-2xl backdrop-blur-sm">
                <Calendar className="w-6 h-6 text-fuchsia-200" />
              </div>
              <TrendingUp className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div>
              <p className="text-fuchsia-300 text-sm font-medium mb-1">Member Since</p>
              <h3 className="text-xl font-bold text-white mb-2">{formatDate(user?.joinedAt || new Date())}</h3>
              <p className="text-fuchsia-200/60 text-sm">
                {Math.ceil((Date.now() - new Date(user?.joinedAt || new Date()).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/0 to-purple-500/0 group-hover:from-fuchsia-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all duration-300" />
          </div>

          {/* Total Users Card */}
          <div className="group relative bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-pink-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-500/30 rounded-2xl backdrop-blur-sm">
                <Users className="w-6 h-6 text-pink-200" />
              </div>
              <TrendingUp className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-pink-300 text-sm font-medium mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-white mb-2">{totalUsers}</h3>
              <p className="text-pink-200/60 text-sm">Platform Members</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:to-purple-500/10 rounded-3xl transition-all duration-300" />
          </div>
        </div>

        {/* User Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Details */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-white" />
              </div>
              Profile Details
            </h2>
            
            <div className="space-y-6">
              
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="p-3 bg-violet-500/20 rounded-xl">
                  <CoinsIcon className="w-6 h-6 text-violet-300" />
                </div>
                <div className="flex-1">
                  <p className="text-violet-300 text-sm font-medium mb-1">Total Credit</p>
                  <p className="text-white text-lg font-semibold break-all">{user?.totalCredit || 'Not provided'}</p>
                </div>
              </div>



              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="p-3 bg-violet-500/20 rounded-xl">
                  <CoinsIcon className="w-6 h-6 text-violet-300" />
                </div>
                <div className="flex-1">
                  <p className="text-violet-300 text-sm font-medium mb-1">Used  Credit</p>
                  <p className="text-white text-lg font-semibold break-all">{user?.userCredit || 0}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="p-3 bg-violet-500/20 rounded-xl">
                  <Crown  className="w-6 h-6 text-violet-300" />
                </div>
                <div className="flex-1">
                  <p className="text-violet-300 text-sm font-medium mb-1">Subscription</p>
                  <p className="text-white text-lg font-semibold break-all">
                  {user?.isSubscribed ? 'Pro' : 'Free'}
                  </p>
                </div>
              </div>

               <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="p-3 bg-violet-500/20 rounded-xl">
                  <Phone className="w-6 h-6 text-violet-300" />
                </div>
                <div className="flex-1">
                  <p className="text-violet-300 text-sm font-medium mb-1">Phone No</p>
                  <p className="text-white text-lg font-semibold break-all">{user?.phoneNo || '**********'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="p-3 bg-violet-500/20 rounded-xl">
                  <Trophy  className="w-6 h-6 text-violet-300" />
                </div>
                <div className="flex-1">
                  <p className="text-violet-300 text-sm font-medium mb-1">Rank</p>
                  <p className="text-white text-lg font-semibold break-all">{user?.rank || 0 }</p>
                </div>
              </div>
             

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="p-3 bg-fuchsia-500/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-fuchsia-300" />
                </div>
                <div className="flex-1">
                  <p className="text-fuchsia-300 text-sm font-medium mb-1">Account Created</p>
                  <p className="text-white text-lg font-semibold">{formatDate(user?.joinedAt || new Date())}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="p-3 bg-pink-500/20 rounded-xl">
                  <Activity className="w-6 h-6 text-pink-300" />
                </div>
                <div className="flex-1">
                  <p className="text-pink-300 text-sm font-medium mb-1">Creation ID</p>
                  <p className="text-white text-sm font-mono">{user?.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <Activity className="w-6 h-6 text-cyan-300" />
                </div>
                <div className="flex-1">
                  <p className="text-cyan-300 text-sm font-medium mb-1">User ID</p>
                  <p className="text-white text-sm font-mono break-all">{user?.clerkUserId}</p>
                </div>
              </div>
            </div>
          </div>

         {/* Recent Users */}
{user && <TopRankedUsers currentUserId={user.id} />}
        </div>
      </main>
    </div>
  );
}