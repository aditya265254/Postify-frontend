import  api  from "./api.js";
export const getFeedPostsAPI = () => api.get("/posts/feed");


export const createPostAPI = (formData) => {
    return api.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};


export const likePostAPI = (postId) => api.patch(`/posts/like/${postId}`);


export const sharePostAPI = (postId) => api.patch(`/posts/share/${postId}`);

export const deletePostAPI = (postId) => api.delete(`/posts/delet/${postId}`);

export const getMyPostsAPI = () => api.get("/posts/my-posts");

export const commentPostAPI = (postId, content) => api.patch(`/posts/comment/${postId}`, { content });