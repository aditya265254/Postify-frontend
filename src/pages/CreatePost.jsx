import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import MyPostList from "../components/MyPostList.jsx";
import { createPostAPI, getMyPostsAPI } from "../config/post.api.js";

const CreatePost = () => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchMyPosts = async () => {
        try {
            const response = await getMyPostsAPI();
            setPosts(response.data.data);
        } catch {
            toast.error("Failed to load posts");
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) return navigate('/');
        fetchMyPosts();
    }, [navigate]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!content && !image) return toast.warning("Please provide post text or image");
        setLoading(true);
        try {
            const formData = new FormData();
            if (content) formData.append("content", content);
            if (image) formData.append("image", image);

            await createPostAPI(formData);
            toast.success("Post created successfully!");
            setContent("");
            setImage(null);
            e.target.reset(); 
            fetchMyPosts();  
        } catch {
            toast.error("Post creation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-10 relative transition-colors duration-300">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute top-10 right-1/4 w-80 h-80 bg-blue-500/10 dark:bg-sky-600/15 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                <Navbar />
                <div className="max-w-2xl mx-auto mt-8 px-4">
                    
                    {/* Create Post Form Card */}
                    <div className="bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md p-6 rounded-3xl shadow-sm mb-8">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <span>✏️</span> Create New Post
                        </h2>
                        <form onSubmit={handleCreate}>
                            <textarea
                                placeholder="What's on your mind today?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none mb-4"
                                rows={4}
                            />
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-950/60 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-xs"
                                >
                                    {loading ? "Publishing..." : "Publish Post"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Posts Section */}
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <span>👀</span> Your Recent Posts Preview
                    </h2>
                    <MyPostList posts={posts} showActions={false} /> 

                </div>
            </div>
        </div>
    );
};

export default CreatePost;