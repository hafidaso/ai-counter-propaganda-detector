"""
LLM Integration Service for Enhanced Propaganda Detection
Supports multiple free LLM providers with fallback options
"""

import os
import json
import logging
import requests
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)

@dataclass
class LLMResponse:
    content: str
    provider: str
    model: str
    tokens_used: int = 0
    success: bool = True
    error: Optional[str] = None

class LLMProvider(ABC):
    """Abstract base class for LLM providers"""
    
    @abstractmethod
    def generate(self, prompt: str, max_tokens: int = 500) -> LLMResponse:
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        pass



class OpenRouterProvider(LLMProvider):
    """OpenRouter API Provider (supports many free models)"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('OPENROUTER_API_KEY')
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "mistralai/mistral-7b-instruct:free"  # Free Mistral model
        
    def generate(self, prompt: str, max_tokens: int = 500) -> LLMResponse:
        try:
            if not self.api_key:
                return LLMResponse(
                    content="", provider="openrouter", model=self.model,
                    success=False, error="No API key provided"
                )
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": max_tokens,
                "temperature": 0.7
            }
            
            response = requests.post(
                self.base_url,
                headers=headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                return LLMResponse(
                    content=content,
                    provider="openrouter",
                    model=self.model,
                    tokens_used=result.get('usage', {}).get('total_tokens', 0),
                    success=True
                )
            
            return LLMResponse(
                content="", provider="openrouter", model=self.model,
                success=False, error=f"API error: {response.status_code}"
            )
            
        except Exception as e:
            return LLMResponse(
                content="", provider="openrouter", model=self.model,
                success=False, error=str(e)
            )
    
    def is_available(self) -> bool:
        return bool(self.api_key)

class GroqProvider(LLMProvider):
    """Groq API Provider (fast inference, free tier)"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('GROQ_API_KEY')
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama3-8b-8192"  # Free fast model
        
    def generate(self, prompt: str, max_tokens: int = 500) -> LLMResponse:
        try:
            if not self.api_key:
                return LLMResponse(
                    content="", provider="groq", model=self.model,
                    success=False, error="No API key provided"
                )
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": max_tokens,
                "temperature": 0.3  # Lower for more consistent analysis
            }
            
            response = requests.post(
                self.base_url,
                headers=headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                return LLMResponse(
                    content=content,
                    provider="groq",
                    model=self.model,
                    tokens_used=result.get('usage', {}).get('total_tokens', 0),
                    success=True
                )
            
            return LLMResponse(
                content="", provider="groq", model=self.model,
                success=False, error=f"API error: {response.status_code}"
            )
            
        except Exception as e:
            return LLMResponse(
                content="", provider="groq", model=self.model,
                success=False, error=str(e)
            )
    
    def is_available(self) -> bool:
        return bool(self.api_key)

class MockLLMProvider(LLMProvider):
    """Mock provider for testing and fallback"""
    
    def generate(self, prompt: str, max_tokens: int = 500) -> LLMResponse:
        # Simulate LLM analysis based on prompt content
        if "comprehensive analysis" in prompt.lower() or "propaganda" in prompt.lower():
            content = """{
  "overall_risk_score": 75,
  "risk_level": "high",
  "emotional_intensity": 85,
  "urgency_score": 60,
  "ideological_bias": -20,
  "propaganda_techniques": [
    {
      "technique": "Appeal to fear",
      "confidence": 0.9,
      "evidence": "shocking, devastate",
      "psychological_impact": "Triggers fear response to bypass critical thinking"
    },
    {
      "technique": "Bandwagon",
      "confidence": 0.8,
      "evidence": "everyone",
      "psychological_impact": "Creates social pressure to conform"
    }
  ],
  "emotional_triggers": [
    {
      "trigger_type": "fear",
      "intensity": "high",
      "evidence": "shocking revelation, devastate"
    }
  ],
  "cognitive_biases_exploited": [
    {
      "bias": "availability heuristic",
      "mechanism": "Uses vivid emotional language",
      "impact": "Makes threat seem more immediate and real"
    }
  ],
  "linguistic_manipulation": {
    "loaded_language": ["shocking", "devastate"],
    "false_urgency": [],
    "absolute_statements": ["everyone"]
  },
  "credibility_assessment": {
    "evidence_quality": "poor",
    "logical_fallacies": ["appeal to emotion"]
  },
  "psychological_analysis": {
    "target_audience": "General public",
    "persuasion_tactics": ["fear appeal", "social proof"],
    "vulnerability_exploitation": ["emotional vulnerability", "desire for belonging"]
  },
  "bias_analysis": {
    "ideological_bias": {
      "score": -20,
      "classification": "center-left",
      "evidence": ["emotional manipulation", "lack of evidence"]
    },
    "cultural_bias": {
      "present": false,
      "types": []
    },
    "source_bias": {
      "credibility_issues": ["No sources cited", "Emotional claims without evidence"]
    }
  },
  "entity_analysis": {
    "entities": []
  },
  "technique_explanations": {
    "success": true,
    "content": "This text uses fear-based propaganda techniques including appeal to fear and bandwagon effects. The word 'shocking' creates emotional impact while 'everyone' suggests universal agreement to pressure conformity."
  },
  "improvement_suggestions": {
    "success": true,
    "content": "To improve this text: 1) Remove emotionally charged words like 'shocking' and 'devastate', 2) Provide specific evidence instead of claiming universal impact, 3) Use neutral language and avoid absolute statements."
  },
  "media_literacy_insights": "This text demonstrates how emotional language can bypass critical thinking. Always ask: What evidence supports these claims? Who benefits from this emotional response?",
  "detailed_explanation": "This text shows high-risk propaganda characteristics with emotional manipulation techniques designed to trigger fear and social pressure. It lacks evidence and uses loaded language to bypass rational analysis."
}"""
        else:
            content = "This appears to be a factual statement with minimal bias indicators."
        
        return LLMResponse(
            content=content,
            provider="mock",
            model="mock-llm",
            success=True
        )
    
    def is_available(self) -> bool:
        return True

class LLMService:
    """Main LLM service with multiple provider support and fallbacks"""
    
    def __init__(self):
        self.providers = [
            GroqProvider(),
            OpenRouterProvider(), 
            MockLLMProvider()  # Always available fallback
        ]
        self.current_provider_index = 0
        
    def get_available_providers(self) -> List[LLMProvider]:
        """Get list of available providers"""
        return [p for p in self.providers if p.is_available()]
    
    def analyze_comprehensive_single_call(self, text: str) -> Dict[str, Any]:
        """Comprehensive single-call LLM analysis - combines all analysis into one request to reduce timeouts"""
        prompt = f"""
Perform a comprehensive analysis of this text for propaganda, bias, and manipulation. Include ALL analysis components in a single JSON response.

TEXT: "{text}"

Respond with ONLY this JSON structure - no additional text:

{{
  "overall_risk_score": <0-100>,
  "risk_level": "<low|medium|high>",
  "emotional_intensity": <0-100>,
  "urgency_score": <0-100>,
  "ideological_bias": <-100 to +100>,
  "propaganda_techniques": [
    {{
      "technique": "<name>",
      "confidence": <0-1>,
      "evidence": "<words found>",
      "psychological_impact": "<brief explanation>"
    }}
  ],
  "emotional_triggers": [
    {{
      "trigger_type": "<fear|anger|pride|urgency>",
      "intensity": "<high|medium|low>",
      "evidence": "<examples>"
    }}
  ],
  "cognitive_biases_exploited": [
    {{
      "bias": "<confirmation bias|availability heuristic|etc>",
      "mechanism": "<how it's exploited>",
      "impact": "<psychological effect>"
    }}
  ],
  "linguistic_manipulation": {{
    "loaded_language": ["word1", "word2"],
    "false_urgency": ["phrase1"],
    "absolute_statements": ["statement1"]
  }},
  "credibility_assessment": {{
    "evidence_quality": "<poor|fair|good|excellent>",
    "logical_fallacies": ["fallacy1"]
  }},
  "psychological_analysis": {{
    "target_audience": "<who this aims to influence>",
    "persuasion_tactics": ["<list of tactics>"],
    "vulnerability_exploitation": ["<what vulnerabilities are targeted>"]
  }},
  "bias_analysis": {{
    "ideological_bias": {{
      "score": <-100 to +100>,
      "classification": "<political classification>",
      "evidence": ["<specific examples>"]
    }},
    "cultural_bias": {{
      "present": <true|false>,
      "types": ["<cultural assumptions>"]
    }},
    "source_bias": {{
      "credibility_issues": ["<problems with sources>"]
    }}
  }},
  "entity_analysis": {{
    "entities": [
      {{
        "entity": "<name>",
        "type": "<PERSON|ORG|LOCATION>",
        "sentiment_context": "<positive|negative|neutral>",
        "framing_analysis": "<how presented>"
      }}
    ]
  }},
  "technique_explanations": {{
    "success": true,
    "content": "<educational explanations of detected techniques and how to recognize them>"
  }},
  "improvement_suggestions": {{
    "success": true,
    "content": "<specific suggestions for making the text more neutral and factual>"
  }},
  "media_literacy_insights": "<insights for building critical thinking skills>",
  "detailed_explanation": "<comprehensive 3-4 sentence summary of findings>"
}}
"""
        return self._generate_with_fallback(prompt, max_tokens=2000)

    def analyze_propaganda_advanced(self, text: str) -> Dict[str, Any]:
        """Legacy method - redirects to comprehensive single call for backwards compatibility"""
        return self.analyze_comprehensive_single_call(text)
    
    def explain_techniques(self, detected_techniques: List[Dict]) -> Dict[str, Any]:
        """Get detailed explanations of detected propaganda techniques with psychological insights"""
        techniques_text = "\n".join([f"- {t['technique']}: '{t['keyword']}' (confidence: {t.get('confidence', 0.8):.0%})" for t in detected_techniques])
        
        prompt = f"""
You are a media literacy educator. Explain these propaganda techniques detected in a text, focusing on building critical thinking skills:

DETECTED TECHNIQUES:
{techniques_text}

For each technique, provide:

PSYCHOLOGICAL MECHANISM:
- What cognitive vulnerability does it exploit?
- How does it bypass rational thinking?
- What emotional responses does it trigger?

RECOGNITION PATTERNS:
- Key linguistic markers to watch for
- Context clues that reveal the technique
- Variations and subtle forms

DEFENSE STRATEGIES:
- Questions to ask when encountering this technique
- How to verify claims independently
- Mental frameworks for resistance

REAL-WORLD IMPACT:
- Why this technique is particularly harmful
- Historical examples of its misuse
- Effects on democratic discourse

Make explanations accessible but thorough. Help users become more resilient against manipulation while maintaining healthy skepticism, not cynicism.

Focus on empowering users with knowledge, not creating paranoia about all persuasive communication.
"""
        
        return self._generate_with_fallback(prompt)
    
    def analyze_entities_advanced(self, text: str) -> Dict[str, Any]:
        """LLM-powered entity analysis with context and bias assessment"""
        prompt = f"""
Analyze all named entities in this text and assess their contextual framing for bias or manipulation.

TEXT: "{text}"

Provide analysis in this JSON format:

{{
  "entities": [
    {{
      "entity": "<name>",
      "type": "<PERSON|ORGANIZATION|LOCATION|CONCEPT>",
      "sentiment_context": "<positive|negative|neutral>",
      "framing_analysis": "<how the entity is presented>",
      "manipulation_indicators": ["<list of bias indicators>"],
      "authority_appeal": "<whether used to support claims>"
    }}
  ],
  "overall_entity_bias": "<assessment of how entities are used manipulatively>",
  "credibility_flags": ["<entities that need fact-checking>"]
}}

Focus on how entities are used to manipulate perception rather than just identifying them.
"""
        return self._generate_with_fallback(prompt)
    
    def analyze_bias_comprehensive(self, text: str) -> Dict[str, Any]:
        """LLM-powered comprehensive bias analysis"""
        prompt = f"""
Conduct a comprehensive bias analysis of this text across multiple dimensions.

TEXT: "{text}"

Provide detailed analysis in this JSON format:

{{
  "ideological_bias": {{
    "score": <number -100 to +100>,
    "classification": "<far-left|left|center-left|center|center-right|right|far-right|unclear>",
    "evidence": ["<specific examples>"],
    "dog_whistles": ["<coded language>"],
    "framing_techniques": ["<how issues are presented>"]
  }},
  "cultural_bias": {{
    "present": <true|false>,
    "types": ["<cultural assumptions made>"],
    "exclusions": ["<groups marginalized>"]
  }},
  "confirmation_bias_exploitation": {{
    "present": <true|false>,
    "techniques": ["<how it reinforces existing beliefs>"],
    "echo_chamber_indicators": ["<insular thinking patterns>"]
  }},
  "source_bias": {{
    "credibility_issues": ["<problems with sources>"],
    "cherry_picking": ["<selective evidence>"],
    "false_balance": ["<artificial equivalencies>"]
  }},
  "linguistic_bias": {{
    "loaded_terms": ["<emotionally charged words>"],
    "euphemisms": ["<softening language>"],
    "dysphemisms": ["<harsh language>"],
    "presuppositions": ["<unstated assumptions>"]
  }},
  "bias_summary": "<overall assessment of bias types and severity>"
}}

Be thorough in identifying subtle forms of bias.
"""
        return self._generate_with_fallback(prompt)
    
    def suggest_improvements(self, text: str, bias_score: float) -> Dict[str, Any]:
        """Suggest how to make text more neutral and factual"""
        prompt = f"""
The following text has been flagged with a bias score of {bias_score}%. Suggest improvements to make it more neutral and factual:

ORIGINAL TEXT:
"{text}"

Provide suggestions for:
1. Removing emotional manipulation
2. Making language more objective
3. Adding necessary context or caveats
4. Improving factual accuracy presentation
5. Reducing bias indicators

Format as practical, actionable advice for content creators.
"""
        
        return self._generate_with_fallback(prompt)
    
    def _generate_with_fallback(self, prompt: str, max_tokens: int = 1000) -> Dict[str, Any]:
        """Generate response with automatic fallback between providers"""
        available_providers = self.get_available_providers()
        
        if not available_providers:
            return {
                "success": False,
                "error": "No LLM providers available",
                "content": ""
            }
        
        for provider in available_providers:
            try:
                response = provider.generate(prompt, max_tokens)
                if response.success:
                    return {
                        "success": True,
                        "content": response.content,
                        "provider": response.provider,
                        "model": response.model,
                        "tokens_used": response.tokens_used
                    }
                else:
                    logger.warning(f"Provider {provider.__class__.__name__} failed: {response.error}")
                    continue
                    
            except Exception as e:
                logger.error(f"Error with provider {provider.__class__.__name__}: {e}")
                continue
        
        return {
            "success": False,
            "error": "All LLM providers failed",
            "content": "LLM analysis unavailable"
        }
    
    def health_check(self) -> Dict[str, Any]:
        """Check health and availability of LLM providers"""
        provider_status = []
        
        for provider in self.providers:
            status = {
                "name": provider.__class__.__name__,
                "available": provider.is_available(),
                "model": getattr(provider, 'model', 'unknown')
            }
            provider_status.append(status)
        
        available_count = sum(1 for p in provider_status if p['available'])
        
        return {
            "providers": provider_status,
            "available_providers": available_count,
            "status": "healthy" if available_count > 0 else "degraded"
        }

# Global LLM service instance
llm_service = LLMService()
