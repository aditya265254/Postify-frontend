import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAdminUserPostsAPI,
  softDeletePostAPI,
  restorePostAPI,
  adminHardDeleteAPI,
} from "../config/post.api.js";

const AdminUserPosts = () => {
  const { userId } = useParams(); // Get user ID from the URL
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the Soft Delete Reason Modal
  const [reasonModal, setReasonModal] = useState({
    isOpen: false,
    postId: null,
    reason: "",
  });

  // 🚀 Clean & Direct: fetchPosts is now safely defined inside useEffect
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
          error.response?.data?.message || "Failed to load user's posts",
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
        reasonModal.reason,
      );
      toast.success("Post soft deleted successfully");

      // Update UI
      setPosts(
        posts.map((post) =>
          post._id === reasonModal.postId ? response.data.data : post,
        ),
      );
      setReasonModal({ isOpen: false, postId: null, reason: "" }); // Close modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Soft delete failed");
    }
  };

  const handleRestore = async (postId) => {
    if (
      !window.confirm(
        "Are you sure you want to restore this post? It will be visible to the public again.",
      )
    )
      return;

    try {
      const response = await restorePostAPI(postId);
      toast.success("Post restored successfully");
      setPosts(
        posts.map((post) => (post._id === postId ? response.data.data : post)),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Restore failed");
    }
  };

  const handleHardDelete = async (postId) => {
    if (
      !window.confirm(
        "WARNING: This will permanently delete the post and its image. Continue?",
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
      <div className="min-h-screen flex items-center justify-center">
        Loading User Data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-900 text-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-gray-300 hover:text-white font-medium text-lg"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-xl font-bold border-l border-gray-700 pl-4">
            Moderation Panel
          </h1>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            User's Content History
          </h2>
          <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-semibold text-sm">
            Total Posts: {posts.length}
          </span>
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-2xl shadow-sm text-gray-500">
              This user has not created any posts yet.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className={`p-6 rounded-2xl shadow-sm border ${post.isSoftDeleted ? "bg-red-50 border-red-200" : "bg-white border-gray-100"}`}
              >
                {/* Status Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                  {post.isSoftDeleted ? (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      Soft Deleted
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      Active
                    </span>
                  )}
                </div>

                {/* Content */}
                {post.content && (
                  <p className="text-gray-800 mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>
                )}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full max-h-100 object-cover rounded-xl mb-4 border border-gray-200"
                  />
                )}

                {/* Moderation Details (Only shows if Soft Deleted) */}
                {post.isSoftDeleted && (
                  <div className="bg-white rounded-lg p-4 mb-4 border border-red-100">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong className="text-red-600">Admin Reason:</strong>{" "}
                      {post.deletedByReason}
                    </p>
                    {post.userClarification ? (
                      <p className="text-sm text-gray-700">
                        <strong className="text-blue-600">User Appeal:</strong>{" "}
                        {post.userClarification}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        User has not appealed yet.
                      </p>
                    )}
                  </div>
                )}

                {/* Admin Action Buttons */}
                <div className="border-t pt-4 flex gap-3 justify-end">
                  {post.isSoftDeleted ? (
                    <button
                      onClick={() => handleRestore(post._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition text-sm"
                    >
                      ✅ Restore Post
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
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition text-sm"
                    >
                      ⚠️ Soft Delete
                    </button>
                  )}
                  <button
                    onClick={() => handleHardDelete(post._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition text-sm"
                  >
                    🗑️ Hard Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Soft Delete Reason Modal */}
      {reasonModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Provide Reason
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This reason will be visible to the user.
            </p>

            <form onSubmit={handleSoftDelete}>
              <textarea
                value={reasonModal.reason}
                onChange={(e) =>
                  setReasonModal({ ...reasonModal, reason: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4 resize-none"
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
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition"
                >
                  Submit & Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserPosts;
