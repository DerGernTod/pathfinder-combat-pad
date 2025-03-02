export function MagnetKindArrow({ className }: { className?: string }) {
    return (
        <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon className={`apply-transitions ${className}`} points="50,10 90,90 50,70 10,90" fill="gray" />
        </svg>
    );
}