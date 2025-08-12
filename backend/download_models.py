#!/usr/bin/env python3
"""
download the ML models we need for propaganda detection
this script handles downloading spaCy and transformers models
"""

import os
import subprocess
import sys

def main():
    print("🚀 setting up ML models for propaganda detection...")
    
    # create models directory
    models_dir = "./models"
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)
        print(f"✅ created models directory: {models_dir}")
    
    # download spaCy model
    print("📥 downloading spaCy model...")
    try:
        subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"], check=True)
        print("✅ spaCy model downloaded successfully")
    except subprocess.CalledProcessError:
        print("❌ failed to download spaCy model")
        return False
    
    # download transformers models
    print("📥 downloading transformers models...")
    
    # create a simple Python script to download the model
    download_script = """
from transformers import pipeline
import os

print("downloading sentiment analysis model...")
sentiment_pipeline = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment-latest")
print("✅ sentiment model ready")

print("downloading NER model...")
ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")
print("✅ NER model ready")

print("testing the pipeline...")
test_text = "This is a test sentence."
sentiment_result = sentiment_pipeline(test_text)
print(f"sentiment test: {sentiment_result}")

# test NER pipeline
test_text = "John Smith works at Google in New York."
ner_result = ner_pipeline(test_text)
print(f"NER test: {ner_result}")

print("🎉 all models downloaded and tested successfully!")
"""
    
    # write and execute the download script
    script_path = os.path.join(models_dir, "download_models.py")
    with open(script_path, "w") as f:
        f.write(download_script)
    
    try:
        subprocess.run([sys.executable, script_path], check=True)
        print("✅ transformers models downloaded successfully")
    except subprocess.CalledProcessError:
        print("❌ failed to download transformers models")
        return False
    
    # clean up the script
    os.remove(script_path)
    
    print("🎉 all models are ready to go!")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
