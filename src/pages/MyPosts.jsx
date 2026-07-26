import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import MyPostList from "../components/MyPostList.jsx";
import { getMyPostsAPI, deletePostAPI } from "../config/post.api.js";

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) return navigate('/');
        fetchMyPosts();
    }, [navigate]);

    const fetchMyPosts = async () => {
        try {
            const response = await getMyPostsAPI();
            setPosts(response.data.data);
        } catch {
            toast.error("Failed to load posts");
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Sach me delete karna hai?")) return;
        try {
            await deletePostAPI(postId);
            toast.success("Post deleted!");
            setPosts(posts.filter(post => post._id !== postId));
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleEdit = (postId) => {
        // Edit ka logic hum next banayenge
        toast.info("Edit feature coming soon!");
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Navbar />
            <div className="max-w-2xl mx-auto mt-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Manage My Posts</h2>
                    <button onClick={() => navigate('/create')} className="text-blue-600 font-medium hover:underline">
                        + Create New
                    </button>
                </div>
                
                {/* 👇 Yahan showActions={true} bhejenge taaki delete button dikhe */}
                <MyPostList 
                    posts={posts} 
                    showActions={true} 
                    onDelete={handleDelete} 
                    onEdit={handleEdit} 
                />
            </div>
        </div>
    );
};

export default MyPosts;