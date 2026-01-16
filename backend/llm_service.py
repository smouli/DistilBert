import os
import json
from typing import List, Dict, Optional
from openai import OpenAI
import anthropic
# from dashscope import Generation  # Uncomment if using Qwen API


class LLMService:
    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) if os.getenv("OPENAI_API_KEY") else None
        self.anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY")) if os.getenv("ANTHROPIC_API_KEY") else None
        # self.qwen_client = Generation() if os.getenv("QWEN_API_KEY") else None  # Uncomment if using Qwen API
        self.qwen_client = None

    async def analyze_problem(self, problem: str, provider: str = "claude") -> Dict:
        """Analyze problem statement and return domain + clarification questions"""
        
        prompt = f"""You are an AI assistant helping to build a DistilBERT model for entity and intent recognition.

Problem Statement: {problem}

Please:
1. Identify the domain/segment (e.g., "Customer Service & Support", "Healthcare - Patient Records")
2. Generate 3-5 clarifying questions to better understand the entities and intents needed

Return your response as JSON with this structure:
{{
    "domain": "Identified domain/segment",
    "questions": ["Question 1", "Question 2", "Question 3"]
}}
"""

        response_text = await self._call_llm(prompt, provider)
        
        # Try to parse JSON from response
        try:
            # Extract JSON from markdown code blocks if present
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            elif "```" in response_text:
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            
            result = json.loads(response_text)
        except:
            # Fallback if JSON parsing fails
            result = {
                "domain": "General NLP",
                "questions": [
                    "What types of entities are most critical? (e.g., dates, locations, names)",
                    "What are the typical user actions you need to capture?",
                    "Are there any domain-specific terms or jargon?"
                ]
            }
        
        return result

    async def generate_entities_intents(
        self, 
        problem: str, 
        domain: Optional[str],
        questions: List[Dict],
        provider: str = "claude"
    ) -> Dict:
        """Generate entities and intents based on problem analysis and answers"""
        
        # Handle both Pydantic objects and dictionaries
        def get_question_text(q):
            # Check if it's a Pydantic model (has dict() method) or regular dict
            if hasattr(q, 'question') and hasattr(q, 'answer'):
                # Pydantic object - access as attributes
                return f"Q: {q.question}\nA: {q.answer}"
            elif isinstance(q, dict):
                # Regular dictionary
                return f"Q: {q.get('question', '')}\nA: {q.get('answer', '')}"
            else:
                # Try to convert to dict if it's a Pydantic model
                try:
                    q_dict = q.dict() if hasattr(q, 'dict') else dict(q)
                    return f"Q: {q_dict.get('question', '')}\nA: {q_dict.get('answer', '')}"
                except:
                    return f"Q: {str(q)}\nA: "
        
        questions_text = "\n".join([get_question_text(q) for q in questions])
        
        prompt = f"""You are an AI assistant helping to build a DistilBERT model for entity and intent recognition.

Problem Statement: {problem}
Domain/Segment: {domain or "General NLP"}

Clarification Questions & Answers:
{questions_text}

Based on this information, generate:
1. A list of entities (named entities to extract) - format: ENTITY_NAME: description
2. A list of intents (user intentions/actions) - format: intent_name: description

Return your response as JSON with this structure:
{{
    "entities": [
        {{"name": "ENTITY_NAME", "description": "Description of what this entity represents"}},
        ...
    ],
    "intents": [
        {{"name": "intent_name", "description": "Description of this user intent"}},
        ...
    ]
}}

Generate 5-10 entities and 4-8 intents based on the problem domain.
"""

        response_text = await self._call_llm(prompt, provider)
        
        # Try to parse JSON from response
        try:
            # Extract JSON from markdown code blocks if present
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            elif "```" in response_text:
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            
            result = json.loads(response_text)
        except Exception as e:
            # Fallback if JSON parsing fails
            result = {
                "entities": [
                    {"name": "PERSON", "description": "Person names"},
                    {"name": "LOCATION", "description": "Geographic locations"},
                    {"name": "DATE", "description": "Dates and times"}
                ],
                "intents": [
                    {"name": "query_information", "description": "User wants to query information"},
                    {"name": "request_action", "description": "User wants to request an action"}
                ]
            }
        
        return result

    async def _call_llm(self, prompt: str, provider: str) -> str:
        """Call the specified LLM provider"""
        
        if provider == "openai" and self.openai_client:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            return response.choices[0].message.content
        
        elif provider == "claude" and self.anthropic_client:
            message = self.anthropic_client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            return message.content[0].text
        
        elif provider == "qwen":
            # Qwen API integration example (requires dashscope package)
            # from dashscope import Generation
            # gen = Generation()
            # response = gen.call(
            #     model='qwen-plus',
            #     messages=[{"role": "user", "content": prompt}]
            # )
            # return response.output.choices[0].message.content
            return json.dumps({
                "domain": "General NLP",
                "questions": [
                    "What types of entities are most critical?",
                    "What are the typical user actions?",
                    "Are there any domain-specific terms?"
                ]
            })
        
        else:
            # Fallback to mock response if provider not configured
            # Return entities and intents format for generate_entities_intents
            return json.dumps({
                "entities": [
                    {"name": "PERSON", "description": "Person names"},
                    {"name": "LOCATION", "description": "Geographic locations"},
                    {"name": "DATE", "description": "Dates and times"},
                    {"name": "ORGANIZATION", "description": "Company or organization names"},
                    {"name": "PRODUCT", "description": "Product names"}
                ],
                "intents": [
                    {"name": "query_information", "description": "User wants to query information"},
                    {"name": "request_action", "description": "User wants to request an action"},
                    {"name": "make_complaint", "description": "User wants to make a complaint"},
                    {"name": "request_support", "description": "User needs support"}
                ]
            })

