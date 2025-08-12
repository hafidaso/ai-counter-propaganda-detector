#!/bin/bash

# AI Counter-Propaganda Detector Installation Script
echo "🚀 Installing AI Counter-Propaganda Detector..."
echo "================================================"

# Check for required dependencies
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install $1 and try again."
        exit 1
    else
        echo "✅ $1 found"
    fi
}

echo "🔍 Checking dependencies..."
check_dependency python3
check_dependency node
check_dependency npm

echo ""
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Download AI models
echo "📥 Downloading AI models (this may take 5-10 minutes)..."
python download_models.py

if [ $? -eq 0 ]; then
    echo "✅ Backend setup complete!"
else
    echo "❌ Backend setup failed. Check the error messages above."
    exit 1
fi

echo ""
echo "📦 Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend setup complete!"
else
    echo "❌ Frontend setup failed. Check the error messages above."
    exit 1
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "To start the application:"
echo "1. Start backend:  cd backend && source venv/bin/activate && python app.py"
echo "2. Start frontend: cd frontend && npm start"
echo "3. Open browser:   http://localhost:3000"
echo ""
echo "For more information, see README.md"
