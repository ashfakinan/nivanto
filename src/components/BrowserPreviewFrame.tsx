import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Globe } from 'lucide-react';
import { isSafeUrl } from '../types/nivanto';

interface BrowserPreviewFrameProps {
  title: string;
  category: string;
  liveUrl: string;
  imageUrl: string;
  description?: string;
}

export function BrowserPreviewFrame({
  title,
  category,
  liveUrl,
  imageUrl,
  description,
}: BrowserPreviewFrameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.32);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const safeLiveUrl = isSafeUrl(liveUrl) ? liveUrl : '#';
  const safeImageUrl =
    isSafeUrl(imageUrl) || imageUrl.startsWith('data:image/svg+xml')
      ? imageUrl
      : '';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setScale(width / 1280);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const displayHost = (() => {
    if (safeLiveUrl.startsWith('/')) return `nivanto.com${safeLiveUrl}`;
    try {
      return new URL(safeLiveUrl).hostname;
    } catch {
      return 'live-preview';
    }
  })();

  const handleOpen = (e: React.MouseEvent) => {
    if (safeLiveUrl === '#') {
      e.preventDefault();
    }
  };

  return (
    <a
      href={safeLiveUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleOpen}
      className="group block rounded-[22px] bg-white border border-[#E5E1D8] overflow-hidden transition-all duration-200 hover:border-[#2B5FAA]/50 hover:shadow-[0_12px_32px_rgba(28,36,64,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B5FAA]"
    >
      {/* Browser chrome top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#F8F6F2] border-b border-[#E5E1D8]">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E1D8]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E1D8]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5E1D8]" />
        </div>
        <div className="flex-1 min-w-0 px-3 py-1 rounded-lg bg-white border border-[#E5E1D8] text-[11px] text-[#6B7280] truncate text-center">
          {displayHost}
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2B5FAA] shrink-0 whitespace-nowrap">
          <Globe className="w-3 h-3" />
          Live site
        </span>
      </div>

      {/* 16:10 Viewport container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] overflow-hidden bg-[#EDEAE4]"
      >
        {/* Fallback thumbnail (always shown on mobile, or behind/in place of blocked iframes) */}
        <div className="absolute inset-0 w-full h-full">
          {safeImageUrl && !imgFailed ? (
            <img
              src={safeImageUrl}
              alt={`${title} preview`}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#1C2440] text-white text-center">
              <span className="font-display font-extrabold text-xl tracking-tight">
                {title}
              </span>
              <span className="text-xs text-white/60 mt-1">{category}</span>
            </div>
          )}
        </div>

        {/* Desktop-only scaled live iframe preview */}
        {safeLiveUrl !== '#' && !iframeFailed && (
          <div className="hidden md:block absolute inset-0 overflow-hidden bg-white">
            <iframe
              src={safeLiveUrl}
              title={title}
              loading="lazy"
              onError={() => setIframeFailed(true)}
              style={{
                width: '1280px',
                height: '800px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                pointerEvents: 'none',
                border: 0,
              }}
            />
          </div>
        )}

        {/* Measured contrast scrim + title overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-[#1C2440]/90 via-[#1C2440]/45 to-transparent flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#E8900A] truncate">
              {category}
            </p>
            <h3 className="font-display font-bold text-base text-white truncate">
              {title}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[10px] bg-white text-[#1C2440] text-xs font-semibold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shrink-0 whitespace-nowrap">
            Visit Live Site
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Card description footer */}
      {description && (
        <div className="p-5 bg-white">
          <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      )}
    </a>
  );
}
