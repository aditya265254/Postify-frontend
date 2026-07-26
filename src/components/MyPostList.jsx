const MyPostList = ({ posts, showActions = false, onDelete, onEdit }) => {
    if (!posts || posts.length === 0) {
        return (
            <div className="text-center bg-white p-10 rounded-2xl shadow-sm">
                <p className="text-gray-500">Koi post nahi mili!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div key={post._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    
                    {post.content && (
                        <p className="text-gray-800 mb-3 text-[15px]">{post.content}</p>
                    )}
                    
                    {post.imageUrl && (
                        <img
                            src={post.imageUrl}
                            alt="Post"
                            className="w-full max-h-[400px] object-cover rounded-xl mb-3"
                        />
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                        
                        {/* 👇 Magic Yahan Hai: Agar showActions true hoga, tabhi ye buttons dikhenge */}
                        {showActions && (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => onEdit && onEdit(post._id)}
                                    className="text-blue-500 hover:text-blue-700 font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete && onDelete(post._id)}
                                    className="text-red-500 hover:text-red-700 font-medium"
                                >
                                    Delete
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