import { useState, useRef } from "react";
import { Upload, X, Check } from "lucide-react";
import { motion } from "framer-motion";

export interface UploadedImage {
  file: File;
  preview: string;
  isThumbnail: boolean;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  error?: string;
  maxFiles?: number;
  maxSizePerFile?: number; // in bytes
}

export function ImageUpload({
  images,
  onImagesChange,
  error,
  maxFiles = 5,
  maxSizePerFile = 5 * 1024 * 1024, // 5MB
}: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const newImages: UploadedImage[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      if (file.size > maxSizePerFile) {
        return;
      }

      if (images.length + newImages.length >= maxFiles) {
        return;
      }

      const preview = URL.createObjectURL(file);
      newImages.push({
        file,
        preview,
        isThumbnail: images.length + newImages.length === 1, // First image is thumbnail
      });
    });

    onImagesChange([...images, ...newImages]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Reset thumbnail if removed image was thumbnail
    if (newImages.length > 0 && images[index].isThumbnail) {
      newImages[0].isThumbnail = true;
    }
    onImagesChange(newImages);
  };

  const setThumbnail = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isThumbnail: i === index,
    }));
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          isDragActive
            ? "border-orange-400 bg-orange-50"
            : error
              ? "border-red-300 bg-red-50"
              : "border-orange-200/50 bg-orange-50/30 hover:border-orange-300"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-orange-100 p-3">
            <Upload size={24} className="text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              Drag and drop images here
            </p>
            <p className="text-sm text-slate-600">
              or click to select files (max {maxFiles} images)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-900">
            Uploaded Images ({images.length}/{maxFiles})
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative overflow-hidden rounded-xl border border-orange-200/30"
              >
                <img
                  src={img.preview}
                  alt={`Upload ${idx + 1}`}
                  className="aspect-square w-full object-cover"
                />
                {img.isThumbnail && (
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-transparent flex items-end p-2">
                    <span className="text-xs font-semibold text-white">
                      Thumbnail
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                  {!img.isThumbnail && (
                    <button
                      onClick={() => setThumbnail(idx)}
                      className="rounded-lg bg-orange-600 p-2 text-white hover:bg-orange-700"
                      title="Set as thumbnail"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => removeImage(idx)}
                    className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
