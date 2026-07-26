import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import MyPostList from "../components/MyPostList.jsx";
import { getMyPostsAPI, deletePostAPI, updatePostAPI, appealPostAPI } from "../config/post.api.js";

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    
    // Edit States
    const [editingPost, setEditingPost] = useState(null); 
    const [editContent, setEditContent] = useState("");
    const [editImage, setEditImage] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    
    // Appeal States
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

    // --- NEW APPEAL FUNCTIONS --- //
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
            
            // Update UI without refresh
            setPosts(posts.map(p => p._id === appealModal.postId ? response.data.data : p));
            setAppealModal({ isOpen: false, postId: null, clarification: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit appeal");
        } finally {
            setAppealLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10 relative">
            <Navbar />
            <div className="max-w-2xl mx-auto mt-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Manage My Posts</h2>
                    <button onClick={() => navigate('/create')} className="text-blue-600 font-medium hover:underline">
                        + Create New
                    </button>
                </div>
                
                <MyPostList 
                    posts={posts} 
                    showActions={true} 
                    onDelete={handleDelete} 
                    onEdit={handleEdit} 
                    onAppeal={handleAppealClick} // Added the appeal prop
                />
            </div>

            {/* EDIT MODAL */}
            {editingPost && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Post</h2>
                        
                        <form onSubmit={handleUpdate}>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-blue-500 resize-none"
                                rows="4"
                                placeholder="Edit your content here..."
                            />
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Update Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditImage(e.target.files[0])}
                                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingPost(null)}
                                    className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-full transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:bg-gray-400"
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Submit an Appeal</h2>
                        <p className="text-sm text-gray-500 mb-4">Please explain why you think your post should be restored.</p>
                        
                        <form onSubmit={handleAppealSubmit}>
                            <textarea
                                value={appealModal.clarification}
                                onChange={(e) => setAppealModal({ ...appealModal, clarification: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-blue-500 resize-none"
                                rows="4"
                                placeholder="Write your clarification to the admin..."
                            />
                            
                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setAppealModal({ isOpen: false, postId: null, clarification: "" })}
                                    className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-full transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={appealLoading}
                                    className="bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition disabled:opacity-50"
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