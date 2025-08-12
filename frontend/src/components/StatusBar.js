import React from 'react';
import { CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';

const StatusBar = ({ health, onRefresh }) => {
  const getStatusIcon = () => {
    switch (health.status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-danger-600" />;
      case 'checking':
      default:
        return <Loader className="w-4 h-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusText = () => {
    if (health.status === 'healthy') {
      return health.models_loaded ? 'AI Models Ready' : 'Connected (Models Loading)';
    }
    if (health.status === 'error') {
      return 'API Offline';
    }
    return 'Checking Status...';
  };

  const getStatusColor = () => {
    if (health.status === 'healthy' && health.models_loaded) {
      return 'text-success-600';
    }
    if (health.status === 'healthy') {
      return 'text-warning-600';
    }
    if (health.status === 'error') {
      return 'text-danger-600';
    }
    return 'text-gray-500';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      <button
        onClick={onRefresh}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        title="Refresh status"
      >
        <RefreshCw className="w-4 h-4" />
      </button>

      {/* Status Details Tooltip */}
      {health.status === 'healthy' && (
        <div className="hidden md:flex items-center space-x-1 text-xs text-gray-500">
          <span>•</span>
          <span>
            {health.models_loaded ? 'All systems operational' : 'Initializing AI models...'}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusBar;
