from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import spacy
from datetime import datetime
import logging
import os
from dotenv import load_dotenv

# gotta load these first so the API keys are ready
load_dotenv()

# now we can import the LLM stuff safely
from llm_service import LLMService
from llm_analyzer import LLMPropagandaAnalyzer

# these heavy ML libraries - only import when we actually need them
def _import_heavy_deps():
    """grab the heavy ML stuff only when fallback analysis kicks in"""
    try:
        import torch
        from transformers import pipeline
        import numpy as np
        return torch, pipeline, np
    except ImportError as e:
        logging.warning(f"heavy ML stuff not available: {e}")
        return None, None, None

# set up the Flask app
app = Flask(__name__)
CORS(app)

# logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# get the LLM services ready
llm_service = LLMService()
llm_analyzer = LLMPropagandaAnalyzer()

class PropagandaDetector:
    def __init__(self):
        self.models_loaded = False
        self.load_models()
        
    def load_models(self):
        """load models only when we need them - LLM analysis is the priority"""
        try:
            logger.info("setting up the detector (models load on-demand)...")
            
            # lazy loading - models only load when fallback analysis is needed
            self.sentiment_pipeline = None
            self.ner_pipeline = None
            self.nlp = None
            
            # try to load spaCy for basic text analysis (it's lightweight)
            try:
                self.nlp = spacy.load("en_core_web_sm")
                logger.info("✅ spaCy model loaded")
            except OSError:
                logger.warning("spaCy model not found - will use basic text analysis only")
                self.nlp = None
            
            # these are the keywords and patterns we look for to detect bias
            self.bias_keywords = {
                'emotional_high': ['outrageous', 'shocking', 'devastating', 'incredible', 'unbelievable', 'terrifying', 'catastrophic', 'nightmare', 'horrifying', 'appalling'],
                'emotional_medium': ['concerning', 'troubling', 'alarming', 'disturbing', 'unsettling', 'worrying', 'dangerous', 'serious', 'critical'],
                'emotional_subtle': ['questionable', 'problematic', 'unfortunate', 'disappointing', 'misleading', 'concerning', 'notable'],
                'urgency_high': ['immediately', 'urgent', 'crisis', 'emergency', 'act now', 'time is running out', 'before it\'s too late', 'right now', 'this instant'],
                'urgency_medium': ['soon', 'quickly', 'don\'t delay', 'limited time', 'hurry', 'fast', 'prompt action', 'time-sensitive'],
                'urgency_subtle': ['consider', 'think about', 'when convenient', 'at your earliest', 'worth noting', 'keep in mind'],
                'fear_triggers': ['threat', 'danger', 'risk', 'harm', 'damage', 'destroy', 'ruin', 'collapse', 'failure', 'loss', 'attack', 'invasion'],
                'loaded': ['terrorist', 'extremist', 'radical', 'dangerous', 'threat', 'enemy', 'traitor', 'corrupt', 'evil', 'villain'],
                'absolute': ['always', 'never', 'all', 'none', 'every', 'completely', 'totally', 'entirely', 'absolutely', 'definitely', 'certainly']
            }
            
            # propaganda techniques we're looking for
            self.propaganda_techniques = {
                'bandwagon': ['everyone', 'popular', 'trending', 'majority', 'most people', 'standing united', 'unite', 'together'],
                'fear_mongering': ['dangerous', 'threat', 'risk', 'fear', 'scared', 'terrifying', 'too late', 'before it\'s too late'],
                'strawman': ['claims that', 'says that', 'believes that', 'thinks that'],
                'loaded_language': ['devastating', 'outrageous', 'shocking', 'incredible', 'lies', 'hiding the truth', 'expose'],
                'appeal_to_authority': ['experts say', 'studies show', 'research proves', 'scientists agree'],
                'conspiracy_theory': ['hiding', 'cover up', 'conspiracy', 'truth', 'they don\'t want you to know'],
                'call_to_action': ['act now', 'take action', 'stand up', 'fight back', 'protect'],
                'us_vs_them': ['our freedom', 'our rights', 'they', 'them', 'the government', 'establishment']
            }
            
            self.models_loaded = True
            logger.info("detector is ready to go!")
            
        except Exception as e:
            logger.error(f"oops, error setting up detector: {e}")
            self.models_loaded = False
    
    def _ensure_heavy_models_loaded(self):
        """load the heavy ML models only when we need them for fallback"""
        if self.sentiment_pipeline is None or self.ner_pipeline is None:
            logger.info("loading heavy ML models for fallback analysis...")
            torch, pipeline_func, np = _import_heavy_deps()
            
            if pipeline_func is None:
                logger.error("cannot load heavy models - transformers not available")
                return False
            
            try:
                # sentiment analysis using Twitter RoBERTa
                self.sentiment_pipeline = pipeline_func(
                    "sentiment-analysis",
                    model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                    return_all_scores=True
                )
                
                # named entity recognition
                self.ner_pipeline = pipeline_func(
                    "ner",
                    model="dbmdz/bert-large-cased-finetuned-conll03-english",
                    aggregation_strategy="simple"
                )
                
                logger.info("✅ heavy ML models loaded successfully")
                return True
                
            except Exception as e:
                logger.error(f"failed to load heavy models: {e}")
                return False
        
        return True
    
    def analyze_sentiment(self, text):
        """figure out the emotional intensity and sentiment of the text"""
        try:
            # make sure we have the heavy models loaded for fallback
            if not self._ensure_heavy_models_loaded():
                logger.warning("sentiment analysis unavailable - using basic emotional analysis")
                return self._basic_emotional_analysis(text)
                
            results = self.sentiment_pipeline(text)
            
            # grab the sentiment scores
            sentiment_scores = {}
            for result in results[0]:
                sentiment_scores[result['label']] = result['score']
            
            # calculate base emotional intensity from the sentiment model
            positive_score = sentiment_scores.get('LABEL_2', 0)  # positive
            negative_score = sentiment_scores.get('LABEL_0', 0)  # negative
            base_intensity = max(positive_score, negative_score) * 100
            
            # enhanced emotional intensity with keyword analysis
            enhanced_intensity = self.calculate_enhanced_emotional_intensity(text, base_intensity)
            
            return {
                'emotional_intensity': round(enhanced_intensity, 2),
                'base_sentiment_intensity': round(base_intensity, 2),
                'sentiment_breakdown': sentiment_scores,
                'emotional_analysis': self.analyze_emotional_triggers(text)
            }
        except Exception as e:
            logger.error(f"Sentiment analysis error: {e}")
            return self._basic_emotional_analysis(text)
    
    def _basic_emotional_analysis(self, text):
        """Basic emotional analysis without heavy ML models"""
        text_lower = text.lower()
        
        # Simple keyword-based emotional intensity
        emotional_keywords = self.bias_keywords.get('emotional_high', []) + \
                           self.bias_keywords.get('emotional_medium', []) + \
                           self.bias_keywords.get('urgency_high', [])
        
        emotion_count = sum(1 for keyword in emotional_keywords if keyword in text_lower)
        basic_intensity = min(emotion_count * 15, 100)  # Cap at 100
        
        return {
            'emotional_intensity': basic_intensity,
            'base_sentiment_intensity': basic_intensity,
            'sentiment_breakdown': {'positive': 0.3, 'neutral': 0.4, 'negative': 0.3},
            'emotional_analysis': self.analyze_emotional_triggers(text)
        }
    
    def calculate_enhanced_emotional_intensity(self, text, base_intensity):
        """Calculate enhanced emotional intensity considering subtle triggers"""
        text_lower = text.lower()
        intensity_score = base_intensity
        
        # Weight factors for different emotional categories
        weights = {
            'emotional_high': 25,
            'emotional_medium': 15,
            'emotional_subtle': 8,
            'urgency_high': 20,
            'urgency_medium': 12,
            'urgency_subtle': 5,
            'fear_triggers': 18,
            'loaded': 15,
            'absolute': 10
        }
        
        # Count occurrences and calculate weighted score
        for category, keywords in self.bias_keywords.items():
            if category in weights:
                count = sum(1 for keyword in keywords if keyword in text_lower)
                if count > 0:
                    # Apply diminishing returns for multiple occurrences
                    weighted_score = weights[category] * min(count, 3) * (0.8 ** max(0, count - 1))
                    intensity_score += weighted_score
        
        # Cap at 100 but allow for detection of extreme cases
        return min(intensity_score, 100)
    
    def analyze_emotional_triggers(self, text):
        """Detailed analysis of emotional triggers and their psychological impact"""
        text_lower = text.lower()
        triggers = {
            'fear_appeals': [],
            'urgency_markers': [],
            'emotional_language': [],
            'psychological_pressure': []
        }
        
        # Analyze fear appeals
        for keyword in self.bias_keywords['fear_triggers']:
            if keyword in text_lower:
                triggers['fear_appeals'].append({
                    'trigger': keyword,
                    'impact': 'Exploits anxiety and threat perception',
                    'positions': self.find_keyword_positions(text_lower, keyword)
                })
        
        # Analyze urgency markers
        for category in ['urgency_high', 'urgency_medium', 'urgency_subtle']:
            for keyword in self.bias_keywords[category]:
                if keyword in text_lower:
                    intensity = category.split('_')[1]
                    triggers['urgency_markers'].append({
                        'trigger': keyword,
                        'intensity': intensity,
                        'impact': f'Creates {intensity} pressure for immediate action',
                        'positions': self.find_keyword_positions(text_lower, keyword)
                    })
        
        # Analyze emotional language
        for category in ['emotional_high', 'emotional_medium', 'emotional_subtle']:
            for keyword in self.bias_keywords[category]:
                if keyword in text_lower:
                    intensity = category.split('_')[1]
                    triggers['emotional_language'].append({
                        'trigger': keyword,
                        'intensity': intensity,
                        'impact': f'Bypasses rational thinking with {intensity} emotional appeal',
                        'positions': self.find_keyword_positions(text_lower, keyword)
                    })
        
        # Analyze psychological pressure techniques
        for keyword in self.bias_keywords['absolute']:
            if keyword in text_lower:
                triggers['psychological_pressure'].append({
                    'trigger': keyword,
                    'impact': 'Uses absolute statements to discourage critical thinking',
                    'positions': self.find_keyword_positions(text_lower, keyword)
                })
        
        return triggers
    
    def find_keyword_positions(self, text, keyword):
        """Find all positions of a keyword in text"""
        positions = []
        start = 0
        while True:
            pos = text.find(keyword, start)
            if pos == -1:
                break
            positions.append({'start': pos, 'end': pos + len(keyword)})
            start = pos + 1
        return positions
    
    def detect_propaganda_techniques(self, text):
        """Detect propaganda techniques in text"""
        detected = []
        text_lower = text.lower()
        
        for technique, keywords in self.propaganda_techniques.items():
            for keyword in keywords:
                if keyword in text_lower:
                    # Find positions of the keyword
                    positions = []
                    start = 0
                    while True:
                        pos = text_lower.find(keyword, start)
                        if pos == -1:
                            break
                        positions.append({'start': pos, 'end': pos + len(keyword)})
                        start = pos + 1
                    
                    if positions:
                        detected.append({
                            'technique': technique.replace('_', ' ').title(),
                            'keyword': keyword,
                            'confidence': 0.8,  # Static confidence for demo
                            'positions': positions
                        })
        
        return detected
    
    def analyze_bias(self, text):
        """Analyze ideological bias in text"""
        # Simple keyword-based bias detection
        left_keywords = ['progressive', 'liberal', 'equality', 'social justice', 'reform']
        right_keywords = ['conservative', 'traditional', 'law and order', 'free market', 'patriot']
        
        text_lower = text.lower()
        left_count = sum(1 for keyword in left_keywords if keyword in text_lower)
        right_count = sum(1 for keyword in right_keywords if keyword in text_lower)
        
        # Calculate bias score (-100 to +100)
        total_bias_indicators = left_count + right_count
        if total_bias_indicators == 0:
            bias_score = 0
        else:
            bias_score = ((right_count - left_count) / total_bias_indicators) * 100
        
        return round(bias_score, 2)
    
    def analyze_urgency(self, text):
        """Enhanced urgency analysis with weighted scoring"""
        urgency_score = 0
        text_lower = text.lower()
        
        # Weight different urgency levels
        urgency_weights = {
            'urgency_high': 25,
            'urgency_medium': 15,
            'urgency_subtle': 8
        }
        
        for category, weight in urgency_weights.items():
            if category in self.bias_keywords:
                for keyword in self.bias_keywords[category]:
                    count = text_lower.count(keyword)
                    if count > 0:
                        # Apply diminishing returns for multiple occurrences
                        score_addition = weight * min(count, 3) * (0.9 ** max(0, count - 1))
                        urgency_score += score_addition
        
        # Cap at 100
        return min(urgency_score, 100)
    
    def extract_entities(self, text):
        """Extract named entities from text"""
        try:
            # Ensure heavy models are loaded for fallback analysis
            if not self._ensure_heavy_models_loaded():
                logger.warning("NER unavailable - using basic entity detection")
                return self._basic_entity_extraction(text)
                
            entities = self.ner_pipeline(text)
            
            # Group entities by type
            entity_groups = {}
            for entity in entities:
                entity_type = entity['entity_group']
                if entity_type not in entity_groups:
                    entity_groups[entity_type] = []
                
                entity_groups[entity_type].append({
                    'text': entity['word'],
                    'confidence': round(entity['score'], 3),
                    'start': entity['start'],
                    'end': entity['end']
                })
            
            return entity_groups
            
        except Exception as e:
            logger.error(f"NER error: {e}")
            return self._basic_entity_extraction(text)
    
    def _basic_entity_extraction(self, text):
        """Basic entity extraction using spaCy or simple patterns"""
        if self.nlp is not None:
            try:
                doc = self.nlp(text)
                entity_groups = {}
                for ent in doc.ents:
                    if ent.label_ not in entity_groups:
                        entity_groups[ent.label_] = []
                    entity_groups[ent.label_].append({
                        'text': ent.text,
                        'confidence': 0.8,  # Default confidence for spaCy
                        'start': ent.start_char,
                        'end': ent.end_char
                    })
                return entity_groups
            except Exception as e:
                logger.warning(f"spaCy entity extraction failed: {e}")
        
        # Fallback to simple pattern matching
        import re
        entity_groups = {}
        
        # Simple capitalized word detection (basic person/org detection)
        capitalized_words = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)
        if capitalized_words:
            entity_groups['MISC'] = [
                {'text': word, 'confidence': 0.5, 'start': text.find(word), 'end': text.find(word) + len(word)}
                for word in set(capitalized_words) if len(word) > 2
            ]
        
        return entity_groups
    
    def analyze_language_patterns(self, text):
        """Analyze linguistic patterns and complexity"""
        analysis = {
            'word_count': len(text.split()),
            'sentence_count': len(re.findall(r'[.!?]+', text)),
            'avg_sentence_length': 0,
            'reading_level': 'Medium',
            'exclamation_count': text.count('!'),
            'question_count': text.count('?'),
            'caps_percentage': 0
        }
        
        if analysis['sentence_count'] > 0:
            analysis['avg_sentence_length'] = analysis['word_count'] / analysis['sentence_count']
        
        # Calculate caps percentage
        if len(text) > 0:
            caps_count = sum(1 for c in text if c.isupper())
            analysis['caps_percentage'] = round((caps_count / len(text)) * 100, 2)
        
        # Simple reading level assessment
        if analysis['avg_sentence_length'] > 20:
            analysis['reading_level'] = 'High'
        elif analysis['avg_sentence_length'] < 10:
            analysis['reading_level'] = 'Low'
        
        return analysis
    
    def calculate_overall_score(self, emotional_intensity, bias_score, urgency_score, propaganda_techniques, emotional_analysis=None):
        """Enhanced overall propaganda/bias risk score calculation"""
        # Base weighted combination
        emotional_weight = 0.25
        bias_weight = 0.15
        urgency_weight = 0.2
        propaganda_weight = 0.25
        combination_weight = 0.15  # New: weight for technique combinations
        
        # Normalize bias score to 0-100
        normalized_bias = abs(bias_score)
        
        # Enhanced propaganda scoring with technique analysis
        propaganda_count = len(propaganda_techniques)
        propaganda_score = self.calculate_propaganda_risk_score(propaganda_techniques)
        
        # Calculate combination bonus for multiple manipulation tactics
        combination_score = self.calculate_combination_risk(propaganda_techniques, emotional_analysis)
        
        # Calculate weighted score
        overall_score = (
            emotional_intensity * emotional_weight +
            normalized_bias * bias_weight +
            urgency_score * urgency_weight +
            propaganda_score * propaganda_weight +
            combination_score * combination_weight
        )
        
        return round(min(overall_score, 100), 2)
    
    def calculate_propaganda_risk_score(self, propaganda_techniques):
        """Calculate propaganda risk based on technique types and severity"""
        if not propaganda_techniques:
            return 0
        
        # Weight different propaganda techniques by severity
        technique_weights = {
            'fear_mongering': 15,
            'conspiracy_theory': 12,
            'loaded_language': 10,
            'call_to_action': 8,
            'us_vs_them': 10,
            'bandwagon': 7,
            'appeal_to_authority': 6,
            'strawman': 8
        }
        
        score = 0
        technique_types = set()
        
        for technique in propaganda_techniques:
            technique_name = technique['technique'].lower().replace(' ', '_')
            weight = technique_weights.get(technique_name, 5)  # Default weight
            confidence = technique.get('confidence', 0.8)
            
            # Score = base weight * confidence * diminishing returns
            technique_score = weight * confidence
            score += technique_score
            technique_types.add(technique_name)
        
        # Bonus for diverse technique types (indicates sophisticated manipulation)
        if len(technique_types) >= 3:
            score *= 1.2
        elif len(technique_types) >= 5:
            score *= 1.4
        
        return min(score, 100)
    
    def calculate_combination_risk(self, propaganda_techniques, emotional_analysis):
        """Calculate additional risk from dangerous technique combinations"""
        if not propaganda_techniques or not emotional_analysis:
            return 0
        
        risk_score = 0
        technique_names = [t['technique'].lower() for t in propaganda_techniques]
        
        # High-risk combinations
        dangerous_combos = [
            (['fear_mongering', 'call_to_action'], 20, "Fear + urgent action = classic manipulation"),
            (['conspiracy_theory', 'us_vs_them'], 18, "Conspiracy + division = radicalization pattern"),
            (['loaded_language', 'bandwagon'], 15, "Emotional language + peer pressure"),
            (['fear_mongering', 'conspiracy_theory'], 25, "Fear + conspiracy = dangerous misinformation"),
            (['call_to_action', 'urgency'], 12, "Pressure tactics combination")
        ]
        
        for combo_techniques, bonus, description in dangerous_combos:
            if all(any(combo_tech in tech for tech in technique_names) for combo_tech in combo_techniques):
                risk_score += bonus
        
        # Additional risk from emotional trigger diversity
        trigger_categories = 0
        if emotional_analysis.get('fear_appeals'):
            trigger_categories += 1
        if emotional_analysis.get('urgency_markers'):
            trigger_categories += 1
        if emotional_analysis.get('emotional_language'):
            trigger_categories += 1
        if emotional_analysis.get('psychological_pressure'):
            trigger_categories += 1
        
        if trigger_categories >= 3:
            risk_score += 10  # Multi-vector emotional manipulation
        
        return min(risk_score, 40)  # Cap combination bonus
    
    def get_risk_level(self, score, thresholds=None):
        """Convert score to risk level with customizable thresholds"""
        if thresholds is None:
            # Default thresholds
            thresholds = {'low': 34, 'medium': 67}
        
        if score < thresholds['low']:
            return 'low'
        elif score < thresholds['medium']:
            return 'medium'
        else:
            return 'high'
    
    def highlight_text(self, text, propaganda_techniques, entities):
        """Generate highlighted text with markup"""
        highlighted = text
        
        # Simple highlighting - in a real implementation, you'd use more sophisticated markup
        for technique in propaganda_techniques:
            keyword = technique['keyword']
            highlighted = highlighted.replace(
                keyword, 
                f'<mark class="propaganda" title="{technique["technique"]}">{keyword}</mark>'
            )
        
        return highlighted
    
    def analyze_text(self, text, use_llm=True):
        """Main analysis function - LLM-first with rule-based fallback"""
        if not self.models_loaded:
            return {"error": "Models not loaded properly"}
        
        try:
            if use_llm:
                # PRIMARY: Use LLM-powered comprehensive analysis
                logger.info("Using LLM-powered primary analysis")
                result = llm_analyzer.analyze_text_comprehensive(text)
                
                # Apply custom thresholds if needed (handled in endpoint)
                return result
            else:
                # FALLBACK: Use rule-based analysis only when LLM is disabled
                logger.info("Using rule-based analysis (LLM disabled)")
                return self._rule_based_analysis(text)
                
        except Exception as e:
            logger.error(f"Analysis error: {e}")
            return {"error": f"Analysis failed: {str(e)}"}
    
    def _rule_based_analysis(self, text):
        """Rule-based analysis for fallback or when LLM is disabled"""
        try:
            # Perform traditional analyses
            sentiment_analysis = self.analyze_sentiment(text)
            propaganda_techniques = self.detect_propaganda_techniques(text)
            bias_score = self.analyze_bias(text)
            urgency_score = self.analyze_urgency(text)
            entities = self.extract_entities(text)
            language_analysis = self.analyze_language_patterns(text)
            
            # Calculate overall score with enhanced analysis
            overall_score = self.calculate_overall_score(
                sentiment_analysis['emotional_intensity'],
                bias_score,
                urgency_score,
                propaganda_techniques,
                sentiment_analysis.get('emotional_analysis')
            )
            
            risk_level = self.get_risk_level(overall_score)
            highlighted_text = self.highlight_text(text, propaganda_techniques, entities)
            
            # Base analysis result
            result = {
                'overall_score': overall_score,
                'risk_level': risk_level,
                'analysis': {
                    'emotional_intensity': sentiment_analysis['emotional_intensity'],
                    'base_sentiment_intensity': sentiment_analysis.get('base_sentiment_intensity', 0),
                    'emotional_analysis': sentiment_analysis.get('emotional_analysis', {}),
                    'ideological_bias': bias_score,
                    'urgency_score': urgency_score,
                    'propaganda_techniques': propaganda_techniques,
                    'named_entities': entities,
                    'language_analysis': language_analysis,
                    'sentiment_breakdown': sentiment_analysis['sentiment_breakdown']
                },
                'highlighted_text': highlighted_text,
                'llm_analysis': {
                    'success': False,
                    'content': 'LLM analysis disabled - using rule-based detection',
                    'provider': 'rule-based'
                },
                'timestamp': datetime.now().isoformat()
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Rule-based analysis error: {e}")
            return {"error": f"Rule-based analysis failed: {str(e)}"}
    
    def compare_texts(self, texts, labels=None, use_llm=True, thresholds=None):
        """Compare multiple texts - LLM-first with rule-based fallback"""
        if not texts or len(texts) < 2:
            return {"error": "At least 2 texts required for comparison"}
        
        if len(texts) > 5:
            return {"error": "Maximum 5 texts allowed for comparison"}
        
        try:
            if use_llm:
                # PRIMARY: Use LLM-powered comparative analysis
                logger.info("Using LLM-powered comparative analysis")
                result = llm_analyzer.compare_texts_llm(texts, labels)
                
                # Apply custom thresholds if provided
                if thresholds:
                    for individual_result in result.get('individual_results', []):
                        if 'overall_score' in individual_result:
                            individual_result['risk_level'] = self.get_risk_level(
                                individual_result['overall_score'], thresholds
                            )
                
                return result
            else:
                # FALLBACK: Use rule-based comparison
                logger.info("Using rule-based comparative analysis")
                return self._rule_based_comparison(texts, labels, thresholds)
                
        except Exception as e:
            logger.error(f"Comparison error: {e}")
            return {"error": f"Comparison failed: {str(e)}"}
    
    def _rule_based_comparison(self, texts, labels=None, thresholds=None):
        """Rule-based comparison for fallback"""
        results = []
        
        # Analyze each text
        for i, text in enumerate(texts):
            label = labels[i] if labels and i < len(labels) else f"Text {i+1}"
            
            try:
                analysis = self._rule_based_analysis(text)
                if 'error' in analysis:
                    return {"error": f"Failed to analyze {label}: {analysis['error']}"}
                
                # Apply custom thresholds if provided
                if thresholds:
                    analysis['risk_level'] = self.get_risk_level(analysis['overall_score'], thresholds)
                
                analysis['label'] = label
                results.append(analysis)
                
            except Exception as e:
                return {"error": f"Error analyzing {label}: {str(e)}"}
        
        # Generate comparison insights
        comparison_insights = self.generate_comparison_insights(results)
        
        return {
            'individual_results': results,
            'comparison_insights': comparison_insights,
            'timestamp': datetime.now().isoformat()
        }
    
    def generate_comparison_insights(self, results):
        """Generate insights from comparing multiple text analyses"""
        if len(results) < 2:
            return {}
        
        insights = {
            'risk_comparison': [],
            'emotional_intensity_comparison': [],
            'propaganda_technique_comparison': [],
            'bias_comparison': [],
            'key_differences': [],
            'common_patterns': []
        }
        
        # Risk level comparison
        for result in results:
            insights['risk_comparison'].append({
                'label': result['label'],
                'overall_score': result['overall_score'],
                'risk_level': result['risk_level']
            })
        
        # Sort by risk score
        insights['risk_comparison'].sort(key=lambda x: x['overall_score'], reverse=True)
        
        # Emotional intensity comparison
        for result in results:
            insights['emotional_intensity_comparison'].append({
                'label': result['label'],
                'emotional_intensity': result['analysis']['emotional_intensity'],
                'urgency_score': result['analysis']['urgency_score']
            })
        
        # Propaganda technique comparison
        for result in results:
            techniques = result['analysis']['propaganda_techniques']
            insights['propaganda_technique_comparison'].append({
                'label': result['label'],
                'technique_count': len(techniques),
                'unique_techniques': list(set([t['technique'] for t in techniques]))
            })
        
        # Bias comparison
        for result in results:
            insights['bias_comparison'].append({
                'label': result['label'],
                'ideological_bias': result['analysis']['ideological_bias']
            })
        
        # Identify key differences
        scores = [r['overall_score'] for r in results]
        max_score, min_score = max(scores), min(scores)
        if max_score - min_score > 20:
            highest = max(results, key=lambda x: x['overall_score'])
            lowest = min(results, key=lambda x: x['overall_score'])
            insights['key_differences'].append({
                'type': 'significant_risk_difference',
                'description': f"{highest['label']} shows {max_score - min_score:.1f} points higher risk than {lowest['label']}",
                'highest': highest['label'],
                'lowest': lowest['label'],
                'difference': max_score - min_score
            })
        
        # Find common propaganda techniques
        all_techniques = {}
        for result in results:
            for technique in result['analysis']['propaganda_techniques']:
                tech_name = technique['technique']
                if tech_name not in all_techniques:
                    all_techniques[tech_name] = []
                all_techniques[tech_name].append(result['label'])
        
        common_techniques = {k: v for k, v in all_techniques.items() if len(v) > 1}
        if common_techniques:
            insights['common_patterns'].append({
                'type': 'shared_propaganda_techniques',
                'techniques': common_techniques
            })
        
        return insights

# Initialize detector
detector = PropagandaDetector()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': detector.models_loaded,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    """Text analysis endpoint with optional LLM enhancement"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text'].strip()
        if len(text) < 10:
            return jsonify({'error': 'Text too short for analysis'}), 400
        
        if len(text) > 10000:
            return jsonify({'error': 'Text too long (max 10,000 characters)'}), 400
        
        # Check if LLM analysis is requested (default: True)
        use_llm = data.get('use_llm', True)
        
        # Check for custom risk thresholds
        thresholds = data.get('thresholds')
        
        # Perform analysis
        result = detector.analyze_text(text, use_llm=use_llm)
        
        # Apply custom thresholds if provided
        if thresholds and 'error' not in result:
            result['risk_level'] = detector.get_risk_level(result['overall_score'], thresholds)
        
        if 'error' in result:
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"API error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/models/status', methods=['GET'])
def models_status():
    """Get status of loaded models"""
    # Get LLM status
    llm_status = llm_service.health_check()
    
    return jsonify({
        'models_loaded': detector.models_loaded,
        'available_models': [
            'sentiment_analysis',
            'named_entity_recognition',
            'bias_detection',
            'propaganda_detection'
        ],
        'llm_status': llm_status
    })

@app.route('/api/llm/health', methods=['GET'])
def llm_health():
    """Check LLM providers health"""
    return jsonify(llm_service.health_check())

@app.route('/api/compare', methods=['POST'])
def compare_texts():
    """Compare multiple texts for bias and propaganda analysis"""
    try:
        data = request.get_json()
        
        if not data or 'texts' not in data:
            return jsonify({'error': 'No texts provided for comparison'}), 400
        
        texts = data['texts']
        if not isinstance(texts, list) or len(texts) < 2:
            return jsonify({'error': 'At least 2 texts required for comparison'}), 400
        
        if len(texts) > 5:
            return jsonify({'error': 'Maximum 5 texts allowed for comparison'}), 400
        
        # Validate text lengths
        for i, text in enumerate(texts):
            if not text or len(text.strip()) < 10:
                return jsonify({'error': f'Text {i+1} too short for analysis'}), 400
            if len(text) > 10000:
                return jsonify({'error': f'Text {i+1} too long (max 10,000 characters)'}), 400
        
        # Get optional parameters
        labels = data.get('labels')
        use_llm = data.get('use_llm', True)
        thresholds = data.get('thresholds')
        
        # Perform comparison
        result = detector.compare_texts(texts, labels=labels, use_llm=use_llm, thresholds=thresholds)
        
        if 'error' in result:
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Comparison API error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
