"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { getSafeImageUrl } from "@/utils/imageUtils";
import { imageManager } from "@/utils/imageManager";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes,
  style,
}: SafeImageProps) {
  // Pre-validate the URL on mount to prevent Next.js from trying to optimize bad URLs
  const initialSrc = useMemo(() => getSafeImageUrl(src), [src]);
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(initialSrc !== src);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = async () => {
    if (!hasError && retryCount < 2) {
      // Try to get a fallback image
      try {
        const fallbackUrl = await imageManager.processImageUrl(src, alt, 'default');
        if (fallbackUrl !== imgSrc) {
          setImgSrc(fallbackUrl);
          setRetryCount(retryCount + 1);
          return;
        }
      } catch (error) {
        console.warn('Fallback image failed:', error);
      }

      setHasError(true);
      setImgSrc("/images/placeholder.svg");
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Early validation - check if the URL is from an invalid domain
  const isInvalidDomain = useMemo(() => {
    try {
      const urlObj = new URL(src);
      return ['rawnaqstoore.com', 'rawnaq.com'].some(domain =>
        urlObj.hostname.includes(domain)
      );
    } catch {
      return src === '' || src === '/images/placeholder.svg';
    }
  }, [src]);

  // If URL is from invalid domain or empty, immediately show placeholder
  if (isInvalidDomain) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`} style={style}>
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  const imageProps = {
    src: imgSrc,
    alt,
    onError: handleError,
    onLoad: handleLoad,
    priority,
    sizes,
    ...(fill
      ? {
          fill,
          style: { objectFit: "contain" as const, ...style },
        }
      : {
          width,
          height,
          style,
        }),
  };

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      {isLoading && !hasError && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className}`}
          style={style}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      )}
      <Image
        {...imageProps}
        className={className}
        unoptimized={hasError || !src.includes("cloudinary.com") || src.includes("rawnaqstoore.com")}
      />
    </div>
  );
}