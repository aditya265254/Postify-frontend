import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import MyPostList from "../components/MyPostList.jsx";
import { getMyPostsAPI, deletePostAPI, updatePostAPI, appealPostAPI } from "../config/post.api.js";

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    
    const [editingPost, setEditingPost] = useState(null); 
    const [editContent, setEditContent] = useState("");
    const [editImage, setEditImage] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    
    const [appealModal, setAppealModal] = useState({ isOpen: false, postId: null, clarification: "" });
    const [appealLoading, setAppealLoading] = useState(false);
    
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
        if (!window.confirm("Are you sure want to delete your post?")) return;
        try {
            await deletePostAPI(postId);
            toast.success("Post deleted!");
            setPosts(posts.filter(post => post._id !== postId));
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleEdit = (postId) => {
        const postToEdit = posts.find(p => p._id === postId);
        setEditingPost(postToEdit);
        setEditContent(postToEdit.content || "");
        setEditImage(null); 
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        
        try {
            const formData = new FormData();
            if (editContent) formData.append("content", editContent);
            if (editImage) formData.append("image", editImage); 

            const response = await updatePostAPI(editingPost._id, formData);
            toast.success("Post updated successfully!");
            
            setPosts(posts.map(p => p._id === editingPost._id ? response.data.data : p));
            setEditingPost(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update post");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleAppealClick = (postId) => {
        setAppealModal({ isOpen: true, postId, clarification: "" });
    };

    const handleAppealSubmit = async (e) => {
        e.preventDefault();
        if (!appealModal.clarification.trim()) return toast.warning("Clarification is required!");

        setAppealLoading(true);
        try {
            const response = await appealPostAPI(appealModal.postId, appealModal.clarification);
            toast.success("Appeal submitted successfully!");
            
            setPosts(posts.map(p => p._id === appealModal.postId ? response.data.data : p));
            setAppealModal({ isOpen: false, postId: null, clarification: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit appeal");
        } finally {
            setAppealLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-10 relative transition-colors duration-300">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                <Navbar />
                <div className="max-w-3xl mx-auto mt-8 px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span>🖼️</span> Manage My Posts
                        </h2>
                        <button 
                            onClick={() => navigate('/create')} 
                            className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition cursor-pointer shadow-xs"
                        >
                            + Create New
                        </button>
                    </div>
                    
                    <MyPostList 
                        posts={posts} 
                        showActions={true} 
                        onDelete={handleDelete} 
                        onEdit={handleEdit} 
                        onAppeal={handleAppealClick} 
                    />
                </div>

                {/* EDIT MODAL */}
                {editingPost && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 px-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-2xl w-full max-w-lg">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">Edit Post</h2>
                            
                            <form onSubmit={handleUpdate}>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 mb-4 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                                    rows="4"
                                    placeholder="Edit your content here..."
                                />
                                
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">Update Image (Optional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setEditImage(e.target.files[0])}
                                        className="text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-950/60 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPost(null)}
                                        className="px-5 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-sm transition cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50 cursor-pointer shadow-xs"
                                    >
                                        {updateLoading ? "Updating..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* APPEAL MODAL */}
                {appealModal.isOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 px-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-2xl w-full max-w-lg">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">Submit an Appeal</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Please explain why you think your post should be restored.</p>
                            
                            <form onSubmit={handleAppealSubmit}>
                                <textarea
                                    value={appealModal.clarification}
                                    onChange={(e) => setAppealModal({ ...appealModal, clarification: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 mb-4 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                                    rows="4"
                                    placeholder="Write your clarification to the admin..."
                                />
                                
                                <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setAppealModal({ isOpen: false, postId: null, clarification: "" })}
                                        className="px-5 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-sm transition cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={appealLoading}
                                        className="bg-red-600 dark:bg-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition disabled:opacity-50 cursor-pointer shadow-xs"
                                    >
                                        {appealLoading ? "Submitting..." : "Submit Appeal"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPosts;