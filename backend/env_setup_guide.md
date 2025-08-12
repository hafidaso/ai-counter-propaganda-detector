# Environment Setup Guide

## Required Environment Variables

Create a `config.env` file in the backend directory with the following variables:

```env
# LLM API Keys (Free options)
# Get free API keys from these providers:

# Groq - Fast inference, generous free tier
# Sign up at: https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here

# OpenRouter - Access to many models
# Sign up at: https://openrouter.ai/
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Hugging Face - Community models
# Sign up at: https://huggingface.co/
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Optional: Other providers
# OPENAI_API_KEY=your_openai_api_key_here
# ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Getting API Keys

### 1. Groq (Recommended - Free Tier)
- Visit [console.groq.com](https://console.groq.com/)
- Sign up for a free account
- Generate an API key
- Free tier includes 100 requests per minute

### 2. OpenRouter (Multiple Models)
- Visit [openrouter.ai](https://openrouter.ai/)
- Sign up for a free account
- Generate an API key
- Access to many open-source models

### 3. Hugging Face
- Visit [huggingface.co](https://huggingface.co/)
- Sign up for a free account
- Generate an API key
- Access to community models

## Security Notes

- Never commit your actual API keys to version control
- Keep your `config.env` file local and secure
- Use environment variables in production
- Rotate your API keys regularly 
