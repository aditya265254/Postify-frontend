import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import {
  getAdminUserPostsAPI,
  softDeletePostAPI,
  restorePostAPI,
  adminHardDeleteAPI,
} from "../config/post.api.js";

const AdminUserPosts = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reasonModal, setReasonModal] = useState({
    isOpen: false,
    postId: null,
    reason: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user?.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await getAdminUserPostsAPI(userId);
        setPosts(response.data.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load user's posts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, navigate]);

  const handleSoftDelete = async (e) => {
    e.preventDefault();
    if (!reasonModal.reason.trim())
      return toast.warning("Please provide a reason");

    try {
      const response = await softDeletePostAPI(
        reasonModal.postId,
        reasonModal.reason
      );
      toast.success("Post soft deleted successfully");

      setPosts(
        posts.map((post) =>
          post._id === reasonModal.postId ? response.data.data : post
        )
      );
      setReasonModal({ isOpen: false, postId: null, reason: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Soft delete failed");
    }
  };

  const handleRestore = async (postId) => {
    if (
      !window.confirm(
        "Are you sure you want to restore this post? It will be visible to the public again."
      )
    )
      return;

    try {
      const response = await restorePostAPI(postId);
      toast.success("Post restored successfully");
      setPosts(
        posts.map((post) => (post._id === postId ? response.data.data : post))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Restore failed");
    }
  };

  const handleHardDelete = async (postId) => {
    if (
      !window.confirm(
        "WARNING: This will permanently delete the post and its image. Continue?"
      )
    )
      return;

    try {
      await adminHardDeleteAPI(postId);
      toast.success("Post permanently deleted");
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Hard delete failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#1E1E24] flex items-center justify-center font-bold text-slate-700 dark:text-zinc-300">
        Loading User Data...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1E1E24] text-slate-900 dark:text-zinc-100 pb-10 relative transition-colors duration-300">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-slate-200 dark:bg-[#303038] text-slate-700 dark:text-zinc-200 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-slate-300 dark:hover:bg-[#303038] transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Admin Dashboard
            </button>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100">
              User Moderation History
            </h2>
          </div>
          <span className="bg-slate-100 dark:bg-[#303038] text-slate-700 dark:text-zinc-300 px-3.5 py-1 rounded-full font-bold text-xs border border-slate-200 dark:border-[#3E3E48]">
            Total Posts: {posts.length}
          </span>
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white dark:bg-[#28282F] p-10 text-center rounded-3xl border border-slate-200 dark:border-[#3E3E48] text-slate-500 dark:text-zinc-400 font-medium shadow-xs">
              This user has not created any posts yet.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className={`p-6 rounded-3xl shadow-xs border transition ${
                  post.isSoftDeleted
                    ? "bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/40"
                    : "bg-white dark:bg-[#28282F] border-slate-200/80 dark:border-[#3E3E48]"
                }`}
              >
                {/* Status Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-slate-400 dark:text-zinc-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                  {post.isSoftDeleted ? (
                    <span className="bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide">
                      Soft Deleted
                    </span>
                  ) : (
                    <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide">
                      Active
                    </span>
                  )}
                </div>

                {/* Content */}
                {post.content && (
                  <p className="text-slate-800 dark:text-zinc-200 mb-4 whitespace-pre-wrap text-[15px] leading-relaxed">
                    {post.content}
                  </p>
                )}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full max-h-100 object-cover rounded-2xl mb-4 border border-slate-100 dark:border-[#3E3E48]"
                  />
                )}

                {/* Moderation Details */}
                {post.isSoftDeleted && (
                  <div className="bg-white dark:bg-[#28282F] rounded-2xl p-4 mb-4 border border-red-200 dark:border-red-900/50 shadow-xs">
                    <p className="text-xs text-slate-700 dark:text-zinc-300 mb-2">
                      <strong className="text-red-600 dark:text-red-400">Admin Reason:</strong>{" "}
                      {post.deletedByReason}
                    </p>
                    {post.userClarification ? (
                      <p className="text-xs text-slate-700 dark:text-zinc-300">
                        <strong className="text-slate-900 dark:text-zinc-100">User Appeal:</strong>{" "}
                        {post.userClarification}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        User has not appealed yet.
                      </p>
                    )}
                  </div>
                )}

                {/* Admin Action Buttons */}
                <div className="border-t border-slate-100 dark:border-[#3E3E48]/80 pt-4 flex gap-3 justify-end">
                  {post.isSoftDeleted ? (
                    <button
                      onClick={() => handleRestore(post._id)}
                      className="bg-emerald-600 dark:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Restore Post
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setReasonModal({
                          isOpen: true,
                          postId: post._id,
                          reason: "",
                        })
                      }
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold transition text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4" /> Soft Delete
                    </button>
                  )}
                  <button
                    onClick={() => handleHardDelete(post._id)}
                    className="bg-red-600 dark:bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold transition text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Hard Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Soft Delete Reason Modal */}
        {reasonModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-[#28282F] border border-slate-200 dark:border-[#3E3E48] p-6 rounded-3xl w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2">
                Provide Soft Delete Reason
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                This reason will be visible to the post owner.
              </p>

              <form onSubmit={handleSoftDelete}>
                <textarea
                  value={reasonModal.reason}
                  onChange={(e) =>
                    setReasonModal({ ...reasonModal, reason: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-[#303038]/70 border border-slate-300 dark:border-[#3E3E48] rounded-xl p-3 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4 resize-none"
                  rows="3"
                  placeholder="E.g., Violates community guidelines regarding spam..."
                  required
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setReasonModal({ isOpen: false, postId: null, reason: "" })
                    }
                    className="px-4 py-2 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#38383F] rounded-xl text-sm font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition cursor-pointer shadow-xs"
                  >
                    Submit & Delete
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

export default AdminUserPosts;



