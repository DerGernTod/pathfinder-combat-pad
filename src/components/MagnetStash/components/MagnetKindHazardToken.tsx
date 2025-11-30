import type { ReactElement } from "react";
import type { MagnetKindProps } from "./magnet-kind-types";

export function MagnetKindHazardToken({ className, details }: MagnetKindProps): ReactElement {
    const fillColor = details || "#b39f9f";
    
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
                <filter id="shadow-hazard" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0.5" stdDeviation="1" floodOpacity="0.8"/>
                </filter>
            </defs>
            
            {/* Apply transitions to entire token */}
            <g className={`apply-transitions ${className}`}>
                {/* Triangle warning sign background */}
                <path
                    d="M 30 8 L 52 50 L 8 50 Z"
                    fill={fillColor}
                    stroke="#1a1a1a"
                    strokeWidth="2"
                    filter="url(#shadow-hazard)"
                />
                
                {/* Inner triangle for depth */}
                <path
                    d="M 30 14 L 47 45 L 13 45 Z"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                />
                
                {/* Warning exclamation mark */}
                <g transform="translate(30, 30)" fill="#1a1a1a" opacity="0.9">
                    {/* Exclamation mark body */}
                    <rect 
                        x="-2" 
                        y="-8" 
                        width="4" 
                        height="12" 
                        rx="2" 
                        fill="rgba(255, 255, 255, 0.9)" 
                    />
                    
                    {/* Exclamation mark dot */}
                    <circle 
                        cx="0" 
                        cy="8" 
                        r="2.5" 
                        fill="rgba(255, 255, 255, 0.9)" 
                    />
                    
                    {/* Additional hazard stripes for effect */}
                    <g opacity="0.3">
                        <rect x="-12" y="12" width="24" height="2" fill="#1a1a1a" />
                        <rect x="-10" y="16" width="20" height="2" fill="#1a1a1a" />
                    </g>
                </g>
            </g>
        </svg>
    );
}
