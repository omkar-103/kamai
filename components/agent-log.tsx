'use client';

import { useEffect, useState } from 'react';

interface LogAction {
  id: string;
  text: string;
  time: string;
  agent: string;
}

interface AgentLogProps {
  userId?: string;
}

export default function AgentLog({ userId }: AgentLogProps) {
  const [logs, setLogs] = useState<LogAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [userId]);

  const loadLogs = async () => {
    try {
      const response = await fetch(`/api/agents?userId=${userId || '674d9a1e5f8c2a001234abcd'}`);
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        // Transform agents data to log actions
        const logActions: LogAction[] = result.data.map((agent: any) => ({
          id: agent._id || Math.random().toString(),
          text: agent.last_action || 'No action recorded',
          time: getRelativeTime(agent.timestamp || new Date()),
          agent: agent.agent_name || 'Kamai AI'
        }));
        
        setLogs(logActions);
      } else {
        // Set default logs if no data
        setLogs([
          {
            id: '1',
            text: 'System initialized and monitoring your financial health',
            time: '2 minutes ago',
            agent: 'Kamai AI'
          },
          {
            id: '2',
            text: 'Analyzing your financial patterns',
            time: '5 minutes ago',
            agent: 'Budget Agent'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading agent logs:', error);
      // Set fallback logs on error
      setLogs([
        {
          id: '1',
          text: 'Monitoring your financial health and income patterns',
          time: 'Just now',
          agent: 'Kamai AI'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (timestamp: string | Date): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    } catch {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.length > 0 ? logs.map((log) => (
        <div key={log.id} className="text-xs">
          <div className="text-[var(--text-primary)] mb-1">
            {log.text}
          </div>
          <div className="text-[var(--text-secondary)] flex items-center justify-between">
            <span>{log.agent}</span>
            <span>{log.time}</span>
          </div>
        </div>
      )) : (
        <div className="text-xs text-[var(--text-secondary)] text-center py-4">
          No agent activity yet
        </div>
      )}
    </div>
  );
}