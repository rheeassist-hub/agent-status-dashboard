// src/components/RecentActivities.js
import React from 'react';

function RecentActivities({ activities, formatTimestamp }) {
  return (
    <div className="status-card recent-activities">
      <h2>Recent Activities</h2>
      {activities.length === 0 ? (
        <p>No recent activities to show.</p>
      ) : (
        <ul>
          {activities.map((activity, index) => (
            <li key={index}>
              <strong>{activity.taskName}</strong> ({activity.status || 'N/A'}) - Completed {formatTimestamp(activity.endTime)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentActivities;
