import React, { useState, useRef, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImg: string;
  afterImg: string;
  title?: string;
  category?: string;
  aspectRatio?: string;
  heightClass?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImg,
  afterImg,
  title,
  category,
  heightClass = 'h-56',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full ${heightClass} rounded-xl overflow-hidden select-none cursor-ew-resize border border-slate-200 shadow-xs group`}
    >
      {/* After Image (Background layer) */}
      <img
        src={afterImg}
        alt="After cleaning"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute bottom-2.5 right-2.5 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10">
        After
      </div>

      {/* Before Image (Clipped layer) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImg}
          alt="Before cleaning"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{
            width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
          }}
        />
        <div className="absolute bottom-2.5 left-2.5 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10">
          Before
        </div>
      </div>

      {/* Category tag */}
      {category && (
        <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs z-10">
          {category}
        </div>
      )}

      {/* Slider Divider Bar and Knob */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)] z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white rounded-full shadow-md border border-slate-200 flex items-center justify-center text-slate-700 group-hover:scale-110 transition-transform">
          <ChevronsLeftRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
