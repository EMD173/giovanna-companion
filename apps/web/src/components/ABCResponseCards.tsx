/**
 * ABC Response Cards Component
 * 
 * Shows a 3-card response after each ABC entry:
 * - Card A: Affirmation of parent action
 * - Card B: 2-3 likely hypotheses (with uncertainty)
 * - Card C: 2 ethical "try next" experiments
 */

import { useState } from 'react';
import { X, Heart, Lightbulb, Compass, ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { ABCEntry } from '../hooks/useABCLogs';

interface ABCResponseCardsProps {
    entry: ABCEntry;
    onClose: () => void;
}

interface Hypothesis {
    text: string;
    reasoning: string;
}

interface Experiment {
    title: string;
    description: string;
    dignityNote: string;
}

export function ABCResponseCards({ entry, onClose }: ABCResponseCardsProps) {
    const [expanded, setExpanded] = useState<'A' | 'B' | 'C' | null>(null);

    // Generate context-aware content based on entry
    const affirmation = generateAffirmation(entry);
    const hypotheses = generateHypotheses(entry);
    const experiments = generateExperiments(entry);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">What This Might Mean</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Card A: Affirmation */}
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Heart className="text-green-600" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-green-900">You captured the moment</h3>
                                <p className="text-sm text-green-800 mt-1">{affirmation}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card B: Hypotheses */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setExpanded(expanded === 'B' ? null : 'B')}
                            className="w-full p-4 flex items-start gap-3 text-left"
                        >
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Lightbulb className="text-amber-600" size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-amber-900">What might be happening</h3>
                                <p className="text-sm text-amber-700 mt-1">
                                    {hypotheses.length} possible explanations (not diagnoses)
                                </p>
                            </div>
                            {expanded === 'B' ? <ChevronUp size={20} className="text-amber-500" /> : <ChevronDown size={20} className="text-amber-500" />}
                        </button>

                        {expanded === 'B' && (
                            <div className="px-4 pb-4 space-y-3">
                                {hypotheses.map((h, idx) => (
                                    <div key={idx} className="bg-white/70 rounded-lg p-3">
                                        <p className="font-medium text-slate-800">{h.text}</p>
                                        <p className="text-xs text-slate-500 mt-1">{h.reasoning}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Card C: Experiments */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setExpanded(expanded === 'C' ? null : 'C')}
                            className="w-full p-4 flex items-start gap-3 text-left"
                        >
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Compass className="text-indigo-600" size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-indigo-900">Try next</h3>
                                <p className="text-sm text-indigo-700 mt-1">
                                    Small, dignity-centered experiments
                                </p>
                            </div>
                            {expanded === 'C' ? <ChevronUp size={20} className="text-indigo-500" /> : <ChevronDown size={20} className="text-indigo-500" />}
                        </button>

                        {expanded === 'C' && (
                            <div className="px-4 pb-4 space-y-3">
                                {experiments.map((exp, idx) => (
                                    <div key={idx} className="bg-white/70 rounded-lg p-3">
                                        <p className="font-medium text-slate-800">{exp.title}</p>
                                        <p className="text-sm text-slate-600 mt-1">{exp.description}</p>
                                        <p className="text-xs text-indigo-600 mt-2 italic">
                                            💜 {exp.dignityNote}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Disclaimer */}
                    <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                        <Info size={14} className="flex-shrink-0 mt-0.5 text-slate-400" />
                        <span>
                            <strong>Educational support only.</strong> These suggestions are not medical advice,
                            diagnosis, or therapy. Every child is unique. Trust your knowledge of your child
                            and consult professionals for clinical decisions.
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper functions to generate content based on entry
function generateAffirmation(_entry: ABCEntry): string {
    const affirmations = [
        "By writing this down, you're building a map of your child's experience. That takes attention and love.",
        "Noticing patterns is powerful. You're gathering information that will help you and your child.",
        "Every entry is an act of advocacy. You're paying attention when it matters.",
        "This observation is valuable data. You're learning your child's language.",
        "By pausing to capture this, you're showing up for your child in a meaningful way."
    ];

    // Could be more sophisticated based on entry content
    return affirmations[Math.floor(Math.random() * affirmations.length)];
}

function generateHypotheses(entry: ABCEntry): Hypothesis[] {
    const hypotheses: Hypothesis[] = [];

    // Analyze antecedent for sensory/demand hypotheses
    const antecedent = entry.antecedent?.toLowerCase() || '';

    // Sensory hypothesis
    if (antecedent.includes('loud') || antecedent.includes('bright') || antecedent.includes('crowd') || antecedent.includes('touch')) {
        hypotheses.push({
            text: "Sensory regulation need",
            reasoning: "The environment might have been overwhelming. Bodies sometimes need to move or withdraw to process sensory input."
        });
    }

    // Transition hypothesis
    if (antecedent.includes('transition') || antecedent.includes('change') || antecedent.includes('stop') || antecedent.includes('end')) {
        hypotheses.push({
            text: "Transition difficulty",
            reasoning: "Shifting between activities can require significant mental energy. The behavior might be a way of coping with unexpected change."
        });
    }

    // Communication hypothesis
    hypotheses.push({
        text: "Communication attempt",
        reasoning: "All behavior communicates something. This might be your child's way of expressing a need they can't yet put into words."
    });

    // Demand/escape hypothesis (reframed)
    if (antecedent.includes('asked') || antecedent.includes('told') || antecedent.includes('had to')) {
        hypotheses.push({
            text: "Task difficulty or unclear expectations",
            reasoning: "The request might have felt overwhelming or confusing. This isn't defiance — it might be a signal that support is needed."
        });
    }

    // Ensure we have at least 2-3 hypotheses
    if (hypotheses.length < 2) {
        hypotheses.push({
            text: "Unmet need seeking expression",
            reasoning: "Something in the situation wasn't meeting your child's needs. With more observations, patterns may emerge."
        });
    }

    return hypotheses.slice(0, 3);
}

function generateExperiments(entry: ABCEntry): Experiment[] {
    const experiments: Experiment[] = [];
    const antecedent = entry.antecedent?.toLowerCase() || '';

    // Sensory-related
    if (antecedent.includes('loud') || antecedent.includes('crowd') || antecedent.includes('busy')) {
        experiments.push({
            title: "Offer a calm space first",
            description: "Before similar situations, check in: 'Do you need a quiet moment?' Provide noise-canceling headphones or a calm corner option.",
            dignityNote: "Respects their sensory experience as valid"
        });
    }

    // Transition-related
    if (antecedent.includes('transition') || antecedent.includes('change') || antecedent.includes('time to')) {
        experiments.push({
            title: "Add transition warnings",
            description: "Try a 5-minute, 2-minute, and 1-minute warning before changes. Use a visual timer if helpful.",
            dignityNote: "Gives them agency over their own readiness"
        });
    }

    // General experiments
    experiments.push({
        title: "Pause and observe before intervening",
        description: "Next time, take a breath before responding. Notice what happens if you wait 10 seconds. Sometimes space helps more than words.",
        dignityNote: "Trusts their capacity to self-regulate with support"
    });

    experiments.push({
        title: "Name the feeling together",
        description: "After things calm down, try: 'That seemed hard. I wonder if you were feeling [overwhelmed/frustrated/unsure]?' Let them correct you.",
        dignityNote: "Validates their inner experience without assuming"
    });

    return experiments.slice(0, 2);
}
