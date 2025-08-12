"""
LLM-Powered Primary Analysis Engine
This replaces rule-based detection with sophisticated LLM analysis
"""

import json
import logging
from typing import Dict, Any, List
from datetime import datetime
from llm_service import llm_service

logger = logging.getLogger(__name__)

class LLMPropagandaAnalyzer:
    """Primary LLM-powered propaganda analyzer that handles all detection"""
    
    def __init__(self):
        self.llm_service = llm_service
        
    def analyze_text_comprehensive(self, text: str) -> Dict[str, Any]:
        """Complete LLM-powered analysis - this is the primary analysis method"""
        try:
            logger.info("Starting comprehensive LLM analysis")
            
            # Single comprehensive LLM analysis - gets everything in one call
            comprehensive_analysis = self.llm_service.analyze_comprehensive_single_call(text)
            
            if not comprehensive_analysis.get('success', False):
                logger.warning("Comprehensive LLM analysis failed, using fallback")
                return self._fallback_analysis(text)
            
            # Parse comprehensive LLM response
            llm_data = self._parse_llm_response(comprehensive_analysis.get('content', ''))
            
            if not llm_data:
                logger.warning("LLM response parsing failed, using fallback")
                return self._fallback_analysis(text)
            
            # Extract nested data with fallbacks
            bias_analysis = llm_data.get('bias_analysis', {})
            entity_analysis = llm_data.get('entity_analysis', {})
            technique_explanations = llm_data.get('technique_explanations', {})
            improvement_suggestions = llm_data.get('improvement_suggestions', {})
            
            # Build comprehensive result
            result = {
                'overall_score': llm_data.get('overall_risk_score', 0),
                'risk_level': llm_data.get('risk_level', 'low'),
                'analysis': {
                    'emotional_intensity': llm_data.get('emotional_intensity', 0),
                    'urgency_score': llm_data.get('urgency_score', 0),
                    'ideological_bias': llm_data.get('ideological_bias', 0),
                    'propaganda_techniques': llm_data.get('propaganda_techniques', []),
                    'emotional_triggers': llm_data.get('emotional_triggers', []),
                    'cognitive_biases_exploited': llm_data.get('cognitive_biases_exploited', []),
                    'linguistic_manipulation': llm_data.get('linguistic_manipulation', {}),
                    'named_entities': entity_analysis.get('entities', []),
                    'credibility_assessment': llm_data.get('credibility_assessment', {}),
                    'psychological_analysis': llm_data.get('psychological_analysis', {}),
                    'bias_analysis': bias_analysis,
                    'language_analysis': self._extract_language_stats(text)
                },
                'llm_analysis': {
                    'success': True,
                    'content': llm_data.get('detailed_explanation', 'No explanation available'),
                    'provider': comprehensive_analysis.get('provider', 'unknown'),
                    'model': comprehensive_analysis.get('model', 'unknown'),
                    'tokens_used': comprehensive_analysis.get('tokens_used', 0)
                },
                'technique_explanations': technique_explanations,
                'improvement_suggestions': improvement_suggestions,
                'media_literacy_insights': llm_data.get('media_literacy_insights', ''),
                'highlighted_text': self._highlight_manipulation(text, llm_data),
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info("LLM comprehensive analysis completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"LLM comprehensive analysis failed: {e}")
            return self._fallback_analysis(text)
    
    def _parse_llm_response(self, content: str) -> Dict[str, Any]:
        """Parse JSON response from LLM"""
        try:
            # Clean up the content first
            content = content.strip()
            
            # Try to extract JSON from the response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = content[start_idx:end_idx]
                # Clean up common LLM formatting issues
                json_str = json_str.replace('```json', '').replace('```', '')
                parsed = json.loads(json_str)
                logger.info(f"Successfully parsed LLM JSON response from {json_str[:100]}...")
                return parsed
            
            # If no JSON found, try to parse the whole content
            parsed = json.loads(content)
            logger.info("Successfully parsed full content as JSON")
            return parsed
            
        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse LLM JSON response: {e}")
            logger.debug(f"Content that failed to parse: {content[:500]}...")
            return None
        except Exception as e:
            logger.error(f"Error parsing LLM response: {e}")
            return None
    
    def _parse_entity_analysis(self, content: str) -> Dict[str, Any]:
        """Parse entity analysis from LLM"""
        try:
            data = self._parse_llm_response(content)
            if data and 'entities' in data:
                return data
        except Exception as e:
            logger.warning(f"Failed to parse entity analysis: {e}")
        
        return {'entities': [], 'overall_entity_bias': 'neutral', 'credibility_flags': []}
    
    def _parse_bias_analysis(self, content: str) -> Dict[str, Any]:
        """Parse comprehensive bias analysis from LLM"""
        try:
            data = self._parse_llm_response(content)
            if data:
                return data
        except Exception as e:
            logger.warning(f"Failed to parse bias analysis: {e}")
        
        return {
            'ideological_bias': {'score': 0, 'classification': 'center'},
            'cultural_bias': {'present': False},
            'bias_summary': 'No bias detected'
        }
    
    def _get_educational_content(self, llm_data: Dict[str, Any], text: str) -> Dict[str, Any]:
        """Get educational explanations for detected techniques"""
        try:
            techniques = llm_data.get('propaganda_techniques', [])
            if techniques:
                explanations = self.llm_service.explain_techniques(techniques)
                return explanations
        except Exception as e:
            logger.warning(f"Failed to get educational content: {e}")
        
        return {'success': False, 'content': 'Educational content unavailable'}
    
    def _get_improvement_suggestions(self, text: str, risk_score: float) -> Dict[str, Any]:
        """Get improvement suggestions if text is high risk"""
        try:
            if risk_score > 40:  # Only for medium/high risk content
                suggestions = self.llm_service.suggest_improvements(text, risk_score)
                return suggestions
        except Exception as e:
            logger.warning(f"Failed to get improvement suggestions: {e}")
        
        return {'success': False, 'content': 'Improvement suggestions unavailable'}
    
    def _highlight_manipulation(self, text: str, llm_data: Dict[str, Any]) -> str:
        """Create highlighted text based on LLM findings"""
        highlighted = text
        
        try:
            # Highlight loaded language
            linguistic = llm_data.get('linguistic_manipulation', {})
            loaded_language = linguistic.get('loaded_language', [])
            
            for term in loaded_language:
                if term.lower() in text.lower():
                    highlighted = highlighted.replace(
                        term, 
                        f'<mark class="loaded-language" title="Loaded Language">{term}</mark>'
                    )
            
            # Highlight false urgency
            false_urgency = linguistic.get('false_urgency', [])
            for phrase in false_urgency:
                if phrase.lower() in text.lower():
                    highlighted = highlighted.replace(
                        phrase,
                        f'<mark class="false-urgency" title="False Urgency">{phrase}</mark>'
                    )
            
        except Exception as e:
            logger.warning(f"Failed to highlight text: {e}")
        
        return highlighted
    
    def _extract_language_stats(self, text: str) -> Dict[str, Any]:
        """Extract basic language statistics"""
        import re
        
        words = text.split()
        sentences = re.findall(r'[.!?]+', text)
        
        return {
            'word_count': len(words),
            'sentence_count': len(sentences),
            'avg_sentence_length': len(words) / len(sentences) if sentences else 0,
            'exclamation_count': text.count('!'),
            'question_count': text.count('?'),
            'caps_percentage': round((sum(1 for c in text if c.isupper()) / len(text)) * 100, 2) if text else 0,
            'reading_level': 'Medium'  # Could be enhanced with readability formulas
        }
    
    def _fallback_analysis(self, text: str) -> Dict[str, Any]:
        """Fallback to rule-based analysis if LLM fails"""
        logger.info("Using fallback rule-based analysis")
        
        # Import the original detector for fallback
        from app import PropagandaDetector
        fallback_detector = PropagandaDetector()
        
        try:
            # Use the original analysis but enhance the response format
            result = fallback_detector.analyze_text(text, use_llm=False)
            
            # Enhance with mock LLM-style structure
            result['llm_analysis'] = {
                'success': False,
                'content': 'LLM analysis unavailable - using rule-based detection',
                'provider': 'fallback',
                'model': 'rule-based'
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Even fallback analysis failed: {e}")
            return {
                'error': 'All analysis methods failed',
                'overall_score': 0,
                'risk_level': 'unknown'
            }
    
    def compare_texts_llm(self, texts: List[str], labels: List[str] = None) -> Dict[str, Any]:
        """LLM-powered comparative analysis"""
        try:
            # Analyze each text with LLM
            results = []
            for i, text in enumerate(texts):
                label = labels[i] if labels and i < len(labels) else f"Text {i+1}"
                analysis = self.analyze_text_comprehensive(text)
                analysis['label'] = label
                results.append(analysis)
            
            # Generate LLM-powered comparison insights
            comparison_prompt = f"""
            Compare these {len(texts)} texts for propaganda techniques, bias, and manipulation tactics. 
            
            TEXTS TO COMPARE:
            {chr(10).join([f"{i+1}. {labels[i] if labels else f'Text {i+1}'}: '{text[:200]}...'" for i, text in enumerate(texts)])}
            
            Provide comparative analysis in JSON format:
            {{
              "overall_comparison": "<summary of key differences>",
              "manipulation_ranking": ["<texts ranked by manipulation level>"],
              "common_techniques": ["<techniques used across multiple texts>"],
              "unique_patterns": ["<distinctive manipulation patterns>"],
              "audience_targeting": "<how different texts target different audiences>",
              "sophistication_analysis": "<comparison of manipulation sophistication>",
              "recommendations": "<which texts are most/least trustworthy and why>"
            }}
            
            Focus on providing actionable insights for media literacy.
            """
            
            llm_comparison = self.llm_service._generate_with_fallback(comparison_prompt)
            comparison_insights = self._parse_llm_response(llm_comparison.get('content', '{}'))
            
            return {
                'individual_results': results,
                'llm_comparison_insights': comparison_insights,
                'comparison_insights': self._generate_basic_comparison(results),  # Backup comparison
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"LLM comparative analysis failed: {e}")
            # Fallback to basic comparison
            return self._fallback_comparison(texts, labels)
    
    def _generate_basic_comparison(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate basic comparison insights from individual results"""
        risk_comparison = []
        for result in results:
            risk_comparison.append({
                'label': result.get('label', 'Unknown'),
                'overall_score': result.get('overall_score', 0),
                'risk_level': result.get('risk_level', 'unknown')
            })
        
        risk_comparison.sort(key=lambda x: x['overall_score'], reverse=True)
        
        return {
            'risk_comparison': risk_comparison,
            'key_differences': [],
            'common_patterns': []
        }
    
    def _fallback_comparison(self, texts: List[str], labels: List[str] = None) -> Dict[str, Any]:
        """Fallback comparison using rule-based analysis"""
        from app import PropagandaDetector
        fallback_detector = PropagandaDetector()
        
        return fallback_detector.compare_texts(texts, labels, use_llm=False)

# Global LLM analyzer instance
llm_analyzer = LLMPropagandaAnalyzer()
