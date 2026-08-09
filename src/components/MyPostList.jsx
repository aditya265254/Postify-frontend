const MyPostList = ({ posts, showActions = false, onDelete, onEdit, onAppeal }) => {
    if (!posts || posts.length === 0) {
        return (
            <div className="text-center bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-10 rounded-2xl shadow-xs backdrop-blur-md">
                <p className="text-slate-500 dark:text-slate-400 font-medium">No posts found!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div 
                    key={post._id} 
                    className={`p-6 rounded-2xl shadow-xs border backdrop-blur-md transition ${
                        post.isSoftDeleted 
                            ? 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900/50' 
                            : 'bg-white/85 dark:bg-slate-900/85 border-slate-200/80 dark:border-slate-800/80'
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
                            className={`w-full max-h-100 object-cover rounded-xl mb-3 border border-slate-100 dark:border-slate-800 ${
                                post.isSoftDeleted ? 'opacity-50' : 'opacity-100'
                            }`}
                        />
                    )}

                    {/* Soft Delete Alert & Appeal Section */}
                    {post.isSoftDeleted && (
                        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 p-4 rounded-xl mt-4 mb-2 shadow-xs">
                            <p className="text-sm text-red-600 dark:text-red-400 font-bold mb-1">
                                ⚠️ This post was removed by an Admin
                            </p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                                <span className="font-semibold">Reason:</span> {post.deletedByReason}
                            </p>
                            
                            {post.userClarification ? (
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/50 p-2 rounded-lg inline-block border border-blue-100 dark:border-blue-900/40">
                                    ✅ Appeal submitted. Awaiting admin review.
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
                    <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 mt-4 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                        
                        {showActions && (
                            <div className="flex gap-4">
                                {!post.isSoftDeleted && (
                                    <button
                                        onClick={() => onEdit && onEdit(post._id)}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold cursor-pointer"
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