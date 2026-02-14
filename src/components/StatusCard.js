// src/components/StatusCard.js
import React from 'react';

function StatusCard({ title, data, formatTimestamp }) {
  return (
    <div className="status-card">
      <h2>{title}</h2>
      <ul>
        {Object.entries(data).map(([key, value]) => {
          const displayKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();

          let displayValue = value;
          if (value && typeof value === 'string' && (value.endsWith('Z') || (value.includes('-') && value.includes(':')))) {
            displayValue = formatTimestamp(value);
          } else if (value === null || value === undefined) {
            displayValue = 'N/A';
          } else if (typeof value === 'boolean') {
            displayValue = value ? 'Yes' : 'No';
          }

          return (
            <li key={key}>
              <strong>{displayKey}:</strong> {displayValue}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default StatusCard;
