import type { ReactElement } from "react";
import type { MagnetKindProps } from "./magnet-kind-types";

export function MagnetKindNPCToken({ className, details }: MagnetKindProps): ReactElement {
    const fillColor = details || "#82a687";
    
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
                <filter id="shadow-npc" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0.5" stdDeviation="1" floodOpacity="0.8"/>
                </filter>
            </defs>
            
            {/* Apply transitions to entire token */}
            <g className={`apply-transitions ${className}`}>
                {/* Diamond/rhombus background */}
                <path
                    d="M 30 6 L 54 30 L 30 54 L 6 30 Z"
                    fill={fillColor}
                    stroke="#1a1a1a"
                    strokeWidth="2"
                    filter="url(#shadow-npc)"
                />
                
                {/* Inner diamond for depth */}
                <path
                    d="M 30 12 L 48 30 L 30 48 L 12 30 Z"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                />
                
                {/* Person silhouette icon */}
                <g transform="translate(30, 30)" fill="#1a1a1a" opacity="0.9">
                    {/* Head */}
                    <circle cx="0" cy="-8" r="5" fill="rgba(255, 255, 255, 0.9)" />
                    
                    {/* Body - simple torso shape */}
                    <path 
                        d="M -6 0 L -6 8 Q -6 10 -4 10 L 4 10 Q 6 10 6 8 L 6 0 Q 6 -2 4 -2 L -4 -2 Q -6 -2 -6 0 Z" 
                        fill="rgba(255, 255, 255, 0.9)" 
                    />
                    
                    {/* Arms */}
                    <rect x="-9" y="1" width="3" height="7" rx="1.5" fill="rgba(255, 255, 255, 0.9)" />
                    <rect x="6" y="1" width="3" height="7" rx="1.5" fill="rgba(255, 255, 255, 0.9)" />
                    
                    {/* Legs */}
                    <rect x="-4" y="10" width="3" height="6" rx="1.5" fill="rgba(255, 255, 255, 0.9)" />
                    <rect x="1" y="10" width="3" height="6" rx="1.5" fill="rgba(255, 255, 255, 0.9)" />
                </g>
            </g>
        </svg>
    );
}
