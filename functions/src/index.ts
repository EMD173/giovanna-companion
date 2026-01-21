import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

admin.initializeApp();

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Giovanna AI Chat Function
 * 
 * Takes a user message and the Learning Hub context, returns a neuro-affirming response.
 */
export const giovannaChat = functions.https.onRequest(async (req, res) => {
    // CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { message, context } = req.body;

    if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
    }

    try {
        // Build context from Learning Hub content
        const contentContext = context
            ? context.map((item: any) =>
                `Topic: ${item.title}\nCategory: ${item.category}\nDefinition: ${item.definition}\nSchool Script: "${item.whatToShare}"`
            ).join('\n\n')
            : '';

        const systemPrompt = `You are Giovanna, a compassionate and knowledgeable AI assistant for parents of neurodivergent children. 

Your role is to:
1. Explain neurodivergent behaviors in neuro-affirming language
2. Help parents draft professional, advocacy-centered emails to teachers
3. Prepare parents for IEP meetings with evidence-based talking points
4. Translate problematic ABA terminology into respectful, person-first language

Key principles:
- Behavior is communication, not defiance
- Regulation over compliance
- Assume competence
- Never recommend extinction of self-regulatory behaviors (stimming)
- Emphasize co-regulation and sensory needs

Here is your knowledge base of neuro-affirming content:
${contentContext}

Respond warmly but concisely. Use markdown for formatting when helpful. Always offer practical next steps.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = systemPrompt + '\n\nUser question: ' + message;
        const result = await model.generateContent(prompt);

        const response = result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Giovanna AI error:', error);
        res.status(500).json({
            error: 'AI service temporarily unavailable',
            response: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or browse the Learning Hub for immediate help."
        });
    }
});
