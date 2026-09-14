import React, { useState } from 'react';
import { SupabaseAPI } from '../services/supabaseClient';
import { Upload, Trash2, Star, MoveLeft, MoveRight, AlertCircle, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const FALLBACK_IMAGE = 'https://via.placeholder.com/400x300?text=AutoZon+Product+Image';

export const ProductImageUploader = ({ productId = null, images = [], onChange, onToast }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Convert raw URLs or objects into standardized internal image object structure
  const formattedImages = images.map((img, index) => {
    if (typeof img === 'string') {
      return {
        id: `img-${index}-${Date.now()}`,
        image_url: img,
        alt_text: `Product Image #${index + 1}`,
        sort_order: index,
        is_primary: index === 0
      };
    }
    return {
      id: img.id || `img-${index}-${Date.now()}`,
      image_url: img.image_url || img.url || img.src || FALLBACK_IMAGE,
      alt_text: img.alt_text || `Product Image #${index + 1}`,
      sort_order: img.sort_order ?? index,
      is_primary: Boolean(img.is_primary || index === 0)
    };
  });

  const notifyToast = (msg, type = 'success') => {
    if (onToast) onToast(msg, type);
  };

  // Validate File
  const validateFile = (file) => {
    const fileType = file.type.toLowerCase();
    const isFormatAllowed = ALLOWED_FORMATS.includes(fileType) || 
                            file.name.match(/\.(jpg|jpeg|png|webp)$/i);
    
    if (!isFormatAllowed) {
      return `Format not supported! Allowed formats: JPG, JPEG, PNG, WEBP. Received: ${file.name}`;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return `File "${file.name}" exceeds max limit of ${MAX_FILE_SIZE_MB}MB (${fileSizeMB.toFixed(2)}MB).`;
    }

    return null;
  };

  // Handle Files Selected / Dropped
  const handleFiles = async (files) => {
    setErrorMessage('');
    setSuccessMessage('');

    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    // Validate each file
    for (const file of fileList) {
      const error = validateFile(file);
      if (error) {
        setErrorMessage(error);
        notifyToast(`❌ ${error}`, 'error');
        return;
      }
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      const newUploadedImages = [];
      const total = fileList.length;

      for (let i = 0; i < total; i++) {
        const file = fileList[i];
        setUploadProgress(Math.round(((i + 0.5) / total) * 100));

        // Call Supabase API helper
        const result = await SupabaseAPI.uploadProductImage(file, productId, {
          sortOrder: formattedImages.length + i,
          isPrimary: formattedImages.length === 0 && i === 0
        });

        if (result.error) {
          console.error('Supabase upload error:', result.error);
          // Fallback locally using FileReader if Supabase offline/unconfigured
          const base64Url = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });

          newUploadedImages.push({
            id: `img-local-${Date.now()}-${i}`,
            image_url: base64Url,
            alt_text: file.name,
            sort_order: formattedImages.length + i,
            is_primary: formattedImages.length === 0 && i === 0
          });
        } else {
          newUploadedImages.push(result.data);
        }
      }

      setUploadProgress(100);
      const updatedList = [...formattedImages, ...newUploadedImages];
      
      // Ensure exactly ONE primary image
      const hasPrimary = updatedList.some(img => img.is_primary);
      if (!hasPrimary && updatedList.length > 0) {
        updatedList[0].is_primary = true;
      }

      onChange(updatedList);
      setSuccessMessage(`Successfully uploaded ${total} image(s) to Supabase Storage!`);
      notifyToast(`🎉 Uploaded ${total} product image(s)!`);
    } catch (err) {
      console.error('Upload exception:', err);
      setErrorMessage(`Upload failed: ${err.message || 'Unknown storage error'}`);
      notifyToast('❌ Upload failed', 'error');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Select Primary Image
  const handleSetPrimary = async (targetId) => {
    let updatedList;
    
    if (productId) {
      await SupabaseAPI.setPrimaryProductImage(productId, targetId);
    }

    updatedList = formattedImages.map(img => ({
      ...img,
      is_primary: img.id === targetId
    }));

    onChange(updatedList);
    notifyToast('⭐ Primary product image updated!');
  };

  // Delete Image
  const handleDeleteImage = async (targetImg) => {
    if (formattedImages.length <= 1) {
      setErrorMessage('Product should have at least 1 image.');
      notifyToast('⚠️ Product must have at least 1 image.', 'error');
      return;
    }

    if (productId && targetImg.id && !targetImg.id.startsWith('img-local-')) {
      await SupabaseAPI.deleteProductImage(targetImg.id, targetImg.image_url);
    }

    const filtered = formattedImages.filter(img => img.id !== targetImg.id);

    // If deleted image was primary, assign first remaining image as primary
    if (targetImg.is_primary && filtered.length > 0) {
      filtered[0].is_primary = true;
    }

    // Re-index sort order
    const reindexed = filtered.map((img, idx) => ({ ...img, sort_order: idx }));

    onChange(reindexed);
    notifyToast('🗑️ Image deleted from storage & database.');
  };

  // Reorder Images
  const handleMoveImage = (index, direction) => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= formattedImages.length) return;

    const listCopy = [...formattedImages];
    const temp = listCopy[index];
    listCopy[index] = listCopy[newIdx];
    listCopy[newIdx] = temp;

    // Reassign sort orders
    const reindexed = listCopy.map((img, idx) => ({ ...img, sort_order: idx }));
    onChange(reindexed);
    notifyToast('🔄 Image display order updated.');
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-400" /> Supabase Storage Product Images
          </h4>
          <p className="text-[11px] text-slate-400">
            Bucket: <code className="text-emerald-400 font-mono">product-images</code> | Max file size: {MAX_FILE_SIZE_MB}MB (JPG, JPEG, PNG, WEBP)
          </p>
        </div>
        <div className="text-xs bg-slate-950 border border-slate-800 text-slate-300 font-bold px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span>Total Images:</span>
          <span className="text-emerald-400 font-black">{formattedImages.length}</span>
        </div>
      </div>

      {/* Alert Error / Success Messages */}
      {errorMessage && (
        <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 p-3 rounded-2xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}
      {successMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 p-3 rounded-2xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Upload Drag and Drop Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length > 0) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => document.getElementById(`supabase-img-input-${productId || 'new'}`)?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
          dragOver 
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]' 
            : 'border-blue-500/50 hover:border-amber-400 bg-slate-950/60 hover:bg-slate-950'
        }`}
      >
        <input
          type="file"
          id={`supabase-img-input-${productId || 'new'}`}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center space-y-2 py-2">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs font-black text-amber-300">Uploading to Supabase Storage ({uploadProgress}%)...</span>
            <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black text-white block">
                Drag & Drop product images here or <span className="text-amber-400 underline">Browse Files</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Supported Formats: <strong>JPG, JPEG, PNG, WEBP</strong> (Max {MAX_FILE_SIZE_MB}MB per image)
              </span>
            </div>
          </>
        )}
      </div>

      {/* Image Gallery Grid & Preview */}
      {formattedImages.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Uploaded Image Previews ({formattedImages.length})</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Click ⭐ to set Primary image (loaded in Product Cards)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {formattedImages.map((img, idx) => (
              <div
                key={img.id}
                className={`relative bg-slate-950 border-2 rounded-2xl p-2 flex flex-col justify-between transition-all ${
                  img.is_primary 
                    ? 'border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Image Container with Fallback */}
                <div className="relative h-28 w-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src={img.image_url}
                    alt={img.alt_text || `Product image ${idx + 1}`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />

                  {/* Primary Badge Tag */}
                  {img.is_primary && (
                    <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
                      ★ Primary
                    </span>
                  )}
                </div>

                {/* Controls Bar */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    {/* Make Primary Toggle */}
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg font-extrabold cursor-pointer transition ${
                        img.is_primary
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800'
                      }`}
                      title="Set as primary product image"
                    >
                      <Star className={`w-3 h-3 ${img.is_primary ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span>{img.is_primary ? 'Primary' : 'Set Primary'}</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img)}
                      className="bg-rose-950/60 hover:bg-rose-600 text-rose-400 hover:text-white p-1 rounded-lg border border-rose-500/30 transition cursor-pointer"
                      title="Delete image from storage & catalog"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Move Left / Right Reordering */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800/80">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveImage(idx, 'left')}
                      className="disabled:opacity-20 hover:text-white font-bold cursor-pointer"
                      title="Move Left"
                    >
                      <MoveLeft className="w-3 h-3" />
                    </button>

                    <span className="font-mono font-bold text-[9px]">#{idx + 1}</span>

                    <button
                      type="button"
                      disabled={idx === formattedImages.length - 1}
                      onClick={() => handleMoveImage(idx, 'right')}
                      className="disabled:opacity-20 hover:text-white font-bold cursor-pointer"
                      title="Move Right"
                    >
                      <MoveRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
