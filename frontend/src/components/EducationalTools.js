import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Award,
  Lightbulb,
  Target,
  Brain
} from 'lucide-react';

const EducationalTools = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const propagandaTechniques = [
    {
      name: "Bandwagon Appeal",
      description: "Encourages people to follow the crowd or join the majority",
      examples: ["Everyone is doing it", "Join the millions who...", "Don't be left behind"],
      psychology: "Exploits the human need to belong and fear of social isolation",
      defense: "Ask: Is popularity a good measure of truth or quality?"
    },
    {
      name: "Fear Mongering",
      description: "Uses fear to persuade by emphasizing potential dangers",
      examples: ["If we don't act now, disaster will strike", "They're coming for you", "Time is running out"],
      psychology: "Triggers fight-or-flight response, bypassing rational thinking",
      defense: "Evaluate claims objectively. Ask for evidence of the supposed threat."
    },
    {
      name: "Appeal to Authority",
      description: "Claims something is true because an authority figure says so",
      examples: ["Experts agree", "Studies show", "Doctors recommend"],
      psychology: "Leverages respect for expertise and social hierarchy",
      defense: "Check credentials, look for consensus, verify sources independently."
    },
    {
      name: "Loaded Language",
      description: "Uses emotionally charged words to influence opinion",
      examples: ["Devastating", "Outrageous", "Incredible", "Shocking"],
      psychology: "Bypasses critical thinking by triggering emotional responses",
      defense: "Focus on facts, not emotional language. Rephrase in neutral terms."
    },
    {
      name: "False Dilemma",
      description: "Presents only two options when more exist",
      examples: ["You're either with us or against us", "It's now or never"],
      psychology: "Simplifies complex issues, forces quick decisions",
      defense: "Look for additional options and middle-ground solutions."
    },
    {
      name: "Strawman Argument",
      description: "Misrepresents someone's position to make it easier to attack",
      examples: ["They want to destroy our way of life", "Critics claim we should do nothing"],
      psychology: "Makes opposition seem unreasonable or extreme",
      defense: "Seek out the actual positions being criticized, not summaries."
    }
  ];

  const quizQuestions = [
    {
      question: "Which propaganda technique is being used: 'Everyone knows this is the best product!'",
      options: ["Fear Mongering", "Bandwagon Appeal", "Loaded Language", "Appeal to Authority"],
      correct: 1,
      explanation: "This uses bandwagon appeal by claiming 'everyone knows' to pressure you to join the majority."
    },
    {
      question: "What should you do when you see emotionally charged language in an article?",
      options: [
        "Trust it because emotions show passion",
        "Ignore the content completely", 
        "Focus on the facts and rephrase in neutral terms",
        "Share it immediately"
      ],
      correct: 2,
      explanation: "Emotionally charged language can cloud judgment. Focus on factual content and neutral phrasing."
    },
    {
      question: "A headline reads: 'SHOCKING: Scientists discover dangerous truth!' What techniques are used?",
      options: [
        "Only Appeal to Authority",
        "Loaded Language and Appeal to Authority", 
        "Only Fear Mongering",
        "Bandwagon Appeal"
      ],
      correct: 1,
      explanation: "Uses loaded language ('SHOCKING', 'dangerous') and appeals to scientific authority."
    },
    {
      question: "How can you defend against the 'False Dilemma' technique?",
      options: [
        "Choose one of the two options quickly",
        "Always pick the first option",
        "Look for additional options and middle-ground solutions",
        "Ignore the issue completely"
      ],
      correct: 2,
      explanation: "False dilemmas limit your choices. Always look for additional options or compromise solutions."
    }
  ];

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const submitQuiz = () => {
    setShowQuizResults(true);
  };

  const getQuizScore = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowQuizResults(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-3">
          <Brain className="w-8 h-8 text-primary-600" />
          <span>Media Literacy Education Center</span>
        </h1>
        
        <nav className="flex space-x-4 border-b">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'techniques', label: 'Propaganda Techniques', icon: Target },
            { id: 'quiz', label: 'Knowledge Quiz', icon: Award },
            { id: 'tips', label: 'Defense Strategies', icon: Lightbulb }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeSection === id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Understanding Media Manipulation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">What is Propaganda?</h3>
              <p className="text-gray-700 mb-4">
                Propaganda is information designed to influence public opinion through emotional appeal 
                rather than rational argument. It often uses psychological techniques to bypass critical thinking.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-3">Why Learn About It?</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Develop critical thinking skills</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Make more informed decisions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Resist manipulation attempts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Promote democratic discourse</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Key Principles</h3>
              <div className="space-y-3 text-blue-800">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-900 font-bold text-sm mt-0.5">1</div>
                  <span>Question emotional appeals - focus on facts</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-900 font-bold text-sm mt-0.5">2</div>
                  <span>Verify sources and check credentials</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-900 font-bold text-sm mt-0.5">3</div>
                  <span>Seek multiple perspectives on important issues</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-900 font-bold text-sm mt-0.5">4</div>
                  <span>Be aware of your own biases and emotions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Techniques Section */}
      {activeSection === 'techniques' && (
        <div className="space-y-4">
          {propagandaTechniques.map((technique, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{technique.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600">{technique.description}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Common Examples</h4>
                    <ul className="space-y-1">
                      {technique.examples.map((example, i) => (
                        <li key={i} className="text-gray-600 text-sm">
                          ""{example}""
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Psychology Behind It</h4>
                    <p className="text-gray-600 text-sm">{technique.psychology}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2 flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4" />
                      <span>How to Defend</span>
                    </h4>
                    <p className="text-green-700 text-sm">{technique.defense}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiz Section */}
      {activeSection === 'quiz' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Your Knowledge</h2>
          
          {!showQuizResults ? (
            <div className="space-y-6">
              {quizQuestions.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Question {index + 1}: {question.question}
                  </h3>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optionIndex}
                          checked={quizAnswers[index] === optionIndex}
                          onChange={() => handleQuizAnswer(index, optionIndex)}
                          className="text-primary-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              <button
                onClick={submitQuiz}
                disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Award className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                <p className="text-xl text-gray-700">
                  You scored {getQuizScore()} out of {quizQuestions.length}
                </p>
                <div className="mt-4">
                  {getQuizScore() === quizQuestions.length && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Perfect Score! 🎉
                    </span>
                  )}
                  {getQuizScore() >= quizQuestions.length * 0.7 && getQuizScore() < quizQuestions.length && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Good Job! 👍
                    </span>
                  )}
                  {getQuizScore() < quizQuestions.length * 0.7 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Keep Learning! 📚
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Review Your Answers</h4>
                {quizQuestions.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Question {index + 1}</h5>
                    <p className="text-gray-700 mb-3">{question.question}</p>
                    
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-2">
                        {quizAnswers[index] === question.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm text-gray-600">
                          Your answer: {question.options[quizAnswers[index]]}
                        </span>
                      </div>
                    </div>
                    
                    {quizAnswers[index] !== question.correct && (
                      <div className="text-sm text-green-700 mb-2">
                        Correct answer: {question.options[question.correct]}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={resetQuiz}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Take Quiz Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tips Section */}
      {activeSection === 'tips' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Defense Strategies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Before Reading</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <div className="font-medium text-gray-900">Check the Source</div>
                    <div className="text-sm text-gray-600">Who wrote this? What's their reputation and expertise?</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <div className="font-medium text-gray-900">Consider the Purpose</div>
                    <div className="text-sm text-gray-600">What is the author trying to achieve? Inform, persuade, or sell?</div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mt-6">While Reading</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <div className="font-medium text-gray-900">Watch for Emotional Language</div>
                    <div className="text-sm text-gray-600">Strong emotions can cloud judgment. Focus on facts.</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm mt-0.5">4</div>
                  <div>
                    <div className="font-medium text-gray-900">Question Claims</div>
                    <div className="text-sm text-gray-600">Ask: What evidence supports this? Are there alternative explanations?</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">After Reading</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm mt-0.5">5</div>
                  <div>
                    <div className="font-medium text-gray-900">Verify Information</div>
                    <div className="text-sm text-gray-600">Cross-check facts with multiple reliable sources.</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm mt-0.5">6</div>
                  <div>
                    <div className="font-medium text-gray-900">Seek Other Perspectives</div>
                    <div className="text-sm text-gray-600">What do critics or opposing viewpoints say?</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                <h4 className="font-medium text-yellow-800 mb-2">Red Flags to Watch For</h4>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• Claims of "hidden truths" or secret knowledge</li>
                  <li>• Pressure to act immediately without time to think</li>
                  <li>• Attacks on those who question or disagree</li>
                  <li>• Oversimplified solutions to complex problems</li>
                  <li>• Appeal to fear, anger, or pride over facts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalTools;
