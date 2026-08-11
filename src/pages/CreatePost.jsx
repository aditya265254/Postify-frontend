import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Sparkles } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import MyPostList from "../components/MyPostList.jsx";
import PostForm from "../components/forms/PostForm.jsx";
import { createPostAPI, getMyPostsAPI } from "../config/post.api.js";

const CreatePost = () => {
    const [posts, setPosts] = useState([]);
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
        if (!localStorage.getItem("token")) return navigate("/");
        fetchMyPosts();
    }, [navigate]);

    const handleCreatePost = async ({ content, image }) => {
        setLoading(true);
        try {
            const formData = new FormData();
            if (content) formData.append("content", content);
            if (image) formData.append("image", image);

            await createPostAPI(formData);
            toast.success("Post created successfully!");
            fetchMyPosts();
            return true;
        } catch {
            toast.error("Post creation failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 pb-10 relative transition-colors duration-300">
            <Navbar />
            <div className="max-w-2xl mx-auto mt-8 px-4">

                {/* Modular MVC Post Form Component */}
                <PostForm onSubmit={handleCreatePost} loading={loading} />

                {/* Recent Posts */}
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Your Recent Posts Preview
                </h2>

                <MyPostList posts={posts} setPosts={setPosts} />
            </div>
        </div>
    );
};

export default CreatePost;
