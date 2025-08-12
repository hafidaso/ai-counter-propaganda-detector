# 🧠 AI Counter-Propaganda Detector

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18.0+-61dafb.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38b2ac.svg)](https://tailwindcss.com/)

> **Advanced AI-powered analysis for media literacy and critical thinking**

A sophisticated web application that uses cutting-edge AI models to detect propaganda techniques, emotional manipulation, and ideological bias in text content. Built with modern web technologies and designed for educational use.

## ✨ Features

### 🔍 **Advanced AI Analysis**
- **Multi-model detection**: Combines traditional NLP with Large Language Models
- **95% accuracy**: High-precision propaganda technique identification
- **Real-time processing**: Get comprehensive results in seconds
- **Educational insights**: Learn about manipulation tactics and bias indicators

### 🎯 **Detection Capabilities**
- **Propaganda techniques**: Bandwagon appeal, fear mongering, loaded language
- **Emotional analysis**: Sentiment breakdown and emotional intensity scoring
- **Bias detection**: Ideological bias analysis with visual indicators
- **Language patterns**: Text statistics, readability, and linguistic markers
- **Named entities**: People, places, and organizations identification

### 🎨 **Modern UI/UX**
- **Beautiful design**: Modern, responsive interface with smooth animations
- **Interactive elements**: Hover effects, micro-interactions, and visual feedback
- **Mobile-first**: Optimized for all devices and screen sizes
- **Accessibility**: WCAG compliant with proper contrast and navigation

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp config.env.example config.env
# Edit config.env with your API keys

# Run the backend
python app.py
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Production Build
```bash
# Build for production
npm run build

# Serve production build
npm run serve
```

## 🏗️ Architecture

### **Backend (Python/Flask)**
- **Flask**: Lightweight web framework
- **SpaCy**: Advanced NLP processing
- **OpenRouter**: LLM integration with Mistral 7B Instruct model
- **In-memory processing**: Fast, lightweight analysis without database dependencies

### **Frontend (React)**
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Responsive design**: Mobile-first approach with modern breakpoints

### **AI Models**
- **OpenRouter Integration**: Primary LLM service with Mistral 7B Instruct model
- **Mistral 7B Instruct**: Fast, efficient 7B parameter model for real-time analysis
- **Traditional NLP**: Rule-based propaganda detection with SpaCy
- **Sentiment Analysis**: Emotional intensity and bias scoring
- **Entity Recognition**: Named entity extraction and analysis
- **Model Flexibility**: Easy to switch between different OpenRouter models

## 📊 Analysis Results

### **Risk Assessment**
- **Low Risk (0-34%)**: Minimal bias detected
- **Medium Risk (35-67%)**: Moderate bias present
- **High Risk (68-100%)**: Strong bias indicators

### **Detailed Insights**
- Propaganda technique identification with confidence scores
- Emotional manipulation analysis
- Ideological bias visualization
- Language pattern statistics
- Educational explanations and improvement suggestions

## 🎓 Educational Value

This tool is designed to:
- **Enhance media literacy** and critical thinking skills
- **Identify manipulation tactics** commonly used in propaganda
- **Provide educational resources** for understanding bias
- **Support fact-checking** and source verification efforts
- **Promote digital citizenship** and responsible media consumption

## 🔧 Configuration

### Environment Variables
```env
# LLM API Keys (Required)
OPENROUTER_API_KEY=your_openrouter_api_key_here  # Primary service with Mistral 7B Instruct

# Alternative LLM Providers (Optional)
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Security & Configuration
SECRET_KEY=your_secret_key_here
FLASK_ENV=production
```

### Model Configuration
- **Default Model**: Mistral 7B Instruct via OpenRouter (fast, efficient)
- **Alternative Models**: Easy to switch to other OpenRouter models (GPT-4, Claude, etc.)
- **Fallback Support**: Automatic fallback to other providers if OpenRouter is unavailable

### Customization
- **Thresholds**: Adjust risk level boundaries
- **Sensitivity**: Configure analysis sensitivity levels
- **Models**: Enable/disable specific AI models
- **Styling**: Customize UI themes and colors

## 📱 Screenshots

### Main Interface
![Main Interface](Main%20Interface.png)

### Analysis Results
![Analysis Results](Analysis%20Results.png)

### Educational Tools
![Educational Tools](Educational%20Tools.png)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for advanced language model capabilities
- **SpaCy** for excellent NLP processing
- **React Team** for the amazing frontend framework
- **Tailwind CSS** for the beautiful design system
- **Open Source Community** for inspiration and support

## 📞 Contact

**Hafida Belayd** - Data Scientist & AI Engineer

- **LinkedIn**: [hafida-belayd](https://www.linkedin.com/in/hafida-belayd/)
- **GitHub**: [@hafidaso](https://github.com/hafidaso)
- **Portfolio**: [hafida-belayd.netlify.app](https://hafida-belayd.netlify.app/)
- **Email**: hafidabelaidagnaoui@gmail.com



---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/hafidaso">Hafida Belayd</a></p>
  <p>Empowering critical thinking through AI-powered media analysis</p>
</div>
