import CreatePost from "../pages/CreatePost"
import MyPosts from "../pages/MyPosts"


export const PostRoutes = [

    { path: '/create', element: <CreatePost/>},
    { path: '/my-posts', element: <MyPosts /> }
]
