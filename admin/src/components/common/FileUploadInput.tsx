import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Check, Link as LinkIcon } from 'lucide-react';

export interface PresetOption {
  label: string;
  url: string;
}

interface FileUploadInputProps {
  label: string;
  value: string;
  onChange: (fileUrl: string, file?: File) => void;
  accept?: string;
  hint?: string;
  presets?: PresetOption[];
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  label,
  value,
  onChange,
  accept = 'image/*',
  hint = 'PNG, JPG, WebP up to 8MB',
  presets,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    // Read as Data URL for instant frontend display and storage
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result, file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Use File Upload' : 'Use Image URL'}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {showUrlInput ? (
        <div className="space-y-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/services/service-1.webp or https://..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
          <p className="text-[10px] text-slate-400">Direct server image path or public image URL</p>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
            dragActive
              ? 'border-sky-500 bg-sky-50/90 ring-4 ring-sky-500/20'
              : value
              ? 'border-emerald-300 bg-emerald-50/20 hover:border-emerald-400'
              : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          {value ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white shadow-2xs">
                  <img src={value} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{fileName || 'Selected Image Ready'}</span>
                  </div>
                  {fileSize && <p className="text-[11px] text-slate-400 font-mono mt-0.5">{fileSize}</p>}
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Image Active</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-3 flex flex-col items-center justify-center gap-2">
              <div className="w-11 h-11 rounded-2xl bg-sky-100/70 text-sky-600 flex items-center justify-center shadow-2xs">
                <ImageIcon className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Select Image File to Upload</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{hint}</p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition active:scale-95"
              >
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>Upload Image File</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Optional Preset Image Picker Row */}
      {presets && presets.length > 0 && (
        <div className="pt-1">
          <p className="text-[11px] font-semibold text-slate-500 mb-2">Or select from preset template images:</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {presets.map((preset, idx) => {
              const isSelected = value === preset.url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(preset.url);
                    setFileName(preset.label);
                    setFileSize('');
                  }}
                  className={`relative p-1.5 rounded-xl border text-center transition flex flex-col items-center gap-1 group ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="relative w-full h-12 rounded-lg overflow-hidden border border-slate-200/80 bg-white">
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-sky-600/30 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 truncate w-full">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

