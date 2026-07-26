import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../config/api.js';

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
        fetchAdminData();
    }, [navigate]);

    const fetchAdminData = async () => {
        try {
            const response = await api.get('/auth/admin/dashbord'); // Match your backend route
            setData(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch admin data");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // Quick action from Admin Dashboard: Restore post directly
    const handleRestore = async (postId) => {
        try {
            await api.patch(`/posts/restore/${postId}`);
            toast.success("Post restored successfully!");
            fetchAdminData(); // Refresh data
        } catch (error) {
            toast.error("Failed to restore post");
        }
    };

    // Quick action from Admin Dashboard: Permanent delete
    const handleHardDelete = async (postId) => {
        if (!window.confirm("Permanently delete this post?")) return;
        try {
            await api.delete(`/posts/admin-delete/${postId}`);
            toast.success("Post permanently deleted");
            fetchAdminData(); // Refresh data
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-semibold">Loading Admin Panel...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Admin Navbar */}
            <nav className="bg-gray-900 text-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        Postify <span className="text-red-500">Admin</span>
                    </h1>
                    <button 
                        onClick={() => navigate('/')}
                        className="text-gray-300 hover:text-white font-medium transition"
                    >
                        View Public Feed
                    </button>
                </div>
                <button 
                    onClick={handleLogout}
                    className="bg-red-600 px-5 py-2 rounded-full font-medium hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </nav>

            <div className="max-w-6xl mx-auto mt-8 px-4 space-y-8">
                
                {/* Platform Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 font-medium">Total Users</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{data.totalUsers}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 font-medium">Pending Appeals</p>
                        <h3 className="text-3xl font-bold text-yellow-600 mt-2">{data.pendingAppeals?.length || 0}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 font-medium">Total Posts (Platform)</p>
                        <h3 className="text-3xl font-bold text-blue-600 mt-2">{data.totalPosts}</h3>
                    </div>
                </div>

                {/* 🚨 PENDING APPEALS SECTION (Centralized Queue) */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">📢 User Appeals Requiring Review</h2>
                    
                    {(!data.pendingAppeals || data.pendingAppeals.length === 0) ? (
                        <p className="text-gray-500 text-sm py-4 bg-gray-50 text-center rounded-xl">No pending appeals right now.</p>
                    ) : (
                        <div className="space-y-4">
                            {data.pendingAppeals.map((post) => (
                                <div key={post._id} className="border border-yellow-200 bg-yellow-50/40 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">{post.user?.fullName}</span>
                                            <span className="text-xs text-gray-500">({post.user?.email})</span>
                                        </div>
                                        <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                                            <strong className="text-blue-600">User Appeal:</strong> "{post.userClarification}"
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            <strong className="text-red-600">Admin Reason for Removal:</strong> {post.deletedByReason}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 self-end md:self-center">
                                        <button 
                                            onClick={() => handleRestore(post._id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition"
                                        >
                                            ✅ Restore Post
                                        </button>
                                        <button 
                                            onClick={() => handleHardDelete(post._id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-red-700 transition"
                                        >
                                            🗑️ Delete Permanently
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User Management List */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Registered Users</h2>
                    
                    {data.users.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No users found.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {data.users.map((u) => (
                                <li 
                                    key={u._id} 
                                    onClick={() => navigate(`/admin/user/${u._id}`)}
                                    className="py-4 flex justify-between items-center hover:bg-gray-50 px-4 -mx-4 cursor-pointer transition rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold uppercase">
                                            {u.fullName?.[0] || "U"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{u.fullName}</p>
                                            <p className="text-sm text-gray-500">{u.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'}`}>
                                            {u.role}
                                        </span>
                                        <span className="text-gray-400 font-bold ml-2">›</span>
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