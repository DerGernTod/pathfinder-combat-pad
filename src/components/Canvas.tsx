import "./Canvas.css"; 
import { CanvasStore, useCanvasStore } from "../store/useCanvasStore";
import React, {
    CSSProperties,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import { useShallow } from "zustand/react/shallow";

interface CanvasProps {
    style: CSSProperties;
    storeId?: string;
}

export const Canvas = forwardRef<HTMLCanvasElement | null, CanvasProps>(({ style, storeId }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasHiddenRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const { canvasContent, updateCanvas } = useCanvasStore(useShallow(function extractSpecificCanvas(state: CanvasStore) {
        return extractCanvasDataFromState(storeId, state);
    }));

    useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(ref, () => canvasRef.current);

    const resizeCurrentCanvas = useCallback(() => {
        if (!canvasRef.current || !canvasHiddenRef.current) return;
        resizeCanvas(canvasRef.current, canvasHiddenRef.current);
    }, []);

    useEffect(() => {
        configureCanvas(canvasRef, contextRef, canvasContent);
    }, [canvasContent]);

    useLayoutEffect(() => {
        resizeCurrentCanvas();
        window.addEventListener("keydown", setErasing);
        window.addEventListener("keyup", resetErasing);
        window.addEventListener("resize", resizeCurrentCanvas);
        return () => {
            window.removeEventListener("keydown", setErasing);
            window.removeEventListener("keyup", resetErasing);
            window.removeEventListener("resize", resizeCurrentCanvas);
        };

        function setErasing(e: globalThis.KeyboardEvent) {
            if (e.key === "Shift") {
                setIsErasing(true);
            }
        }

        function resetErasing(e: globalThis.KeyboardEvent) {
            if (e.key === "Shift") {
                setIsErasing(false);
            }
        }
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
            drawLineAndMove(contextRef.current, event.nativeEvent.offsetX, event.nativeEvent.offsetY);
        }
    }, []);

    const draw = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawing || !contextRef.current) return;
        if (isErasing) {
            contextRef.current.globalCompositeOperation = "destination-out";
            contextRef.current.lineWidth = 15;
        } else {
            contextRef.current.globalCompositeOperation = "source-over";
            contextRef.current.lineWidth = 5;
        }
        drawLineAndMove(contextRef.current, event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    }, [drawing, isErasing]);

    const endDrawing = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
        draw(event);
        setDrawing(false);
        if (contextRef.current) {
            contextRef.current.closePath();
        }
        if (canvasRef.current) {
            canvasRef.current.setPointerCapture(event.pointerId);
            if (storeId) {
                updateCanvas(storeId, canvasRef.current.toDataURL("image/webp"));
            }
        }
    }, [
        draw,
        storeId,
        updateCanvas
    ]);

    let erasingClass = "";
    if (isErasing) {
        erasingClass = "erasing";
    }

    return (
        <>
            <div className="drawing-container" style={style}>
                <canvas
                    className={`drawing-canvas ${erasingClass}`}
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

function configureCanvas(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
    canvasContent: string | undefined
): void {
    const canvas = canvasRef.current;
    if (!canvas) {
        return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
        return;
    }
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
    if (canvasContent) {
        restoreCanvasFromBase64(canvas, canvasContent);
    }
}

function extractCanvasDataFromState(storeId: string | undefined, state: CanvasStore) {
    let canvasContent: string | undefined = undefined;
    if (storeId) {
        canvasContent = state.canvases[storeId || ""];
    }
    return {
        canvasContent,
        updateCanvas: state.updateCanvas
    };
}

function resizeCanvas(canvas: HTMLCanvasElement, canvasHidden: HTMLCanvasElement): void {
    saveDrawing(canvas, canvasHidden);
    canvas.width = canvas.parentElement!.offsetWidth;
    canvas.height = canvas.parentElement!.offsetHeight;
    restoreDrawing(canvas, canvasHidden);
}

function saveDrawing(canvas: HTMLCanvasElement, canvasHidden: HTMLCanvasElement): void {
    const context = canvas.getContext("2d");
    const contextHidden = canvasHidden.getContext("2d");
    canvasHidden.width = canvas.width;
    canvasHidden.height = canvas.height;
    if (context && contextHidden) {
        contextHidden.drawImage(canvas, 0, 0);
    }
}

function restoreDrawing(canvas: HTMLCanvasElement, canvasHidden: HTMLCanvasElement): void {
    const context = canvas.getContext("2d");
    const contextHidden = canvasHidden.getContext("2d");
    if (context && contextHidden) {
        context.drawImage(canvasHidden, 0, 0, canvasHidden.width, canvasHidden.height);
    }
}

function drawLineAndMove(context: CanvasRenderingContext2D, x: number, y: number): void {
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
}

function restoreCanvasFromBase64(canvas: HTMLCanvasElement, base64: string): void {
    const img = new Image();
    img.onload = () => {
        const context = canvas.getContext("2d");
        if (context) {
            context.drawImage(img, 0, 0);
        }
    };
    img.src = base64;
}