import "./InitSlot.css";

export function InitSlot(): JSX.Element {
    return (
        <div className="init-slot-container">
            <div className="init-slot">slot</div>
            <div className="init-content-status">
                <div>O</div>
                <div>💀</div>
                <div>💀</div>
                <div>💀</div>
            </div>
        </div>
    );
}