"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.giovannaChat = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const generative_ai_1 = require("@google/generative-ai");
admin.initializeApp();
// Initialize Gemini client
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
/**
 * Giovanna AI Chat Function
 *
 * Takes a user message and the Learning Hub context, returns a neuro-affirming response.
 */
exports.giovannaChat = functions.https.onRequest(async (req, res) => {
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
            ? context.map((item) => `Topic: ${item.title}\nCategory: ${item.category}\nDefinition: ${item.definition}\nSchool Script: "${item.whatToShare}"`).join('\n\n')
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
    }
    catch (error) {
        console.error('Giovanna AI error:', error);
        res.status(500).json({
            error: 'AI service temporarily unavailable',
            response: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or browse the Learning Hub for immediate help."
        });
    }
});
//# sourceMappingURL=index.js.map