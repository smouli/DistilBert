#!/usr/bin/env python3
"""Quick test script to verify the setup"""

import os
from dotenv import load_dotenv

load_dotenv()

print("🔍 Checking environment configuration...\n")

# Check OpenAI
openai_key = os.getenv("OPENAI_API_KEY")
if openai_key and openai_key != "your_openai_key_here":
    print("✅ OpenAI API key configured")
else:
    print("⚠️  OpenAI API key not configured")

# Check Anthropic
anthropic_key = os.getenv("ANTHROPIC_API_KEY")
if anthropic_key and anthropic_key != "your_anthropic_key_here":
    print("✅ Anthropic API key configured")
else:
    print("⚠️  Anthropic API key not configured (optional)")

# Check Qwen
qwen_key = os.getenv("QWEN_API_KEY")
if qwen_key and qwen_key != "your_qwen_key_here":
    print("✅ Qwen API key configured")
else:
    print("⚠️  Qwen API key not configured (optional)")

print("\n📦 Checking dependencies...")

try:
    import fastapi
    print("✅ FastAPI installed")
except ImportError:
    print("❌ FastAPI not installed - run: pip install -r requirements.txt")

try:
    import openai
    print("✅ OpenAI SDK installed")
except ImportError:
    print("❌ OpenAI SDK not installed - run: pip install -r requirements.txt")

try:
    import anthropic
    print("✅ Anthropic SDK installed")
except ImportError:
    print("⚠️  Anthropic SDK not installed (optional)")

print("\n✨ Setup check complete!")
print("\nTo start the backend server:")
print("  uvicorn main:app --reload")

