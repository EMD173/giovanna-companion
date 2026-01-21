export interface ContentItem {
    id: string;
    title: string;
    category: 'Behavior' | 'Sensory' | 'Communication' | 'Regulation';
    summary: string;
    definition: string;
    whyItHappens: string;
    whatToTry: string[];
    whatToAvoid: string[];
    whatToShare: string; // The text for the School Bridge card
    citations: Array<{
        text: string;
        link?: string;
    }>;
}

export const initialContent: ContentItem[] = [
    {
        id: 'stimming',
        title: 'Stimming (Self-Stimulatory Behavior)',
        category: 'Regulation',
        summary: 'Repetitive movements or sounds that help regulate the nervous system.',
        definition: 'Stimming (self-stimulatory behavior) refers to repetitive movements, sounds, or fidgeting. It is a natural and essential mechanism for emotional and sensory regulation.',
        whyItHappens: 'It provides sensory input (if under-stimulated) or blocks it out (if over-stimulated). It can also express intense joy, anxiety, or help with concentration.',
        whatToTry: [
            'Observe without intervening: Is the child happy? Safe? regulated?',
            'If unsafe, redirect to a safer alternative that provides similar sensory input (e.g., chewing a necklace instead of a shirt).',
            'Check the environment: Is it too loud? Too bright? The stim might be a signal of distress.'
        ],
        whatToAvoid: [
            'Stopping the behavior "quiet hands" demands (this removes their regulation tool).',
            'Shaming or punishing the behavior.',
            'Assuming it is "non-compliance" or distraction.'
        ],
        whatToShare: 'My child uses repetitive movements (stimming) to regulate their nervous system and manage focus. Please verify they are safe, but do not stop the behavior, as this increases anxiety and reduces their ability to learn.',
        citations: [
            { text: 'Kapp, S. K., et al. (2019). "People Should Be Allowed to Do Whatever They Like": Autistic Adults’ Views and Experiences of Stimming. Autism.', link: 'https://journals.sagepub.com/doi/10.1177/1362361319829628' }
        ]
    },
    {
        id: 'meltdown-vs-tantrum',
        title: 'Meltdown vs. Tantrum',
        category: 'Behavior',
        summary: 'Distinguishing between a physiological loss of control and a behavioral request.',
        definition: 'A meltdown is an involuntary neurological response to sensory or emotional overload (fight/flight/freeze). A tantrum is a goal-oriented behavior to get a desired outcome.',
        whyItHappens: 'Meltdowns occur when the brain is overwhelmed and can no longer process input. Tantrums occur when a child wants something and hasn not developed the skills to negotiate or accept "no".',
        whatToTry: [
            'For Meltdowns: Reduce demands immediately. Ensure safety. Low voice, low lights. Co-regulate (breathe with them).',
            'For Tantrums: Validate the feeling ("I know you are mad we cannot buy that"), but hold the boundary calmly.'
        ],
        whatToAvoid: [
            'Punishing a meltdown (they literally cannot control it).',
            'Talking too much during a meltdown (auditory processing is offline).',
            'giving in to a tantrum (reinforces the behavior).'
        ],
        whatToShare: 'Please distinguish between a choice (tantrum) and overload (meltdown). If my child is in a meltdown, they are not being "naughty"—their nervous system is crashed. Please reduce demands and provide a quiet space until they recover.',
        citations: [
            { text: 'Ross, B. (n.d.). Meltdowns vs. Tantrums. Child Mind Institute.', link: 'https://childmind.org/article/autism-and-meltdowns/' }
        ]
    },
    {
        id: 'functional-communication',
        title: 'Functional Communication',
        category: 'Communication',
        summary: 'Communication is about being understood, not just speech.',
        definition: 'Functional Communication Training (FCT) focuses on giving a child a reliable way to express wants, needs, and feelings, whether through speech, sign, AAC, or gestures.',
        whyItHappens: 'Many "behaviors" are actually failed attempts to communicate (e.g., hitting to say "stop").',
        whatToTry: [
            'Identify what the child is trying to say with their behavior.',
            'Teach a simpler replacement way to say it (e.g., handing a "Break" card instead of flipping a desk).',
            'Honor the communication immediately when they use the new method.'
        ],
        whatToAvoid: [
            'Forcing eye contact or "whole sentences" before honoring a request.',
            'Withholding items until they "say it right" (causes frustration).',
            'Ignoring non-verbal cues.'
        ],
        whatToShare: 'Behavior is communication. We are prioritizing my childs ability to advocate for their needs (e.g., asking for a break) over compliance. Please honor their requests even if they are not phrased perfectly.',
        citations: [
            { text: 'Carr, E. G., & Durand, V. M. (1985). Reducing behavior problems through functional communication training. Journal of Applied Behavior Analysis.', link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1307999/' }
        ]
    }
];
