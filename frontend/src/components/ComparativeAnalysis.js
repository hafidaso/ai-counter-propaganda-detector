import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Users,
  ArrowUp,
  ArrowDown,
  Equal,
  Sparkles,
  Target,
  Shield,
  Eye,
  Zap
} from 'lucide-react';

const ComparativeAnalysis = ({ onAnalyze, loading }) => {
  const [texts, setTexts] = useState(['', '']);
  const [labels, setLabels] = useState(['Text 1', 'Text 2']);
  const [comparisonResult, setComparisonResult] = useState(null);

  const addText = () => {
    if (texts.length < 5) {
      setTexts([...texts, '']);
      setLabels([...labels, `Text ${texts.length + 1}`]);
    }
  };

  const removeText = (index) => {
    if (texts.length > 2) {
      const newTexts = texts.filter((_, i) => i !== index);
      const newLabels = labels.filter((_, i) => i !== index);
      setTexts(newTexts);
      setLabels(newLabels);
    }
  };

  const updateText = (index, value) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const updateLabel = (index, value) => {
    const newLabels = [...labels];
    newLabels[index] = value;
    setLabels(newLabels);
  };

  const handleCompare = async () => {
    const validTexts = texts.filter(text => text.trim().length >= 10);
    if (validTexts.length < 2) {
      alert('Please provide at least 2 texts with minimum 10 characters each');
      return;
    }

    try {
      const result = await onAnalyze(texts, labels);
      setComparisonResult(result);
    } catch (error) {
      console.error('Comparison failed:', error);
      alert('Comparison failed. Please try again.');
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getComparisonIcon = (score1, score2) => {
    const diff = score1 - score2;
    if (Math.abs(diff) < 5) return <Equal className="w-5 h-5 text-slate-400" />;
    return diff > 0 ? <ArrowUp className="w-5 h-5 text-rose-500" /> : <ArrowDown className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Comparative Analysis
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Compare multiple texts to identify propaganda patterns, emotional intensity, and risk levels
          </p>
        </div>

        {/* Input Section */}
        <div className="backdrop-blur-sm bg-white/70 rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Text Input</h2>
              <p className="text-slate-600">Add up to 5 texts for comprehensive comparison</p>
            </div>
            <button
              onClick={addText}
              disabled={texts.length >= 5}
              className="group relative inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold">Add Text</span>
            </button>
          </div>

          <div className="space-y-6">
            {texts.map((text, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative backdrop-blur-sm bg-white/80 rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={labels[index]}
                        onChange={(e) => updateLabel(index, e.target.value)}
                        className="font-semibold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl px-3 py-2 text-lg"
                        placeholder={`Text ${index + 1} Label`}
                      />
                    </div>
                    {texts.length > 2 && (
                      <button
                        onClick={() => removeText(index)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => updateText(index, e.target.value)}
                    className="w-full h-36 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/50 backdrop-blur-sm text-slate-700 placeholder-slate-400 transition-all duration-200"
                    placeholder={`Enter ${labels[index]} for analysis...`}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <Target className="w-4 h-4" />
                      <span>{text.length} characters</span>
                    </div>
                    {text.length < 10 && (
                      <div className="flex items-center space-x-2 text-amber-600 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Minimum 10 required</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleCompare}
            disabled={loading || texts.filter(t => t.trim().length >= 10).length < 2}
            className="group relative w-full mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:transform-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-3">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                  <span className="text-lg font-semibold">Analyzing...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-lg font-semibold">Compare Texts</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Results Section */}
        {comparisonResult && comparisonResult.comparison_insights && (
          <div className="space-y-8 animate-fade-in">
            {/* Overall Comparison */}
            <div className="backdrop-blur-sm bg-white/70 rounded-3xl shadow-xl border border-white/20 p-8 stagger-item">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center float">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Risk Score Comparison</h3>
              </div>
              <div className="space-y-4">
                {comparisonResult.comparison_insights?.risk_comparison?.map((item, index) => (
                  <div key={index} className="group relative stagger-item">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-blue-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative backdrop-blur-sm bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 card-hover">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold hover:scale-110 transition-transform duration-200">
                            {item.label.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-lg">{item.label}</div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(item.risk_level)}`}>
                              {item.risk_level.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                              {item.overall_score}%
                            </div>
                            <div className="text-sm text-slate-500">Risk Score</div>
                          </div>
                          {index > 0 && (
                            <div className="flex items-center space-x-2">
                              {getComparisonIcon(
                                item.overall_score, 
                                comparisonResult.comparison_insights.risk_comparison[index - 1].overall_score
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )) || <p className="text-slate-500 text-center py-8">No risk comparison data available</p>}
              </div>
            </div>

            {/* Detailed Metrics Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Emotional Intensity */}
              <div className="backdrop-blur-sm bg-white/70 rounded-3xl shadow-xl border border-white/20 p-8 stagger-item">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center float">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Emotional Intensity</h4>
                </div>
                <div className="space-y-4">
                  {comparisonResult.comparison_insights?.emotional_intensity_comparison?.map((item, index) => (
                    <div key={index} className="space-y-2 stagger-item">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700">{item.label}</span>
                        <span className="font-bold text-slate-900">{item.emotional_intensity}%</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg progress-animate"
                            style={{ width: `${Math.min(item.emotional_intensity, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )) || <p className="text-slate-500 text-center py-4">No emotional intensity data available</p>}
                </div>
              </div>

              {/* Propaganda Techniques */}
              <div className="backdrop-blur-sm bg-white/70 rounded-3xl shadow-xl border border-white/20 p-8 stagger-item">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center float">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Propaganda Techniques</h4>
                </div>
                <div className="space-y-4">
                  {comparisonResult.comparison_insights?.propaganda_technique_comparison?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 stagger-item hover:scale-105 transition-transform duration-200">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-amber-600">{item.technique_count}</span>
                        <span className="text-sm text-amber-600">techniques</span>
                      </div>
                    </div>
                  )) || <p className="text-slate-500 text-center py-4">No propaganda technique data available</p>}
                </div>
              </div>
            </div>

            {/* Key Differences */}
            {comparisonResult.comparison_insights?.key_differences?.length > 0 && (
              <div className="backdrop-blur-sm bg-white/70 rounded-3xl shadow-xl border border-white/20 p-8 stagger-item">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center float">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Key Differences</h4>
                </div>
                <div className="space-y-4">
                  {comparisonResult.comparison_insights.key_differences.map((diff, index) => (
                    <div key={index} className="group relative stagger-item">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative backdrop-blur-sm bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 card-hover">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform duration-200">
                            <AlertTriangle className="w-5 h-5 text-white" />
                          </div>
                          <div className="space-y-3">
                            <div className="font-semibold text-yellow-800 text-lg">Significant Risk Difference</div>
                            <div className="text-yellow-700">{diff.description}</div>
                            <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                              Difference: {diff.difference.toFixed(1)} percentage points
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Patterns */}
            {comparisonResult.comparison_insights?.common_patterns?.length > 0 && (
              <div className="backdrop-blur-sm bg-white/70 rounded-3xl shadow-xl border border-white/20 p-8 stagger-item">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center float">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Common Patterns</h4>
                </div>
                <div className="space-y-4">
                  {comparisonResult.comparison_insights.common_patterns.map((pattern, index) => (
                    <div key={index} className="group relative stagger-item">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative backdrop-blur-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 card-hover">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform duration-200">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div className="space-y-3">
                            <div className="font-semibold text-blue-800 text-lg">Shared Propaganda Techniques</div>
                            <div className="space-y-2">
                              {Object.entries(pattern.techniques).map(([technique, texts]) => (
                                <div key={technique} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-sm text-blue-700">
                                    <span className="font-medium">{technique}:</span> {texts.join(', ')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Results Summary */}
            <div className="backdrop-blur-sm bg-white/70 rounded-3xl shadow-xl border border-white/20 p-8 stagger-item">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center float">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Individual Analysis Summary</h4>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {comparisonResult.individual_results?.map((result, index) => (
                  <div key={index} className="group relative stagger-item">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative backdrop-blur-sm bg-white/60 rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 card-hover">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold text-slate-900 text-lg">{result.label}</h5>
                        <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${getRiskColor(result.risk_level)}`}>
                          {result.overall_score}% {result.risk_level.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 hover:scale-105 transition-transform duration-200">
                          <div className="text-2xl font-bold text-blue-600">{result.analysis?.emotional_intensity || 0}%</div>
                          <div className="text-sm text-blue-600">Emotional Intensity</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 hover:scale-105 transition-transform duration-200">
                          <div className="text-2xl font-bold text-amber-600">{result.analysis?.urgency_score || 0}%</div>
                          <div className="text-sm text-amber-600">Urgency Score</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200/50 hover:scale-105 transition-transform duration-200">
                          <div className="text-2xl font-bold text-rose-600">{result.analysis?.propaganda_techniques?.length || 0}</div>
                          <div className="text-sm text-rose-600">Techniques</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )) || <p className="text-slate-500 text-center py-8">No individual results available</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparativeAnalysis;
