/**
 * Groq API Service for Health-Related Chatbot
 * 
 * This service provides an interface to the Groq API with strict health-topic filtering.
 * Only health-related questions will receive substantive answers.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System prompt that enforces health-topic filtering
const HEALTH_SYSTEM_PROMPT = `You are a professional healthcare assistant AI. Your ONLY purpose is to answer questions related to health, medicine, wellness, fitness, nutrition, mental health, and medical conditions.

STRICT RULES:
1. ONLY answer questions about health-related topics including:
   - Medical conditions, symptoms, and diseases
   - Medications and treatments
   - Nutrition and diet
   - Fitness and exercise
   - Mental health and wellness
   - Preventive care and healthy lifestyle
   - Medical procedures and healthcare
   - First aid and emergency care

2. If a question is NOT related to health topics, you MUST respond with:
   "I'm a healthcare assistant and can only answer questions related to health, medicine, wellness, and medical topics. Please ask me a health-related question, and I'll be happy to help!"

3. Do NOT answer questions about:
   - Weather, sports, entertainment, politics
   - Cooking (unless specifically about nutrition/diet)
   - Technology, programming, or general knowledge
   - Any non-health related topics

4. Always provide accurate, helpful health information
5. Remind users to consult healthcare professionals for serious medical concerns
6. Be empathetic and supportive in your responses

FORMATTING GUIDELINES FOR PROFESSIONAL RESPONSES:
- Start with a brief, clear introduction (1-2 sentences)
- Use numbered lists for symptoms, steps, or multiple points
- Keep each point concise (1-2 lines maximum)
- Use bold text sparingly for emphasis on key medical terms (use **term**)
- End with a professional reminder about consulting healthcare professionals
- Avoid repetition - don't repeat the same advice multiple times
- Keep the total response concise and scannable (aim for 8-12 key points maximum)
- Use clear, simple language that patients can understand
- Avoid overly technical jargon unless necessary

EXAMPLE FORMAT:
"[Brief introduction about the condition]

Common symptoms include:
1. **Symptom name**: Brief description
2. **Symptom name**: Brief description
[etc.]

If you experience these symptoms, it's important to consult with a healthcare professional for proper diagnosis and treatment."

Remember: You are EXCLUSIVELY a health assistant. Stay focused on health topics only. Keep responses professional, concise, and well-formatted.`;

/**
 * Send a message to the Groq API and get a health-focused response
 * @param {string} userMessage - The user's question
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<string>} - The AI's response
 */
export async function sendHealthMessage(userMessage, conversationHistory = []) {
    try {
        // Build messages array with system prompt and conversation history
        const messages = [
            {
                role: 'system',
                content: HEALTH_SYSTEM_PROMPT
            },
            ...conversationHistory,
            {
                role: 'user',
                content: userMessage
            }
        ];

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile', // Fast and capable model
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from API');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error('Groq API Error:', error);

        // Provide user-friendly error messages
        if (error.message.includes('fetch')) {
            throw new Error('Unable to connect to the AI service. Please check your internet connection.');
        } else if (error.message.includes('401')) {
            throw new Error('Authentication failed. Please check the API configuration.');
        } else if (error.message.includes('429')) {
            throw new Error('Too many requests. Please wait a moment and try again.');
        } else {
            throw new Error(error.message || 'An error occurred while processing your request.');
        }
    }
}

/**
 * Validate if a message appears to be health-related (client-side pre-check)
 * This is optional and provides immediate feedback before API call
 * @param {string} message - The user's message
 * @returns {boolean} - True if likely health-related
 */
export function isLikelyHealthRelated(message) {
    const healthKeywords = [
        'health', 'medical', 'doctor', 'symptom', 'disease', 'pain', 'treatment',
        'medicine', 'medication', 'diet', 'nutrition', 'exercise', 'fitness',
        'wellness', 'mental', 'therapy', 'diagnosis', 'condition', 'illness',
        'injury', 'surgery', 'hospital', 'clinic', 'patient', 'care', 'vitamin',
        'blood', 'pressure', 'diabetes', 'cancer', 'heart', 'lung', 'brain',
        'infection', 'virus', 'bacteria', 'immune', 'vaccine', 'allergy'
    ];

    const messageLower = message.toLowerCase();
    return healthKeywords.some(keyword => messageLower.includes(keyword));
}

export default {
    sendHealthMessage,
    isLikelyHealthRelated
};
