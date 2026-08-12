import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";
import { getCroppedImg } from "../../utils/cropImage.js";

const ASPECT_RATIOS = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 / 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:4", value: 3 / 4 },
];

const ImageCropper = ({ imageSrc, open, onClose, onApply, fileName = "cropped-image.jpg" }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [localImageSrc, setLocalImageSrc] = useState(imageSrc);

  useEffect(() => {
    if (!open) return;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAspectRatio(null);
    setCroppedAreaPixels(null);

    let objectUrl = null;

    const loadLocalImage = async () => {
      if (!imageSrc) return;
      if (imageSrc.startsWith("blob:") || imageSrc.startsWith("data:")) {
        setLocalImageSrc(imageSrc);
        return;
      }

      try {
        const response = await fetch(imageSrc, { mode: "cors" });
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setLocalImageSrc(objectUrl);
      } catch (error) {
        setLocalImageSrc(imageSrc);
      }
    };

    loadLocalImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [open, imageSrc]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(localImageSrc, croppedAreaPixels);
      const nameParts = fileName.split(".");
      const extension = nameParts.length > 1 ? `.${nameParts.pop()}` : ".jpg";
      const baseName = nameParts.join(".") || "cropped-image";
      const uniqueName = `${baseName}-${Date.now()}${extension}`;
      const croppedFile = new File([croppedBlob], uniqueName, { type: "image/jpeg" });
      const croppedPreview = URL.createObjectURL(croppedBlob);
      onApply(croppedFile, croppedPreview);
    } catch (error) {
      console.error("Crop failed", error);
      onClose();
    }
  };

  if (!open || !imageSrc) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/90 z-[60] flex flex-col justify-between p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center text-white z-10">
        <span className="font-bold text-sm flex items-center gap-1.5">
          <X className="w-4 h-4 text-blue-400" /> Crop & Adjust Image
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="relative w-full h-[55vh] rounded-2xl overflow-hidden my-4 border border-slate-800">
        <Cropper
          image={localImageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="space-y-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl z-10 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3 text-white text-xs">
          <span className="font-semibold shrink-0">Aspect Ratio:</span>
          <div className="flex flex-wrap gap-1.5">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.label}
                type="button"
                onClick={() => setAspectRatio(ratio.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  aspectRatio === ratio.value
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-white text-xs">
          <span className="font-semibold shrink-0">Zoom:</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        <div className="flex justify-end gap-3 pt-1 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md shadow-blue-500/20"
          >
            <Check className="w-3.5 h-3.5" /> Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
