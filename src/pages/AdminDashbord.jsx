import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../config/api.js';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    // State for dashboard statistics
    const [stats, setStats] = useState({ totalUsers: 0, deletedAccounts: 0, totalPosts: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        
        // Redirect if not an admin
        if (!user || user?.role !== "admin") {
            navigate('/');
            return;
        }
        
        fetchAdminData();
    }, [navigate]);

    const fetchAdminData = async () => {
        try {
            // Using the api instance which should already have the base URL and interceptors for the token
            const response = await api.get('/auth/admin/dashbord');
            
            // Assuming your backend sends users array. Adjust this based on your actual API response structure.
            const fetchedUsers = response.data.data;
            setUsers(fetchedUsers);

            // Populate stats. You will need to update your backend to return actual post/deleted counts later.
            setStats({
                totalUsers: fetchedUsers.length,
                deletedAccounts: 0, // Placeholder: requires backend update
                totalPosts: "TBD"   // Placeholder: requires backend update
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong fetching users");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // Navigate to the specific user's moderation page
    const handleViewUserPosts = (userId) => {
        navigate(`/admin/user/${userId}`);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Admin Panel...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Navbar */}
            <nav className="bg-gray-900 text-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        Postify <span className="text-red-500">Admin</span>
                    </h1>
                    {/* Button for admin to visit the public feed */}
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

            <div className="max-w-6xl mx-auto mt-8 px-4 pb-10">
                
                {/* Platform Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 font-medium">Total Users</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 font-medium">Deleted Accounts</p>
                        <h3 className="text-3xl font-bold text-red-600 mt-2">{stats.deletedAccounts}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 font-medium">Total Posts (Platform)</p>
                        <h3 className="text-3xl font-bold text-blue-600 mt-2">{stats.totalPosts}</h3>
                    </div>
                </div>

                {/* User Management List */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Registered Users</h2>
                    
                    {users.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No users found.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <li 
                                    key={user._id} 
                                    onClick={() => handleViewUserPosts(user._id)}
                                    className="py-4 flex justify-between items-center hover:bg-gray-50 px-4 -mx-4 cursor-pointer transition rounded-lg"
                                    title="Click to view user posts and moderate"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold uppercase">
                                            {user.fullName?.[0] || "U"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{user.fullName}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'}`}>
                                            {user.role}
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