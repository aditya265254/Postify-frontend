import React, { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Plus, ImagePlus, X, Crop } from "lucide-react";
import FormTextArea from "../common/FormTextArea.jsx";
import { toast } from "react-toastify";


export const PostForm = ({ onSubmit, loading = false }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setRawImageSrc(objectUrl);
    setImage(file);
    setPreview(objectUrl);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setRawImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = async (data) => {
    const postContent = data.content?.trim();
    if (!postContent && !image) {
      toast.warning("Please provide post text or image");
      return;
    }

    const success = await onSubmit({ content: postContent, image });
    if (success !== false) {
      reset();
      handleRemoveImage();
    }
  };

  return (
    <div className="bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-[#1C2A4A] p-6 rounded-3xl shadow-xs mb-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Create New Post
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Reusable FormTextArea */}
        <FormTextArea
          placeholder="What's on your mind today?"
          name="content"
          register={register}
          error={errors.content}
          className="mb-4"
        />

        {/* Image Preview */}
        {preview && (
          <div className="relative mb-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1C2A4A] bg-slate-100 dark:bg-[#141D33]">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-72 object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2.5 right-2.5 bg-slate-900/75 hover:bg-red-600 text-white rounded-xl p-1.5 transition cursor-pointer backdrop-blur-sm"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2.5 left-2.5 bg-slate-900/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm">
              {image?.name?.length > 28 ? image.name.substring(0, 28) + "..." : image?.name}
            </div>
          </div>
        )}

        {/* File Input & Submit Action */}
        <div className="flex items-center justify-between gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="post-image-input"
          />
          <label
            htmlFor="post-image-input"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-[#141D33] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1C2A4A] border border-slate-200 dark:border-[#1C2A4A] transition cursor-pointer"
          >
            <ImagePlus className="w-4 h-4" />
            {image ? "Change Image" : "Add Image"}
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50 cursor-pointer shadow-md shadow-blue-500/20"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
