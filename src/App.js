// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistance, parseISO } from 'date-fns';
import StatusCard from './components/StatusCard';
import RecentActivities from './components/RecentActivities';
import './App.css';

const API_URL = '/api/status'; // Relative URL for Vercel Serverless Function
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds

function App() {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const username = process.env.REACT_APP_DASHBOARD_USER || 'user';
      const password = process.env.REACT_APP_DASHBOARD_PASSWORD || 'pass';

      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`
        }
      });
      setStatusData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching status:", err);
      if (err.response && err.response.status === 401) {
        setError("Authentication failed. Please check your credentials.");
      } else {
        setError("Could not fetch dashboard status. Please try again later.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const intervalId = setInterval(fetchStatus, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    fetchStatus();
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = parseISO(timestamp);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Rheeman's Agent Status</h1>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading dashboard...</div>}

      {!loading && !error && statusData && (
        <div className="dashboard-content">
          <StatusCard title="Agent Health" data={statusData.agentHealth} formatTimestamp={formatTimestamp} />

          {statusData.currentActivity && (
            <StatusCard title="Current Activity" data={statusData.currentActivity} formatTimestamp={formatTimestamp} />
          )}

          {statusData.recentActivities && statusData.recentActivities.length > 0 && (
            <RecentActivities activities={statusData.recentActivities} formatTimestamp={formatTimestamp} />
          )}
          <div className="timestamp-info">
            Last Updated: {formatTimestamp(statusData.lastUpdated)}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
