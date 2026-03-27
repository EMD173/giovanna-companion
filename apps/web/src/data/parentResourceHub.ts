/**
 * Parent Resource Hub Content
 * 
 * Resources for your family, your advocacy, and yourself.
 * Each topic includes: what this is, what helps, what to avoid, and a copy-ready script.
 * 
 * Categories:
 *   caregiving  — supporting your child (original 8 resources)
 *   caregiver-self — resources for the caregiver's OWN needs
 *   advocacy    — organizations, networks, and community connections
 *   funding     — grants, waivers, and financial support
 */

export type ResourceCategory = 'caregiving' | 'caregiver-self' | 'advocacy' | 'funding';

export interface CategoryInfo {
    key: ResourceCategory;
    label: string;
    labelEs: string;
    emoji: string;
    description: string;
}

export const RESOURCE_CATEGORIES: CategoryInfo[] = [
    { key: 'caregiving', label: 'Caregiving', labelEs: 'Cuidado', emoji: '💛', description: 'Supporting your child' },
    { key: 'caregiver-self', label: 'For You', labelEs: 'Para Ti', emoji: '🧠', description: 'Your own needs matter' },
    { key: 'advocacy', label: 'Advocacy', labelEs: 'Apoyo', emoji: '🤝', description: 'Organizations & community' },
    { key: 'funding', label: 'Funding', labelEs: 'Fondos', emoji: '💰', description: 'Grants & financial support' },
];

export interface ParentResource {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    icon: string; // Lucide icon name
    color: string;
    category: ResourceCategory;

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
        category: 'caregiving',
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
        category: 'caregiving',
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
        category: 'caregiving',
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
        category: 'caregiving',
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
        category: 'caregiving',
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
        category: 'caregiving',
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
        category: 'caregiving',
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
        category: 'caregiving',
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
    },

    // ─────────────────────────────────────────────
    // CATEGORY: CAREGIVER SELF-SUPPORT (caregiver-self)
    // "Caregivers of disabled people often have disabilities themselves."
    // — Shannon Mattox, Founding Ambassador
    // ─────────────────────────────────────────────

    {
        id: 'your-neurodivergence',
        slug: 'your-neurodivergence',
        title: 'Your Own Neurodivergence',
        subtitle: 'When the caregiver manages ADHD, autism, or learning differences',
        icon: 'Heart',
        color: 'blue',
        category: 'caregiver-self',
        whatThisIs: `A truth that few apps acknowledge: a significant percentage of parents raising neurodivergent children are neurodivergent themselves. ADHD, autism, dyslexia, anxiety disorders, sensory processing differences — these run in families, and the caregiving demands of the system often collide directly with your own needs.

You may struggle with executive function while managing a complex IEP schedule. You may be sensory-avoidant while your child is sensory-seeking. You may have undiagnosed ADHD that makes the paperwork mountain feel impossible. This isn't failure — it's navigating systems that weren't designed for you, while advocating for someone else in those same systems.`,
        whatHelpsThisWeek: [
            'Get screened yourself — many adults discover ADHD or autism during their child\'s evaluation journey',
            'Set up auto-reminders for every recurring task (meds, appointments, IEP deadlines)',
            'Reduce decision fatigue: meal-prep one day, set out clothes the night before',
            'Find one accommodation that helps YOU — noise-canceling headphones, visual schedules, body doubling',
            'Tell your child\'s care team about your own needs — they should accommodate YOU too'
        ],
        whatToAvoid: [
            'Masking your own needs to appear "together" for professionals',
            'Assuming your struggles mean you\'re a bad parent — the system is the problem, not you',
            'Using all your energy advocating for your child and leaving nothing for yourself',
            'Ignoring executive function struggles — they compound under caregiving stress'
        ],
        copyReadyScript: {
            context: 'Telling a provider about your own needs',
            script: `"I want to let you know that I also have [ADHD / sensory processing differences / anxiety]. This means I may need:

- Written summaries after our meetings instead of just verbal
- Extra processing time before making decisions  
- Agendas sent in advance so I can prepare
- Check-ins by text instead of phone calls when possible

I'm telling you this because I want to be the best advocate I can for [child's name], and accommodating my needs helps me do that."`
        },
        relatedLinks: [
            { label: 'ADHD in adults (CHADD)', url: 'https://chadd.org/' },
            { label: 'Late-diagnosed autism resources', url: 'https://autisticadvocacy.org/' },
            { label: 'Executive function strategies', url: 'https://www.understood.org/en/articles/understanding-executive-functioning-issues' }
        ]
    },
    {
        id: 'ssi-ssdi-caregivers',
        slug: 'ssi-ssdi-caregivers',
        title: 'SSI & SSDI for Caregivers',
        subtitle: 'Benefits YOU may qualify for — not just your child',
        icon: 'Shield',
        color: 'green',
        category: 'caregiver-self',
        whatThisIs: `Most caregivers know about SSI for their child, but many don't know they may qualify for benefits themselves. If you have a disability — diagnosed or undiagnosed — that limits your ability to work, you may be eligible for Supplemental Security Income (SSI) or Social Security Disability Insurance (SSDI).

Additionally, if your caregiving duties are so intensive that you can't maintain employment, some states offer Paid Family Caregiving programs, In-Home Supportive Services (IHSS), or consumer-directed personal assistance programs that PAY YOU to care for your child.

These aren't handouts. These are systems your taxes built. Using them is your right.`,
        whatHelpsThisWeek: [
            'Visit SSA.gov and create a my Social Security account to check your benefits',
            'Search "[Your State] paid family caregiver program" — many states have them and people don\'t know',
            'Ask your child\'s case manager about IHSS, consumer-directed care, or waiver-funded caregiver payments',
            'Document your caregiving hours for one week — this data supports applications',
            'Contact your local disability rights organization for free benefits counseling'
        ],
        whatToAvoid: [
            'Assuming you don\'t qualify — eligibility rules are complex and worth investigating',
            'Filing without help — free legal aid and benefits counselors exist for this',
            'Letting pride stop you — these programs exist because caregiving IS work',
            'Waiting until you\'re in crisis to explore financial support'
        ],
        copyReadyScript: {
            context: 'Asking a case manager about caregiver payment programs',
            script: `"I'm [child's name]'s primary caregiver, and the level of care they need has made it difficult for me to maintain employment. I'd like to explore:

1. Whether our state has a paid family caregiver or consumer-directed care program
2. Whether I might qualify for IHSS or a Medicaid waiver that compensates family caregivers
3. Any respite care funding I can access

Can you help me understand what's available and start the application process?"`
        },
        relatedLinks: [
            { label: 'Social Security Administration', url: 'https://www.ssa.gov/' },
            { label: 'Paid family caregiving programs by state', url: 'https://www.caregiver.org/resource/state-caregiver-support-programs/' },
            { label: 'Benefits.gov screening tool', url: 'https://www.benefits.gov/' }
        ]
    },
    {
        id: 'caregiver-mental-health',
        slug: 'caregiver-mental-health',
        title: 'Caregiver Mental Health',
        subtitle: 'Therapy, coaching, and support specifically for YOU',
        icon: 'Heart',
        color: 'rose',
        category: 'caregiver-self',
        whatThisIs: `Your mental health isn't a luxury — it's the foundation everything else is built on. Research consistently shows that caregivers of children with disabilities experience higher rates of depression, anxiety, PTSD, and chronic stress than the general population.

But here's what rarely gets said: the therapy models designed for general anxiety or depression often don't fit caregiver reality. You don't need someone telling you to "practice self-care" when you haven't slept a full night in three years. You need a therapist who understands the specific weight of navigating hostile systems while keeping a child alive and thriving.

ADHD coaching, trauma-informed therapy, somatic work, and peer support groups designed for disability caregivers — these are the interventions that actually move the needle.`,
        whatHelpsThisWeek: [
            'Search for a therapist who specializes in caregiver burnout or disability families',
            'If you have ADHD, look into ADHD coaching — it\'s different from therapy and often more immediately useful',
            'Try one somatic exercise: 5 minutes of bilateral tapping or a cold water face splash when overwhelmed',
            'Join an online peer support group — hearing "me too" from someone who actually gets it is medicine',
            'If therapy isn\'t accessible, try the SAMHSA helpline: 1-800-662-4357 (free, confidential, 24/7)'
        ],
        whatToAvoid: [
            'Therapists who don\'t understand disability parenting — find someone who gets it',
            'Waiting until you completely break down to seek support',
            'Believing you should be able to handle everything on your own',
            'Ignoring physical symptoms of stress (headaches, stomach issues, insomnia) — your body is talking'
        ],
        copyReadyScript: {
            context: 'Calling to find a therapist who understands your reality',
            script: `"I'm looking for a therapist who has experience with disability caregivers — specifically parents of neurodivergent children. I need someone who understands:

- Chronic stress from navigating medical and educational systems
- The intersection of my own possible neurodivergence and caregiving demands
- That my schedule is unpredictable and I may need flexible appointment times

Do you have someone on staff with this background, or can you refer me to someone who specializes in this?"`
        },
        relatedLinks: [
            { label: 'Therapy for Black Girls directory', url: 'https://therapyforblackgirls.com/' },
            { label: 'Open Path Collective (affordable therapy)', url: 'https://openpathcollective.org/' },
            { label: 'SAMHSA helpline (free, 24/7)', url: 'https://www.samhsa.gov/find-help/national-helpline' }
        ]
    },

    // ─────────────────────────────────────────────
    // CATEGORY: ADVOCACY ORGANIZATIONS (advocacy)
    // ─────────────────────────────────────────────

    {
        id: 'national-advocacy-orgs',
        slug: 'national-advocacy-orgs',
        title: 'National Advocacy Organizations',
        subtitle: 'Hidden networks that fight for YOUR family',
        icon: 'Shield',
        color: 'blue',
        category: 'advocacy',
        whatThisIs: `There are dozens of national organizations fighting for disability rights and family support — but most families never hear about them until they stumble into a crisis. These organizations provide free legal help, policy advocacy, parent training, peer mentorship, and direct service connections.

The Autism Self-Advocacy Network (ASAN) fights for autistic-led policy. The National Center for Learning Disabilities (NCLD) advocates for educational equity. The Disability Rights Network has a Protection & Advocacy agency in EVERY state with free legal support. The Arc provides local chapters nationwide with direct family services.

You are not alone. There are people who have made it their life's work to fight for your family's rights. Let them help.`,
        whatHelpsThisWeek: [
            'Look up your state\'s Protection & Advocacy (P&A) agency — they provide FREE legal help for disability rights',
            'Join The Arc\'s local chapter — they offer parent support groups, respite referrals, and benefits counseling',
            'Follow ASAN (Autistic Self-Advocacy Network) for policy updates that affect your child',
            'Check COPAA (Council of Parent Attorneys and Advocates) for IEP/504 legal support',
            'Sign up for email alerts from NCLD — they track legislation affecting learning disabilities'
        ],
        whatToAvoid: [
            'Trying to fight systemic battles alone — these organizations have lawyers and lobbyists',
            'Assuming advocacy organizations only serve certain diagnoses — most serve all disabilities',
            'Overlooking local chapters — national orgs often have powerful local affiliates',
            'Being intimidated by "legal" language — P&A agencies specifically help regular families navigate this'
        ],
        copyReadyScript: {
            context: 'Calling a Protection & Advocacy agency for the first time',
            script: `"Hello, I'm a parent of a child with [diagnosis], and I'm having difficulty getting appropriate services from [school/insurance/state agency].

I don't have legal representation, and I was told your agency provides free advocacy and legal support for disability rights cases. Can you help me understand:

1. Whether my situation qualifies for your assistance
2. What documentation I should gather
3. What my child's rights are under [IDEA/ADA/Section 504]?"`
        },
        relatedLinks: [
            { label: 'Find your state P&A agency', url: 'https://www.ndrn.org/about/ndrn-member-agencies/' },
            { label: 'Autistic Self-Advocacy Network (ASAN)', url: 'https://autisticadvocacy.org/' },
            { label: 'The Arc — find a local chapter', url: 'https://thearc.org/find-a-chapter/' },
            { label: 'COPAA — special education advocacy', url: 'https://www.copaa.org/' },
            { label: 'National Center for Learning Disabilities', url: 'https://www.ncld.org/' }
        ]
    },
    {
        id: 'local-support-networks',
        slug: 'local-support-networks',
        title: 'State & Local Support Networks',
        subtitle: 'Finding YOUR community nearby',
        icon: 'Users',
        color: 'green',
        category: 'advocacy',
        whatThisIs: `Every state has a network of disability support organizations that most families never find. Family-to-Family Health Information Centers, Parent Training and Information Centers (PTIs), early intervention programs, and local disability coalitions — all funded to help YOU, and most families don't know they exist.

The federal government funds a Parent Training and Information Center (PTI) in every state, specifically to help parents navigate special education. They offer free workshops, one-on-one advocacy, and peer mentoring from parents who've been through it.

Additionally, every state has a University Center for Excellence in Developmental Disabilities (UCEDD) and a Council on Developmental Disabilities — both mandated to provide community support. These aren't theoretical. They're in your county, waiting for your call.`,
        whatHelpsThisWeek: [
            'Find your state\'s PTI center at parentcenterhub.org — they offer FREE IEP and advocacy training',
            'Search for your state\'s Family-to-Family Health Information Center (F2F HIC)',
            'Contact your state\'s UCEDD for free developmental evaluations and family support',
            'Ask your pediatrician about Early Intervention services if your child is under 3',
            'Look for local parent support groups through your school district\'s special education office'
        ],
        whatToAvoid: [
            'Assuming these organizations are only for "severe" cases — they serve ALL disability families',
            'Paying for advocacy services before checking free options — your state PTI is free',
            'Only relying on school-provided information — independent parent centers know more',
            'Giving up after one unanswered phone call — these organizations are underfunded but committed'
        ],
        copyReadyScript: {
            context: 'Contacting your state\'s Parent Training and Information Center',
            script: `"Hi, I'm a parent of a child with [disability/diagnosis] in [your county/city]. I found your center through parentcenterhub.org.

I'm looking for help with:
- Understanding my child's rights under IDEA
- Preparing for an upcoming IEP meeting
- Connecting with other parents in similar situations locally

Do you offer one-on-one guidance or upcoming workshops I could attend? I'm new to navigating this system and could really use support from people who understand it."`
        },
        relatedLinks: [
            { label: 'Find your state PTI center', url: 'https://www.parentcenterhub.org/find-your-center/' },
            { label: 'Family-to-Family Health Info Centers', url: 'https://familyvoices.org/affiliates/' },
            { label: 'Find your UCEDD', url: 'https://www.aucd.org/directory/directory.cfm?program=UCEDD' },
            { label: 'State Councils on Developmental Disabilities', url: 'https://www.nacdd.org/councils/' }
        ]
    },
    {
        id: 'community-events',
        slug: 'community-events',
        title: 'Community Events & Social Networks',
        subtitle: 'Facebook groups, conferences, and local meetups',
        icon: 'Users',
        color: 'amber',
        category: 'advocacy',
        whatThisIs: `Connection is medicine. Research shows that caregiver isolation is one of the strongest predictors of burnout and depression. But finding community that truly understands your life — where you don't have to explain, translate, or minimize — can feel impossible.

The good news: there are vibrant, active communities of disability families online and in person. Facebook groups with thousands of members sharing strategies at 2am. National conferences where your child can stim freely and nobody bats an eye. Local sensory-friendly events designed for families like yours.

These aren't just nice-to-haves. These are lifelines. The parent who shows you a Medicaid trick, the family who invites you to a sensory-friendly movie night, the Facebook group that answers your crisis text at midnight — this is the village.`,
        whatHelpsThisWeek: [
            'Join at least one Facebook group specific to your child\'s diagnosis + your identity (e.g., "Black Autism Moms")',
            'Search Eventbrite and Meetup for "sensory-friendly" or "special needs family" events in your area',
            'Follow @AutisticBlackGirl, @TheAutisticOT, and @FidgetsAndFries on social media',
            'Look up the Autism Society\'s local chapter events — many are free',
            'Start small: one connection this week. Say hi in a group. Share one experience.'
        ],
        whatToAvoid: [
            'Doom-scrolling in parent groups without also engaging — lurking increases isolation',
            'Joining groups that feel deficit-based or pity-driven — find strength-based communities',
            'Comparing your journey to others in the group — everyone\'s path is different',
            'Feeling guilty about needing community — this is literally how humans survive'
        ],
        copyReadyScript: {
            context: 'Making your first post in a support group',
            script: `"Hi everyone, I'm new here. I'm [your name], parent/caregiver to [child's name] who is [age] and [diagnosis/needs].

I joined because I've been feeling pretty alone in this journey and I need people who get it. Things I'm currently navigating: [1-2 specific challenges].

I'm not looking for advice necessarily — just need to know I'm not the only one going through this. Thank you for being here. 💛"`
        },
        relatedLinks: [
            { label: 'Autism Society local events', url: 'https://www.autism-society.org/get-involved/' },
            { label: 'Sensory-friendly movie listings (AMC)', url: 'https://www.amctheatres.com/programs/sensory-friendly-films' },
            { label: 'Black Autism Network community', url: 'https://blackautismnetwork.org/' },
            { label: 'Special Olympics — local events', url: 'https://www.specialolympics.org/' }
        ]
    },

    // ─────────────────────────────────────────────
    // CATEGORY: FUNDING (funding)
    // ─────────────────────────────────────────────

    {
        id: 'grants-scholarships',
        slug: 'grants-scholarships',
        title: 'Grants & Scholarships',
        subtitle: 'Money that most families never learn about',
        icon: 'Heart',
        color: 'green',
        category: 'funding',
        whatThisIs: `There are hundreds of grants and scholarships specifically for individuals with disabilities and their families — and most people never find them. These aren't loans. They're free money for therapy, equipment, camps, assistive technology, and family support.

Organizations like First Hand Foundation, the Organization for Autism Research, ACE Scholarships, the Autism Care Today Family Fund, and dozens of diagnosis-specific foundations give away millions of dollars annually. Some are nationally competitive; others are small, local, and have very few applicants.

The key is knowing they exist and applying consistently. Many families who apply get funded — the barrier is awareness, not eligibility.`,
        whatHelpsThisWeek: [
            'Visit autismcaretoday.org to apply for their quarterly family grants (up to $5,000)',
            'Check First Hand Foundation — they fund individual therapy and equipment needs',
            'Search "disability grants [your state]" — many states have family support funds with open enrollment',
            'Apply for Organization for Autism Research (OAR) scholarships if your child is college-bound',
            'Ask your child\'s therapist about industry-specific grants — many therapy organizations have assistance programs'
        ],
        whatToAvoid: [
            'Paying for grant-search services — all legitimate grants are free to find and apply for',
            'Giving up after one denial — grant cycles are ongoing and your situation may fit another round',
            'Only looking at national grants — local and state-level grants often have less competition',
            'Assuming your income is too high — many grants are need-based but have generous thresholds'
        ],
        copyReadyScript: {
            context: 'Grant application cover letter template',
            script: `"Dear [Organization Name],

I am writing to apply for [specific grant/fund name] on behalf of my child, [child's name], age [age], who has been diagnosed with [diagnosis].

Our family is currently navigating [specific challenge: therapy costs, equipment needs, educational support]. [Child's name] would benefit from [specific service/item the grant covers] because [specific reason tied to their needs].

As a [single parent / low-income family / family without insurance coverage for this service], this funding would make a meaningful difference in our ability to support [child's name]'s development and wellbeing.

I have attached [required documents]. Thank you for your commitment to families like ours."`
        },
        relatedLinks: [
            { label: 'Autism Care Today — Family Grants', url: 'https://www.autismcaretoday.org/' },
            { label: 'First Hand Foundation', url: 'https://www.firsthandfoundation.org/' },
            { label: 'Organization for Autism Research', url: 'https://researchautism.org/' },
            { label: 'National database of disability grants', url: 'https://www.disability.gov/' }
        ]
    },
    {
        id: 'medicaid-waivers',
        slug: 'medicaid-waivers',
        title: 'Medicaid Waivers Explained',
        subtitle: 'State-by-state home and community-based services',
        icon: 'Shield',
        color: 'blue',
        category: 'funding',
        whatThisIs: `Medicaid Waivers are one of the most powerful — and most confusing — funding sources for disability families. These waivers allow states to provide home and community-based services (HCBS) that Medicaid normally doesn't cover: respite care, therapist visits in your home, adaptive equipment, caregiver training, and sometimes even home modifications.

The catch: every state has different waiver programs with different names, different eligibility rules, and different waitlists. Some waitlists are measured in YEARS. This is why applying NOW — even if your child is young — is critical.

The Katie Beckett waiver (also called TEFRA, Tax Equity and Fiscal Responsibility Act) is particularly important: it allows children with significant disabilities to qualify for Medicaid based on the CHILD'S disability — not the family's income. Many middle-income families don't know this exists.`,
        whatHelpsThisWeek: [
            'Search "[Your State] Medicaid waiver developmental disabilities" to find your state\'s specific programs',
            'Call your state\'s Medicaid office and ask about Katie Beckett / TEFRA eligibility',
            'Get on EVERY applicable waitlist NOW — even if the wait is long, your place in line matters',
            'Contact your state\'s Disability Rights organization for free help navigating waiver applications',
            'Ask your child\'s pediatrician to document "medical necessity" — this language matters for waiver approvals'
        ],
        whatToAvoid: [
            'Assuming your income disqualifies you — Katie Beckett waivers look at the CHILD\'s disability, not income',
            'Waiting until your child is older to apply — some waivers have age limits and waitlists start NOW',
            'Trying to navigate waiver applications alone — free counseling is available through your state P&A agency',
            'Accepting "denied" without appeal — many initial denials are overturned on appeal with proper documentation'
        ],
        copyReadyScript: {
            context: 'Calling your state Medicaid office about waivers',
            script: `"Hello, I'm calling to learn about home and community-based service waivers for my child, [child's name], who has [diagnosis/disability].

I'd like to know:
1. What HCBS waivers does our state offer for children with developmental disabilities?
2. Is my child eligible for Katie Beckett / TEFRA based on their disability?
3. What are the current waitlist times for each program?
4. Can I apply for multiple waivers simultaneously?
5. What documentation do I need to get started?

I want to make sure we're on every applicable waitlist as soon as possible."`
        },
        relatedLinks: [
            { label: 'Medicaid HCBS waivers by state', url: 'https://www.medicaid.gov/medicaid/home-community-based-services/index.html' },
            { label: 'Katie Beckett waiver information', url: 'https://www.medicaid.gov/medicaid/eligibility/index.html' },
            { label: 'Family Voices — insurance help', url: 'https://familyvoices.org/' },
            { label: 'Find your state Medicaid office', url: 'https://www.medicaid.gov/about-us/contact-us/index.html' }
        ]
    },
    {
        id: 'assistive-tech-funding',
        slug: 'assistive-tech-funding',
        title: 'Technology & Equipment Funding',
        subtitle: 'Getting assistive technology covered',
        icon: 'Battery',
        color: 'amber',
        category: 'funding',
        whatThisIs: `Assistive technology (AT) can transform your child's ability to communicate, learn, and navigate daily life — but the cost can be staggering. AAC devices, weighted blankets, sensory equipment, adaptive switches, specialized software, and communication tablets can run from hundreds to thousands of dollars.

What most families don't know: there are multiple pathways to get this technology FUNDED. Schools are required by law to provide AT if it's needed for your child's education (IDEA mandates this). Insurance may cover it if a doctor prescribes it as medically necessary. State AT loan programs let you TRY devices before buying. And organizations like the Assistive Technology Industry Association maintain state-by-state directories of AT funding.

Your child's right to communicate is not optional. The funding exists — you just have to know where to look.`,
        whatHelpsThisWeek: [
            'Ask your child\'s IEP team for an assistive technology evaluation — this is your RIGHT under IDEA',
            'Visit your state\'s AT Act program (every state has one) for device loans and demonstrations',
            'Get a letter of medical necessity from your child\'s doctor for insurance-covered AT',
            'Check with your state\'s Vocational Rehabilitation office — they fund AT for transition-age youth',
            'Look into UnitedHealthcare Children\'s Foundation and similar programs for AT grants'
        ],
        whatToAvoid: [
            'Buying expensive devices before exploring free trial/loan programs',
            'Accepting "we don\'t do that" from schools — AT evaluation is an IDEA right',
            'Getting one device and never reassessing — your child\'s needs evolve',
            'Overlooking low-tech solutions — sometimes a simple picture board is more effective than a $3,000 tablet'
        ],
        copyReadyScript: {
            context: 'Requesting an AT evaluation at an IEP meeting',
            script: `"I'd like to formally request an assistive technology evaluation for [child's name]. Under IDEA, the school is required to consider assistive technology for any child whose IEP team determines it's necessary for them to access their education.

[Child's name] currently struggles with [specific area: communication, writing, organization, sensory regulation in the classroom], and I believe an AT evaluation would help us identify tools that could support their learning.

I'm requesting this in writing today and would like confirmation of the evaluation timeline. Thank you."`
        },
        relatedLinks: [
            { label: 'Find your state AT program', url: 'https://www.at3center.net/stateprogram' },
            { label: 'IDEA and assistive technology rights', url: 'https://sites.ed.gov/idea/' },
            { label: 'AAC device funding guide', url: 'https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/' },
            { label: 'UnitedHealthcare Children\'s Foundation', url: 'https://www.uhccf.org/' }
        ]
    }
];

/**
 * Get resource by slug
 */
export function getResourceBySlug(slug: string): ParentResource | undefined {
    return PARENT_RESOURCES.find(r => r.slug === slug);
}

/**
 * Get resources filtered by category
 */
export function getResourcesByCategory(category: ResourceCategory): ParentResource[] {
    return PARENT_RESOURCES.filter(r => r.category === category);
}
