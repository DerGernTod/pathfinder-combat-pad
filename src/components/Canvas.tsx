import React, { useRef, useState, useEffect, useCallback, useLayoutEffect, CSSProperties, forwardRef, useImperativeHandle } from "react";
import "./Canvas.css";

export const Canvas = forwardRef<HTMLCanvasElement | null, { style: CSSProperties }>(({ style }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasHiddenRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);

    useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(ref, () => canvasRef.current);

    const resizeCurrentCanvas = useCallback(() => {
        if (!canvasRef.current || !canvasHiddenRef.current) return;
        resizeCanvas(canvasRef.current, canvasHiddenRef.current);
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
        resizeCurrentCanvas();
        window.addEventListener("resize", resizeCurrentCanvas);
        return () => {
            window.removeEventListener("resize", resizeCurrentCanvas);
        };
    }, [resizeCurrentCanvas]);

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
    return (
        <>
            <div className="drawing-container" style={style}>
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
                ref={canvasHiddenRef} />
        </>
    );
});

function resizeCanvas(canvas: HTMLCanvasElement, canvasHidden: HTMLCanvasElement) {
    saveDrawing(canvas, canvasHidden);
    canvas.width = canvas.parentElement!.offsetWidth;
    canvas.height = canvas.parentElement!.offsetHeight;
    restoreDrawing(canvas, canvasHidden);
}

function saveDrawing(canvas: HTMLCanvasElement, canvasHidden: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    const contextHidden = canvasHidden.getContext("2d");
    canvasHidden.width = canvas.width;
    canvasHidden.height = canvas.height;
    if (context && contextHidden) {
        contextHidden.drawImage(canvas, 0, 0);
    }
}

function restoreDrawing(canvas: HTMLCanvasElement, canvasHidden: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    const contextHidden = canvasHidden.getContext("2d");
    if (context && contextHidden) {
        context.drawImage(canvasHidden, 0, 0, canvasHidden.width, canvasHidden.height);
    }
}