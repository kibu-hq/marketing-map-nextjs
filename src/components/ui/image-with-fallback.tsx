'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  fallbackSrc = '/globe.svg'
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [attemptIndex, setAttemptIndex] = useState(0);

  const buildCandidates = (u?: string) => {
    if (!u) return [fallbackSrc];
    try {
      const url = new URL(u);
      const pathname = url.pathname;
      // If this looks like a signed S3 URL, do NOT alter the extension; the signature will break.
      if (url.search && /X-Amz-/i.test(url.search)) {
        return [u, fallbackSrc];
      }
      const candidates: string[] = [u];
      const addWithExt = (ext: string) => {
        if (pathname.includes('.')) {
          const replaced = u.replace(/\.[^./?]+(?=(\?|$))/, `.${ext}`);
          candidates.push(replaced);
        }
      };
      addWithExt('webp');
      addWithExt('png');
      addWithExt('jpg');
      candidates.push(fallbackSrc);
      return Array.from(new Set(candidates));
    } catch {
      return [u, fallbackSrc];
    }
  };

  const [candidates, setCandidates] = useState<string[]>(buildCandidates(src));

  // Update image source when incoming src changes
  useEffect(() => {
    const c = buildCandidates(src);
    setCandidates(c);
    setAttemptIndex(0);
    setImgSrc(c[0] || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    try { console.warn('Image failed to load, attempting fallback:', imgSrc); } catch {}
    // Try next candidate if available
    if (attemptIndex + 1 < candidates.length) {
      const nextIdx = attemptIndex + 1;
      setAttemptIndex(nextIdx);
      setImgSrc(candidates[nextIdx]);
      return;
    }
    // Otherwise stick to fallback
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // If no src provided, show fallback immediately
  if (!src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={{ width, height }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={`${width}px`}
      unoptimized
      className={className}
      onError={handleError}
      style={{ objectFit: 'cover' }}
    />
  );
}
