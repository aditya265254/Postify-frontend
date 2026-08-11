import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Sparkles, ImagePlus, X, Crop, Check } from "lucide-react";
import Cropper from "react-easy-crop";
import Navbar from "../components/Navbar.jsx";
import MyPostList from "../components/MyPostList.jsx";
import { createPostAPI, getMyPostsAPI } from "../config/post.api.js";

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", (err) => reject(err));
        img.setAttribute("crossOrigin", "anonymous");
        img.src = url;
    });

async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/jpeg", 0.92);
    });
}

const ASPECT_RATIOS = [
    { label: "Free", value: null },
    { label: "1:1", value: 1 / 1 },
    { label: "4:3", value: 4 / 3 },
    { label: "16:9", value: 16 / 9 },
    { label: "3:4", value: 3 / 4 },
];

const CreatePost = () => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showCropper, setShowCropper] = useState(false);
    const [rawImageSrc, setRawImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspectRatio, setAspectRatio] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const fetchMyPosts = async () => {
        try {
            const response = await getMyPostsAPI();
            setPosts(response.data.data);
        } catch {
            toast.error("Failed to load posts");
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) return navigate("/");
        fetchMyPosts();
    }, [navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setRawImageSrc(objectUrl);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setShowCropper(true);
    };

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleCropDone = async () => {
        try {
            const croppedBlob = await getCroppedImg(rawImageSrc, croppedAreaPixels);
            const croppedFile = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });
            setImage(croppedFile);
            setPreview(URL.createObjectURL(croppedBlob));
            setShowCropper(false);
        } catch {
            toast.error("Crop failed. Please try again.");
        }
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setRawImageSrc(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
        setRawImageSrc(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!content && !image) return toast.warning("Please provide post text or image");
        setLoading(true);
        try {
            const formData = new FormData();
            if (content) formData.append("content", content);
            if (image) formData.append("image", image);

            await createPostAPI(formData);
            toast.success("Post created successfully!");
            setContent("");
            setImage(null);
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchMyPosts();
        } catch {
            toast.error("Post creation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#1E1E24] text-slate-900 dark:text-zinc-100 pb-10 relative transition-colors duration-300">
            <Navbar />
            <div className="max-w-2xl mx-auto mt-8 px-4">

                {/* Create Post Form Card */}
                <div className="bg-white dark:bg-[#28282F] border border-slate-200/80 dark:border-[#3E3E48] p-6 rounded-3xl shadow-xs mb-8">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-slate-700 dark:text-zinc-300" /> Create New Post
                    </h2>
                    <form onSubmit={handleCreate}>
                        <textarea
                            placeholder="What's on your mind today?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#303038]/70 border border-slate-200 dark:border-[#3E3E48] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-slate-400 dark:focus:border-zinc-500 resize-none mb-4"
                            rows={4}
                        />

                        {/* Image Preview */}
                        {preview && !showCropper && (
                            <div className="relative mb-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-[#3E3E48] bg-slate-100 dark:bg-[#303038]">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full max-h-72 object-cover"
                                />
                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2.5 right-2.5 bg-slate-900/75 hover:bg-red-600 text-white rounded-xl p-1.5 transition cursor-pointer backdrop-blur-sm"
                                    title="Remove image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {/* Re-crop button */}
                                <button
                                    type="button"
                                    onClick={() => { setCrop({ x: 0, y: 0 }); setZoom(1); setShowCropper(true); }}
                                    className="absolute top-2.5 right-12 bg-slate-900/75 hover:bg-slate-900 text-white rounded-xl p-1.5 transition cursor-pointer backdrop-blur-sm flex items-center gap-1 px-2.5 text-xs font-semibold"
                                    title="Re-crop image"
                                >
                                    <Crop className="w-3.5 h-3.5" /> Crop
                                </button>
                                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                                    {image?.name?.length > 28 ? image.name.substring(0, 28) + "..." : image?.name}
                                </div>
                            </div>
                        )}

                        {/* File + Submit */}
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
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-[#303038] text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-[#303038] border border-slate-200 dark:border-[#3E3E48] transition cursor-pointer"
                            >
                                <ImagePlus className="w-4 h-4" />
                                {image ? "Change Image" : "Add Image"}
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-slate-800 dark:hover:bg-zinc-200 px-6 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50 cursor-pointer shadow-xs"
                            >
                                {loading ? "Publishing..." : "Publish Post"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Recent Posts */}
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-700 dark:text-zinc-300" /> Your Recent Posts Preview
                </h2>
                <MyPostList posts={posts} showActions={false} />
            </div>

            {/* ─── Crop Modal ─── */}
            {showCropper && rawImageSrc && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center px-4">
                    <div className="bg-white dark:bg-[#28282F] border border-slate-200 dark:border-[#3E3E48] rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
                        
                        {/* Header */}
                        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 dark:border-[#3E3E48]">
                            <div>
                                <h3 className="font-extrabold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                                    <Crop className="w-4 h-4" /> Crop Image
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Drag to reposition · Scroll to zoom</p>
                            </div>
                            <button
                                onClick={handleCropCancel}
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#38383F] text-slate-500 dark:text-zinc-400 transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Crop Canvas Area */}
                        <div className="relative w-full bg-slate-950" style={{ height: "340px" }}>
                            <Cropper
                                image={rawImageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                style={{
                                    containerStyle: { borderRadius: 0 },
                                    cropAreaStyle: { border: "2px solid #fff" },
                                }}
                            />
                        </div>

                        {/* Controls */}
                        <div className="px-5 py-4 space-y-4 border-t border-slate-100 dark:border-[#3E3E48]">
                            {/* Aspect Ratio */}
                            <div>
                                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Aspect Ratio</p>
                                <div className="flex gap-2 flex-wrap">
                                    {ASPECT_RATIOS.map((r) => (
                                        <button
                                            key={r.label}
                                            type="button"
                                            onClick={() => setAspectRatio(r.value)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                                aspectRatio === r.value
                                                    ? "bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-slate-900 dark:border-zinc-100"
                                                    : "bg-slate-100 dark:bg-[#303038] text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-[#3E3E48] hover:bg-slate-200 dark:hover:bg-[#303038]"
                                            }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Zoom Slider */}
                            <div>
                                <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Zoom: {zoom.toFixed(1)}x</p>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.05}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full accent-slate-900 dark:accent-zinc-100 cursor-pointer"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={handleCropCancel}
                                    className="px-5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#38383F] transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCropDone}
                                    className="flex items-center gap-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-slate-800 dark:hover:bg-zinc-200 px-6 py-2 rounded-xl text-sm font-bold transition cursor-pointer shadow-xs"
                                >
                                    <Check className="w-4 h-4" /> Apply Crop
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePost;


