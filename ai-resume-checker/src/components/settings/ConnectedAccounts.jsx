import React, { useState } from 'react';
import { Link2, Link2Off, CheckCircle2 } from 'lucide-react';

export default function ConnectedAccounts({ data, onSave }) {
  const [accounts, setAccounts] = useState(data);

  const toggleConnection = (providerName) => {
    const updated = accounts.map(acc => {
      if (acc.provider === providerName) {
        if (acc.connected) {
          onSave(`${providerName} disconnected successfully.`);
          return { ...acc, connected: false, email: null };
        } else {
          onSave(`${providerName} connected successfully!`);
          return { ...acc, connected: true, email: 'user@example.com' }; // mock email
        }
      }
      return acc;
    });
    setAccounts(updated);
  };

  const getProviderBrandColor = (provider) => {
    switch (provider.toLowerCase()) {
      case 'google': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'github': return 'text-gray-200 bg-white/10 border-white/20';
      case 'linkedin': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'microsoft': return 'text-blue-300 bg-blue-400/10 border-blue-400/20';
      default: return 'text-white bg-white/10 border-white/20';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white mb-2">Connected Accounts</h2>
        <p className="text-gray-400 text-sm">Link external accounts to enable seamless single sign-on (SSO) and import data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc, idx) => (
          <div key={idx} className="glass-card p-6 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl border ${getProviderBrandColor(acc.provider)}`}>
                  {acc.provider.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{acc.provider}</h3>
                  {acc.connected ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-400 mt-1">
                      <CheckCircle2 size={12} /> Connected
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 mt-1">Not connected</span>
                  )}
                </div>
              </div>
            </div>

            {acc.connected && acc.email && (
              <p className="text-sm text-gray-400 mb-4">{acc.email}</p>
            )}

            <button 
              onClick={() => toggleConnection(acc.provider)}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                acc.connected 
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20' 
                  : 'bg-white/5 text-white hover:bg-white/10 border-white/10'
              }`}
            >
              {acc.connected ? (
                <><Link2Off size={16} /> Disconnect</>
              ) : (
                <><Link2 size={16} /> Connect {acc.provider}</>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
