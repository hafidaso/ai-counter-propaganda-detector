import React, { useState } from 'react';
import { Settings, Info, RotateCcw } from 'lucide-react';

const AnalysisSettings = ({ settings, onSettingsChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    lowThreshold: settings?.thresholds?.low || 34,
    mediumThreshold: settings?.thresholds?.medium || 67,
    useLLM: settings?.useLLM !== false,
    sensitivity: settings?.sensitivity || 'balanced'
  });

  const handleSave = () => {
    const newSettings = {
      thresholds: {
        low: localSettings.lowThreshold,
        medium: localSettings.mediumThreshold
      },
      useLLM: localSettings.useLLM,
      sensitivity: localSettings.sensitivity
    };
    onSettingsChange(newSettings);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultSettings = {
      lowThreshold: 34,
      mediumThreshold: 67,
      useLLM: true,
      sensitivity: 'balanced'
    };
    setLocalSettings(defaultSettings);
  };

  const sensitivityPresets = {
    'strict': { low: 25, medium: 50, description: 'High sensitivity - flags more potential issues' },
    'balanced': { low: 34, medium: 67, description: 'Balanced approach - recommended for most users' },
    'relaxed': { low: 45, medium: 75, description: 'Lower sensitivity - focuses on obvious manipulation' }
  };

  const handleSensitivityChange = (sensitivity) => {
    const preset = sensitivityPresets[sensitivity];
    setLocalSettings(prev => ({
      ...prev,
      sensitivity,
      lowThreshold: preset.low,
      mediumThreshold: preset.medium
    }));
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="Analysis Settings"
      >
        <Settings className="w-4 h-4" />
        <span className="text-sm font-medium">Settings</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Analysis Settings</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Sensitivity Presets */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Detection Sensitivity
            </label>
            <div className="space-y-3">
              {Object.entries(sensitivityPresets).map(([key, preset]) => (
                <label key={key} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sensitivity"
                    value={key}
                    checked={localSettings.sensitivity === key}
                    onChange={(e) => handleSensitivityChange(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900 capitalize">{key}</div>
                    <div className="text-sm text-gray-600">{preset.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Thresholds */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Custom Risk Thresholds
            </label>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Low Risk Threshold: {localSettings.lowThreshold}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={localSettings.lowThreshold}
                  onChange={(e) => setLocalSettings(prev => ({ 
                    ...prev, 
                    lowThreshold: parseInt(e.target.value),
                    sensitivity: 'custom'
                  }))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>More Strict (10%)</span>
                  <span>More Relaxed (50%)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Medium Risk Threshold: {localSettings.mediumThreshold}%
                </label>
                <input
                  type="range"
                  min={localSettings.lowThreshold + 5}
                  max="90"
                  value={localSettings.mediumThreshold}
                  onChange={(e) => setLocalSettings(prev => ({ 
                    ...prev, 
                    mediumThreshold: parseInt(e.target.value),
                    sensitivity: 'custom'
                  }))}
                  className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>More Strict ({localSettings.lowThreshold + 5}%)</span>
                  <span>More Relaxed (90%)</span>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Risk Level Guide:</div>
                  <div>• 0-{localSettings.lowThreshold}%: Low Risk (minimal bias)</div>
                  <div>• {localSettings.lowThreshold + 1}-{localSettings.mediumThreshold}%: Medium Risk (moderate bias)</div>
                  <div>• {localSettings.mediumThreshold + 1}-100%: High Risk (strong bias indicators)</div>
                </div>
              </div>
            </div>
          </div>

          {/* LLM Settings */}
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.useLLM}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, useLLM: e.target.checked }))}
                className="rounded"
              />
              <div>
                <div className="font-medium text-gray-900">Enable AI Analysis</div>
                <div className="text-sm text-gray-600">
                  Use Large Language Models for detailed explanations and insights
                </div>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
            
            <div className="space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisSettings;
