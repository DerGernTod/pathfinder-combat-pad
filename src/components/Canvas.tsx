import React, { useRef, useState, useEffect } from "react";

export function Canvas({ ratio }: { ratio: string }): JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");
            if (context) {
                context.lineCap = "round";
                context.strokeStyle = "black";
                context.lineWidth = 5;
                contextRef.current = context;
            }
        }
    }, []);

    const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (event.pointerType === "pen") {
            setIsErasing(event.button === 5);
        }
        setDrawing(true);
        if (contextRef.current) {
            contextRef.current.beginPath();
            contextRef.current.moveTo(
                event.nativeEvent.offsetX,
                event.nativeEvent.offsetY
            );
        }
    };

    const endDrawing = () => {
        setDrawing(false);
        if (contextRef.current) {
            contextRef.current.closePath();
        }
    };

    const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawing || !contextRef.current) return;
        if (isErasing) {
            contextRef.current.globalCompositeOperation = "destination-out";
            contextRef.current.lineWidth = 10;
        } else {
            contextRef.current.globalCompositeOperation = "source-over";
            contextRef.current.lineWidth = 5;
        }
        contextRef.current.lineTo(
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY
        );
        contextRef.current.stroke();
        contextRef.current.beginPath();
        contextRef.current.moveTo(
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY
        );
    };
    const cursor = isErasing ? "crosshair" : "pointer";
    return (
        <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerUp={endDrawing}
            onPointerMove={draw}
            width={100}
            style={{ cursor, flexBasis: ratio, height: "100%" }}
        ></canvas>
    );
}
