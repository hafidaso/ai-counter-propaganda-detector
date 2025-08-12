import React, { useState } from 'react';
import { Send, FileText, Loader, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

const TextInput = ({ onAnalyze, loading, loadingStage }) => {
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !loading) {
      onAnalyze(text);
    }
  };

  const handleExampleText = () => {
    const exampleText = `Breaking: This shocking new study reveals that 90% of people are being deceived by mainstream media! The establishment doesn't want you to know the truth about what's really happening. Act now before it's too late - share this urgent message with everyone you know! The future of our democracy depends on immediate action. Don't let them silence the real patriots who are fighting for our freedom!`;
    setText(exampleText);
    setCharCount(exampleText.length);
  };

  const isTextValid = text.trim().length >= 10 && text.length <= 10000;

  return (
    <div className="card-elevated p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-secondary-900">Text Analysis</h3>
            <p className="text-secondary-600">Enter text to analyze for propaganda and bias patterns</p>
          </div>
        </div>
        <button
          onClick={handleExampleText}
          className="btn-secondary flex items-center space-x-2"
          disabled={loading}
        >
          <Sparkles className="w-4 h-4" />
          <span>Try Example</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label htmlFor="text-input" className="block text-lg font-semibold text-secondary-900">
            Enter your text here
          </label>
          <div className="relative">
            <textarea
              id="text-input"
              value={text}
              onChange={handleTextChange}
              placeholder="Paste any text here - news articles, social media posts, speeches, or any written content you want to analyze for propaganda techniques and bias..."
              className="textarea-modern h-48 text-base leading-relaxed"
              disabled={loading}
            />
            <div className="absolute bottom-3 right-3">
              {charCount > 0 && (
                <div className={`flex items-center space-x-2 text-sm ${
                  charCount > 10000 ? 'text-danger-600' : 'text-secondary-500'
                }`}>
                  {charCount > 10000 ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : charCount >= 10 ? (
                    <CheckCircle className="w-4 h-4 text-success-600" />
                  ) : null}
                  <span className="font-medium">
                    {charCount.toLocaleString()} / 10,000
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {charCount > 0 && charCount < 10 && (
            <div className="flex items-center space-x-2 text-warning-600 bg-warning-50 px-4 py-3 rounded-xl border border-warning-200">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Minimum 10 characters required for analysis</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-secondary-900">What this tool analyzes:</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-secondary-700">Propaganda techniques and manipulation tactics</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-secondary-700">Emotional intensity and sentiment analysis</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-secondary-700">Ideological bias and urgency markers</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-secondary-700">Named entities and language patterns</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-4">
            <button
              type="submit"
              disabled={!isTextValid || loading}
              className={`btn-primary w-full lg:w-auto ${
                !isTextValid || loading
                  ? 'opacity-50 cursor-not-allowed hover:transform-none'
                  : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Send className="w-5 h-5" />
                  <span>Analyze Text</span>
                </div>
              )}
            </button>
            
            {!isTextValid && text.length > 0 && (
              <p className="text-sm text-secondary-500 text-center">
                {text.length < 10 ? 'Text too short' : 'Text too long'}
              </p>
            )}
          </div>
        </div>
      </form>

      {/* Analysis progress indicator */}
      {loading && (
        <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-2xl">
          <div className="flex items-center space-x-4 mb-4">
            <div className="loading-spinner"></div>
            <div>
              <h4 className="text-lg font-semibold text-primary-800">Analysis in Progress</h4>
              <p className="text-primary-700">
                {loadingStage || 'Running AI analysis... This may take up to 60 seconds for comprehensive analysis.'}
              </p>
            </div>
          </div>
          
          {loadingStage && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-primary-700">
                <span>Progress</span>
                <span>
                  {loadingStage.includes('Initializing') ? '20%' :
                   loadingStage.includes('Processing') ? '40%' :
                   loadingStage.includes('Analyzing') ? '60%' :
                   loadingStage.includes('Evaluating') ? '80%' :
                   loadingStage.includes('Generating') ? '90%' :
                   loadingStage.includes('complete') ? '100%' : '10%'}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill progress-info h-2"
                  style={{
                    width: loadingStage.includes('Initializing') ? '20%' :
                           loadingStage.includes('Processing') ? '40%' :
                           loadingStage.includes('Analyzing') ? '60%' :
                           loadingStage.includes('Evaluating') ? '80%' :
                           loadingStage.includes('Generating') ? '90%' :
                           loadingStage.includes('complete') ? '100%' : '10%'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextInput;
