import api from "./api.js";
export const getFeedPostsAPI = () => api.get("/posts/feed");

export const createPostAPI = (formData) => {
  return api.post("/posts/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const likePostAPI = (postId) => api.patch(`/posts/like/${postId}`);

export const sharePostAPI = (postId) => api.patch(`/posts/share/${postId}`);

export const deletePostAPI = (postId) => api.delete(`/posts/delet/${postId}`);

export const getMyPostsAPI = () => api.get("/posts/my-posts");

export const commentPostAPI = (postId, content) =>
  api.patch(`/posts/comment/${postId}`, { content });

export const updatePostAPI = (postId, formData) => {
  return api.patch(`/posts/update/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const appealPostAPI = (postId, userClarification) => {
  return api.patch(`/posts/appeal-post/${postId}`, { userClarification });
};

export const getAdminUserPostsAPI = (userId) =>
  api.get(`posts/admin/user-post/${userId}`);

export const softDeletePostAPI = (postId, reason) =>
  api.patch(`/posts/soft-delete/${postId}`, { reason });

export const restorePostAPI = (postId) => api.patch(`/posts/restore/${postId}`);

export const adminHardDeleteAPI = (postId) =>
  api.delete(`/posts/admin/delete/${postId}`);

export const getAdminDashboardAPI = () => {
    return api.get('/auth/admin/dashbord-data'); 
};

export const logoutAPI = () => api.post("/auth/logout");
