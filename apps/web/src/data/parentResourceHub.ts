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
        id: 'police-safety',
        slug: 'police-interaction',
        title: 'Police Interaction Guide',
        subtitle: 'Scripts and strategies for high-stakes moments',
        icon: 'Shield',
        color: 'rose',
        whatThisIs: `For Black autistic individuals, interactions with law enforcement carry a unique and heavy weight. The "compliance" expected by officers—quick responses, eye contact, stillness—can be impossible for an autistic nervous system under stress.
        
This guide isn't about scaring you. It's about arming you with specific scripts and tools to de-escalate these moments before they begin. It's about safety, dignity, and making sure your child comes home.`,
        whatHelpsThisWeek: [
            'Practice the "Disclosure Script" when your child is calm',
            'Create a laminated " Essential Info" card for their wallet or lanyard',
            'Visit your local precinct to introduce your child in a non-crisis moment',
            'Teach "Hands on Dashboard" or "Hands Visible" as a sensory drill',
            'Identify a "Safe Person" neighbor who can intervene if you aren\'t there'
        ],
        whatToAvoid: [
            'Relying on verbal communication alone during high-stress moments',
            'Assuming officers have been trained in autism or neurodivergence',
            'Making sudden movements to reach for an ID card',
            'Leaving the house without identification or emergency contact info'
        ],
        copyReadyScript: {
            context: 'Script for the Autistic Individual to memorize or have on a card',
            script: `"I have a disability called Autism.
I am not resisting you.
I may not look at you or answer quickly.
I may act different when I am scared.
Please do not touch me.
Please call my emergency contact: [Number]."`
        },
        relatedLinks: [
            { label: 'BE SAFE: The Movie (Police interaction training)', url: 'https://besafethemovie.com/' },
            { label: 'NAACP: Interactions with Law Enforcement', url: 'https://naacp.org/' }
        ]
    },
    {
        id: 'burnout',
        slug: 'burnout',
        title: 'Protecting Our Peace',
        subtitle: 'Rest as resistance against burnout',
        icon: 'Battery',
        color: 'rose',
        whatThisIs: `Caregiver burnout isn't a personal failure—it's what happens when you pour from an empty cup into a system with holes in it. In our community, "strength" is often praised, but rest is revolutionary.
        
Protecting your peace isn't selfish. It is the only way to sustain the advocacy and love your child needs. You are the most important intervention.`,
        whatHelpsThisWeek: [
            'Identify one thing you can delegate or drop this week',
            'Schedule 15 minutes of "unproductive" rest (staring at trees, listening to music)',
            'Reach out to one person who understands—not to solve, just to witness',
            'Write down three things you did well today (they can be tiny)',
            'Say "No" to a request that drains your battery'
        ],
        whatToAvoid: [
            'Comparing your journey to curated social media lives',
            'Waiting until you collapse to take a break',
            'Believing you must be "on" 24/7 to be a good parent',
            'Isolating yourself when things get hard'
        ],
        copyReadyScript: {
            context: 'Asking for specific help',
            script: `"I need to be honest—I'm running on empty. I'm not asking you to fix everything, but I need some support to keep showing up for [Child's Name].
            
Could you handle [specific task: laundry, dinner, school pickup] this week? It would give me the breathing room I need to reset."`
        },
        relatedLinks: [
            { label: 'The Nap Ministry', url: 'https://thenapministry.wordpress.com/' },
            { label: 'SAMHSA Caregiver Support', url: 'https://www.samhsa.gov/caregiver-support' }
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
    },
    {
        id: 'family-stigma',
        slug: 'family-stigma',
        title: 'Navigating Family Stigma',
        subtitle: 'When family says "nothing\'s wrong with that child"',
        icon: 'Users',
        color: 'amber',
        whatThisIs: `In many Black families, an autism diagnosis can be met with denial, skepticism, or blame. You may hear things like "Why put that label on him?" or "He's just being a boy." Extended family may suggest more discipline instead of accommodation. Church members may imply you should "pray it away."

This isn't because your family doesn't love your child — it's often about protection. Many Black parents and grandparents have seen how labels are used to harm Black children in schools and systems. Denial can feel like defense.

But your child needs support, and you need your family's support too. Navigating this tension is real, exhausting work.`,
        whatHelpsThisWeek: [
            'Start with one family member who seems most open — don\'t try to convince everyone at once',
            'Share a short video or article that shows autism in Black children specifically',
            'Lead with "I need your support" rather than "You need to understand"',
            'Find language that works for your family — you don\'t have to use clinical terms',
            'Connect with other Black parents who\'ve navigated family stigma'
        ],
        whatToAvoid: [
            'Expecting one conversation to change decades of beliefs',
            'Debating in front of your child',
            'Cutting off family completely (unless safety is at stake)',
            'Letting guilt push you into hiding your child\'s needs'
        ],
        copyReadyScript: {
            context: 'Talking to a skeptical family member (grandparent, aunt, uncle)',
            script: `"I know this is hard to hear. I need you to know that autism doesn't mean something is wrong with [child's name]. It means their brain works differently — and understanding that helps me help them.

When you say 'nothing's wrong,' I hear your love. But when I don't get support, I feel alone in this. I'm not asking you to agree with everything. I'm asking you to trust that I'm doing what's best for my child.

What would really help is [specific request: coming to appointments, learning about meltdowns vs. tantrums, not suggesting discipline when they're overwhelmed]."`
        },
        relatedLinks: [
            { label: 'Black autism parent stories', url: 'https://www.autism-society.org/' },
            { label: 'Autism in the Black community', url: 'https://blackautismnetwork.org/' }
        ]
    },
    {
        id: 'double-burden',
        slug: 'double-burden',
        title: 'The Double Burden',
        subtitle: 'When racism and ableism collide',
        icon: 'Heart',
        color: 'rose',
        whatThisIs: `Black families navigating autism face what researchers call a "double burden" — the intersection of racism and ableism. Your child's behaviors may be read through racial stereotypes instead of understood as autism.

A meltdown becomes "aggression." Stimming becomes "acting wild." Not making eye contact becomes "defiance." You've watched doctors dismiss your concerns, teachers rush to punishment, and systems designed to help instead cause harm.

This isn't in your head. Research shows Black children are diagnosed 3-4 years later than white children — even when parents raise concerns at the same age. You're not fighting twice as hard because you're failing. You're fighting twice as hard because the system wasn't built for you.`,
        whatHelpsThisWeek: [
            'Document everything — dates, names, what was said, what was promised',
            'Request evaluations in writing so there\'s a paper trail',
            'Bring someone with you to appointments when possible',
            'Ask explicitly: "Is this behavior being considered in the context of autism?"',
            'Find providers who understand intersectionality — prioritize Black therapists when available'
        ],
        whatToAvoid: [
            'Second-guessing your own observations — you know your child',
            'Accepting "wait and see" when your gut says something is wrong',
            'Blaming yourself for systemic failures',
            'Masking your concerns to seem "agreeable" in meetings'
        ],
        copyReadyScript: {
            context: 'When a provider seems to be misreading your child\'s behavior',
            script: `"I want to make sure we're interpreting [child's name]'s behavior through an autism lens, not a behavioral one.

What looks like defiance or aggression may actually be [sensory overload, communication difficulty, transition anxiety]. I've seen this at home, and these are documented autism presentations.

Can we pause and talk about what accommodations might help, before we discuss discipline or consequences?"`
        },
        relatedLinks: [
            { label: 'Therapy for Black Kids directory', url: 'https://www.therapyforblackkids.com/' },
            { label: 'Melanin & Autism support', url: 'https://www.inclusiveautism.org/' }
        ]
    },
    {
        id: 'safety',
        slug: 'safety',
        title: 'Keeping Our Children Safe',
        subtitle: 'Preparing for a world that may not understand',
        icon: 'Heart',
        color: 'rose',
        whatThisIs: `For Black parents of autistic children, safety isn't just about childproofing the house. It's about a world where your child's autistic traits — not responding quickly to commands, reaching for objects, pacing, making unexpected movements — could be fatally misunderstood.

This fear is real and it's backed by research. Black autistic children and adults face unique risks in encounters with police, security, and even well-meaning strangers who misread their behavior.

Preparing your child isn't about scaring them. It's about giving them tools. And advocating for your child means educating others too — teachers, neighbors, extended family — so they don't call for the wrong kind of "help."`,
        whatHelpsThisWeek: [
            'Practice simple scripts with your child: "I have autism. I need a moment to think."',
            'Create an ID card or wearable with key information about your child',
            'Notify local police about your child (some departments have registries)',
            'Talk to school about what happens if police are called on campus',
            'Educate neighbors: "If you see [child\'s name] outside, please call me, not 911"'
        ],
        whatToAvoid: [
            'Avoiding the conversation because it\'s painful — preparation protects',
            'Assuming school resource officers understand autism',
            'Waiting until an incident to educate your community',
            'Carrying this fear alone — connect with other parents navigating this'
        ],
        copyReadyScript: {
            context: 'Telling a neighbor or community member about your child',
            script: `"I wanted to introduce you to [child's name]. They have autism, which means they might not always respond the way you expect.

If you ever see them outside and they seem confused or aren't responding, please call me first at [phone number]. They're not in danger — they just might need a familiar voice.

I really appreciate you being someone I can count on in our community."`
        },
        relatedLinks: [
            { label: 'Autism safety resources', url: 'https://www.autismspeaks.org/safety' },
            { label: 'National Autism Association safety toolkit', url: 'https://nationalautismassociation.org/resources/autism-safety-facts/' }
        ]
    }
];

/**
 * Get resource by slug
 */
export function getResourceBySlug(slug: string): ParentResource | undefined {
    return PARENT_RESOURCES.find(r => r.slug === slug);
}
