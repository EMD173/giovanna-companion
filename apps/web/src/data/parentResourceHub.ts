/**
 * Parent Resource Hub Content
 * 
 * Resources for the emotional load of caregiving.
 * Each topic includes: what this is, what helps, what to avoid, and a copy-ready script.
 */

export interface ParentResource {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    icon: string; // Lucide icon name
    color: string;

    // Content sections
    whatThisIs: string;
    whatHelpsThisWeek: string[];
    whatToAvoid: string[];
    copyReadyScript: {
        context: string;
        script: string;
    };

    // Related resources
    relatedLinks: {
        label: string;
        url: string;
    }[];
}

export const PARENT_RESOURCES: ParentResource[] = [
    {
        id: 'burnout',
        slug: 'burnout',
        title: 'Caregiver Burnout',
        subtitle: 'When the weight feels too heavy',
        icon: 'Battery',
        color: 'rose',
        whatThisIs: `Caregiver burnout isn't a personal failing — it's what happens when you give continuously without adequate support, rest, or recognition. It can show up as exhaustion, irritability, feeling disconnected from your child, or losing interest in things you used to enjoy.

Research consistently shows that parents of neurodivergent children face higher rates of stress-related health issues. This isn't because neurodivergent children are burdens — it's because our systems weren't built to support families well.`,
        whatHelpsThisWeek: [
            'Identify one thing you can delegate or drop this week — even temporarily',
            'Schedule 15 minutes of something that refills you (not productivity, just rest)',
            'Reach out to one person who understands — not to solve, just to witness',
            'Write down three things you did well today (they can be tiny)',
            'Consider whether you need to ask for professional support'
        ],
        whatToAvoid: [
            'Comparing yourself to other parents (especially curated social media)',
            'Saying yes to new commitments when you\'re already depleted',
            'Waiting until you\'re "really" burnt out to take a break',
            'Isolating yourself further — even when it feels easier'
        ],
        copyReadyScript: {
            context: 'Asking for help from a partner, family member, or friend',
            script: `"I need to be honest with you. I'm running on empty and I need some support. I'm not asking you to fix everything, but here's one specific thing that would help this week: [specific request].

This isn't about me failing — it's about making sure I can keep showing up for [child's name]. Thank you for being someone I can ask."`
        },
        relatedLinks: [
            { label: 'Caregiver burnout research', url: 'https://pubmed.ncbi.nlm.nih.gov/22302147/' },
            { label: 'SAMHSA caregiver resources', url: 'https://www.samhsa.gov/caregiver-support' }
        ]
    },
    {
        id: 'isolation',
        slug: 'isolation',
        title: 'Isolation & Loneliness',
        subtitle: 'When no one seems to understand',
        icon: 'Users',
        color: 'blue',
        whatThisIs: `Parenting a neurodivergent child can be isolating in ways others don't see. Playdates that don't work out, events you skip to avoid overwhelm, friends who drift away, family who judges — it adds up.

The isolation isn't just about being physically alone. It's the loneliness of feeling unseen, even in a crowded room. It's explaining the same things over and over. It's smiling when people offer advice that shows they don't really get it.`,
        whatHelpsThisWeek: [
            'Find one online or in-person community of parents who "get it"',
            'Accept that some friendships may need to change — and that\'s okay',
            'Reach out to one person this week, even with just a text',
            'Notice when you\'re masking your own experience — and give yourself permission to be honest',
            'Remember: quality over quantity in relationships'
        ],
        whatToAvoid: [
            'Forcing connections that drain you more than they fill you',
            'Comparing your reality to neurotypical families\' highlight reels',
            'Assuming everyone will judge you — some people want to understand',
            'Waiting for others to reach out first (even though it\'s exhausting to keep trying)'
        ],
        copyReadyScript: {
            context: 'Reaching out to a friend who may not fully understand',
            script: `"Hey, I know we haven't connected in a while. Things have been intense with [child's name] and I've been in survival mode. I miss you.

I'm not looking for advice — I just miss having someone to talk to about regular life stuff sometimes. Want to [specific low-key activity]? No pressure if timing doesn't work."`
        },
        relatedLinks: [
            { label: 'Autism parent support groups', url: 'https://www.autism-society.org/' },
            { label: 'Online community: Reddit r/Autism_Parenting', url: 'https://www.reddit.com/r/Autism_Parenting/' }
        ]
    },
    {
        id: 'family-conflict',
        slug: 'family-conflict',
        title: 'Navigating Family Conflict',
        subtitle: 'When loved ones don\'t agree',
        icon: 'MessageSquare',
        color: 'amber',
        whatThisIs: `Disagreements about your child — with partners, grandparents, or extended family — can feel uniquely painful. You're trying to protect and support your child while also managing relationships with people you love.

Common conflicts include: different views on discipline, skepticism about diagnoses or needs, unsolicited advice, comparisons to other children, and misunderstanding of behaviors. These conflicts are about values, fear, and love — on all sides.`,
        whatHelpsThisWeek: [
            'Pick one relationship to focus on this week — not all at once',
            'Lead with shared values: "We both want [child\'s name] to thrive"',
            'Share one resource (article, video) that explains what you see',
            'Set one boundary clearly: "I need you to trust my judgment on this"',
            'Accept that some people may need more time — or may never fully understand'
        ],
        whatToAvoid: [
            'Having important conversations when either party is depleted or activated',
            'Expecting one conversation to change someone\'s perspective',
            'Putting your child in the middle of adult conflicts',
            'Cutting off relationships too quickly (unless safety is a concern)'
        ],
        copyReadyScript: {
            context: 'Talking to a family member who questions your approach',
            script: `"I know you love [child's name] and want what's best. So do I. The approaches I'm using come from research and from knowing my child really well.

I'm not asking you to agree with everything. I'm asking you to trust that I'm making thoughtful decisions. What would help is [specific supportive action]. Can we try that?"`
        },
        relatedLinks: [
            { label: 'Article: Helping grandparents understand', url: 'https://www.understood.org/en/articles/grandparents-guide-to-understanding-learning-and-attention-issues' }
        ]
    },
    {
        id: 'school-prep',
        slug: 'school-prep',
        title: 'School Meeting Prep',
        subtitle: 'Showing up prepared and empowered',
        icon: 'GraduationCap',
        color: 'green',
        whatThisIs: `IEP meetings, parent-teacher conferences, and school team meetings can feel overwhelming. You're advocating for your child in a system that often prioritizes compliance over connection.

The goal isn't to "win" against the school — it's to build a partnership where your child's needs are understood and met. You are an equal member of the team, and your knowledge of your child is irreplaceable.`,
        whatHelpsThisWeek: [
            'Write down your top 3 priorities for your child this year',
            'Prepare one specific example of what works at home',
            'Bring a support person if you can (partner, friend, advocate)',
            'Request the agenda in advance and add your items',
            'Take notes or ask to record (where legally permitted)'
        ],
        whatToAvoid: [
            'Going in expecting conflict (even if past experiences were hard)',
            'Agreeing to things you\'re unsure about in the moment — you can say "I need to think about that"',
            'Forgetting that teachers are often under-resourced too',
            'Leaving without clear next steps in writing'
        ],
        copyReadyScript: {
            context: 'Introducing your child at a school meeting',
            script: `"Thank you for being here. Before we start, I want to share what I see at home.

[Child's name] is curious, creative, and has a great sense of humor. They do best when they have extra processing time, clear expectations, and sensory breaks.

What I'd love for us to focus on today is [specific goal]. I'm here as a partner, and I'm hoping we can work together to help [child's name] thrive — not just comply."`
        },
        relatedLinks: [
            { label: 'Parent advocacy resources', url: 'https://www.wrightslaw.com/' },
            { label: 'IEP meeting rights', url: 'https://www.understood.org/en/articles/10-things-to-know-about-iep-meetings' }
        ]
    }
];

/**
 * Get resource by slug
 */
export function getResourceBySlug(slug: string): ParentResource | undefined {
    return PARENT_RESOURCES.find(r => r.slug === slug);
}
