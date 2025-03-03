import "./MagnetKindCondition.css";
import { PointerEvent, RefObject, useCallback, useRef, useState } from "react";
import { Canvas } from "../../Canvas";
import { MagnetKindProps } from "./MagnetKinds";
import { useMagnetStore } from "../../../store/useMagnetStore";
import { useShallow } from "zustand/react/shallow";

const canvasStyle = { height: "21px", width: "100%" };

export function MagnetKindCondition({ className, details = "", id }: MagnetKindProps) {
    const [isEditing, setIsEditing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const setMagnetImage = useMagnetStore(useShallow(state => state.setMagnetImage));

    if (typeof details !== "string") {
        throw new Error("MagnetKindCondition details must be a string");
    }

    const toggleEditing = useCallback((e: PointerEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const imageUrl = canvasRef.current?.toDataURL("image/webp");
        if (isEditing && imageUrl) {
            setMagnetImage(id, imageUrl);
        }
        setIsEditing(!isEditing);
    }, [isEditing, id, setMagnetImage]);

    return (
        <div className={`condition-marker apply-transitions ${className || ""}`}>
            <div className="condition-label">condition</div>
            <div className={`condition-text ${editingClass(isEditing)}`}>
                {renderDetails(details, isEditing, canvasRef)}
            </div>
            <div className="condition-edit" onPointerDown={stopPropagation} onClick={toggleEditing}>
                {renderEditChar(isEditing)}
            </div>
        </div>
    );
}

function editingClass(isEditing: boolean) {
    if (isEditing) {
        return "editing";
    }
    return "";
}

function stopPropagation(e: PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
}

function renderEditChar(isEditing: boolean) {
    if (isEditing) {
        return "✓";
    }
    return "✎";
}

function renderDetails(details: string, isEditing: boolean, ref: RefObject<HTMLCanvasElement>) {
    if (isEditing) {
        return <Canvas ref={ref} style={canvasStyle} penSize={3} />;
    }
    if (details.length > 0) {
        return <img src={details} alt="condition" />;
    }
    return <>&nbsp;</>;
}

export function MagnetKindConditionPreview() {
    return (
        <div className="condition-marker apply-transitions preview">
            <div className="condition-label">condition</div>
            <div className="condition-text">&nbsp;</div>
        </div>
    )
}