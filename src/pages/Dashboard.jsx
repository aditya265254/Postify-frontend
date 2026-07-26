import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
    getFeedPostsAPI, 
    likePostAPI, 
    sharePostAPI,
    commentPostAPI,
    softDeletePostAPI, 
    getMyPostsAPI
} from "../config/post.api.js"; 

const Dashboard = () => {
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const [posts, setPosts] = useState([]);
    const [commentTexts, setCommentTexts] = useState({}); 
    const [showCommentBox, setShowCommentBox] = useState({}); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // State for Admin Soft Delete Modal from Feed
    const [reasonModal, setReasonModal] = useState({ isOpen: false, postId: null, reason: "" });
    
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload(); 
    };

    const fetchFeedPosts = async () => {
        try {
            const response = await getFeedPostsAPI();
            setPosts(response.data.data); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load feed");
        }
    };

   useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        const urlUser = urlParams.get('user');
        
        if (urlToken && urlUser) {
            try {
                const decodedUser = decodeURIComponent(urlUser);
                localStorage.setItem("token", urlToken);
                localStorage.setItem("user", decodedUser);
                
                const parsedUser = JSON.parse(decodedUser);
                localStorage.setItem("role", parsedUser.role);
                
                if (parsedUser.role === "admin") {
                    window.location.href = "/admin/dashboard";
                } else {
                    window.location.href = "/";
                }
                
                return;
            } catch (e) {
                console.error("User data parse error:", e);
            }
        }
        
        fetchFeedPosts();

        // 🚨 NEW: Check if user has any soft-deleted posts without an appeal upon login
        if (user && user.role !== "admin") {
            getMyPostsAPI().then(res => {
                const softDeletedPosts = res.data.data.filter(p => p.isSoftDeleted && !p.userClarification);
                if (softDeletedPosts.length > 0) {
                    toast.warning(`⚠️ Notice: ${softDeletedPosts.length} of your post(s) were removed by an admin. Check 'My Posts' to appeal.`, {
                        autoClose: false 
                    });
                }
            }).catch(() => {});
        }
    }, [navigate, user]);

  
    const requireAuth = () => {
        if (!user) {
            toast.info("Please login to interact with posts.");
            navigate('/login');
            return false;
        }
        return true;
    };

    const handleLike = async (postId) => {
        if (!requireAuth()) return;

        try {
            const response = await likePostAPI(postId);
            const { isLiked } = response.data.data; 
            
            setPosts(posts.map(post => {
                if (post._id === postId) {
                    let updatedLikes = [...(post.likes || [])];
                    if (isLiked) {
                        if (!updatedLikes.includes(user?._id)) updatedLikes.push(user?._id);
                    } else {
                        updatedLikes = updatedLikes.filter(id => id !== user?._id);
                    }
                    return { ...post, likes: updatedLikes };
                }
                return post;
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Like failed");
        }
    };

    const handleComment = async (postId) => {
        if (!requireAuth()) return;

        const text = commentTexts[postId];
        if (!text || text.trim() === "") return toast.warning("Comment cannot be empty");

        try {
            const response = await commentPostAPI(postId, text);
            const newComment = response.data.data; 

            setPosts(posts.map(post => 
                post._id === postId 
                ? { ...post, comments: [...(post.comments || []), newComment] } 
                : post
            ));

            setCommentTexts({ ...commentTexts, [postId]: "" });
            toast.success("Comment added!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Comment failed");
        }
    };

    const handleShare = async (postId, postContent) => {
        if (!requireAuth()) return;

        const shareUrl = window.location.origin; 
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Postify App',
                    text: postContent ? postContent.substring(0, 60) + "..." : "Check out this post!",
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                toast.info("Link copied to clipboard!");
            }

            const response = await sharePostAPI(postId);
            setPosts(posts.map(post => 
                post._id === postId ? { ...post, sharesCount: response.data.data.sharesCount } : post
            ));
        } catch (error) {
            if (error.name !== 'AbortError') toast.error("Share failed");
        }
    };

    // Handle Admin Soft Delete directly from the Feed
    const handleAdminFeedSoftDelete = async (e) => {
        e.preventDefault();
        if (!reasonModal.reason.trim()) return toast.warning("Please provide a reason");

        try {
            await softDeletePostAPI(reasonModal.postId, reasonModal.reason);
            toast.success("Post soft deleted successfully");
            
            // Remove the post from the public feed view instantly
            setPosts(posts.filter(post => post._id !== reasonModal.postId));
            setReasonModal({ isOpen: false, postId: null, reason: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Soft delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            
            {/* Top Navigation Bar */}
            <div className="bg-white shadow px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight cursor-pointer" onClick={() => navigate('/')}>
                    Postify
                </h1>
                
                <div className="flex items-center gap-4 relative">
                    {!user ? (
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => navigate('/login')} 
                                className="text-blue-600 font-semibold hover:text-blue-700 transition"
                            >
                                Login
                            </button>
                            <button 
                                onClick={() => navigate('/signup')} 
                                className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-sm"
                            >
                                Sign Up
                            </button>
                        </div>
                    ) : (
                        <>
                            <button 
                                onClick={() => navigate('/create')} 
                                className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition"
                            >
                                + Create Post
                            </button>

                            <div className="relative">
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                    className="font-semibold text-gray-700 hover:text-blue-600 bg-gray-100 px-4 py-2 rounded-full transition flex items-center gap-2"
                                >
                                    👤 {user?.fullName} <span className="text-xs">▼</span>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                                        
                                        {/* Admin Dashboard Navigation Option */}
                                        {user?.role === "admin" && (
                                            <>
                                                <button 
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        navigate('/admin/dashboard');
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                                                >
                                                    🛡️ Admin Dashboard
                                                </button>
                                                <hr className="my-1 border-gray-100" />
                                            </>
                                        )}

                                        <button 
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                navigate('/my-posts');
                                            }}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                                        >
                                            🖼️ See My Posts
                                        </button>
                                        <hr className="my-1 border-gray-100" />
                                        <button 
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium"
                                        >
                                            🚪 Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="max-w-2xl mx-auto mt-8 px-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Latest Feed</h2>
                
                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <div className="text-center bg-white p-10 rounded-2xl shadow-sm">
                            <p className="text-gray-500 text-lg">No posts available right now!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md uppercase">
                                        {post.user?.fullName?.[0] || "U"}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{post.user?.fullName}</h3>
                                        <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                {post.content && <p className="text-gray-800 mb-4 whitespace-pre-wrap text-[15px] leading-relaxed">{post.content}</p>}
                                
                                {post.imageUrl && (
                                    <img 
                                        src={post.imageUrl} 
                                        alt="Post" 
                                        className="w-full max-h-[500px] object-cover rounded-xl mb-4 border border-gray-100"
                                    />
                                )}
                                
                                <div className="border-y border-gray-100 py-3 flex justify-between text-gray-500 font-medium">
                                    <button 
                                        onClick={() => handleLike(post._id)}
                                        className={`flex items-center gap-2 hover:text-blue-600 transition ${post.likes?.includes(user?._id) ? 'text-blue-600' : ''}`}
                                    >
                                        {post.likes?.includes(user?._id) ? '👍' : '👍🏻'} Like ({post.likes?.length || 0})
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (requireAuth()) setShowCommentBox({ ...showCommentBox, [post._id]: !showCommentBox[post._id] });
                                        }}
                                        className="flex items-center gap-2 hover:text-blue-600 transition"
                                    >
                                        💬 Comment ({post.comments?.length || 0})
                                    </button>
                                    <button 
                                        onClick={() => handleShare(post._id, post.content)}
                                        className="flex items-center gap-2 hover:text-green-600 transition"
                                    >
                                        🔗 Share ({post.sharesCount || 0})
                                    </button>
                                </div>

                                {/* Admin Moderation button directly on the feed */}
                                {user?.role === "admin" && (
                                    <div className="mt-3 flex justify-end">
                                        <button 
                                            onClick={() => setReasonModal({ isOpen: true, postId: post._id, reason: "" })}
                                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                        >
                                            ⚠️ Admin: Soft Delete Post
                                        </button>
                                    </div>
                                )}

                                {/* Comment Section */}
                                {showCommentBox[post._id] && (
                                    <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                                        <div className="flex gap-2 mb-4">
                                            <input 
                                                type="text"
                                                placeholder="Write a comment..."
                                                value={commentTexts[post._id] || ""}
                                                onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                                                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                                                onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                                            />
                                            <button 
                                                onClick={() => handleComment(post._id)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700"
                                            >
                                                Post
                                            </button>
                                        </div>

                                        <div className="space-y-3 max-h-40 overflow-y-auto">
                                            {post.comments?.slice().reverse().map((comment, index) => (
                                                <div key={index} className="flex gap-2 items-start">
                                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0 uppercase">
                                                        {comment.user?.fullName?.[0] || comment.user?.email?.[0] || "U"}
                                                    </div>
                                                    <div className="bg-white p-2 px-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm">
                                                        <span className="font-semibold block text-xs text-gray-900">
                                                          {comment.user?.fullName || comment.user?.email || "User"}
                                                        </span>
                                                        <span className="text-gray-700">{comment.text}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Admin Soft Delete Reason Modal */}
            {reasonModal.isOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Provide Reason</h3>
                        <p className="text-sm text-gray-500 mb-4">This reason will be visible to the user.</p>
                        
                        <form onSubmit={handleAdminFeedSoftDelete}>
                            <textarea
                                value={reasonModal.reason}
                                onChange={(e) => setReasonModal({ ...reasonModal, reason: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 resize-none"
                                rows="3"
                                placeholder="E.g., Violates community guidelines..."
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setReasonModal({ isOpen: false, postId: null, reason: "" })}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                                >
                                    Confirm Soft Delete
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;