import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({
  message = 'Unable to load device data.',
  onRetry = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-rose-50/80 backdrop-blur-md border border-rose-200 rounded-2xl text-center my-4 shadow-glass">
      <div className="p-3 bg-rose-100 text-rose-700 rounded-xl mb-3 border border-rose-200">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-rose-900 mb-1">Connection Error</h3>
      <p className="text-xs text-rose-700/90 mb-5 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
