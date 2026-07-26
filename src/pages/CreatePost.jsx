
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar.jsx"
import { createPostAPI, getMyPostsAPI, deletePostAPI } from "../config/post.api.js"

const CreatePost = () => {
        const [posts, setPosts] = useState([])
    const [content, setContent] = useState("")
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("user"))

    // My posts fetch karo
    const fetchMyPosts = async () => {
        try {
            const response = await getMyPostsAPI()
            setPosts(response.data.data)
        } catch {
            toast.error("Failed to load posts")
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate('/')
            return
        }
        fetchMyPosts()
    }, [navigate])

    // Post create karo
    const handleCreate = async (e) => {
        e.preventDefault()
        if (!content && !image) return toast.warning("Content ya image zaroori h")

        setLoading(true)
        try {
            const formData = new FormData()
            if (content) formData.append("content", content)
            if (image) formData.append("image", image)

            await createPostAPI(formData)
            toast.success("Post created!")
            setContent("")
            setImage(null)
            fetchMyPosts()  // List refresh karo
        } catch {
            toast.error("Post create failed")
        } finally {
            setLoading(false)
        }
    }

    // Post delete karo
    const handleDelete = async (postId) => {
        try {
            await deletePostAPI(postId)
            toast.success("Post deleted!")
            setPosts(posts.filter(post => post._id !== postId))
        } catch {
            toast.error("Delete failed")
        }
    }
  return (
   <div className="min-h-screen bg-gray-50 pb-10">
            <Navbar />

            <div className="max-w-2xl mx-auto mt-8 px-4">

                {/* Create Post Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Create Post</h2>
                    <form onSubmit={handleCreate}>
                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none mb-3"
                            rows={3}
                        />
                        <div className="flex items-center justify-between">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="text-sm text-gray-500"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="px-4 py-2 rounded-full text-sm text-gray-600 border border-gray-200 hover:bg-gray-50"
                                >
                                    Back to Feed
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? "Posting..." : "Post"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* My Posts List */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">My Posts</h2>
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <div className="text-center bg-white p-10 rounded-2xl shadow-sm">
                            <p className="text-gray-500">No post yet !</p>
                        </div>
                    ) : (
                        posts.map((post) => (
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

                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(post._id)}
                                            className="text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
  )
}

export default CreatePost







