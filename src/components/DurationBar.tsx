import './DurationBar.css'; // Assuming you will add some CSS for styling

export function DurationBar(): JSX.Element {
    return (
        <>
        <div className="pad"></div>
        <div className="duration-bar">
            <div className="duration-label">
                <div className="rotated-text">DURATION</div>
            </div>
            <div className="duration-numbers">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="duration-number">{10 - i}</div>
                ))}
            </div>
        </div>
        </>
    );
};
