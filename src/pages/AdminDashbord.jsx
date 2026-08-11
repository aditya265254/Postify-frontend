import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, AlertTriangle, CheckCircle2, Trash2, FileText } from 'lucide-react';
import api from '../config/api.js';
import { getAdminDashboardAPI } from "../config/post.api.js";
import Navbar from '../components/Navbar.jsx';
import UserAvatar from '../components/common/UserAvatar.jsx';
import RoleBadge from '../components/common/RoleBadge.jsx';
import LoadingScreen from '../components/common/LoadingScreen.jsx';

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
        return <LoadingScreen message="Loading Admin Panel..." />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 pb-12 transition-colors duration-300 relative">
            <Navbar />

            <div className="max-w-6xl mx-auto mt-8 px-4 space-y-8">
                
                {/* Stats Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-[#1C2A4A] pb-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0" />
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Admin Dashboard
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Overview of community platform stats and moderation requests
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-[#0D1424] p-6 rounded-3xl shadow-xs border border-slate-200/80 dark:border-[#1C2A4A]">
                        <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Total Registered Users</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{data?.totalUsers || 0}</h3>
                    </div>
                    <div className="bg-white dark:bg-[#0D1424] p-6 rounded-3xl shadow-xs border border-slate-200/80 dark:border-[#1C2A4A]">
                        <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Pending User Appeals</p>
                        <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">{data?.pendingAppeals?.length || 0}</h3>
                    </div>
                    <div className="bg-white dark:bg-[#0D1424] p-6 rounded-3xl shadow-xs border border-slate-200/80 dark:border-[#1C2A4A]">
                        <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Total Platform Posts</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{data?.totalPosts || 0}</h3>
                    </div>
                </div>

                {/* Pending Appeals Section */}
                <div className="bg-white dark:bg-[#0D1424] shadow-xs border border-slate-200/80 dark:border-[#1C2A4A] rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" /> User Appeals Requiring Review
                    </h3>
                    
                    {(!data?.pendingAppeals || data.pendingAppeals.length === 0) ? (
                        <p className="text-slate-500 dark:text-slate-400 text-xs py-4 bg-slate-50 dark:bg-[#141D33]/50 text-center rounded-2xl border border-slate-100 dark:border-[#1C2A4A]">
                            No pending appeals right now.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {data.pendingAppeals.map((post) => (
                                <div key={post._id} className="border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">{post.user?.fullName}</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">({post.user?.email})</span>
                                        </div>
                                        <p className="text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-[#0D1424] p-3 rounded-xl border border-slate-200 dark:border-[#1C2A4A]">
                                            <strong className="text-slate-900 dark:text-white">User Appeal:</strong> "{post.userClarification}"
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            <strong className="text-red-600 dark:text-red-400">Admin Removal Reason:</strong> {post.deletedByReason}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 self-end md:self-center">
                                        <button 
                                            onClick={() => handleRestore(post._id)}
                                            className="bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Restore Post
                                        </button>
                                        <button 
                                            onClick={() => handleHardDelete(post._id)}
                                            className="bg-red-600 dark:bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                                        >
                                            <Trash2 className="w-4 h-4" /> Hard Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Registered Users Section */}
                <div className="bg-white dark:bg-[#0D1424] shadow-xs border border-slate-200/80 dark:border-[#1C2A4A] rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Registered Users</h3>
                    
                    {(!data?.users || data.users.length === 0) ? (
                        <p className="text-slate-500 dark:text-slate-400 text-center py-4">No users found.</p>
                    ) : (
                        <ul className="divide-y divide-slate-100 dark:divide-[#1C2A4A]">
                            {data.users.map((u) => (
                                <li 
                                    key={u._id} 
                                    onClick={() => navigate(`/admin/user/${u._id}`)}
                                    className="py-3.5 px-4 -mx-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-[#141D33]/60 cursor-pointer transition rounded-2xl"
                                >
                                    {/* User Info Left Column */}
                                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                        <UserAvatar name={u.fullName} size="md" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{u.fullName}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                                        </div>
                                    </div>

                                    {/* Badges & Actions Right Column (Fixed Alignment) */}
                                    <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
                                        <span className="w-24 sm:w-28 justify-center text-xs px-3 py-1 rounded-full font-extrabold bg-slate-100 dark:bg-[#141D33] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1C2A4A] inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                                            <FileText className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                                            <span>{u.postsCount !== undefined ? u.postsCount : 0} {u.postsCount === 1 ? "Post" : "Posts"}</span>
                                        </span>
                                        <RoleBadge role={u.role} />
                                        <span className="w-5 text-right text-slate-400 dark:text-slate-500 font-bold shrink-0 text-sm">›</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


