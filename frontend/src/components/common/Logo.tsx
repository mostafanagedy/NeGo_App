"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 36 }) => {
  return (
    <div className={`inline-flex items-center gap-2 font-black tracking-tight ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        role="img"
        aria-label="NeGo Logo Symbol"
        className="shrink-0"
      >
        <g fill="#F4A100">
          <path d="M18 22 L64 10 L64 84 Q64 87 62 89 L34 114 Q32.5 115.5 31 115.5 Q28.5 115.5 28.5 112.5 L28.5 46 L18 35 Z" />
          <path d="M74 22 L102 12 L112 22 L112 84 Q112 86.5 110.5 88.5 L82 116 L74 123 Z" />
          <rect x="66" y="40" width="8" height="22" rx="2" transform="skewX(-15)" />
        </g>
      </svg>
      <span className="text-2xl font-black">
        <span className="text-gray-900 dark:text-white">Ne</span>
        <span className="text-blue-600 dark:text-blue-500">Go</span>
      </span>
    </div>
  );
};
