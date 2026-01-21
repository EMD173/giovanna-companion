/**
 * AI Goal Suggestions Component
 * 
 * Uses Giovanna AI to suggest appropriate goals based on child profile.
 */

import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { Sparkles, Loader2, Check, X, ChevronRight } from 'lucide-react';
import { GOAL_AREAS, type GoalArea } from '../data/personalSupportPlan';
import type { ChildProfile } from '../data/familyProfile';

interface AIGoalSuggestionsProps {
    child: ChildProfile;
    existingGoals: string[];
    onAccept: (goal: { area: GoalArea; title: string; description: string; whyImportant: string }) => void;
}

interface SuggestedGoal {
    area: GoalArea;
    title: string;
    description: string;
    whyImportant: string;
}

export function AIGoalSuggestions({ child, existingGoals, onAccept }: AIGoalSuggestionsProps) {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<SuggestedGoal[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dismissed, setDismissed] = useState<string[]>([]);

    const generateSuggestions = async () => {
        setLoading(true);
        setError(null);

        try {
            const giovannaChat = httpsCallable(functions, 'giovannaChat');

            const prompt = `Based on this child's profile, suggest 3 developmentally appropriate goals.

Child info:
- Name: ${child.firstName}
- Age: ${child.dateOfBirth ? calculateAge(child.dateOfBirth) : 'Unknown'}
- Strengths: ${child.strengths?.join(', ') || 'Not specified'}
- Interests: ${child.interests?.join(', ') || 'Not specified'}
- Current goals already set: ${existingGoals.join(', ') || 'None'}

For each goal, provide:
1. Area (one of: communication, regulation, social, independence, academic, motor, self-care)
2. Title (short, actionable)
3. Description (what success looks like)
4. Why it matters (family-centered reason)

Return ONLY a JSON array with 3 objects, each having: area, title, description, whyImportant. No markdown, just JSON.`;

            const result = await giovannaChat({ message: prompt });
            const data = result.data as { response: string; error?: string };

            if (data.error) {
                setError('Unable to generate suggestions right now.');
                return;
            }

            // Parse JSON from response
            try {
                const jsonMatch = data.response.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]) as SuggestedGoal[];
                    setSuggestions(parsed);
                } else {
                    setError('Could not parse suggestions.');
                }
            } catch {
                setError('Could not parse suggestions.');
            }
        } catch (err) {
            console.error('AI suggestions error:', err);
            setError('Failed to generate suggestions.');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = (goal: SuggestedGoal) => {
        onAccept(goal);
        setDismissed(prev => [...prev, goal.title]);
    };

    const handleDismiss = (title: string) => {
        setDismissed(prev => [...prev, title]);
    };

    const visibleSuggestions = suggestions.filter(s => !dismissed.includes(s.title));

    return (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-purple-600" size={20} />
                <h3 className="font-bold text-slate-900">AI Goal Suggestions</h3>
            </div>

            {visibleSuggestions.length === 0 && !loading && (
                <div>
                    <p className="text-sm text-slate-600 mb-3">
                        Get personalized goal suggestions based on your child's profile.
                    </p>
                    <button
                        onClick={generateSuggestions}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                    >
                        <Sparkles size={16} />
                        Generate Suggestions
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex items-center gap-2 text-purple-700">
                    <Loader2 size={18} className="animate-spin" />
                    <span>Generating suggestions...</span>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            {visibleSuggestions.length > 0 && (
                <div className="space-y-3">
                    {visibleSuggestions.map((goal, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-3 border border-purple-100">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <span className="text-xs font-medium text-purple-600">
                                        {GOAL_AREAS[goal.area]?.label || goal.area}
                                    </span>
                                    <h4 className="font-semibold text-slate-900">{goal.title}</h4>
                                    <p className="text-sm text-slate-600 mt-1">{goal.description}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleAccept(goal)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                                        title="Add this goal"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDismiss(goal.title)}
                                        className="p-2 text-slate-400 hover:bg-slate-50 rounded"
                                        title="Dismiss"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={generateSuggestions}
                        className="text-sm text-purple-600 font-medium flex items-center gap-1"
                    >
                        <ChevronRight size={14} /> Get more suggestions
                    </button>
                </div>
            )}
        </div>
    );
}

function calculateAge(dateOfBirth: Date): string {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return `${age} years old`;
}
