import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import "./Canvas.css";
import { debounce } from "es-toolkit";

const hiddenStyle = {
    display: "none",
};

export function Canvas({ ratio }: { ratio: number }): JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasHiddenRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);

    const saveDrawing = useCallback(() => {
        if (!canvasRef.current || !canvasHiddenRef.current) return;
        const context = canvasRef.current.getContext("2d");
        const contextHidden = canvasHiddenRef.current.getContext("2d");
        canvasHiddenRef.current.width = canvasRef.current.width;
        canvasHiddenRef.current.height = canvasRef.current.height;
        if (context && contextHidden) {
            contextHidden.drawImage(canvasRef.current, 0, 0);
        }
    }, [canvasRef.current, canvasHiddenRef.current]);

    const restoreDrawing = useCallback(() => {
        if (!canvasRef.current || !canvasHiddenRef.current) return;
        const context = canvasRef.current.getContext("2d");
        const contextHidden = canvasHiddenRef.current.getContext("2d");
        if (context && contextHidden) {
            context.drawImage(canvasHiddenRef.current, 0, 0, canvasHiddenRef.current.width, canvasHiddenRef.current.height);
        }
    }, [canvasRef.current, canvasHiddenRef.current]);

    const resizeCanvas = useCallback(() => {
        if (!canvasRef.current) return;
        saveDrawing();
        canvasRef.current.width = canvasRef.current.parentElement!.offsetWidth;
        canvasRef.current.height = canvasRef.current.parentElement!.offsetHeight;
        restoreDrawing();
    }, [canvasRef.current, saveDrawing, restoreDrawing]);


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
    }, [canvasRef.current]);

    useLayoutEffect(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [resizeCanvas]);

    const startDrawing = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {

        if (event.pointerType === "pen") {
            setIsErasing(event.button === 5);
        }
        setDrawing(true);
        if (canvasRef.current) {
            canvasRef.current.setPointerCapture(event.pointerId);
        }
        if (contextRef.current) {
            contextRef.current.beginPath();
            contextRef.current.moveTo(
                event.nativeEvent.offsetX,
                event.nativeEvent.offsetY
            );
        }
    }, [contextRef.current]);

    const endDrawing = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
        setDrawing(false);
        if (canvasRef.current) {
            canvasRef.current.setPointerCapture(event.pointerId);
        }
        if (contextRef.current) {
            contextRef.current.closePath();
        }
    }, [canvasRef.current, contextRef.current]);

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
        <>
            <div className="drawing-container" style={{flexGrow: ratio}}>
                <canvas
                    className="drawing-canvas"
                    ref={canvasRef}
                    onPointerDown={startDrawing}
                    onPointerUp={endDrawing}
                    onPointerMove={draw}
                />
            </div>
            <canvas
                className="hidden"
                ref={canvasHiddenRef}
                style={hiddenStyle} />
        </>
    );
}
