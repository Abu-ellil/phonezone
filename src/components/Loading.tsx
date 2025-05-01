// src/components/Loading.tsx
import React from "react";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  fullScreen = false,
  text = "جاري التحميل...",
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    : "flex items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center">
        <div
          className={`
            ${sizeClasses[size]}
            border-4 border-t-4 border-gray-200 border-t-red-600
            rounded-full animate-spin
          `}
        />
        {text && (
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Full screen loading component
export const FullScreenLoading: React.FC = () => (
  <Loading fullScreen={true} size="large" />
);
