import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../config/api.js';
import { getAdminDashboardAPI } from "../config/post.api.js";
import Navbar from '../components/Navbar.jsx';

const AdminDashboard = () => {
    const [data, setData] = useState({ users: [], pendingAppeals: [], totalUsers: 0, totalPosts: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user?.role !== "admin") {
            navigate('/');
            return;
        }

        const fetchAdminData = async () => {
            try {
                const response = await getAdminDashboardAPI();
                if (response.data && response.data.data) {
                    setData(response.data.data);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch admin data");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [navigate]);

    const handleRestore = async (postId) => {
        try {
            await api.patch(`/posts/restore/${postId}`);
            toast.success("Post restored successfully!");
            window.location.reload(); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to restore post");
        }
    };

    const handleHardDelete = async (postId) => {
        if (!window.confirm("Permanently delete this post?")) return;
        try {
            await api.delete(`/posts/admin-delete/${postId}`);
            toast.success("Post permanently deleted");
            window.location.reload(); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete post");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                Loading Admin Panel...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-12 transition-colors duration-300 relative">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-96 h-96 bg-red-500/10 dark:bg-red-900/15 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 dark:bg-blue-900/15 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                <Navbar />

                <div className="max-w-6xl mx-auto mt-8 px-4 space-y-8">
                    
                    {/* Stats Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                🛡️ Admin Dashboard
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Overview of community platform stats and moderation requests
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer"
                        >
                            🌐 View Public Feed
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800/80">
                            <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Total Registered Users</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2">{data?.totalUsers || 0}</h3>
                        </div>
                        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800/80">
                            <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Pending User Appeals</p>
                            <h3 className="text-3xl font-black text-amber-500 dark:text-amber-400 mt-2">{data?.pendingAppeals?.length || 0}</h3>
                        </div>
                        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800/80">
                            <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Total Platform Posts</p>
                            <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{data?.totalPosts || 0}</h3>
                        </div>
                    </div>

                    {/* Pending Appeals Section */}
                    <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-xs border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                            📢 User Appeals Requiring Review
                        </h3>
                        
                        {(!data?.pendingAppeals || data.pendingAppeals.length === 0) ? (
                            <p className="text-slate-500 dark:text-slate-400 text-xs py-4 bg-slate-50 dark:bg-slate-800/50 text-center rounded-2xl border border-slate-100 dark:border-slate-800">
                                No pending appeals right now.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {data.pendingAppeals.map((post) => (
                                    <div key={post._id} className="border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{post.user?.fullName}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">({post.user?.email})</span>
                                            </div>
                                            <p className="text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                                <strong className="text-blue-600 dark:text-blue-400">User Appeal:</strong> "{post.userClarification}"
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                <strong className="text-red-600 dark:text-red-400">Admin Removal Reason:</strong> {post.deletedByReason}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 self-end md:self-center">
                                            <button 
                                                onClick={() => handleRestore(post._id)}
                                                className="bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                                            >
                                                ✅ Restore Post
                                            </button>
                                            <button 
                                                onClick={() => handleHardDelete(post._id)}
                                                className="bg-red-600 dark:bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                                            >
                                                🗑️ Hard Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Registered Users Section */}
                    <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-xs border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Registered Users</h3>
                        
                        {(!data?.users || data.users.length === 0) ? (
                            <p className="text-slate-500 dark:text-slate-400 text-center py-4">No users found.</p>
                        ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                {data.users.map((u) => (
                                    <li 
                                        key={u._id} 
                                        onClick={() => navigate(`/admin/user/${u._id}`)}
                                        className="py-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 -mx-4 cursor-pointer transition rounded-2xl"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-extrabold uppercase">
                                                {u.fullName?.[0] || "U"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{u.fullName}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-xs px-3 py-1 rounded-full font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-900/40">
                                                📝 {u.postsCount !== undefined ? u.postsCount : 0} {u.postsCount === 1 ? "Post" : "Posts"}
                                            </span>
                                            <span className={`text-xs px-3 py-1 rounded-full font-bold ${u.role === 'admin' ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'}`}>
                                                {u.role}
                                            </span>
                                            <span className="text-slate-400 dark:text-slate-500 font-bold ml-1">›</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;