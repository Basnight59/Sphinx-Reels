import React, { useEffect, useState } from 'react';

type AiRequest = {
  id: string;
  provider: string;
  prompt: string;
  status: string;
  createdAt: string;
  cost?: number | null;
  result?: any;
  user?: { id: string; email: string } | null;
};

export const Admin: React.FC = () => {
  const [requests, setRequests] = useState<AiRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_URL}/admin/ai-requests`, { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setRequests(data || []);
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    };
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">AI Requests</h2>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="p-3 border border-border rounded-lg bg-surface">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted">{new Date(r.createdAt).toLocaleString()}</div>
                  <div className="font-medium text-white">{r.provider.toUpperCase()} — {r.status}</div>
                </div>
                <div className="text-sm text-muted">Cost: {r.cost ?? '—'}</div>
              </div>
              <div className="mt-2 text-sm text-muted">Prompt: {r.prompt}</div>
              {r.user && <div className="mt-2 text-xs text-muted">User: {r.user.email}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
