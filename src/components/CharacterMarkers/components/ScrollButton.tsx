import {
    scrollOverlay,
    scrollOverlayButton,
    scrollOverlayButtonVariants,
    scrollOverlayVariants,
    hidden,
} from "./ScrollButton.css.ts";

interface ScrollButtonProps {
    direction: "top" | "bottom";
    onClick: () => void;
    show: boolean;
}

export function ScrollButton({ direction, onClick, show }: ScrollButtonProps) {
    const label = `Scroll to ${direction}`;
    const symbol = direction === "top" ? "▲" : "▼";

    return (
        <div
            className={`${scrollOverlay} ${scrollOverlayVariants[direction]} ${show ? "" : hidden}`}
            aria-hidden={!show}
        >
            <button
                type="button"
                className={`${scrollOverlayButton} ${scrollOverlayButtonVariants[direction]}`}
                onClick={onClick}
                aria-label={label}
                title={label}
            >
                {symbol} Scroll
            </button>
        </div>
    );
}
