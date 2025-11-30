import type { ReactElement } from "react";
import type { MagnetKindProps } from "./magnet-kind-types";

export function MagnetKindMonsterToken({ className, details }: MagnetKindProps): ReactElement {
    const fillColor = details || "#8f554a";
    
    return (
        <svg
            height="60"
            width="60"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 60 60"
            xmlSpace="preserve">
            <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.3"/>
                </filter>
            </defs>
            
            {/* Hexagonal background */}
            <path
                className={`apply-transitions ${className}`}
                d="M 30 5 L 50 17.5 L 50 42.5 L 30 55 L 10 42.5 L 10 17.5 Z"
                fill={fillColor}
                stroke="#1a1a1a"
                strokeWidth="2"
                filter="url(#shadow)"
            />
            
            {/* Inner hexagon for depth */}
            <path
                d="M 30 10 L 45 19 L 45 41 L 30 50 L 15 41 L 15 19 Z"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1"
            />
            
            {/* Stylized monster skull icon */}
            <g transform="translate(30, 30)" fill="#1a1a1a" opacity="0.9">
                {/* Skull shape */}
                <ellipse cx="0" cy="-2" rx="10" ry="11" />
                
                {/* Eye sockets */}
                <ellipse cx="-4" cy="-4" rx="2.5" ry="3.5" fill="rgba(255, 255, 255, 0.9)" />
                <ellipse cx="4" cy="-4" rx="2.5" ry="3.5" fill="rgba(255, 255, 255, 0.9)" />
                
                {/* Nose cavity */}
                <path d="M -1.5 1 L 0 3 L 1.5 1 Z" fill="rgba(255, 255, 255, 0.9)" />
                
                {/* Teeth/jaw */}
                <rect x="-6" y="5" width="2" height="3" rx="0.5" fill="rgba(255, 255, 255, 0.9)" />
                <rect x="-2" y="5" width="1.5" height="3.5" rx="0.5" fill="rgba(255, 255, 255, 0.9)" />
                <rect x="0.5" y="5" width="1.5" height="3.5" rx="0.5" fill="rgba(255, 255, 255, 0.9)" />
                <rect x="4" y="5" width="2" height="3" rx="0.5" fill="rgba(255, 255, 255, 0.9)" />
                
                {/* Horns for monster effect */}
                <path d="M -10 -8 Q -12 -12 -10 -14 L -9 -10 Z" fill={fillColor} stroke="#1a1a1a" strokeWidth="0.5" />
                <path d="M 10 -8 Q 12 -12 10 -14 L 9 -10 Z" fill={fillColor} stroke="#1a1a1a" strokeWidth="0.5" />
            </g>
        </svg>
    );
}
