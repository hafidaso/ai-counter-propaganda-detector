import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Zap, 
  MessageSquare,
  BarChart3,
  Info,
  Brain,
  Lightbulb,
  BookOpen,
  Target,
  Activity,
  CheckCircle
} from 'lucide-react';

const AnalysisResults = ({ result }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!result || !result.analysis) {
    return null;
  }

  const { analysis } = result;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, description: 'Key metrics and scores' },
    { id: 'propaganda', label: 'Propaganda Techniques', icon: AlertTriangle, description: 'Detected manipulation tactics' },
    { id: 'entities', label: 'Named Entities', icon: Users, description: 'People, places, and organizations' },
    { id: 'language', label: 'Language Analysis', icon: MessageSquare, description: 'Text statistics and patterns' },
    ...(result.llm_analysis ? [{ id: 'llm', label: 'AI Analysis', icon: Brain, description: 'Advanced AI insights' }] : []),
    ...(result.technique_explanations ? [{ id: 'explanations', label: 'Explanations', icon: BookOpen, description: 'Learn about techniques' }] : []),
    ...(result.improvement_suggestions ? [{ id: 'suggestions', label: 'Suggestions', icon: Lightbulb, description: 'Improvement tips' }] : []),
  ];

  const getScoreColor = (score, isReverse = false) => {
    if (isReverse) {
      if (score < 34) return 'text-danger-600';
      if (score < 67) return 'text-warning-600';
      return 'text-success-600';
    }
    if (score < 34) return 'text-success-600';
    if (score < 67) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getScoreBg = (score, isReverse = false) => {
    if (isReverse) {
      if (score < 34) return 'bg-danger-50 border-danger-200';
      if (score < 67) return 'bg-warning-50 border-warning-200';
      return 'bg-success-50 border-success-200';
    }
    if (score < 34) return 'bg-success-50 border-success-200';
    if (score < 67) return 'bg-warning-50 border-warning-200';
    return 'bg-danger-50 border-danger-200';
  };

  const MetricCard = ({ title, value, description, icon: Icon, score, isReverse = false }) => (
    <div className={`card p-6 border-2 ${getScoreBg(score, isReverse)} group hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isReverse ? 
              (score < 34 ? 'bg-danger-100' : score < 67 ? 'bg-warning-100' : 'bg-success-100') :
              (score < 34 ? 'bg-success-100' : score < 67 ? 'bg-warning-100' : 'bg-danger-100')
          }`}>
            <Icon className={`w-5 h-5 ${
              isReverse ? 
                (score < 34 ? 'text-danger-600' : score < 67 ? 'text-warning-600' : 'text-success-600') :
                (score < 34 ? 'text-success-600' : score < 67 ? 'text-warning-600' : 'text-danger-600')
            }`} />
          </div>
          <span className="font-semibold text-secondary-900">{title}</span>
        </div>
        <span className={`text-3xl font-bold ${getScoreColor(score, isReverse)}`}>
          {value}
        </span>
      </div>
      <p className="text-secondary-600 leading-relaxed">{description}</p>
    </div>
  );

  const BiasIndicator = ({ score }) => {
    const position = ((score + 100) / 200) * 100; // Convert -100 to +100 to 0 to 100%
    
    return (
      <div className="card p-6 space-y-4">
        <h4 className="text-lg font-semibold text-secondary-900 flex items-center space-x-2">
          <Target className="w-5 h-5 text-primary-600" />
          <span>Ideological Bias Analysis</span>
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-secondary-600 font-medium">
            <span>Left-leaning</span>
            <span>Neutral</span>
            <span>Right-leaning</span>
          </div>
          <div className="relative h-6 bg-gradient-to-r from-blue-200 via-secondary-200 to-red-200 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 w-4 h-6 bg-secondary-800 rounded-full transform -translate-x-1/2 shadow-lg"
              style={{ left: `${position}%` }}
            />
          </div>
          <div className="text-center">
            <span className={`text-lg font-bold ${Math.abs(score) > 30 ? 'text-warning-600' : 'text-secondary-600'}`}>
              {score === 0 ? 'Neutral' : score > 0 ? `+${score}` : score} bias score
            </span>
            <p className="text-sm text-secondary-500 mt-1">
              {Math.abs(score) > 50 ? 'Strong bias detected' : 
               Math.abs(score) > 20 ? 'Moderate bias detected' : 'Minimal bias detected'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card-elevated overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-secondary-50 border-b border-secondary-200">
        <nav className="px-6 overflow-x-auto" aria-label="Tabs">
          <div className="nav-tab-container">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-tab flex-shrink-0 ${
                    activeTab === tab.id ? 'nav-tab-active' : 'nav-tab-inactive'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <span className="font-semibold whitespace-nowrap">{tab.label}</span>
                    <p className="text-xs text-secondary-500 hidden lg:block truncate">{tab.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-secondary-900">Analysis Overview</h3>
              <p className="text-secondary-600 max-w-2xl mx-auto">
                Comprehensive analysis of propaganda techniques, emotional manipulation, and bias indicators
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard
                title="Emotional Intensity"
                value={`${analysis.emotional_intensity}%`}
                description="Measures emotional manipulation and charged language patterns"
                icon={TrendingUp}
                score={analysis.emotional_intensity}
              />
              
              <MetricCard
                title="Urgency Score"
                value={`${analysis.urgency_score}%`}
                description="Detects artificial urgency and pressure tactics"
                icon={Zap}
                score={analysis.urgency_score}
              />
            </div>

            <BiasIndicator score={analysis.ideological_bias} />

            {analysis.sentiment_breakdown && (
              <div className="card p-6">
                <h4 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center justify-center space-x-2">
                  <Activity className="w-5 h-5 text-primary-600" />
                  <span>Sentiment Breakdown</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(analysis.sentiment_breakdown).map(([sentiment, score]) => (
                    <div key={sentiment} className="text-center p-4 bg-secondary-50 rounded-xl">
                      <div className="text-3xl font-bold text-secondary-900 mb-2">
                        {(score * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-secondary-600 capitalize font-medium">
                        {sentiment.replace('LABEL_', '').replace('0', 'Negative').replace('1', 'Neutral').replace('2', 'Positive')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'propaganda' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-secondary-900">Propaganda Techniques Detected</h3>
              <p className="text-secondary-600 max-w-2xl mx-auto">
                Analysis of manipulation tactics and psychological triggers found in the text
              </p>
            </div>
            
            {analysis.propaganda_techniques && analysis.propaganda_techniques.length > 0 ? (
              <div className="space-y-6">
                {analysis.propaganda_techniques.map((technique, index) => (
                  <div key={index} className="card border-l-4 border-warning-500 p-6 group hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-warning-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-warning-900 text-lg">{technique.technique}</h4>
                          <p className="text-warning-700 text-sm">Propaganda technique detected</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="badge badge-warning font-semibold">
                          {(technique.confidence * 100).toFixed(0)}% confidence
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {technique.evidence && (
                        <div className="bg-warning-50 p-4 rounded-xl border border-warning-200">
                          <p className="text-sm text-warning-800">
                            <strong>Evidence:</strong> "<em>{technique.evidence}</em>"
                          </p>
                        </div>
                      )}
                      
                      {technique.keyword && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-warning-700 font-medium">Keyword:</span>
                          <span className="badge badge-warning">{technique.keyword}</span>
                        </div>
                      )}
                      
                      {technique.psychological_impact && (
                        <div className="bg-secondary-50 p-3 rounded-lg">
                          <p className="text-xs text-secondary-700">
                            <strong>Psychological Impact:</strong> {technique.psychological_impact}
                          </p>
                        </div>
                      )}
                      
                      {technique.positions && technique.positions.length > 0 && (
                        <div className="text-xs text-secondary-600">
                          <strong>Positions:</strong> {technique.positions.map(pos => 
                            `${pos.start}-${pos.end}`
                          ).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-success-600" />
                </div>
                <h4 className="text-xl font-semibold text-success-800 mb-2">No Propaganda Techniques Detected</h4>
                <p className="text-success-600 max-w-md mx-auto">
                  This text appears to be free from common propaganda techniques. However, this doesn't guarantee the content is unbiased.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'entities' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-secondary-900">Named Entities</h3>
              <p className="text-secondary-600 max-w-2xl mx-auto">
                People, places, organizations, and other entities mentioned in the text
              </p>
            </div>
            
            {analysis.named_entities && analysis.named_entities.length > 0 ? (
              <div className="space-y-6">
                {/* Group entities by type for display */}
                {Object.entries(
                  analysis.named_entities.reduce((groups, entity) => {
                    const type = entity.type || 'OTHER';
                    if (!groups[type]) groups[type] = [];
                    groups[type].push(entity);
                    return groups;
                  }, {})
                ).map(([entityType, entities]) => (
                  <div key={entityType} className="card p-6">
                    <h4 className="font-semibold text-secondary-900 mb-4 flex items-center space-x-2">
                      <Users className="w-5 h-5 text-primary-600" />
                      <span>{entityType} ({entities.length})</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {entities.map((entity, index) => (
                        <div
                          key={index}
                          className="bg-primary-50 border border-primary-200 rounded-xl p-4 hover:bg-primary-100 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-primary-900">
                              {entity.entity}
                            </span>
                            <span className={`badge ${
                              entity.sentiment_context === 'positive' ? 'badge-success' :
                              entity.sentiment_context === 'negative' ? 'badge-danger' :
                              'badge-info'
                            }`}>
                              {entity.sentiment_context || 'neutral'}
                            </span>
                          </div>
                          {entity.framing_analysis && (
                            <p className="text-sm text-secondary-600">
                              {entity.framing_analysis}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-secondary-600" />
                </div>
                <h4 className="text-xl font-semibold text-secondary-800 mb-2">No Named Entities Detected</h4>
                <p className="text-secondary-600 max-w-md mx-auto">
                  This text doesn't contain specific named entities like people, places, or organizations.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'language' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-secondary-900">Language Analysis</h3>
              <p className="text-secondary-600 max-w-2xl mx-auto">
                Detailed analysis of text structure, readability, and linguistic patterns
              </p>
            </div>
            
            {analysis.language_analysis && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6">
                  <h4 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-primary-600" />
                    <span>Text Statistics</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                      <span className="text-secondary-600 font-medium">Word Count:</span>
                      <span className="font-bold text-secondary-900">{analysis.language_analysis.word_count}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                      <span className="text-secondary-600 font-medium">Sentences:</span>
                      <span className="font-bold text-secondary-900">{analysis.language_analysis.sentence_count}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                      <span className="text-secondary-600 font-medium">Avg. Sentence Length:</span>
                      <span className="font-bold text-secondary-900">
                        {analysis.language_analysis.avg_sentence_length?.toFixed(1)} words
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                      <span className="text-secondary-600 font-medium">Reading Level:</span>
                      <span className="font-bold text-secondary-900">{analysis.language_analysis.reading_level}</span>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h4 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-primary-600" />
                    <span>Emotional Markers</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                      <span className="text-secondary-600 font-medium">Exclamation Points:</span>
                      <span className="font-bold text-secondary-900">{analysis.language_analysis.exclamation_count}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                      <span className="text-secondary-600 font-medium">Question Marks:</span>
                      <span className="font-bold text-secondary-900">{analysis.language_analysis.question_count}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                      <span className="text-secondary-600 font-medium">Capital Letters:</span>
                      <span className="font-bold text-secondary-900">{analysis.language_analysis.caps_percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'llm' && result.llm_analysis && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-secondary-900">Advanced AI Analysis</h3>
              <p className="text-secondary-600 max-w-2xl mx-auto">
                Deep insights powered by large language models for comprehensive content evaluation
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Brain className="w-6 h-6 text-primary-600" />
              <span className="text-lg text-secondary-600">
                Powered by {result.llm_analysis.provider || 'Advanced AI'}
              </span>
            </div>
            
            {result.llm_analysis.success ? (
              <div className="card p-6">
                <div className="prose max-w-none">
                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
                    <div className="whitespace-pre-wrap text-secondary-700 leading-relaxed">
                      {result.llm_analysis.content}
                    </div>
                  </div>
                  
                  {result.llm_analysis.tokens_used && (
                    <div className="text-sm text-secondary-500 mt-4 text-center">
                      Analysis used {result.llm_analysis.tokens_used} tokens
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card p-6 border-l-4 border-warning-500">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-warning-600" />
                  <span className="font-semibold text-warning-800 text-lg">LLM Analysis Unavailable</span>
                </div>
                <p className="text-warning-700 mt-2">
                  {result.llm_analysis.error || 'Advanced AI analysis could not be completed at this time.'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'explanations' && result.technique_explanations && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-secondary-900">Technique Explanations</h3>
              <p className="text-secondary-600 max-w-2xl mx-auto">
                Educational insights about detected propaganda techniques and manipulation tactics
              </p>
            </div>
            
            {result.technique_explanations.success ? (
              <div className="card p-6">
                <div className="prose max-w-none">
                  <div className="bg-success-50 border border-success-200 rounded-xl p-6">
                    <div className="whitespace-pre-wrap text-secondary-700 leading-relaxed">
                      {result.technique_explanations.content}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6 border-l-4 border-warning-500">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-warning-600" />
                  <span className="font-semibold text-warning-800 text-lg">Explanations Unavailable</span>
                </div>
                <p className="text-warning-700 mt-2">
                  Could not generate detailed explanations at this time. Please try again later.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'suggestions' && result.improvement_suggestions && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-secondary-900">Improvement Suggestions</h3>
              <p className="text-secondary-600 max-w-2xl mx-auto">
                Actionable tips to improve content quality and reduce bias indicators
              </p>
            </div>
            
            {result.improvement_suggestions.success ? (
              <div className="card p-6">
                <div className="prose max-w-none">
                  <div className="bg-accent-50 border border-accent-200 rounded-xl p-6">
                    <div className="whitespace-pre-wrap text-secondary-700 leading-relaxed">
                      {result.improvement_suggestions.content}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6 border-l-4 border-warning-500">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-warning-600" />
                  <span className="font-semibold text-warning-800 text-lg">Suggestions Unavailable</span>
                </div>
                <p className="text-warning-700 mt-2">
                  Could not generate improvement suggestions at this time. Please try again later.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Information Panel */}
      <div className="bg-secondary-50 px-8 py-6 border-t border-secondary-200">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-primary-600" />
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-secondary-900 text-lg">How to interpret these results:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary-600">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Higher scores indicate stronger presence of bias indicators or manipulation techniques</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Results are based on pattern recognition and should be combined with human judgment</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Absence of detected patterns doesn't guarantee content neutrality</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Consider context, source credibility, and multiple perspectives when evaluating content</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
