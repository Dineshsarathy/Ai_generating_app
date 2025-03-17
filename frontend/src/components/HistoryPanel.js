import React from "react";
import "../styles/HistoryPanel.css";

function HistoryPanel({ history, onSelect }) {
    return (
        <div className="history-panel">
            <h3 className="history-title">📜 History</h3>
            {history.length === 0 ? (
                <p className="no-history">No history available.</p>
            ) : (
                history.map((item, index) => (
                    <button 
                        key={index} 
                        className="history-item" 
                        onClick={() => onSelect(item)}
                    >
                        {item.prompt}
                    </button>
                ))
            )}
        </div>
    );
}

export default HistoryPanel;
