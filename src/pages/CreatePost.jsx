import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import MyPostList from "../components/MyPostList.jsx"; // 👈 Component import kiya
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
        if (!content && !image) return toast.warning("Content ya image zaroori h");
        setLoading(true);
        try {
            const formData = new FormData();
            if (content) formData.append("content", content);
            if (image) formData.append("image", image);

            await createPostAPI(formData);
            toast.success("Post created!");
            setContent("");
            setImage(null);
            e.target.reset(); // File input clear
            fetchMyPosts();  
        } catch {
            toast.error("Post create failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Navbar />
            <div className="max-w-2xl mx-auto mt-8 px-4">
                
                {/* Create Post Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Create Post</h2>
                    <form onSubmit={handleCreate}>
                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none mb-3"
                            rows={3}
                        />
                        <div className="flex items-center justify-between">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="text-sm text-gray-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* 👇 My Posts List (Read-Only Mode) */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">Preview Your Posts</h2>
                <MyPostList posts={posts} showActions={false} /> 

            </div>
        </div>
    );
};

export default CreatePost;