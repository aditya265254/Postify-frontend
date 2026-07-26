const MyPostList = ({ posts, showActions = false, onDelete, onEdit, onAppeal }) => {
    if (!posts || posts.length === 0) {
        return (
            <div className="text-center bg-white p-10 rounded-2xl shadow-sm">
                <p className="text-gray-500">No posts found!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div 
                    key={post._id} 
                    className={`p-6 rounded-2xl shadow-sm border ${post.isSoftDeleted ? 'bg-red-50/50 border-red-200' : 'bg-white border-gray-100'}`}
                >
                    
                    {/* Content & Image */}
                    {post.content && (
                        <p className={`mb-3 text-[15px] ${post.isSoftDeleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                            {post.content}
                        </p>
                    )}
                    
                    {post.imageUrl && (
                        <img
                            src={post.imageUrl}
                            alt="Post"
                            className={`w-full max-h-100 object-cover rounded-xl mb-3 ${post.isSoftDeleted ? 'opacity-50' : 'opacity-100'}`}
                        />
                    )}

                    {/* Soft Delete Alert & Appeal Section */}
                    {post.isSoftDeleted && (
                        <div className="bg-white border border-red-200 p-4 rounded-xl mt-4 mb-2">
                            <p className="text-sm text-red-600 font-bold mb-1">⚠️ This post was removed by an Admin</p>
                            <p className="text-sm text-gray-700 mb-3"><span className="font-semibold">Reason:</span> {post.deletedByReason}</p>
                            
                            {post.userClarification ? (
                                <p className="text-sm text-blue-600 font-semibold bg-blue-50 p-2 rounded-lg inline-block">
                                    ✅ Appeal submitted. Awaiting admin review.
                                </p>
                            ) : (
                                <button
                                    onClick={() => onAppeal && onAppeal(post._id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                                >
                                    Submit Appeal
                                </button>
                            )}
                        </div>
                    )}

                    {/* Footer Actions (Date, Edit, Delete) */}
                    <div className="flex justify-between items-center text-sm text-gray-500 mt-4 border-t border-gray-100 pt-3">
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                        
                        {showActions && (
                            <div className="flex gap-4">
                                {/* Hide Edit button if post is soft deleted */}
                                {!post.isSoftDeleted && (
                                    <button
                                        onClick={() => onEdit && onEdit(post._id)}
                                        className="text-blue-500 hover:text-blue-700 font-medium"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete && onDelete(post._id)}
                                    className="text-gray-500 hover:text-red-700 font-medium transition"
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