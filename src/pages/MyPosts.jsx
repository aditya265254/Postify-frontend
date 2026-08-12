import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Image, Plus, Crop, X, ImagePlus } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import MyPostList from "../components/MyPostList.jsx";
import ConfirmModal from "../components/modals/ConfirmModal.jsx";
import ImageCropper from "../components/common/ImageCropper.jsx";
import { getMyPostsAPI, deletePostAPI, updatePostAPI, appealPostAPI } from "../config/post.api.js";

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Edit Modal State
    const [editingPost, setEditingPost] = useState(null); 
    const [editContent, setEditContent] = useState("");
    const [editImage, setEditImage] = useState(null);
    const [editPreview, setEditPreview] = useState(null);
    const [removeExistingImage, setRemoveExistingImage] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    // Cropper State for Edit
    const [showCropper, setShowCropper] = useState(false);
    const [rawImageSrc, setRawImageSrc] = useState(null);
    const editFileInputRef = useRef(null);
    
    // Delete Confirmation Modal State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null });
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Appeal Modal State
    const [appealModal, setAppealModal] = useState({ isOpen: false, postId: null, clarification: "" });
    const [appealLoading, setAppealLoading] = useState(false);
    
    const navigate = useNavigate();

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

    useEffect(() => {
        if (!localStorage.getItem("token")) return navigate('/');
        fetchMyPosts();
    }, [navigate]);

    const handleDelete = (postId) => {
        setDeleteModal({ isOpen: true, postId });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.postId) return;
        setDeleteLoading(true);
        try {
            await deletePostAPI(deleteModal.postId);
            toast.success("Post deleted successfully!");
            setPosts(posts.filter(post => post._id !== deleteModal.postId));
            setDeleteModal({ isOpen: false, postId: null });
        } catch {
            toast.error("Delete failed");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEdit = (postId) => {
        const postToEdit = posts.find(p => p._id === postId);
        setEditingPost(postToEdit);
        setEditContent(postToEdit.content || "");
        setEditImage(null); 
        setEditPreview(postToEdit.imageUrl || null);
        setRawImageSrc(postToEdit.imageUrl || null);
        setRemoveExistingImage(false);
        setShowCropper(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setRawImageSrc(objectUrl);
        setEditImage(file);
        setEditPreview(objectUrl);
        setRemoveExistingImage(false);
    };

    const handleCropApply = (croppedFile, croppedPreview) => {
        setEditImage(croppedFile);
        setEditPreview(croppedPreview);
        setRawImageSrc(croppedPreview);
        setRemoveExistingImage(false);
        setShowCropper(false);
    };

    const handleRemoveImage = () => {
        setEditImage(null);
        setEditPreview(null);
        setRawImageSrc(null);
        setRemoveExistingImage(true);
        if (editFileInputRef.current) editFileInputRef.current.value = "";
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        
        try {
            const formData = new FormData();
            if (editContent) formData.append("content", editContent);
            if (editImage) {
                formData.append("image", editImage);
            } else if (removeExistingImage) {
                formData.append("removeImage", "true");
            }

            const response = await updatePostAPI(editingPost._id, formData);
            toast.success("Post updated successfully!");
            
            const updatedPost = response.data.data;
            if (updatedPost?.imageUrl) {
                updatedPost.imageUrl = `${updatedPost.imageUrl}?t=${Date.now()}`;
            }

            setPosts(posts.map(p => p._id === editingPost._id ? updatedPost : p));
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
                
                <MyPostList 
                    posts={posts} 
                    loading={loading}
                    showActions={true} 
                    onDelete={handleDelete} 
                    onEdit={handleEdit} 
                    onAppeal={handleAppealClick} 
                />
            </div>

            {/* EDIT MODAL */}
            {editingPost && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
                    <div className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-[#1C2A4A] p-6 rounded-3xl shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Edit Post</h2>
                            <button
                                type="button"
                                onClick={() => setEditingPost(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdate}>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#141D33] border border-slate-200 dark:border-[#1C2A4A] rounded-2xl px-4 py-3 mb-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                                rows="4"
                                placeholder="Edit your content here..."
                            />
                            
                            {/* Image Preview & Actions */}
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                    Post Image
                                </label>

                                {editPreview ? (
                                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1C2A4A] bg-slate-100 dark:bg-[#141D33] mb-3">
                                        <img
                                            src={editPreview}
                                            alt="Preview"
                                            className="w-full max-h-60 object-cover"
                                        />
                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2.5 right-2.5 bg-slate-900/75 hover:bg-red-600 text-white rounded-xl p-1.5 transition cursor-pointer backdrop-blur-sm"
                                            title="Remove image"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {/* Crop Button */}
                                        <button
                                            type="button"
                                            onClick={() => setShowCropper(true)}
                                            className="absolute top-2.5 right-12 bg-slate-900/75 hover:bg-slate-900 text-white rounded-xl p-1.5 transition cursor-pointer backdrop-blur-sm flex items-center gap-1 px-2.5 text-xs font-semibold"
                                            title="Crop image"
                                        >
                                            <Crop className="w-3.5 h-3.5" /> Crop
                                        </button>
                                    </div>
                                ) : null}

                                <input
                                    ref={editFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="edit-post-image-input"
                                />
                                <label
                                    htmlFor="edit-post-image-input"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-[#141D33] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1C2A4A] border border-slate-200 dark:border-[#1C2A4A] transition cursor-pointer"
                                >
                                    <ImagePlus className="w-4 h-4" />
                                    {editPreview ? "Change Image" : "Add Image"}
                                </label>
                            </div>

                            <ImageCropper
                                imageSrc={rawImageSrc}
                                open={showCropper}
                                onClose={() => setShowCropper(false)}
                                onApply={handleCropApply}
                                fileName="edited-image.jpg"
                            />

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

            {/* DELETE CONFIRMATION MODAL */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, postId: null })}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                title="Delete Post?"
                message="Are you sure you want to delete this post? It will be permanently removed from your profile."
                confirmText="Delete Post"
                confirmVariant="danger"
            />
        </div>
    );
};

export default MyPosts;
