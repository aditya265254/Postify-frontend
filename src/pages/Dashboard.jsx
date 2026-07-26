import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
    getFeedPostsAPI, 
    likePostAPI, 
    sharePostAPI,
    commentPostAPI
} from "../config/post.api.js"; 

const Dashboard = () => {
  
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const [posts, setPosts] = useState([]);
    const [commentTexts, setCommentTexts] = useState({}); 
    const [showCommentBox, setShowCommentBox] = useState({}); 

    
    const navigate = useNavigate();

  
    const fetchFeedPosts = async () => {
        try {
            const response = await getFeedPostsAPI();
            setPosts(response.data.data); 
        } catch {
            toast.error("Failed to load feed");
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
                    window.location.href = "/dashboard";
                }
                return;
            } catch {
                console.error("User data parse error");
            }
        }

        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/');
            return;
        }
        if (user?.role === "admin") {
            navigate('/admin/dashboard');
            return;
        }
        
        fetchFeedPosts();
    }, [navigate]);

    const handleLike = async (postId) => {
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
        } catch {
            toast.error("Like failed");
        }
    };

    const handleComment = async (postId) => {
        const text = commentTexts[postId];
        if (!text || text.trim() === "") return toast.warning("Comment khali nahi ho sakta");

        try {
            await commentPostAPI(postId, text);

            const newComment = {
                user: {
                    _id: user._id,
                    fullName: user.fullName
                },
                text: text.trim(),
                createdAt: new Date().toISOString()
            };

            setPosts(posts.map(post => 
                post._id === postId 
                ? { ...post, comments: [...(post.comments || []), newComment] } 
                : post
            ));

            setCommentTexts({ ...commentTexts, [postId]: "" });
            toast.success("Comment added!");
        } catch {
            toast.error("Comment failed");
        }
    };

    const handleShare = async (postId, postContent) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Check this post!",
                    text: postContent,
                    url: window.location.href
                });
            }
            const response = await sharePostAPI(postId);
            setPosts(posts.map(post => 
                post._id === postId 
                ? { ...post, sharesCount: response.data.data.sharesCount } 
                : post
            ));
            toast.success("Post Shared!");
        } catch {
            toast.error("Share failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Navbar/>

            <div className="max-w-2xl mx-auto mt-8 px-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Latest Feed</h2>
                
                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <div className="text-center bg-white p-10 rounded-2xl shadow-sm">
                            <p className="text-gray-500 text-lg">Abhi tak kisi ne koi post nahi ki hai!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                        {post.user?.fullName?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{post.user?.fullName}</h3>
                                        <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                {post.content && (
                                    <p className="text-gray-800 mb-4 whitespace-pre-wrap text-[15px] leading-relaxed">
                                        {post.content}
                                    </p>
                                )}
                                
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
                                        Like ({post.likes?.length || 0})
                                    </button>
                                    <button 
                                        onClick={() => setShowCommentBox({ ...showCommentBox, [post._id]: !showCommentBox[post._id] })}
                                        className="flex items-center gap-2 hover:text-blue-600 transition"
                                    >
                                        Comment ({post.comments?.length || 0})
                                    </button>
                                    <button 
                                        onClick={() => handleShare(post._id, post.content)}
                                        className="flex items-center gap-2 hover:text-green-600 transition"
                                    >
                                        Share ({post.sharesCount || 0})
                                    </button>
                                </div>

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
                                                        {comment.user?.fullName?.[0] || "U"}
                                                    </div>
                                                    <div className="bg-white p-2 px-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm">
                                                        <span className="font-semibold block text-xs text-gray-900">
                                                            {comment.user?.fullName || "User"}
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
        </div>
    );
};

export default Dashboard;