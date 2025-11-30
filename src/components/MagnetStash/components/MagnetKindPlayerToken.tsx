import type { ReactElement } from "react";
import type { MagnetKindProps } from "./magnet-kind-types";

export function MagnetKindPlayerToken({ className, details }: MagnetKindProps): ReactElement {
    const fillColor = details || "#7fa6b3";
    
    return (
        <svg
            height="60"
            width="60"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 60 60"
            style={{ overflow: "visible" }}
            xmlSpace="preserve">
            <defs>
                <filter id="shadow-pc" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0.5" stdDeviation="1" floodOpacity="0.8"/>
                </filter>
            </defs>
            
            {/* Apply transitions to entire token */}
            <g className={`apply-transitions ${className}`}>
                {/* Circular shield background */}
                <circle
                    cx="30"
                    cy="30"
                    r="24"
                    fill={fillColor}
                    stroke="#1a1a1a"
                    strokeWidth="2"
                    filter="url(#shadow-pc)"
                />
                
                {/* Inner circle for depth */}
                <circle
                    cx="30"
                    cy="30"
                    r="19"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                />
                
                {/* Shield with sword icon */}
                <g transform="translate(30, 30)" fill="#1a1a1a" opacity="0.9">
                    {/* Shield shape */}
                    <path d="M -8 -10 L 8 -10 L 8 2 Q 8 8 0 12 Q -8 8 -8 2 Z" fill="rgba(255, 255, 255, 0.9)" stroke="#1a1a1a" strokeWidth="0.8" />
                    
                    {/* Shield details - cross pattern */}
                    <rect x="-1" y="-8" width="2" height="16" fill={fillColor} opacity="0.7" />
                    <rect x="-6" y="-2" width="12" height="2" fill={fillColor} opacity="0.7" />
                    
                    {/* Sword overlay */}
                    <g transform="rotate(-45)">
                        {/* Blade */}
                        <rect x="-1" y="-12" width="2" height="16" fill="#1a1a1a" />
                        {/* Crossguard */}
                        <rect x="-4" y="4" width="8" height="1.5" fill="#1a1a1a" />
                        {/* Pommel */}
                        <circle cx="0" cy="7" r="1.5" fill="#1a1a1a" />
                    </g>
                </g>
            </g>
        </svg>
    );
}
