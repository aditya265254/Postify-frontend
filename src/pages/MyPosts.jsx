import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Image, Plus } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import MyPostList from "../components/MyPostList.jsx";
import { getMyPostsAPI, deletePostAPI, updatePostAPI, appealPostAPI } from "../config/post.api.js";

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
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
        setLoading(true);
        try {
            const response = await getMyPostsAPI();
            setPosts(response.data.data);
        } catch {
            toast.error("Failed to load posts");
        } finally {
            setLoading(false);
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
        <div className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 pb-10 relative transition-colors duration-300">
            <Navbar />
            <div className="max-w-3xl mx-auto mt-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <Image className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Manage My Posts
                    </h2>
                    <button 
                        onClick={() => navigate('/create')} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1"
                    >
                        <Plus className="w-3.5 h-3.5" /> Create New
                    </button>
                </div>
                
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((n) => (
                            <div key={n} className="p-6 rounded-2xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-[#1C2A4A] animate-shimmer">
                                <div className="h-4 w-3/4 bg-slate-200 dark:bg-[#141D33] rounded mb-3 animate-pulse" />
                                <div className="h-44 w-full bg-slate-200 dark:bg-[#141D33] rounded-xl animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <MyPostList 
                        posts={posts} 
                        showActions={true} 
                        onDelete={handleDelete} 
                        onEdit={handleEdit} 
                        onAppeal={handleAppealClick} 
                    />
                )}
            </div>

            {/* EDIT MODAL */}
            {editingPost && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 px-4">
                    <div className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-[#1C2A4A] p-6 rounded-3xl shadow-2xl w-full max-w-lg">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4">Edit Post</h2>
                        
                        <form onSubmit={handleUpdate}>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#141D33] border border-slate-200 dark:border-[#1C2A4A] rounded-2xl px-4 py-3 mb-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                                rows="4"
                                placeholder="Edit your content here..."
                            />
                            
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">Update Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditImage(e.target.files[0])}
                                    className="text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-[#141D33] file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200 file:cursor-pointer cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-[#1C2A4A] pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingPost(null)}
                                    className="px-5 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-[#141D33] rounded-full text-sm transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition disabled:opacity-50 cursor-pointer shadow-xs"
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
                    <div className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-[#1C2A4A] p-6 rounded-3xl shadow-2xl w-full max-w-lg">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Submit an Appeal</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Please explain why you think your post should be restored.</p>
                        
                        <form onSubmit={handleAppealSubmit}>
                            <textarea
                                value={appealModal.clarification}
                                onChange={(e) => setAppealModal({ ...appealModal, clarification: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-[#141D33] border border-slate-200 dark:border-[#1C2A4A] rounded-2xl px-4 py-3 mb-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                                rows="4"
                                placeholder="Write your clarification to the admin..."
                            />
                            
                            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-[#1C2A4A] pt-4">
                                <button
                                    type="button"
                                    onClick={() => setAppealModal({ isOpen: false, postId: null, clarification: "" })}
                                    className="px-5 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-[#141D33] rounded-full text-sm transition cursor-pointer"
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
    );
};

export default MyPosts;


