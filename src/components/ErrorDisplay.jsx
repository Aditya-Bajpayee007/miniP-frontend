import React from "react";

const ErrorDisplay = ({ error }) =>
  error ? (
    <div className="bg-red-50 backdrop-blur-xl border border-red-200 rounded-2xl p-6 mb-8 shadow-2xl">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-xl">
          ⚠️
        </div>
        <div>
          <div className="font-semibold text-red-600 mb-1">Error</div>
          <div className="text-red-700">{error}</div>
        </div>
      </div>
    </div>
  ) : null;

export default ErrorDisplay;
