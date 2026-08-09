import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import {
  getFeedPostsAPI,
  likePostAPI,
  sharePostAPI,
  commentPostAPI,
  softDeletePostAPI,
  getMyPostsAPI,
} from "../config/post.api.js";

const Dashboard = () => {
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [posts, setPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const [showCommentBox, setShowCommentBox] = useState({});
  const [reasonModal, setReasonModal] = useState({
    isOpen: false,
    postId: null,
    reason: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const urlUser = urlParams.get("user");

    if (urlToken && urlUser) {
      try {
        const decodedUser = decodeURIComponent(urlUser);
        localStorage.setItem("token", urlToken);
        localStorage.setItem("user", decodedUser);

        const parsedUser = JSON.parse(decodedUser);
        localStorage.setItem("role", parsedUser.role);

        if (parsedUser.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
        return;
      } catch (e) {
        console.error("User data parse error:", e);
      }
    }

    const fetchFeedPosts = async () => {
      try {
        const response = await getFeedPostsAPI();
        setPosts(response.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load feed");
      }
    };

    fetchFeedPosts();

    if (user && user.role !== "admin") {
      getMyPostsAPI()
        .then((res) => {
          const softDeletedPosts = res.data.data.filter(
            (p) => p.isSoftDeleted && !p.userClarification
          );
          if (softDeletedPosts.length > 0) {
            toast.warning(
              `⚠️ Notice: ${softDeletedPosts.length} of your post(s) were removed by an admin. Check 'My Posts' to appeal.`,
              { autoClose: 2500 }
            );
          }
        })
        .catch(() => {});
    }
  }, [navigate, user]);

  const requireAuth = () => {
    if (!user) {
      toast.info("Please login to interact with posts.");
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleLike = async (postId) => {
    if (!requireAuth()) return;
    const currentUserId = user?._id?.toString();

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          const likesArr = Array.isArray(post.likes)
            ? post.likes.map((id) =>
                typeof id === "object" ? (id._id || id).toString() : id.toString()
              )
            : [];
          const alreadyLiked = likesArr.includes(currentUserId);
          const updatedLikes = alreadyLiked
            ? likesArr.filter((id) => id !== currentUserId)
            : [...likesArr, currentUserId];

          return {
            ...post,
            likes: updatedLikes,
            likesCount: updatedLikes.length,
            isLiked: !alreadyLiked,
          };
        }
        return post;
      })
    );

    try {
      const response = await likePostAPI(postId);
      const { isLiked, likesCount, likes } = response.data.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: likes || post.likes,
              likesCount: likesCount !== undefined ? likesCount : post.likes?.length,
              isLiked: isLiked !== undefined ? isLiked : post.isLiked,
            };
          }
          return post;
        })
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update like status");
      try {
        const feedRes = await getFeedPostsAPI();
        setPosts(feedRes.data.data);
      } catch {}
    }
  };

  const handleComment = async (postId) => {
    if (!requireAuth()) return;

    const text = commentTexts[postId];
    if (!text || text.trim() === "") return toast.warning("Comment cannot be empty");

    try {
      const response = await commentPostAPI(postId, text);
      const newComment = response.data.data;

      setPosts(
        posts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), newComment] }
            : post
        )
      );

      setCommentTexts({ ...commentTexts, [postId]: "" });
      toast.success("Comment added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Comment failed");
    }
  };

  const handleShare = async (postId, postContent) => {
    if (!requireAuth()) return;

    const shareUrl = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Postify App",
          text: postContent ? postContent.substring(0, 60) + "..." : "Check out this post!",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.info("Link copied to clipboard!");
      }

      const response = await sharePostAPI(postId);
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? { ...post, sharesCount: response.data.data.sharesCount }
            : post
        )
      );
    } catch (error) {
      if (error.name !== "AbortError") toast.error("Share failed");
    }
  };

  const handleAdminFeedSoftDelete = async (e) => {
    e.preventDefault();
    if (!reasonModal.reason.trim()) return toast.warning("Please provide a reason");

    try {
      await softDeletePostAPI(reasonModal.postId, reasonModal.reason);
      toast.success("Post soft deleted successfully");

      setPosts(posts.filter((post) => post._id !== reasonModal.postId));
      setReasonModal({ isOpen: false, postId: null, reason: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Soft delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative transition-colors duration-300 overflow-x-hidden">
      {/* Side Ambient Color Blending Effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-80 -right-20 w-96 h-96 bg-cyan-500/20 dark:bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-blue-500/15 dark:bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar Widget */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              {/* Profile Card */}
              {user ? (
                <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md p-5 rounded-3xl shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md uppercase mb-3">
                      {user.fullName?.[0] || "U"}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                      {user.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      {user.email}
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 flex justify-around">
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {user.role === "admin" ? "Admin 🛡️" : "Member 👤"}
                        </span>
                        <span className="text-[11px] text-slate-400">Account Type</span>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4 border-slate-100 dark:border-slate-800" />

                  <div className="space-y-2">
                    <button
                      onClick={() => navigate("/create")}
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition cursor-pointer shadow-xs"
                    >
                      ✏️ Create New Post
                    </button>
                    <button
                      onClick={() => navigate("/my-posts")}
                      className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 py-2.5 px-4 rounded-xl text-sm font-semibold transition cursor-pointer"
                    >
                      🖼️ Manage My Posts
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-3xl shadow-lg">
                  <h3 className="text-xl font-black mb-2">Welcome to Postify!</h3>
                  <p className="text-sm text-blue-100 mb-6 leading-relaxed">
                    Share your thoughts, connect with creators, and explore exciting posts.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate("/signup")}
                      className="w-full bg-white text-blue-600 font-bold py-2.5 px-4 rounded-xl text-sm hover:bg-blue-50 transition cursor-pointer"
                    >
                      Get Started (Sign Up)
                    </button>
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full border border-white/40 text-white font-semibold py-2.5 px-4 rounded-xl text-sm hover:bg-white/10 transition cursor-pointer"
                    >
                      Login to Account
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Quick Links */}
              <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md p-5 rounded-3xl shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                  Navigation
                </h4>
                <button
                  onClick={() => navigate("/")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 transition"
                >
                  <span>🏠</span> Home Feed
                </button>
                {user && (
                  <button
                    onClick={() => navigate("/my-posts")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
                  >
                    <span>🖼️</span> My Posts
                  </button>
                )}
                {user?.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
                  >
                    <span>🛡️</span> Admin Dashboard
                  </button>
                )}
              </div>
            </div>

            {/* Main Middle Feed Column */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Quick Create Box Launcher */}
              {user && (
                <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md p-4 rounded-3xl shadow-sm flex items-center gap-3 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition"
                     onClick={() => navigate("/create")}>
                  <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                    {user.fullName?.[0] || "U"}
                  </div>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800/70 rounded-full px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400">
                    What's on your mind, {user.fullName?.split(" ")[0]}?
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold transition">
                    Post
                  </button>
                </div>
              )}

              {/* Feed Header */}
              <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>🔥</span> Community Feed
                </h2>
                <span className="text-xs font-bold px-3 py-1 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200/60 dark:border-blue-900/60">
                  {posts.length} {posts.length === 1 ? "Post" : "Posts"}
                </span>
              </div>

              {/* Feed Posts List */}
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="text-center bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md p-12 rounded-3xl shadow-sm">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">
                      No posts available right now!
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Be the first one to create a post and inspire the community.
                    </p>
                    {user && (
                      <button
                        onClick={() => navigate("/create")}
                        className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition"
                      >
                        + Create First Post
                      </button>
                    )}
                  </div>
                ) : (
                  posts.map((post) => {
                    const isLikedByCurrentUser =
                      Array.isArray(post.likes) &&
                      post.likes
                        .map((id) =>
                          typeof id === "object" ? (id._id || id).toString() : id.toString()
                        )
                        .includes(user?._id?.toString());

                    return (
                      <div
                        key={post._id}
                        className="bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md p-6 rounded-3xl shadow-sm hover:shadow-md transition duration-200"
                      >
                        {/* Author Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm uppercase shrink-0">
                            {post.user?.fullName?.[0] || "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug truncate">
                              {post.user?.fullName || "Anonymous Creator"}
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {new Date(post.createdAt).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Post Content Text */}
                        {post.content && (
                          <p className="text-slate-800 dark:text-slate-200 mb-4 whitespace-pre-wrap text-[15px] leading-relaxed">
                            {post.content}
                          </p>
                        )}

                        {/* Post Image Attachment */}
                        {post.imageUrl && (
                          <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 mb-4 bg-slate-100 dark:bg-slate-950">
                            <img
                              src={post.imageUrl}
                              alt="Post Attachment"
                              className="w-full max-h-125 object-cover hover:scale-[1.01] transition duration-300"
                            />
                          </div>
                        )}

                        {/* Interaction Bar */}
                        <div className="border-t border-b border-slate-100 dark:border-slate-800/80 py-3 flex justify-around text-slate-500 dark:text-slate-400 font-medium text-sm">
                          <button
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 ${
                              isLikedByCurrentUser
                                ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40"
                                : ""
                            }`}
                          >
                            <span>{isLikedByCurrentUser ? "👍" : "👍🏻"}</span>
                            <span>Like</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold">
                              {post.likesCount !== undefined
                                ? post.likesCount
                                : Array.isArray(post.likes)
                                ? post.likes.length
                                : 0}
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              if (requireAuth())
                                setShowCommentBox({
                                  ...showCommentBox,
                                  [post._id]: !showCommentBox[post._id],
                                });
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
                          >
                            <span>💬</span>
                            <span>Comment</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold">
                              {post.comments?.length || 0}
                            </span>
                          </button>

                          <button
                            onClick={() => handleShare(post._id, post.content)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
                          >
                            <span>🔗</span>
                            <span>Share</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold">
                              {post.sharesCount || 0}
                            </span>
                          </button>
                        </div>

                        {/* Admin Action */}
                        {user?.role === "admin" && (
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() =>
                                setReasonModal({
                                  isOpen: true,
                                  postId: post._id,
                                  reason: "",
                                })
                              }
                              className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border border-red-200/50 dark:border-red-900/40"
                            >
                              ⚠️ Admin: Soft Delete Post
                            </button>
                          </div>
                        )}

                        {/* Comment Section Box */}
                        {showCommentBox[post._id] && (
                          <div className="mt-4 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex gap-2 mb-4">
                              <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentTexts[post._id] || ""}
                                onChange={(e) =>
                                  setCommentTexts({
                                    ...commentTexts,
                                    [post._id]: e.target.value,
                                  })
                                }
                                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleComment(post._id)
                                }
                              />
                              <button
                                onClick={() => handleComment(post._id)}
                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition shadow-xs"
                              >
                                Post
                              </button>
                            </div>

                            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                              {post.comments && post.comments.length > 0 ? (
                                post.comments
                                  .slice()
                                  .reverse()
                                  .map((comment, index) => {
                                    if (!comment) return null;
                                    const authorName =
                                      comment.user?.fullName ||
                                      comment.user?.email ||
                                      "User";
                                    const avatarChar =
                                      comment.user?.fullName?.[0] ||
                                      comment.user?.email?.[0] ||
                                      "U";
                                    return (
                                      <div key={index} className="flex gap-2.5 items-start">
                                        <div className="w-7 h-7 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0 uppercase">
                                          {avatarChar}
                                        </div>
                                        <div className="bg-white dark:bg-slate-900 p-2.5 px-3.5 rounded-2xl rounded-tl-none shadow-xs border border-slate-100 dark:border-slate-800 text-sm flex-1">
                                          <span className="font-bold block text-xs text-slate-900 dark:text-slate-100">
                                            {authorName}
                                          </span>
                                          <span className="text-slate-700 dark:text-slate-300 text-xs">
                                            {comment.text}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })
                              ) : (
                                <p className="text-xs text-slate-400 italic text-center py-2">
                                  No comments yet. Be the first to comment!
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Sidebar Widget */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              {/* Community Trending */}
              <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md p-5 rounded-3xl shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <span>✨</span> Trending Topics
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-blue-600 dark:text-blue-400">#PostifyV2</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      New dark mode & aesthetics
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-purple-600 dark:text-purple-400">#CommunityFeed</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Active conversations today
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">#CreativePosts</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Share images & ideas
                    </p>
                  </div>
                </div>
              </div>

              {/* Guidelines / Footer Info */}
              <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md p-5 rounded-3xl shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-2">
                  Platform Guidelines
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  Keep discussions respectful and enjoyable for everyone.
                </p>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>© 2026 Postify</span>
                  <span>•</span>
                  <span>Privacy</span>
                  <span>•</span>
                  <span>Terms</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Admin Soft Delete Reason Modal */}
      {reasonModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Provide Soft Delete Reason
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              This reason will be visible to the post owner.
            </p>

            <form onSubmit={handleAdminFeedSoftDelete}>
              <textarea
                value={reasonModal.reason}
                onChange={(e) =>
                  setReasonModal({ ...reasonModal, reason: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 resize-none"
                rows="3"
                placeholder="E.g., Violates community guidelines..."
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setReasonModal({ isOpen: false, postId: null, reason: "" })
                  }
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition cursor-pointer shadow-xs"
                >
                  Confirm Soft Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
