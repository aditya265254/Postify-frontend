import { AlertTriangle, CheckCircle2, FolderOpen } from "lucide-react";
import EmptyState from "./common/EmptyState.jsx";

const MyPostList = ({ posts, loading = false, showActions = false, onDelete, onEdit, onAppeal }) => {
    if (loading) {
        return (
            <div className="bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-[#1C2A4A] p-10 rounded-2xl shadow-xs text-center flex flex-col items-center justify-center gap-3">
                <svg className="animate-spin h-7 w-7 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Loading posts...
                </p>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <EmptyState
                icon={FolderOpen}
                title="No posts found!"
                description="Create your first post to see it listed here."
            />
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div 
                    key={post._id} 
                    className={`p-6 rounded-2xl shadow-xs border transition ${
                        post.isSoftDeleted 
                            ? 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900/50' 
                            : 'bg-white dark:bg-[#0D1424] border-slate-200/80 dark:border-[#1C2A4A]'
                    }`}
                >
                    {/* Content & Image */}
                    {post.content && (
                        <p className={`mb-3 text-[15px] leading-relaxed ${
                            post.isSoftDeleted 
                                ? 'text-slate-400 dark:text-slate-500 line-through' 
                                : 'text-slate-800 dark:text-slate-200'
                        }`}>
                            {post.content}
                        </p>
                    )}
                    
                    {post.imageUrl && (
                        <img
                            src={post.imageUrl}
                            alt="Post"
                            className={`w-full max-h-100 object-cover rounded-xl mb-3 border border-slate-100 dark:border-[#1C2A4A] ${
                                post.isSoftDeleted ? 'opacity-50' : 'opacity-100'
                            }`}
                        />
                    )}

                    {/* Soft Delete Alert & Appeal Section */}
                    {post.isSoftDeleted && (
                        <div className="bg-white dark:bg-[#0D1424] border border-red-200 dark:border-red-900/60 p-4 rounded-xl mt-4 mb-2 shadow-xs">
                            <p className="text-sm text-red-600 dark:text-red-400 font-bold mb-1 flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4" /> This post was removed by an Admin
                            </p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                                <span className="font-semibold">Reason:</span> {post.deletedByReason}
                            </p>
                            
                            {post.userClarification ? (
                                <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-[#141D33] p-2.5 rounded-lg inline-flex items-center gap-1.5 border border-slate-200 dark:border-[#1C2A4A]">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Appeal submitted. Awaiting admin review.
                                </p>
                            ) : (
                                <button
                                    onClick={() => onAppeal && onAppeal(post._id)}
                                    className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 dark:hover:bg-red-600 transition cursor-pointer shadow-xs"
                                >
                                    Submit Appeal
                                </button>
                            )}
                        </div>
                    )}

                    {/* Footer Actions (Date, Edit, Delete) */}
                    <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 mt-4 border-t border-slate-100 dark:border-[#1C2A4A]/80 pt-3">
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                        
                        {showActions && (
                            <div className="flex gap-4">
                                {!post.isSoftDeleted && (
                                    <button
                                        onClick={() => onEdit && onEdit(post._id)}
                                        className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete && onDelete(post._id)}
                                    className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 font-bold transition cursor-pointer"
                                >
                                    Delete Permanently
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyPostList;


