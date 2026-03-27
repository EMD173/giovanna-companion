/**
 * Theory-to-Practice Modules
 *
 * Pillar 1: Parent as Practitioner
 *
 * Six progressive modules that teach parents the theoretical frameworks
 * behind neurodivergent behavior — not as academic content, but as
 * practitioner-level tools they can use in real time.
 *
 * Each module follows a 4-phase cycle:
 *   LEARN  → Understand the theory (what scholars say)
 *   OBSERVE → Practice noticing (guided observation prompts)
 *   PRACTICE → Try a specific strategy (home activity)
 *   REFLECT → Journal what happened (builds data for patterns)
 *
 * Mapped to: content/scholars/CORE_FOUNDATIONS.md
 * Mapped to: content/scholars/FRAMEWORKS.md
 * Mapped to: content/scholars/PRINCIPLES.md
 */

export type ModulePhase = 'learn' | 'observe' | 'practice' | 'reflect';

export interface PhaseContent {
    phase: ModulePhase;
    title: string;
    description: string;
    /** Guided prompts or activities for this phase */
    activities: PhaseActivity[];
    /** Estimated time in minutes */
    estimatedMinutes: number;
}

export interface PhaseActivity {
    id: string;
    type: 'read' | 'prompt' | 'exercise' | 'journal' | 'observe';
    title: string;
    content: string;
    /** Optional follow-up question for journal entries */
    journalPrompt?: string;
}

export interface PracticeModule {
    id: string;
    slug: string;
    /** Module number (1-6) */
    order: number;
    title: string;
    subtitle: string;
    /** Why this matters — parent-facing, emotionally grounded */
    whyThisMatters: string;
    /** The scholar(s) whose work anchors this module */
    scholars: string[];
    /** Primary scholarly citation */
    citation: string;
    /** Which core principle this maps to */
    corePrinciple: string;
    /** Which EC lens this connects to */
    ecLens: 'lineage' | 'environment' | 'nervous-system' | 'meaning' | 'all';
    /** Lucide icon name */
    icon: string;
    /** Theme color key from sanctuary palette */
    color: 'gold' | 'sage' | 'purple' | 'rose';
    /** The four phases of the module */
    phases: PhaseContent[];
    /** What success looks like after completing this module */
    outcomeStatement: string;
    /** Tags for connecting to ABC log functions */
    relatedFunctions: ('escape' | 'attention' | 'tangible' | 'sensory')[];
    /** Prerequisite module slug, if any */
    prerequisite?: string;
    /** Tier required */
    tier: 'free' | 'companion' | 'pro';
}

/**
 * Progress record stored in Firestore
 */
export interface ModuleProgress {
    moduleId: string;
    userId: string;
    familyId: string;
    /** Phase completion status */
    completedPhases: ModulePhase[];
    /** Activity completion by activity ID */
    completedActivities: string[];
    /** Journal entries from reflect phase */
    journalEntries: {
        activityId: string;
        response: string;
        timestamp: Date;
    }[];
    /** When they started this module */
    startedAt: Date;
    /** When they completed all 4 phases */
    completedAt?: Date;
    /** Badge earned on completion */
    badgeEarned: boolean;
}

// ============================================
// THE SIX MODULES
// ============================================

export const PRACTICE_MODULES: PracticeModule[] = [
    // ─────────────────────────────────────────
    // MODULE 1: BEHAVIOR IS COMMUNICATION
    // ─────────────────────────────────────────
    {
        id: 'mod-1-behavior-communication',
        slug: 'behavior-is-communication',
        order: 1,
        title: 'Behavior Is Communication',
        subtitle: 'Decoding what your child is really saying',
        whyThisMatters: `Every behavior your child shows you is a message. Not a problem to fix — a communication to decode. When a child flips a desk, hits a sibling, or shuts down completely, their nervous system is saying something their words cannot. This module teaches you to hear the message underneath the behavior, the same way a clinician would — except you get to do it with the love and context only a parent has.`,
        scholars: ['Dr. Edward Carr', 'Dr. V. Mark Durand'],
        citation: 'Carr, E. G., & Durand, V. M. (1985). Reducing behavior problems through functional communication training. Journal of Applied Behavior Analysis, 18(2), 111–126.',
        corePrinciple: 'Behavior is communication, not defiance',
        ecLens: 'nervous-system',
        icon: 'MessageCircle',
        color: 'gold',
        relatedFunctions: ['escape', 'attention', 'tangible', 'sensory'],
        tier: 'free',
        outcomeStatement: 'You can identify the communicative function behind a challenging behavior and respond to the message, not just the action.',
        phases: [
            {
                phase: 'learn',
                title: 'The Theory',
                description: 'Understanding Functional Communication Training (FCT)',
                estimatedMinutes: 10,
                activities: [
                    {
                        id: 'm1-learn-1',
                        type: 'read',
                        title: 'The Four Functions of Behavior',
                        content: `In Applied Behavior Analysis, every behavior serves one of four functions — it's not random, and it's not "just being bad." Understanding which function a behavior serves is the single most powerful thing you can learn as a parent.\n\n**Escape**: "I need to get away from this." The child is trying to avoid or end something overwhelming — a demand, a sensation, a social situation.\n\n**Attention**: "I need to be seen." The child needs connection, acknowledgment, or engagement — even if the way they seek it looks disruptive.\n\n**Tangible**: "I need access to something." The child wants a specific item, activity, or outcome and doesn't yet have the skills to negotiate or wait.\n\n**Sensory**: "My body needs something." The child's nervous system is seeking or avoiding sensory input — not for social reasons, but because their body requires it.\n\nWhen you log a behavior in Giovanna's ABC Logger, the "Function" field is asking you this exact question. You're not guessing — you're hypothesizing, the same way a Board Certified Behavior Analyst (BCBA) would.`
                    },
                    {
                        id: 'm1-learn-2',
                        type: 'read',
                        title: 'Why This Changes Everything',
                        content: `Here's what shifts when you know the function:\n\n**Without function knowledge**: Your child screams and throws their plate at dinner. You think: "They're being defiant. They need consequences."\n\n**With function knowledge**: Your child screams and throws their plate. You think: "What happened right before this? The kitchen got loud (sensory overload), and I asked them to try a new food (demand). This is likely an escape behavior — their nervous system is saying 'too much.'"\n\nThe response changes completely. Instead of punishment (which adds more demand to an already overwhelmed system), you reduce the load: lower the volume, remove the demand, give them space. The behavior decreases — not because you forced compliance, but because you addressed the need.\n\nThis is what Carr and Durand proved in 1985: when you teach a child an alternative way to communicate the same need (a "break" card instead of throwing), challenging behavior drops. Not through punishment. Through understanding.`
                    }
                ]
            },
            {
                phase: 'observe',
                title: 'Practice Noticing',
                description: 'Guided observation of your child\'s behavior patterns',
                estimatedMinutes: 15,
                activities: [
                    {
                        id: 'm1-observe-1',
                        type: 'observe',
                        title: '24-Hour Function Watch',
                        content: `For the next 24 hours, when your child shows a challenging behavior, pause before reacting and ask yourself:\n\n1. **What happened right BEFORE?** (The antecedent — was there a demand, a transition, a sensory change, a loss of attention?)\n\n2. **What happened right AFTER?** (The consequence — did they escape something? Get attention? Access something? Get sensory relief?)\n\n3. **Which function does this suggest?** (Escape, Attention, Tangible, or Sensory?)\n\nYou don't need to log formally yet. Just notice. Carry this awareness like a lens.`,
                        journalPrompt: 'Describe one behavior you observed today. What happened before it? What happened after? What function do you think it served?'
                    },
                    {
                        id: 'm1-observe-2',
                        type: 'prompt',
                        title: 'Pattern Scan',
                        content: `Think about the last week. Can you identify a behavior that happened more than once?\n\n- Does it tend to happen at the same TIME of day?\n- Does it happen in the same PLACE or CONTEXT?\n- Does it happen with the same PERSON present?\n- Does it happen when the same DEMAND is placed?\n\nIf you can answer yes to any of these, you've just identified a behavioral pattern — and that pattern tells you the function. A behavior that always happens during homework? Likely escape. Always when you're on the phone? Likely attention. Always at the grocery store? Likely sensory.`,
                        journalPrompt: 'What pattern did you notice? What does the repetition tell you about what your child needs?'
                    }
                ]
            },
            {
                phase: 'practice',
                title: 'Try It At Home',
                description: 'Apply function-based thinking to a real situation',
                estimatedMinutes: 20,
                activities: [
                    {
                        id: 'm1-practice-1',
                        type: 'exercise',
                        title: 'The Function-Based Response',
                        content: `Choose one recurring challenging behavior. Based on your observation, identify the likely function and try the matched response:\n\n**If ESCAPE**: Reduce the demand. Break the task into smaller steps. Offer a "break" signal (a card, a word, a gesture). "You can say 'pause' instead of pushing the book away."\n\n**If ATTENTION**: Give attention BEFORE the behavior occurs. Set up 1-on-1 check-ins. "I see you. Tell me about your day." When the challenging behavior happens, keep your response neutral — big reactions reinforce attention-seeking.\n\n**If TANGIBLE**: Teach waiting and turn-taking when calm (not during the moment). Use visual timers. "First homework, then tablet — here's the timer so you can see."\n\n**If SENSORY**: Provide the sensory input proactively. Offer alternatives that meet the same need. Chew necklaces, weighted blankets, movement breaks. The body gets what it needs without the challenging behavior.`,
                        journalPrompt: 'Which function did you target? What response did you try? What happened?'
                    },
                    {
                        id: 'm1-practice-2',
                        type: 'exercise',
                        title: 'Log It in Giovanna',
                        content: `Open the ABC Logger and record the behavior you just worked with.\n\n- Enter the Antecedent (what happened before)\n- Describe the Behavior (what you saw)\n- Note the Consequence (what happened after)\n- Select the Function hypothesis\n\nThis log becomes data. Over time, Giovanna's pattern detection will show you trends you can't see in a single moment. You're building an evidence base — the same kind a BCBA creates, but with the irreplaceable context of a parent who knows their child.`
                    }
                ]
            },
            {
                phase: 'reflect',
                title: 'Make It Yours',
                description: 'Journal and integrate what you\'ve learned',
                estimatedMinutes: 10,
                activities: [
                    {
                        id: 'm1-reflect-1',
                        type: 'journal',
                        title: 'What Shifted?',
                        content: `Take a few minutes to reflect on what you experienced during this module.`,
                        journalPrompt: 'Before this module, how did you interpret your child\'s challenging behaviors? Has anything shifted in how you see them now? What feels different?'
                    },
                    {
                        id: 'm1-reflect-2',
                        type: 'journal',
                        title: 'Letter to Your Child',
                        content: `Write a short note — even just a few sentences — to your child (you don't have to share it). Tell them what you're learning about their communication. Tell them what you see now that you didn't see before.`,
                        journalPrompt: 'Dear [child\'s name], I\'m learning that when you... it might mean you need... I want you to know that I...'
                    }
                ]
            }
        ]
    },

    // ─────────────────────────────────────────
    // MODULE 2: THE NERVOUS SYSTEM
    // ─────────────────────────────────────────
    {
        id: 'mod-2-nervous-system',
        slug: 'understanding-the-nervous-system',
        order: 2,
        title: 'Understanding the Nervous System',
        subtitle: 'Why your child can\'t "just calm down"',
        whyThisMatters: `You've probably said it — or heard someone say it — "Just calm down." But here's what polyvagal theory teaches us: when your child's nervous system shifts into survival mode, the part of their brain that processes language, follows instructions, and makes choices goes offline. They literally cannot hear you. This isn't defiance. This is neurobiology. And understanding it changes everything about how you respond.`,
        scholars: ['Dr. Stephen Porges', 'Dr. Mona Delahooke'],
        citation: 'Porges, S. W. (2011). The Polyvagal Theory: Neurophysiological Foundations of Emotions, Attachment, Communication, and Self-Regulation. W. W. Norton.',
        corePrinciple: 'Regulation over compliance',
        ecLens: 'nervous-system',
        icon: 'Activity',
        color: 'rose',
        relatedFunctions: ['escape', 'sensory'],
        prerequisite: 'behavior-is-communication',
        tier: 'free',
        outcomeStatement: 'You can identify your child\'s nervous system state and match your response to their regulation level, not their behavior.',
        phases: [
            {
                phase: 'learn',
                title: 'The Theory',
                description: 'Polyvagal Theory made practical',
                estimatedMinutes: 12,
                activities: [
                    {
                        id: 'm2-learn-1',
                        type: 'read',
                        title: 'Three States of the Nervous System',
                        content: `Dr. Stephen Porges discovered that our autonomic nervous system — the part that runs without our conscious control — operates in three distinct states:\n\n**1. Ventral Vagal (Safe & Connected)** 💚\nThis is the "green zone." Your child is calm, curious, able to learn, able to connect. Their face is expressive, their voice is melodic, they can make eye contact naturally. This is the ONLY state where learning, instruction, and correction work.\n\n**2. Sympathetic (Fight or Flight)** 🟡\nThis is the "yellow/red zone." The nervous system has detected danger — real or perceived. Heart rate increases, muscles tense, breathing gets shallow. Your child may lash out (fight), run away (flight), or become hyperactive and unfocused. They are NOT choosing this. Their body is protecting them.\n\n**3. Dorsal Vagal (Freeze/Shutdown)** 🔵\nThis is the "blue zone." When fight or flight isn't enough, the nervous system shuts down to conserve energy. Your child may go silent, seem "checked out," become limp or unresponsive, or appear to comply while being emotionally absent. This is the most misunderstood state — it often looks like calm compliance, but it's actually collapse.\n\nDr. Mona Delahooke puts it simply: "Look beneath the behavior to the nervous system state driving it." The behavior is the symptom. The nervous system state is the cause.`
                    },
                    {
                        id: 'm2-learn-2',
                        type: 'read',
                        title: 'Why "Just Calm Down" Doesn\'t Work',
                        content: `When your child is in fight/flight or freeze, the prefrontal cortex — the brain region responsible for language processing, decision-making, and impulse control — is functionally offline. This is not a choice. It's neuroanatomy.\n\nThat means:\n- They cannot process your words (even if they seem to hear you)\n- They cannot follow multi-step instructions\n- They cannot "choose" to calm down\n- They cannot learn from consequences in this state\n- Punishment INCREASES activation, making regulation harder\n\nThe only path back to the green zone is through SAFETY SIGNALS — not demands. A calm voice. A steady presence. Reduced sensory input. Time. Co-regulation.\n\n**The rule**: Regulation comes before instruction. Always. Every time. No exceptions.\n\nThis is what Dr. Delahooke calls "Beyond Behaviors" — stopping the instinct to manage the behavior and instead attending to the nervous system state underneath it.`
                    }
                ]
            },
            {
                phase: 'observe',
                title: 'Practice Noticing',
                description: 'Learning to read your child\'s nervous system state',
                estimatedMinutes: 15,
                activities: [
                    {
                        id: 'm2-observe-1',
                        type: 'observe',
                        title: 'The State Check',
                        content: `For the next 48 hours, practice reading your child's nervous system state at different moments throughout the day. Use these cues:\n\n**Green Zone Signs**: Relaxed face, varied tone of voice, open body posture, willingness to engage, can make eye contact, can follow directions, can tolerate frustration.\n\n**Yellow/Red Zone Signs**: Clenched fists, raised voice, rapid breathing, pacing, hitting, kicking, running, hyperactivity, crying, screaming, rigid body.\n\n**Blue Zone Signs**: Flat voice or silence, limp body, vacant stare, "zoned out," seeming to comply but emotionally absent, very slow responses, hiding, curling up.\n\nCheck in at least 3 times per day: morning, after school, and bedtime. What state are they in? What was happening in their environment at that moment?`,
                        journalPrompt: 'What nervous system states did you observe today? Were there moments you would have previously called "misbehavior" that you now see differently?'
                    },
                    {
                        id: 'm2-observe-2',
                        type: 'observe',
                        title: 'Check YOUR State',
                        content: `This is the part most programs skip — and it's the most important.\n\nYour child's nervous system is constantly reading YOURS. If you're activated (stressed, anxious, angry), your child's nervous system detects threat — even if you haven't said a word.\n\nFor the next 48 hours, when your child shows a challenging behavior, FIRST check your own state:\n\n- Am I in my green zone?\n- Is my breathing shallow or deep?\n- Am I tense? Where do I hold tension?\n- What am I feeling right now — frustration, fear, shame, exhaustion?\n\nYou cannot co-regulate from an activated state. Your calm is their anchor. But you can't give what you don't have — so tending to your own nervous system is not selfish. It's the intervention.`,
                        journalPrompt: 'What did you notice about your own state when your child was dysregulated? Were you able to find calm first? What helped — or what got in the way?'
                    }
                ]
            },
            {
                phase: 'practice',
                title: 'Try It At Home',
                description: 'Co-regulation strategies you can use tonight',
                estimatedMinutes: 20,
                activities: [
                    {
                        id: 'm2-practice-1',
                        type: 'exercise',
                        title: 'The Co-Regulation Toolkit',
                        content: `Build your personal co-regulation toolkit. Choose 2-3 strategies from each category and practice them when your child is ALREADY calm (not during a crisis — that's like learning to swim in a hurricane).\n\n**For Fight/Flight (Yellow/Red Zone)**:\n- Lower your voice to almost a whisper\n- Slow your movements to half-speed\n- Reduce words to 3-5 at a time ("I'm here. You're safe.")\n- Dim the lights or move to a quieter space\n- Offer a weighted blanket or deep pressure\n- Breathe audibly so they can hear your rhythm\n\n**For Freeze/Shutdown (Blue Zone)**:\n- Get physically low (sit on the floor near them)\n- Offer warmth (blanket, warm drink, gentle touch if tolerated)\n- Use rhythmic, gentle stimulation (soft humming, rocking)\n- Don't demand eye contact or verbal response\n- Simply be present. "I'm right here. No rush."\n\n**For Yourself (Your Green Zone)**:\n- Box breathing: 4 counts in, 4 hold, 4 out, 4 hold\n- Feel your feet on the floor (grounding)\n- Name what you feel: "I'm scared right now, and that's okay"\n- Step away for 60 seconds if you need to (this is not abandonment — it's regulation)`
                    },
                    {
                        id: 'm2-practice-2',
                        type: 'exercise',
                        title: 'The State-Matched Response',
                        content: `The next time your child shows a challenging behavior, try this sequence:\n\n1. **STOP** — Don't react. Pause.\n2. **CHECK YOURSELF** — Am I regulated? (If not, breathe first.)\n3. **READ THEIR STATE** — Green, yellow/red, or blue?\n4. **MATCH YOUR RESPONSE TO THE STATE** — not to the behavior.\n\nIf they're in yellow/red: reduce demands, lower stimulation, co-regulate.\nIf they're in blue: offer warmth, presence, gentle activation.\nIf they're in green: NOW you can talk, teach, set expectations.\n\nThe behavior might be the same (screaming, for example), but the state determines the response. Screaming in fight/flight needs calming. Screaming in green zone needs a boundary. The state is the key.`,
                        journalPrompt: 'Describe a moment you tried matching your response to your child\'s state instead of their behavior. What happened?'
                    }
                ]
            },
            {
                phase: 'reflect',
                title: 'Make It Yours',
                description: 'Integrating regulation into your daily rhythm',
                estimatedMinutes: 10,
                activities: [
                    {
                        id: 'm2-reflect-1',
                        type: 'journal',
                        title: 'The Paradigm Shift',
                        content: `Reflect on how understanding the nervous system changes your interpretation of past events.`,
                        journalPrompt: 'Think of a time you punished or corrected your child during a meltdown. Knowing what you know now about nervous system states, what do you think was really happening? What would you do differently? (This isn\'t about guilt — it\'s about growth.)'
                    },
                    {
                        id: 'm2-reflect-2',
                        type: 'journal',
                        title: 'Your Regulation Plan',
                        content: `Create a brief personal regulation plan for yourself — what you'll do to find your own green zone when things get hard.`,
                        journalPrompt: 'My go-to strategies for finding calm when my child is dysregulated are: (1)... (2)... (3)... The person I can call when I need co-regulation for myself is...'
                    }
                ]
            }
        ]
    },

    // ─────────────────────────────────────────
    // MODULE 3: SENSORY WORLD
    // ─────────────────────────────────────────
    {
        id: 'mod-3-sensory-world',
        slug: 'the-sensory-world',
        order: 3,
        title: 'The Sensory World',
        subtitle: 'Experiencing the world through your child\'s body',
        whyThisMatters: `Your child's sensory system is calibrated differently than yours. What feels like a normal grocery store to you might feel like a concert venue to them — fluorescent lights buzzing, carts rattling, strangers brushing past, 47 different smells. Stimming isn't a problem to fix. It's a solution their body invented. This module teaches you to become a sensory detective — to understand what your child's body is telling them and to design environments that work WITH their neurology, not against it.`,
        scholars: ['Dr. Steven Kapp', 'Dr. A. Jean Ayres'],
        citation: 'Kapp, S. K., et al. (2019). "People should be allowed to do what they like": Autistic adults\' views and experiences of stimming. Autism, 23(7), 1782–1792.',
        corePrinciple: 'Protect self-regulatory behaviors',
        ecLens: 'environment',
        icon: 'Volume2',
        color: 'sage',
        relatedFunctions: ['sensory', 'escape'],
        prerequisite: 'understanding-the-nervous-system',
        tier: 'companion',
        outcomeStatement: 'You can identify your child\'s sensory needs, protect their regulatory behaviors, and design environments that reduce sensory overload.',
        phases: [
            {
                phase: 'learn',
                title: 'The Theory',
                description: 'Sensory processing and stimming as regulation',
                estimatedMinutes: 12,
                activities: [
                    {
                        id: 'm3-learn-1',
                        type: 'read',
                        title: 'Sensory Processing: The Basics',
                        content: `We all process sensory information — sight, sound, touch, taste, smell, movement (vestibular), and body position (proprioceptive). For neurodivergent individuals, this processing can be significantly different:\n\n**Hypersensitivity (Over-responsive)**: Input feels amplified. A tag on a shirt feels like sandpaper. A hand dryer sounds like a jet engine. Bright lights cause physical pain. The world is TOO MUCH.\n\n**Hyposensitivity (Under-responsive)**: Input feels muted. The child seeks MORE input — crashing into things, spinning, chewing on objects, touching everything. The world isn't giving ENOUGH.\n\n**Most children are a mix** — oversensitive to some inputs and undersensitive to others. Your child might cover their ears at a fire alarm (hypersensitive to sound) AND seek deep pressure by squeezing into tight spaces (hyposensitive to proprioceptive input).\n\nThis is not a behavior problem. It is a neurological reality. And the behaviors that emerge from sensory processing differences — covering ears, avoiding foods, melting down in stores, seeking movement — are the body's intelligent response to a world that wasn't designed for it.`
                    },
                    {
                        id: 'm3-learn-2',
                        type: 'read',
                        title: 'Stimming Is a Solution, Not a Problem',
                        content: `Dr. Steven Kapp led groundbreaking research that actually asked autistic adults about their own experience of stimming. What they reported was clear:\n\n- Stimming provides essential emotional regulation\n- Stimming helps manage sensory overload\n- Stimming can express JOY, not just distress\n- Suppressing stimming causes anxiety, exhaustion, and burnout\n- Being told to stop stimming feels like being told to stop breathing\n\nCommon stims include: hand-flapping, rocking, spinning, humming, repeating words or phrases (echolalia), finger-flicking, jumping, pacing, and chewing.\n\nThe old approach was to "extinguish" these behaviors — to make the child look "normal." We now know this causes measurable harm. Autistic adults who were forced to suppress stimming as children report higher rates of anxiety, depression, and autistic burnout.\n\n**Giovanna's rule**: Safe stimming is always allowed. If a stim is unsafe (head-banging, self-injury), we redirect to a safer stim that provides similar input — NEVER elimination. We protect the regulation, we redirect the risk.`
                    }
                ]
            },
            {
                phase: 'observe',
                title: 'Practice Noticing',
                description: 'Becoming a sensory detective',
                estimatedMinutes: 20,
                activities: [
                    {
                        id: 'm3-observe-1',
                        type: 'observe',
                        title: 'The Sensory Audit',
                        content: `Walk through the spaces your child spends the most time in (home, school, car, grandparent's house) and audit the sensory environment:\n\n**Sound**: What's the baseline noise level? TV, appliances, siblings, traffic, clocks ticking?\n**Light**: Fluorescent? Natural? Flickering? Too bright? Too dim?\n**Touch**: What textures does your child encounter? Clothing tags, seat fabrics, food textures?\n**Smell**: Cleaning products, cooking odors, perfumes, laundry detergent?\n**Movement**: How much physical movement does their day include? Long periods of sitting?\n**Visual clutter**: How busy is the visual environment? Posters, patterns, screens?\n\nFor each sense, rate it: "This would be fine for me" vs. "If I were 10x more sensitive to this, it would be unbearable."\n\nThis exercise builds empathy for your child's lived experience.`,
                        journalPrompt: 'What did you discover about your child\'s sensory environment? Was there anything that surprised you — something you hadn\'t noticed because it doesn\'t bother YOU?'
                    },
                    {
                        id: 'm3-observe-2',
                        type: 'observe',
                        title: 'Stim Mapping',
                        content: `For three days, observe and document your child's stims WITHOUT intervening:\n\n- What are they doing? (hand-flapping, rocking, humming, etc.)\n- When does it happen? (during transitions? when excited? when stressed?)\n- What seems to trigger it? (sensory input? emotions? boredom?)\n- Does it seem to help them? (calming? energizing? expressing joy?)\n- How do others respond to it? (ignoring? redirecting? shaming?)\n\nYou're building a stim profile — a map of how your child's body regulates itself. This is valuable clinical data that even their therapist might not have, because you see your child in natural environments.`,
                        journalPrompt: 'List 3-5 stims you observed. For each one, what need do you think it\'s meeting? How do you feel when you see your child stimming?'
                    }
                ]
            },
            {
                phase: 'practice',
                title: 'Try It At Home',
                description: 'Designing a sensory-friendly environment',
                estimatedMinutes: 20,
                activities: [
                    {
                        id: 'm3-practice-1',
                        type: 'exercise',
                        title: 'The Sensory Safety Plan',
                        content: `Based on your sensory audit and stim mapping, make three changes this week:\n\n**1. Remove one sensory stressor**\n- Switch to tagless clothing\n- Replace a flickering light bulb\n- Turn off background TV noise\n- Use unscented detergent\n\n**2. Add one sensory support**\n- Create a "calm corner" with dim lighting and soft textures\n- Get a chew necklace or fidget tool\n- Add a weighted blanket to their bed\n- Build movement breaks into their schedule (every 30 minutes)\n\n**3. Protect one stim**\n- Identify a stim that others (school, family) have tried to stop\n- Decide: Is it safe? If yes, commit to protecting it\n- If it's happening at school, prepare a script (use the School Bridge from Learning Hub)\n- Tell your child: "Your [rocking/humming/flapping] is okay with me."`,
                        journalPrompt: 'What three changes did you make? What was your child\'s response?'
                    }
                ]
            },
            {
                phase: 'reflect',
                title: 'Make It Yours',
                description: 'Reframing your relationship with stimming',
                estimatedMinutes: 10,
                activities: [
                    {
                        id: 'm3-reflect-1',
                        type: 'journal',
                        title: 'Unlearning "Quiet Hands"',
                        content: `Many parents were taught — by therapists, schools, or family — that stimming should be stopped. This module asks you to unlearn that.`,
                        journalPrompt: 'Were you ever told to stop your child\'s stimming? How did it feel? How does your child respond when their stim is protected vs. when it\'s suppressed? What message do you want to send your child about how they regulate?'
                    }
                ]
            }
        ]
    },

    // ─────────────────────────────────────────
    // MODULE 4: ASSUME COMPETENCE
    // ─────────────────────────────────────────
    {
        id: 'mod-4-assume-competence',
        slug: 'assume-competence',
        order: 4,
        title: 'Assume Competence',
        subtitle: 'Seeing what your child knows, even when they can\'t show it',
        whyThisMatters: `The most dangerous thing you can do to a child is underestimate them. Anne Donnellan called it "the criterion of the least dangerous assumption" — when we don't know what someone understands, assume they understand MORE than they can show, because the cost of underestimating is always higher than the cost of overestimating. Your child may understand everything you say even when they can't respond. They may have complex opinions even when they can't express them. They may be frustrated by being treated as less than they are. This module teaches you to see competence first — and to demand that others see it too.`,
        scholars: ['Anne Donnellan'],
        citation: 'Donnellan, A. M. (1984). The criterion of the least dangerous assumption. Behavioral Disorders, 9(2), 141–150.',
        corePrinciple: 'Assume competence',
        ecLens: 'meaning',
        icon: 'Star',
        color: 'gold',
        relatedFunctions: ['attention', 'tangible'],
        prerequisite: 'the-sensory-world',
        tier: 'companion',
        outcomeStatement: 'You default to assuming your child understands more than they can show, and you advocate for others to do the same.',
        phases: [
            {
                phase: 'learn',
                title: 'The Theory',
                description: 'The least dangerous assumption',
                estimatedMinutes: 10,
                activities: [
                    {
                        id: 'm4-learn-1',
                        type: 'read',
                        title: 'Why Underestimation Is More Dangerous Than Overestimation',
                        content: `Anne Donnellan posed a simple, devastating question: When we don't know what someone can do, which mistake is worse?\n\n**Mistake A: We assume they CAN and they can't.** We speak to them in full sentences. We offer choices. We explain things. We treat them with dignity. The cost? Some of what we say goes over their head. No real harm done.\n\n**Mistake B: We assume they CAN'T and they can.** We talk about them in front of them as if they're not there. We simplify everything. We make choices for them. We lower expectations. The cost? A human being is trapped inside an environment that denies their intelligence, their agency, and their dignity. Every single day.\n\nMistake B is catastrophically more harmful. And it happens constantly to autistic and neurodivergent people — especially those who are non-speaking, those with high support needs, and those who are Black or Brown (where racial bias compounds the underestimation).\n\n**The rule is simple**: When in doubt, assume competence. Always.`
                    },
                    {
                        id: 'm4-learn-2',
                        type: 'read',
                        title: 'The Intersection: Race + Disability + Presumed Incompetence',
                        content: `For Black and Brown families, presumed incompetence operates on two axes simultaneously.\n\nYour child faces underestimation as a disabled person — "They can't understand," "They'll never..." "Let's set realistic expectations" (code for lowered expectations).\n\nAND your child faces underestimation as a Black or Brown person — over-identification for intellectual disability, under-identification for gifted programs, harsher discipline for the same behaviors white disabled children are accommodated for.\n\nResearch shows Black autistic children receive diagnoses 3-4 years later than white children, are more likely to be misdiagnosed with conduct disorder, and are significantly more likely to be placed in restrictive educational settings.\n\nPresuming competence is not just a clinical principle for your family. It is an act of resistance against a system that has historically refused to see Black and Brown children as capable, intelligent, and worthy of investment.\n\nWhen you walk into an IEP meeting and say "My child understands more than they can show — please treat them accordingly," you are channeling Donnellan AND resisting a legacy of deficit-based thinking about your child's body and mind.`
                    }
                ]
            },
            {
                phase: 'observe',
                title: 'Practice Noticing',
                description: 'Catching moments of underestimation',
                estimatedMinutes: 15,
                activities: [
                    {
                        id: 'm4-observe-1',
                        type: 'observe',
                        title: 'The Competence Watch',
                        content: `For one week, keep a mental (or written) tally of moments when someone — including yourself — underestimates your child.\n\nListen for:\n- "They don't understand" (said in front of your child)\n- "Mental age" comparisons ("They're 10 but they function like a 4-year-old")\n- Talking about your child in third person while they're present\n- Simplified speech that doesn't match your child's actual comprehension\n- Decisions made WITHOUT consulting your child\n- "Realistic expectations" that feel more like giving up\n\nAlso notice moments of surprising competence:\n- Times your child shows understanding you didn't expect\n- Skills they demonstrate in contexts where they feel safe\n- Interests that reveal deep thinking or pattern recognition\n- Moments of humor, empathy, or insight`,
                        journalPrompt: 'What moments of underestimation did you catch this week — from others or from yourself? What moments of unexpected competence did you witness?'
                    }
                ]
            },
            {
                phase: 'practice',
                title: 'Try It At Home',
                description: 'Shifting language and expectations',
                estimatedMinutes: 15,
                activities: [
                    {
                        id: 'm4-practice-1',
                        type: 'exercise',
                        title: 'The Language Upgrade',
                        content: `This week, make three intentional shifts:\n\n**1. Talk TO your child, not ABOUT them.**\n- Before: (to the doctor, in front of child) "He doesn't do well with transitions."\n- After: (to your child) "The doctor needs to know what helps you with transitions. Can you tell them, or should I?"\n\n**2. Offer choices, not directives.**\n- Before: "Put on the blue shirt."\n- After: "Blue shirt or green shirt?"\n- Even non-speaking children can choose through pointing, gaze, or reaching.\n\n**3. Narrate with competence.**\n- Before: "She can't tie her shoes yet."\n- After: "She's learning to tie her shoes. She's got the first loop down."\n- Frame everything as growth, not deficit.`,
                        journalPrompt: 'Which language shift was hardest? Which felt most natural? How did your child respond differently?'
                    },
                    {
                        id: 'm4-practice-2',
                        type: 'exercise',
                        title: 'The School Advocate Script',
                        content: `Prepare a 2-minute statement for your child's next school meeting (IEP, parent-teacher conference, or informal check-in):\n\n1. Start with your child's strengths (at least 3)\n2. Name the principle: "We follow the least dangerous assumption — when we're unsure what [name] understands, we assume competence."\n3. Make a specific request: "Please speak to [name] directly, even when they can't respond in typical ways."\n4. End with what you see at home that they might not see at school\n\nPractice saying it out loud. Record yourself if it helps. You are your child's most powerful advocate — and this script is backed by 40 years of research.`
                    }
                ]
            },
            {
                phase: 'reflect',
                title: 'Make It Yours',
                description: 'Committing to a competence-first lens',
                estimatedMinutes: 10,
                activities: [
                    {
                        id: 'm4-reflect-1',
                        type: 'journal',
                        title: 'What They Know That We Don\'t See',
                        content: `Reflect on your child's inner world — the competence that may be invisible to systems that only measure output.`,
                        journalPrompt: 'If your child could tell you everything they understand but can\'t express, what do you think they would say? What do you think they wish the people in their life knew about them?'
                    }
                ]
            }
        ]
    },

    // ─────────────────────────────────────────
    // MODULE 5: LINEAGE & STORY
    // ─────────────────────────────────────────
    {
        id: 'mod-5-lineage-story',
        slug: 'lineage-and-story',
        order: 5,
        title: 'Lineage & Story',
        subtitle: 'How history lives in your family\'s body',
        whyThisMatters: `This is the module that makes Giovanna different from every other autism app on the market. Your child doesn't exist in a vacuum. They exist inside a family, inside a culture, inside a history. The stress patterns that show up in your home — the hypervigilance, the distrust of systems, the pressure to be "twice as good," the grief that doesn't have a name — these didn't start with you. They were passed down. Epigenetic research shows that trauma can alter gene expression across generations. But so can healing. This module helps you see the lineage patterns in your family and choose which ones to carry forward and which ones to transform.`,
        scholars: ['Dr. Rachel Yehuda', 'Dr. Joy DeGruy', 'Resmaa Menakem'],
        citation: 'Yehuda, R., et al. (2016). Holocaust Exposure Induced Intergenerational Effects on FKBP5 Methylation. Biological Psychiatry, 80(5), 372–380.',
        corePrinciple: 'Behavior is communication, not defiance',
        ecLens: 'lineage',
        icon: 'Users',
        color: 'purple',
        relatedFunctions: ['escape', 'attention', 'tangible', 'sensory'],
        prerequisite: 'assume-competence',
        tier: 'pro',
        outcomeStatement: 'You can identify intergenerational patterns in your family\'s stress responses and make conscious choices about which patterns serve your child and which need transformation.',
        phases: [
            {
                phase: 'learn',
                title: 'The Theory',
                description: 'Intergenerational trauma and epigenetic inheritance',
                estimatedMinutes: 15,
                activities: [
                    {
                        id: 'm5-learn-1',
                        type: 'read',
                        title: 'Epigenetics: How Trauma Travels',
                        content: `Dr. Rachel Yehuda's research at Mount Sinai made headlines when she demonstrated that Holocaust survivors' children showed altered stress hormone patterns — not because of their own experiences, but because their parents' trauma had changed the way certain genes were expressed. The trauma didn't change the DNA sequence. It changed which genes were turned "on" and "off."\n\nThis is epigenetics: the study of how experience shapes gene expression without altering the genetic code itself.\n\nFor Black families in America, this research has profound implications. Dr. Joy DeGruy's work on Post Traumatic Slave Syndrome documents how centuries of chattel slavery, Jim Crow terror, and ongoing systemic racism have created stress patterns that persist across generations:\n\n- Hypervigilance (always scanning for threat)\n- Distrust of institutions (earned through generations of betrayal)\n- Pressure to perform ("You have to be twice as good")\n- Suppression of emotion ("Don't show them you're hurt")\n- Harsh discipline as protection ("I'd rather discipline you than let the world do it")\n\nThese are not pathologies. They are survival adaptations. They kept your ancestors alive. But some of them — particularly harsh discipline and emotional suppression — may not serve your neurodivergent child, who needs softness, accommodation, and room to be exactly who they are.`
                    },
                    {
                        id: 'm5-learn-2',
                        type: 'read',
                        title: 'The Body Keeps the Score — Across Generations',
                        content: `Resmaa Menakem, in "My Grandmother's Hands," argues that racial trauma lives in the body — not just the mind. It shows up as tension, reactivity, and automatic responses that feel like "instinct" but are actually inherited patterns.\n\nWhen your child has a meltdown and your first instinct is to physically restrain, to raise your voice, to demand compliance — ask yourself: whose voice is that? Is it yours? Or is it an echo of someone who raised you, who was raised by someone, who was raised in a world where a Black child who didn't comply immediately could face violence?\n\nThis isn't about blame. Every generation did the best they could with what they had. But you have something previous generations didn't: language for what's happening, research that validates it, and a tool (this app) that helps you see the pattern and choose differently.\n\n**Epigenetic consciousness** means holding two truths at once:\n1. These patterns are real, inherited, and valid.\n2. You have the power to transform them — not by rejecting your lineage, but by consciously choosing which parts to carry forward.\n\nThe patterns that protected your ancestors can coexist with new patterns that accommodate your neurodivergent child. That's not betrayal. That's evolution.`
                    }
                ]
            },
            {
                phase: 'observe',
                title: 'Practice Noticing',
                description: 'Tracing patterns across generations',
                estimatedMinutes: 20,
                activities: [
                    {
                        id: 'm5-observe-1',
                        type: 'observe',
                        title: 'The Family Pattern Map',
                        content: `This exercise asks you to trace stress responses across three generations: your grandparents, your parents, and yourself.\n\nFor each generation, answer:\n\n1. **How was distress handled?** (Silence? Anger? Prayer? Humor? Physical discipline? Avoidance?)\n2. **What was the family's relationship with institutions?** (School, doctors, police, government — trust or distrust?)\n3. **What messages were given about emotions?** ("Big boys don't cry." "Don't air dirty laundry." "Be strong.")\n4. **What messages were given about disability or difference?** ("Nothing's wrong with that child." "They'll grow out of it." "Don't put a label on them.")\n5. **What was the relationship between love and discipline?** ("I discipline you because I love you." "Spare the rod, spoil the child.")\n\nYou're not judging. You're mapping. Every answer reveals a survival strategy that made sense in its time — and may or may not serve your child now.`,
                        journalPrompt: 'What patterns did you trace? Which ones still serve your family? Which ones might be hurting your neurodivergent child without intending to?'
                    }
                ]
            },
            {
                phase: 'practice',
                title: 'Try It At Home',
                description: 'Conscious pattern transformation',
                estimatedMinutes: 15,
                activities: [
                    {
                        id: 'm5-practice-1',
                        type: 'exercise',
                        title: 'The Lineage Letter',
                        content: `Choose one inherited pattern that you want to transform — not reject, but transform. This might be:\n\n- "I was raised with corporal punishment, and I'm choosing to use co-regulation instead"\n- "My family never talked about feelings, and I'm choosing to name emotions out loud"\n- "We were taught to distrust doctors, and I'm choosing to advocate within the medical system while holding healthy skepticism"\n- "We were told disability means something is wrong, and I'm choosing to see my child's neurology as difference, not deficit"\n\nWrite a letter to the ancestor who passed this pattern down. Thank them for what the pattern protected. Explain why you're transforming it. This is not betrayal — it's the deepest form of honor: taking what they gave you and evolving it for a new generation.`,
                        journalPrompt: 'What pattern are you transforming? What did you say to your ancestor? How does it feel to hold both gratitude and change at the same time?'
                    }
                ]
            },
            {
                phase: 'reflect',
                title: 'Make It Yours',
                description: 'Choosing what you pass forward',
                estimatedMinutes: 10,
                activities: [
                    {
                        id: 'm5-reflect-1',
                        type: 'journal',
                        title: 'The Inheritance You Choose',
                        content: `This is the heart of epigenetic consciousness: you are not a passive recipient of history. You are an active author of what comes next.`,
                        journalPrompt: 'What three things from your lineage do you want to pass forward to your child? What three things do you want to transform? And what new pattern — one that didn\'t exist in your family before — do you want to START?'
                    }
                ]
            }
        ]
    },

    // ─────────────────────────────────────────
    // MODULE 6: THE WHOLE PICTURE
    // ─────────────────────────────────────────
    {
        id: 'mod-6-whole-picture',
        slug: 'the-whole-picture',
        order: 6,
        title: 'The Whole Picture',
        subtitle: 'Integrating all four lenses into daily life',
        whyThisMatters: `You've now learned to decode behavior as communication, read nervous system states, understand sensory worlds, presume competence, and trace lineage patterns. This final module brings it all together into the Epigenetic Consciousness framework — the four-lens approach that makes Giovanna different from anything else. From here forward, when your child has a challenging moment, you don't just react. You slow down and look through all four lenses: Lineage & Story, Environment & Load, Nervous System, and Meaning & Dignity. You see the whole picture. And you respond to the whole child.`,
        scholars: ['Eli Davis'],
        citation: 'Davis, E. (2025). Epigenetic Consciousness Framework. Developed for Giovanna Companion.',
        corePrinciple: 'Co-regulation before self-regulation',
        ecLens: 'all',
        icon: 'Eye',
        color: 'purple',
        relatedFunctions: ['escape', 'attention', 'tangible', 'sensory'],
        prerequisite: 'lineage-and-story',
        tier: 'pro',
        outcomeStatement: 'You can apply the full Epigenetic Consciousness framework — all four lenses — to any challenging moment, and respond with the depth and nuance of a trained practitioner.',
        phases: [
            {
                phase: 'learn',
                title: 'The Theory',
                description: 'The Epigenetic Consciousness Framework',
                estimatedMinutes: 12,
                activities: [
                    {
                        id: 'm6-learn-1',
                        type: 'read',
                        title: 'Four Lenses, One Child',
                        content: `The Epigenetic Consciousness (EC) framework was created specifically for Giovanna by Eli Davis, synthesizing polyvagal theory, neurodiversity, intergenerational trauma research, liberation psychology, and Afrocentric developmental frameworks into one integrated tool.\n\nThe framework views every behavior through four interconnected lenses:\n\n**🏛 Lens 1: Lineage & Story**\nWhat family narratives, cultural pressures, and historical patterns are at play? Is the parent's response shaped by inherited survival strategies? Is the child absorbing family stress?\n\n**🌍 Lens 2: Environment & Load**\nWhat's happening in the physical, sensory, and demand environment? How many transitions occurred today? Are basic needs (sleep, food, movement) met? Is the sensory load manageable?\n\n**💓 Lens 3: Nervous System**\nWhat state is the child's autonomic nervous system in? Green (safe), yellow/red (fight/flight), or blue (freeze)? What state is the PARENT in? Is co-regulation possible right now?\n\n**✨ Lens 4: Meaning & Dignity**\nWill the response protect or harm the child's sense of worth? Is this a teaching moment or a connection moment? Are we building skill or demanding compliance?\n\nNo single lens tells the whole story. But together, they reveal the full picture of what a child needs in any given moment.`
                    },
                    {
                        id: 'm6-learn-2',
                        type: 'read',
                        title: 'Putting It Together: A Real Example',
                        content: `**The moment**: Your 8-year-old autistic son throws his homework across the room after school.\n\n**Without EC Framework**: "He's being defiant. He needs consequences."\n\n**With EC Framework**:\n\n🏛 **Lineage & Story**: You grew up hearing "Education is the way out." Homework refusal triggers YOUR anxiety about his future. Your reaction is partly about your inherited story, not just his behavior.\n\n🌍 **Environment & Load**: He just had 7 hours of school (masking, transitions, sensory overload), a 30-minute bus ride, and walked into a house where the TV was on and his sister was screaming. His nervous system has been taxed all day. Homework was the last straw.\n\n💓 **Nervous System**: He's in sympathetic activation (fight). His muscles are tense, his voice is loud, his breathing is rapid. He cannot learn right now. The prefrontal cortex is offline.\n\n✨ **Meaning & Dignity**: If you punish him now, the message is: "Your distress doesn't matter, only your output does." If you pause, validate, and regulate first, the message is: "I see you. You matter more than this worksheet."\n\n**The EC Response**: "I can see you've had a really hard day. Let's take a break. Homework can wait 30 minutes." → Offer a snack, reduce stimulation, co-regulate. Once he's back in green zone, offer homework with accommodations (shorter assignments, movement breaks, low-demand environment).\n\nThat's the whole picture. That's what it means to be a practitioner of your child's wellbeing.`
                    }
                ]
            },
            {
                phase: 'observe',
                title: 'Practice Noticing',
                description: 'Applying all four lenses to real moments',
                estimatedMinutes: 20,
                activities: [
                    {
                        id: 'm6-observe-1',
                        type: 'observe',
                        title: 'The Four-Lens Scan',
                        content: `For the next week, when a challenging moment occurs, pause and run through all four lenses before responding:\n\n1. 🏛 **LINEAGE**: What story from my family is shaping my reaction right now?\n2. 🌍 **ENVIRONMENT**: What's happening around my child that I might not have noticed?\n3. 💓 **NERVOUS SYSTEM**: What state are they in? What state am I in?\n4. ✨ **MEANING**: What message will my response send about their worth?\n\nYou won't get all four every time. That's okay. Start with whichever lens feels most accessible. Over time, the scan becomes automatic — a 10-second mental check that transforms your response.\n\nLog the behavior in Giovanna's ABC Logger after each incident. Over time, the pattern data will reveal which lenses are most relevant for YOUR child.`,
                        journalPrompt: 'Describe a challenging moment this week. Walk through all four lenses. What did each lens reveal that you wouldn\'t have seen otherwise?'
                    }
                ]
            },
            {
                phase: 'practice',
                title: 'Try It At Home',
                description: 'Living the framework',
                estimatedMinutes: 15,
                activities: [
                    {
                        id: 'm6-practice-1',
                        type: 'exercise',
                        title: 'Your Family\'s EC Profile',
                        content: `Create your family's Epigenetic Consciousness profile by answering these questions:\n\n**Lineage & Story**: What are the top 3 inherited patterns that most affect your parenting? (e.g., "punishment = love," "don't show weakness," "education above all else")\n\n**Environment & Load**: What are your child's top 3 environmental stressors? (e.g., "transitions after school," "loud environments," "unstructured time")\n\n**Nervous System**: What are your child's early warning signs for each state? (Green → Yellow: what changes? Yellow → Blue: what changes?)\n\n**Meaning & Dignity**: What messages do you want your child to internalize from how you respond to their hardest moments?\n\nThis profile becomes your family's roadmap. Share it with anyone who cares for your child — teachers, therapists, grandparents, respite providers. It's the most comprehensive picture of your child that exists anywhere.`,
                        journalPrompt: 'Write out your family\'s EC profile. What surprised you? What do you most want others to understand about your child?'
                    }
                ]
            },
            {
                phase: 'reflect',
                title: 'Make It Yours',
                description: 'Completing the journey — and beginning the practice',
                estimatedMinutes: 10,
                activities: [
                    {
                        id: 'm6-reflect-1',
                        type: 'journal',
                        title: 'The Practitioner You\'ve Become',
                        content: `You've completed all six modules. You now have practitioner-level understanding of: functional behavior analysis, polyvagal theory, sensory processing, presumed competence, intergenerational trauma, and the Epigenetic Consciousness framework. No credential program teaches all of these together. You learned them here — not in a classroom, but in the living room, in the car, at the dinner table, in the hardest moments of your parenting life.`,
                        journalPrompt: 'Who were you as a parent before Module 1? Who are you now? What has changed in how you see your child? What has changed in how you see yourself? What do you want the world to know about the parents of neurodivergent children?'
                    },
                    {
                        id: 'm6-reflect-2',
                        type: 'journal',
                        title: 'A Letter to the Next Parent',
                        content: `Write a message to a parent who's just starting their journey — who just got a diagnosis, who's scared, who feels alone. What would you tell them?`,
                        journalPrompt: 'Dear parent who is just starting this journey...'
                    }
                ]
            }
        ]
    }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a module by slug
 */
export function getModuleBySlug(slug: string): PracticeModule | undefined {
    return PRACTICE_MODULES.find(m => m.slug === slug);
}

/**
 * Get the next module after the given one
 */
export function getNextModule(currentSlug: string): PracticeModule | undefined {
    const current = PRACTICE_MODULES.find(m => m.slug === currentSlug);
    if (!current) return undefined;
    return PRACTICE_MODULES.find(m => m.order === current.order + 1);
}

/**
 * Get modules available for a given subscription tier
 */
export function getModulesForTier(tier: 'free' | 'companion' | 'pro' | 'enterprise' | 'ambassador'): PracticeModule[] {
    const tierOrder: Record<string, number> = { free: 0, companion: 1, pro: 2, enterprise: 3, ambassador: 3 };
    const userLevel = tierOrder[tier] ?? 0;
    return PRACTICE_MODULES.filter(m => tierOrder[m.tier] <= userLevel);
}

/**
 * Get modules related to a specific behavior function
 */
export function getModulesForFunction(fn: 'escape' | 'attention' | 'tangible' | 'sensory'): PracticeModule[] {
    return PRACTICE_MODULES.filter(m => m.relatedFunctions.includes(fn));
}

/**
 * Calculate total estimated time for a module (all phases)
 */
export function getModuleDuration(module: PracticeModule): number {
    return module.phases.reduce((sum, phase) => sum + phase.estimatedMinutes, 0);
}
