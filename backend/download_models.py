#!/usr/bin/env python3
"""
Script to download and cache AI models for the Counter-Propaganda Detector
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"📦 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def download_models():
    """Download all required models"""
    print("🚀 Downloading AI models for Counter-Propaganda Detector")
    print("This may take several minutes depending on your internet connection...\n")
    
    # Create models directory
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    models_to_download = [
        "cardiffnlp/twitter-roberta-base-sentiment-latest",
        "dbmdz/bert-large-cased-finetuned-conll03-english"
    ]
    
    # Download spaCy model
    print("📦 Downloading spaCy English model...")
    spacy_success = run_command(
        "python -m spacy download en_core_web_sm",
        "spaCy English model download"
    )
    
    # Download transformers models
    success_count = 0
    for model_name in models_to_download:
        print(f"\n📦 Downloading {model_name}...")
        
        # Create a simple Python script to download the model
        download_script = f"""
import torch
from transformers import AutoTokenizer, AutoModel, AutoModelForSequenceClassification, pipeline

try:
    print("Downloading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained("{model_name}")
    print("Downloading model...")
    
    if "sentiment" in "{model_name}":
        model = AutoModelForSequenceClassification.from_pretrained("{model_name}")
        # Test the pipeline
        pipeline("sentiment-analysis", model="{model_name}", return_all_scores=True)
    else:
        model = AutoModel.from_pretrained("{model_name}")
        # Test NER pipeline
        pipeline("ner", model="{model_name}", aggregation_strategy="simple")
    
    print("✅ Model downloaded and tested successfully")
except Exception as e:
    print(f"❌ Error downloading model: {{e}}")
    exit(1)
"""
        
        # Write and execute the download script
        script_path = models_dir / f"download_{model_name.replace('/', '_')}.py"
        with open(script_path, 'w') as f:
            f.write(download_script)
        
        if run_command(f"python {script_path}", f"Model {model_name}"):
            success_count += 1
            # Clean up the script
            script_path.unlink()
        else:
            print(f"❌ Failed to download {model_name}")
    
    print(f"\n🎉 Download Summary:")
    print(f"   • spaCy model: {'✅' if spacy_success else '❌'}")
    print(f"   • Transformers models: {success_count}/{len(models_to_download)} ✅")
    
    if spacy_success and success_count == len(models_to_download):
        print(f"\n🎉 All models downloaded successfully!")
        print(f"You can now run: python app.py")
        return True
    else:
        print(f"\n⚠️  Some models failed to download. Check the errors above.")
        return False

if __name__ == "__main__":
    success = download_models()
    sys.exit(0 if success else 1)
