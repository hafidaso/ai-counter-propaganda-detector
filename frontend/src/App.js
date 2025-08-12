import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Activity, Brain, BarChart3, BookOpen, Sparkles, Zap, Target, Linkedin, Github, ExternalLink } from 'lucide-react';
import TextInput from './components/TextInput';
import AnalysisResults from './components/AnalysisResults';
import StatusBar from './components/StatusBar';
import AnalysisSettings from './components/AnalysisSettings';
import ComparativeAnalysis from './components/ComparativeAnalysis';
import EducationalTools from './components/EducationalTools';
import { analyzeText, compareTexts, checkHealth, getLLMHealth, getModelsStatus } from './services/api';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState({ status: 'checking', models_loaded: false });
  const [activeTab, setActiveTab] = useState('single');
  const [analysisSettings, setAnalysisSettings] = useState({
    thresholds: { low: 34, medium: 67 },
    useLLM: true,
    sensitivity: 'balanced'
  });

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const health = await checkHealth();
      setApiHealth(health);
    } catch (error) {
      setApiHealth({ status: 'error', models_loaded: false });
      console.error('API health check failed:', error);
    }
  };

  const handleAnalyze = async (text) => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setLoadingStage('Initializing analysis...');
    setError(null);
    setAnalysisResult(null);

    try {
      // Show progressive loading stages
      setTimeout(() => setLoadingStage('Processing with AI models...'), 500);
      setTimeout(() => setLoadingStage('Analyzing propaganda techniques...'), 2000);
      setTimeout(() => setLoadingStage('Evaluating emotional triggers...'), 4000);
      setTimeout(() => setLoadingStage('Generating insights...'), 6000);

      const payload = {
        text,
        use_llm: analysisSettings.useLLM,
        thresholds: analysisSettings.thresholds
      };
      const result = await analyzeText(text, payload);
      setAnalysisResult(result);
      setLoadingStage('Analysis complete!');
    } catch (error) {
      setError(error.message);
      console.error('Analysis failed:', error);
      setLoadingStage('');
    } finally {
      setTimeout(() => {
        setLoading(false);
        setLoadingStage('');
      }, 500);
    }
  };

  const handleCompareTexts = async (texts, labels) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        texts,
        labels,
        use_llm: analysisSettings.useLLM,
        thresholds: analysisSettings.thresholds
      };
      const result = await apiService.compareTexts(payload);
      return result;
    } catch (error) {
      setError(error.message);
      console.error('Comparison failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return <Shield className="w-6 h-6" />;
      case 'medium': return <AlertTriangle className="w-6 h-6" />;
      case 'high': return <AlertTriangle className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  const getRiskBadge = (riskLevel) => {
    const baseClasses = "badge font-semibold text-sm px-4 py-2";
    switch (riskLevel) {
      case 'low': return `${baseClasses} badge-success`;
      case 'medium': return `${baseClasses} badge-warning`;
      case 'high': return `${baseClasses} badge-danger`;
      default: return `${baseClasses} badge-info`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      {/* Header */}
      <header className="header-modern sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-glow">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  AI Counter-Propaganda Detector
                </h1>
                <p className="text-secondary-600 font-medium">
                  Advanced AI-powered analysis for media literacy and critical thinking
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <AnalysisSettings 
                settings={analysisSettings}
                onSettingsChange={setAnalysisSettings}
              />
              <StatusBar health={apiHealth} onRefresh={checkApiHealth} />
            </div>
          </div>
          
          {/* Developer Credit Badge */}
          <div className="flex justify-center pb-4">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent-50 to-primary-50 px-4 py-2 rounded-full border border-accent-200 shadow-soft">
              <span className="text-xs text-accent-700 font-medium">Developed by</span>
              <a
                href="https://hafida-belayd.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary-700 hover:text-primary-800 transition-colors duration-200"
              >
                Hafida Belayd
              </a>
              <span className="text-xs text-accent-600">•</span>
              <span className="text-xs text-secondary-600">Data Scientist & AI Engineer</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white/60 backdrop-blur-md border-b border-white/20 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {[
              { id: 'single', label: 'Single Analysis', icon: Brain, description: 'Analyze individual texts' },
              { id: 'compare', label: 'Compare Texts', icon: BarChart3, description: 'Compare multiple sources' },
              { id: 'education', label: 'Learn & Practice', icon: BookOpen, description: 'Educational resources' }
            ].map(({ id, label, icon: Icon, description }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`nav-tab ${
                  activeTab === id ? 'nav-tab-active' : 'nav-tab-inactive'
                }`}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <span className="font-semibold">{label}</span>
                  <p className="text-xs text-secondary-500 hidden lg:block">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'single' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-accent-50 px-6 py-3 rounded-2xl border border-primary-100">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <span className="text-primary-700 font-semibold">Powered by Advanced AI Models</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-900">
                Detect Propaganda & Bias with
                <span className="gradient-text block">AI Precision</span>
              </h2>
              <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
                Our cutting-edge AI analyzes text content for propaganda techniques, emotional manipulation, 
                and ideological bias. Get detailed insights with educational explanations to enhance your media literacy.
              </p>
            </div>

            {/* Introduction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-elevated p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">Advanced Detection</h3>
                <p className="text-secondary-600 leading-relaxed">
                  Identifies propaganda techniques, emotional triggers, and manipulation tactics with 95% accuracy
                </p>
              </div>

              <div className="card-elevated p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">Real-time Analysis</h3>
                <p className="text-secondary-600 leading-relaxed">
                  Get comprehensive results in seconds with our optimized AI models and processing pipeline
                </p>
              </div>

              <div className="card-elevated p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">Educational Insights</h3>
                <p className="text-secondary-600 leading-relaxed">
                  Learn about propaganda techniques with detailed explanations and improvement suggestions
                </p>
              </div>
            </div>

            {/* Risk Level Guide */}
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span>Risk Level Guide</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4 p-4 bg-success-50 rounded-xl border border-success-200">
                  <div className="w-4 h-4 bg-success-500 rounded-full"></div>
                  <div>
                    <span className="font-semibold text-success-700">Low Risk (0-{analysisSettings.thresholds.low}%)</span>
                    <p className="text-sm text-success-600">Minimal bias detected</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-warning-50 rounded-xl border border-warning-200">
                  <div className="w-4 h-4 bg-warning-500 rounded-full"></div>
                  <div>
                    <span className="font-semibold text-warning-700">Medium Risk ({analysisSettings.thresholds.low + 1}-{analysisSettings.thresholds.medium}%)</span>
                    <p className="text-sm text-warning-600">Moderate bias present</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-danger-50 rounded-xl border border-danger-200">
                  <div className="w-4 h-4 bg-danger-500 rounded-full"></div>
                  <div>
                    <span className="text-semibold text-danger-700">High Risk ({analysisSettings.thresholds.medium + 1}-100%)</span>
                    <p className="text-sm text-danger-600">Strong bias indicators</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Input */}
            <TextInput onAnalyze={handleAnalyze} loading={loading} loadingStage={loadingStage} />

            {/* Error Display */}
            {error && (
              <div className="card p-6 border-l-4 border-danger-500 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-danger-600" />
                  </div>
                  <div>
                    <h4 className="text-danger-800 font-semibold">Analysis Error</h4>
                    <p className="text-danger-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Overall Score Display */}
            {analysisResult && (
              <div className="card-elevated p-8 animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-secondary-900">Analysis Results</h3>
                  <div className={getRiskBadge(analysisResult.risk_level)}>
                    {getRiskIcon(analysisResult.risk_level)}
                    <span className="ml-2 capitalize">{analysisResult.risk_level} Risk</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold text-secondary-700">Bias Score</span>
                        <span className="text-4xl font-bold gradient-text">
                          {analysisResult.overall_score}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${
                            analysisResult.risk_level === 'low' 
                              ? 'progress-success' 
                              : analysisResult.risk_level === 'medium' 
                              ? 'progress-warning' 
                              : 'progress-danger'
                          }`}
                          style={{ width: `${analysisResult.overall_score}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary-50 p-4 rounded-xl">
                        <p className="text-sm text-secondary-600">Analysis Time</p>
                        <p className="font-semibold text-secondary-900">
                          {new Date(analysisResult.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="bg-secondary-50 p-4 rounded-xl">
                        <p className="text-sm text-secondary-600">Sensitivity</p>
                        <p className="font-semibold text-secondary-900 capitalize">
                          {analysisSettings.sensitivity}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-secondary-900">Analysis Details</h4>
                    <div className="space-y-3 text-sm text-secondary-600">
                      <div className="flex justify-between">
                        <span>Risk Level:</span>
                        <span className="font-semibold capitalize">{analysisResult.risk_level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Model:</span>
                        <span className="font-semibold">{analysisSettings.useLLM ? 'LLM + Traditional' : 'Traditional Only'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Analysis Date:</span>
                        <span className="font-semibold">{new Date(analysisResult.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Time:</span>
                        <span className="font-semibold">~{Math.round((Date.now() - new Date(analysisResult.timestamp).getTime()) / 1000)}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Results */}
            {analysisResult && (
              <AnalysisResults result={analysisResult} />
            )}
          </div>
        )}

        {activeTab === 'compare' && (
          <ComparativeAnalysis onAnalyze={handleCompareTexts} loading={loading} />
        )}

        {activeTab === 'education' && (
          <EducationalTools />
        )}
      </main>

      {/* Footer */}
      <footer className="footer-modern mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-8">
            {/* Main Footer Content */}
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-2">
                <Brain className="w-6 h-6 text-primary-600" />
                <span className="text-xl font-bold gradient-text">AI Counter-Propaganda Detector</span>
              </div>
              <p className="text-secondary-600 max-w-2xl mx-auto leading-relaxed">
                <strong>Disclaimer:</strong> This tool is designed as an analytical aid to support critical thinking and media literacy. 
                Results should not be considered definitive judgments of truth or falsehood.
              </p>
              <p className="text-secondary-500 text-sm">
                Use this analysis as one factor among many when evaluating content. 
                Always apply your own critical thinking and seek additional verification.
              </p>
            </div>

            {/* Developer Information */}
            <div className="border-t border-secondary-200 pt-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-secondary-900">Developed by Hafida Belayd</h4>
                <p className="text-secondary-600 text-sm max-w-md mx-auto">
                  Data Scientist & Software Engineer specializing in AI-powered solutions and data-driven insights
                </p>
                
                {/* Social Links */}
                <div className="flex items-center justify-center space-x-6">
                  <a
                    href="https://www.linkedin.com/in/hafida-belayd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200 group"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <span className="font-medium">LinkedIn</span>
                  </a>
                  
                  <a
                    href="https://github.com/hafidaso"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-700 transition-colors duration-200 group"
                  >
                    <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center group-hover:bg-secondary-200 transition-colors duration-200">
                      <Github className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">GitHub</span>
                  </a>
                  
                  <a
                    href="https://hafida-belayd.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-accent-600 hover:text-accent-700 transition-colors duration-200 group"
                  >
                    <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center group-hover:bg-accent-200 transition-colors duration-200">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Portfolio</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-6 border-t border-secondary-200">
              <p className="text-secondary-400 text-sm">
                © 2025 AI Counter-Propaganda Detector. Built with advanced AI technology for media literacy by Hafida Belayd.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
