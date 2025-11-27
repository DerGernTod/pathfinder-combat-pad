import {
    scrollOverlay,
    scrollAttached,
    scrollOverlayButton,
    scrollOverlayButtonAttached,
    scrollOverlayButtonVariants,
    scrollOverlayVariants,
    hidden,
} from "./ScrollButton.css.ts";

interface ScrollButtonProps {
    direction: "top" | "bottom";
    onClick: () => void;
    show: boolean;
    variant?: "grid" | "absolute";
}

export function ScrollButton({ direction, onClick, show, variant = "grid" }: ScrollButtonProps) {
    const label = `Scroll to ${direction}`;
    const symbol = direction === "top" ? "▲" : "▼";
    const containerClass = variant === "grid" ? scrollOverlay : scrollAttached;
    const buttonClass = variant === "grid" ? scrollOverlayButton : `${scrollOverlayButton} ${scrollOverlayButtonAttached}`;

    return (
        <div
            className={`${containerClass} ${scrollOverlayVariants[direction]} ${show ? "" : hidden}`}
            aria-hidden={!show}
        >
            <button
                type="button"
                className={`${buttonClass} ${scrollOverlayButtonVariants[direction]}`}
                onClick={onClick}
                aria-label={label}
                title={label}
            >
                {symbol} Scroll
            </button>
        </div>
    );
}
