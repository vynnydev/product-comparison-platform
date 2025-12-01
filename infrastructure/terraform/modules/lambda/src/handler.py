import json
import boto3
import os
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize Bedrock client
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.environ.get('AWS_REGION', 'us-east-1')
)

MODEL_ID = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-3-5-sonnet-20241022-v2:0')


def invoke_bedrock(prompt: str, max_tokens: int = 4096) -> str:
    """Invoke Bedrock with Claude model"""
    try:
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        })

        response = bedrock_runtime.invoke_model(
            modelId=MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=body
        )

        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']

    except Exception as e:
        logger.error(f"Error invoking Bedrock: {str(e)}")
        raise


def parse_json_response(response_text: str) -> dict:
    """Parse JSON from AI response"""
    try:
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_str = response_text.split("```")[1].split("```")[0].strip()
        else:
            json_str = response_text.strip()
        return json.loads(json_str)
    except json.JSONDecodeError:
        return None


def analyze_product(product_data: dict) -> dict:
    """Analyze a single product using AI"""
    prompt = f"""Analyze the following product and provide a detailed analysis in JSON format.

Product Data:
{json.dumps(product_data, indent=2)}

Provide your analysis in the following JSON structure (respond ONLY with valid JSON, no markdown):
{{
    "summary": "Brief summary of the product",
    "pros": ["list", "of", "advantages"],
    "cons": ["list", "of", "disadvantages"],
    "targetAudience": "Who this product is best for",
    "valueScore": 8.5,
    "recommendedFor": ["use case 1", "use case 2"]
}}
"""

    response_text = invoke_bedrock(prompt)
    analysis = parse_json_response(response_text)

    if not analysis:
        analysis = {
            "summary": response_text[:500],
            "pros": ["Quality product"],
            "cons": ["Limited information available"],
            "targetAudience": "General consumers",
            "valueScore": 7.0,
            "recommendedFor": ["General use"]
        }

    return {
        "analysis": analysis,
        "metadata": {
            "model": MODEL_ID,
            "provider": "AWS Bedrock"
        }
    }


def enhance_search(query: str) -> dict:
    """Enhance a search query using AI"""
    prompt = f"""Analyze and enhance the following search query for a product search engine.

Original Query: "{query}"

Provide your enhancement in the following JSON structure (respond ONLY with valid JSON, no markdown):
{{
    "originalQuery": "{query}",
    "enhancedQuery": "improved search query with better keywords",
    "synonyms": ["synonym1", "synonym2", "synonym3"],
    "intent": "PRODUCT_SEARCH",
    "confidence": 0.95,
    "suggestedFilters": {{
        "category": "suggested category if applicable",
        "priceRange": "budget/mid-range/premium if detectable"
    }}
}}

Intent must be one of: PRODUCT_SEARCH, COMPARISON, PRICE_CHECK, FEATURE_INQUIRY, GENERAL
"""

    response_text = invoke_bedrock(prompt, max_tokens=1024)
    enhancement = parse_json_response(response_text)

    if not enhancement:
        enhancement = {
            "originalQuery": query,
            "enhancedQuery": query,
            "synonyms": [],
            "intent": "PRODUCT_SEARCH",
            "confidence": 0.5,
            "suggestedFilters": {}
        }

    return enhancement


def compare_products(products: list) -> dict:
    """Compare multiple products using AI"""
    prompt = f"""Compare the following products and determine which one is the best value.

Products:
{json.dumps(products, indent=2)}

Provide your comparison in the following JSON structure (respond ONLY with valid JSON, no markdown):
{{
    "winnerProductId": 1,
    "reasoning": "Detailed explanation of why this product is the best choice",
    "breakdown": {{
        "price": {{
            "winnerProductId": 1,
            "score": 8.5,
            "explanation": "Explanation for price comparison"
        }},
        "features": {{
            "winnerProductId": 2,
            "score": 9.0,
            "explanation": "Explanation for features comparison"
        }},
        "value": {{
            "winnerProductId": 1,
            "score": 8.0,
            "explanation": "Explanation for overall value"
        }}
    }}
}}

Use the actual product IDs from the input data.
"""

    response_text = invoke_bedrock(prompt)
    comparison = parse_json_response(response_text)

    if not comparison:
        winner_id = products[0].get('id', 1) if products else 1
        comparison = {
            "winnerProductId": winner_id,
            "reasoning": "Based on overall analysis",
            "breakdown": {
                "price": {"winnerProductId": winner_id, "score": 7.0, "explanation": "Competitive pricing"},
                "features": {"winnerProductId": winner_id, "score": 7.0, "explanation": "Good feature set"},
                "value": {"winnerProductId": winner_id, "score": 7.0, "explanation": "Good overall value"}
            }
        }

    return comparison


def lambda_handler(event, context):
    """Main Lambda handler"""
    logger.info(f"Received event: {json.dumps(event)}")

    try:
        # Parse body if coming from API Gateway
        if 'body' in event:
            if isinstance(event['body'], str):
                body = json.loads(event['body'])
            else:
                body = event['body']
        else:
            body = event

        operation = body.get('operation')

        if operation == 'analyze_product':
            product_data = body.get('productData', {})
            result = analyze_product(product_data)

        elif operation == 'enhance_search':
            query = body.get('query', '')
            result = enhance_search(query)

        elif operation == 'compare_products':
            products = body.get('products', [])
            result = compare_products(products)

        elif operation == 'health':
            result = {
                "status": "healthy",
                "model": MODEL_ID,
                "provider": "AWS Bedrock"
            }

        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': f'Unknown operation: {operation}',
                    'validOperations': ['analyze_product', 'enhance_search', 'compare_products', 'health']
                })
            }

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result)
        }

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e),
                'message': 'Internal server error'
            })
        }