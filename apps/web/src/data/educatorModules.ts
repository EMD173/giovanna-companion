/**
 * Educator Training Modules
 *
 * Pillar 2: Educator & Paraprofessional Literacy Platform
 *
 * Scenario-based training that takes the same theoretical foundations
 * from Pillar 1 (parent modules) and reframes them for classroom settings.
 *
 * Architecture:
 *   - Each module contains 2-4 interactive SCENARIOS (classroom situations)
 *   - Each scenario has a DECISION TREE with 3 response options
 *   - Each response shows consequences + the theory behind why it matters
 *   - Completing all scenarios in a module earns a PD CREDIT certificate
 *
 * Shared theoretical engine with practiceModules.ts:
 *   - FCT (Carr & Durand)
 *   - Polyvagal Theory (Porges)
 *   - Sensory Processing (Kapp)
 *   - Presuming Competence (Donnellan)
 *   - Culturally Responsive Teaching (Ladson-Billings)
 *   - Post Traumatic Slave Syndrome (DeGruy)
 *   - Epigenetic Consciousness (Davis)
 *
 * Tier: Enterprise ($99) — district contract, Title II PD funding eligible
 */

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export type EducatorRole = 'teacher' | 'paraprofessional' | 'administrator' | 'specialist';

export interface ScenarioChoice {
    id: string;
    label: string;
    response: string;
    /** What happens next in the classroom after this choice */
    consequence: string;
    /** The theory behind why this choice helps or harms */
    theoryExplanation: string;
    /** Scholar/citation backing this explanation */
    citation: string;
    /** Rating: best, acceptable, harmful */
    rating: 'best' | 'acceptable' | 'harmful';
}

export interface ClassroomScenario {
    id: string;
    title: string;
    /** The situation the educator is in */
    situation: string;
    /** What the student is doing — described behaviorally, not judgmentally */
    studentBehavior: string;
    /** Context clues the educator should notice */
    contextClues: string[];
    /** The three response options */
    choices: [ScenarioChoice, ScenarioChoice, ScenarioChoice];
    /** Debrief after all choices are explored */
    debrief: string;
    /** The behavior function at play */
    behaviorFunction: 'escape' | 'attention' | 'tangible' | 'sensory';
    /** The EC lens most relevant */
    primaryLens: 'lineage' | 'environment' | 'nervous-system' | 'meaning';
    /** Grade level context */
    gradeLevel: 'elementary' | 'middle' | 'high' | 'all';
}

export interface EducatorModule {
    id: string;
    slug: string;
    order: number;
    title: string;
    subtitle: string;
    /** Why this module matters for educators specifically */
    whyThisMatters: string;
    /** Learning objectives (PD-credit style) */
    learningObjectives: string[];
    /** The scholars whose work grounds this module */
    scholars: string[];
    citation: string;
    /** Which roles benefit most */
    targetRoles: EducatorRole[];
    /** Lucide icon name */
    icon: string;
    color: 'gold' | 'sage' | 'purple' | 'rose';
    /** Interactive classroom scenarios */
    scenarios: ClassroomScenario[];
    /** Key takeaways after completing all scenarios */
    keyTakeaways: string[];
    /** PD credit hours awarded on completion */
    pdCreditHours: number;
    /** Prerequisite module slug */
    prerequisite?: string;
}

/**
 * Progress record stored in Firestore
 */
export interface EducatorProgress {
    moduleId: string;
    userId: string;
    /** Scenarios completed (by scenario ID) */
    completedScenarios: string[];
    /** Choice history — which choices they made for each scenario */
    choiceHistory: {
        scenarioId: string;
        choiceId: string;
        timestamp: Date;
    }[];
    /** Reflection responses */
    reflections: {
        moduleId: string;
        response: string;
        timestamp: Date;
    }[];
    startedAt: Date;
    completedAt?: Date;
    /** PD certificate generated */
    certificateGenerated: boolean;
    /** Total PD hours accumulated */
    pdHoursEarned: number;
}

// ============================================
// THE MODULES
// ============================================

export const EDUCATOR_MODULES: EducatorModule[] = [
    // ─────────────────────────────────────────
    // MODULE 1: BEHAVIOR IS COMMUNICATION (CLASSROOM)
    // ─────────────────────────────────────────
    {
        id: 'edu-1-behavior-communication',
        slug: 'classroom-behavior-communication',
        order: 1,
        title: 'Behavior as Communication in the Classroom',
        subtitle: 'Reading the message behind the disruption',
        whyThisMatters: `Most classroom management training teaches you to respond to what a student does. This module teaches you to understand WHY they do it. When you can identify the communicative function of a behavior — escape, attention, tangible, or sensory — you stop reacting and start responding. The difference between those two words is the difference between escalation and resolution. And for neurodivergent students, especially Black and Brown students who are disproportionately disciplined for behaviors that are actually neurological, this shift can be the difference between staying in class and being pushed out.`,
        learningObjectives: [
            'Identify the four functions of behavior (escape, attention, tangible, sensory) in classroom settings',
            'Distinguish between neurological responses and willful noncompliance',
            'Apply function-based thinking before issuing consequences',
            'Recognize how racial bias intersects with behavioral interpretation',
        ],
        scholars: ['Dr. Edward Carr', 'Dr. V. Mark Durand', 'Dr. Gloria Ladson-Billings'],
        citation: 'Carr, E. G., & Durand, V. M. (1985). Reducing behavior problems through functional communication training. JABA, 18(2), 111–126.',
        targetRoles: ['teacher', 'paraprofessional', 'administrator'],
        icon: 'MessageCircle',
        color: 'gold',
        pdCreditHours: 1.5,
        scenarios: [
            {
                id: 'edu1-s1',
                title: 'The Desk Flip',
                situation: 'You are a 4th-grade teacher. During a math worksheet, a student suddenly pushes their paper off the desk and puts their head down. Other students turn to look.',
                studentBehavior: 'Student pushed paper off desk, head down, body tense, breathing quickly.',
                contextClues: [
                    'The student was working independently — no peer conflict',
                    'The math topic is new and was just introduced 10 minutes ago',
                    'The student has an IEP with accommodations for extended time',
                    'It is 2:15 PM — afternoon, post-lunch',
                ],
                behaviorFunction: 'escape',
                primaryLens: 'environment',
                gradeLevel: 'elementary',
                choices: [
                    {
                        id: 'edu1-s1-a',
                        label: 'Issue a consequence',
                        response: '"Pick up your paper. If you can\'t do the work, you\'ll finish it at recess."',
                        consequence: 'The student does not pick up the paper. They press their face harder into the desk. A few students start whispering. You now have a public standoff, and the student has shut down further. The original problem (math was too hard) remains unsolved, and the student has now lost recess — their one movement break.',
                        theoryExplanation: 'This is an escape-function behavior. The student was overwhelmed by the math demand and pushed it away — literally. Adding a consequence (loss of recess) adds MORE demand to an already overloaded system. It also removes a regulatory break they need. The behavior will increase, not decrease, because the underlying need (escape from an overwhelming task) was never addressed.',
                        citation: 'Carr & Durand (1985): When the function is escape, adding demands escalates the behavior.',
                        rating: 'harmful',
                    },
                    {
                        id: 'edu1-s1-b',
                        label: 'Check in quietly',
                        response: 'Walk over calmly. Crouch to their level. Quietly: "Hey, I can see something is hard right now. Want to take a break or try a different problem first?"',
                        consequence: 'The student lifts their head slightly. After a moment, they say "I don\'t get it." You sit beside them and break the first problem into steps. They attempt it with support. The disruption is resolved in 90 seconds without any other student being affected.',
                        theoryExplanation: 'You addressed the function directly: the student needed to escape an overwhelming demand. By offering a break OR a modified task, you gave them a functional alternative to pushing the paper. You also preserved their dignity — no public confrontation, no shame. The co-regulation (crouching, calm voice, proximity) brought their nervous system down from activation.',
                        citation: 'Carr & Durand (1985): Teaching a functional replacement (asking for help) reduces the challenging behavior. Porges (2011): Co-regulation through calm presence.',
                        rating: 'best',
                    },
                    {
                        id: 'edu1-s1-c',
                        label: 'Ignore the behavior',
                        response: 'Continue teaching. Don\'t acknowledge the paper on the floor or the student\'s head on the desk.',
                        consequence: 'The student stays with their head down for 12 minutes. They complete no work. Other students notice you didn\'t respond and some begin testing boundaries. The student successfully escaped the task — but learned that the only way to get a break is to shut down. No connection was made, no skill was taught.',
                        theoryExplanation: 'Ignoring can be appropriate for attention-function behaviors, but this is escape. By ignoring, you accidentally reinforced the shutdown behavior — the student escaped the demand without learning any alternative. They also missed 12 minutes of instruction. Planned ignoring must be function-matched; here, it was a mismatch.',
                        citation: 'Cooper, Heron & Heward (2020): Extinction procedures must match the maintaining function. Ignoring an escape behavior IS the reinforcement.',
                        rating: 'acceptable',
                    },
                ],
                debrief: 'This scenario illustrates escape-maintained behavior — the most common function in classroom settings. The student wasn\'t being defiant; they were communicating "this is too much." The best response addresses the function: reduce the demand, offer an alternative, and re-engage when the student is regulated. Notice the context clues: new material, independent work, afternoon fatigue, IEP accommodations that may not have been activated. Every one of those clues pointed to escape before the behavior even happened.',
            },
            {
                id: 'edu1-s2',
                title: 'The Constant Caller',
                situation: 'You are a 2nd-grade teacher. One student raises their hand approximately every 90 seconds during independent reading time. When you don\'t call on them immediately, they begin calling out or walking to your desk.',
                studentBehavior: 'Frequent hand-raising, calling out, leaving seat, approaching teacher desk. Voice is not distressed — it\'s animated, eager.',
                contextClues: [
                    'The student is new to the school this year',
                    'During group work, the student is engaged and calm',
                    'The behavior happens specifically during independent/quiet time',
                    'The student\'s reading level is on grade — this isn\'t an academic struggle',
                ],
                behaviorFunction: 'attention',
                primaryLens: 'meaning',
                gradeLevel: 'elementary',
                choices: [
                    {
                        id: 'edu1-s2-a',
                        label: 'Use a behavior chart',
                        response: 'Put the student on a color-coded behavior chart. Green = good, yellow = warning, red = consequence. Move them to yellow when they call out.',
                        consequence: 'The student is visibly upset when moved to yellow. They stop calling out but become withdrawn, barely participating for the rest of the day. The next day, the calling out returns — but now with additional avoidance behaviors (head down during independent time). The chart addressed the symptom but not the need.',
                        theoryExplanation: 'Behavior charts are a compliance tool, not a communication tool. For a student whose behavior function is attention-seeking, a public chart GIVES attention (even negative attention reinforces) while simultaneously shaming. The student learned that seeking connection results in public humiliation. For a new student still building relationships, this is especially damaging.',
                        citation: 'Ladson-Billings (2009): Classroom management that relies on surveillance and public shaming disproportionately harms students of color and those seeking belonging.',
                        rating: 'harmful',
                    },
                    {
                        id: 'edu1-s2-b',
                        label: 'Build in structured attention',
                        response: 'Before independent reading, check in: "I\'m going to be working with small groups, but I\'ll come check on you in 5 minutes. If you need me before that, put this sticky note on your desk and I\'ll come when I can." Set a visual timer.',
                        consequence: 'The student places the sticky note once but waits. You check in at 5 minutes as promised. The calling out drops by 70% in the first week. The student begins self-monitoring with the timer. Trust builds because you kept your promise.',
                        theoryExplanation: 'You addressed the function: the student needs attention and connection. Instead of eliminating the need, you structured it — proactive check-ins, a non-verbal signal system, and a promise you kept. This teaches the student that their need for connection is valid AND that there are functional ways to get it. The visual timer builds self-regulation capacity.',
                        citation: 'Carr & Durand (1985): FCT — teach a functional replacement for the challenging behavior. The sticky note IS the replacement communication.',
                        rating: 'best',
                    },
                    {
                        id: 'edu1-s2-c',
                        label: 'Redirect firmly each time',
                        response: 'Each time the student calls out: "Remember, raise your hand and wait." Consistently redirect them to the expectation.',
                        consequence: 'The student raises their hand and waits... for about 30 seconds. Then calls out again. You redirect again. This cycle repeats 6-8 times per period. You\'re exhausted. The student gets EXACTLY what they need — your repeated, direct attention — every 90 seconds. The behavior is accidentally being reinforced.',
                        theoryExplanation: 'Redirecting is not wrong, but when the function is attention, every redirect IS reinforcement. You\'re giving them 6-8 direct interactions per period — exactly what they wanted. The behavior persists because it works. Firm redirection is appropriate for tangible or escape behaviors, but for attention-seeking, it feeds the cycle.',
                        citation: 'Cooper, Heron & Heward (2020): Verbal redirections for attention-maintained behavior inadvertently serve as positive reinforcement.',
                        rating: 'acceptable',
                    },
                ],
                debrief: 'Attention-seeking is often treated as a character flaw ("They\'re needy," "They need to learn to be independent"). But attention is a basic human need, and for a new student building relationships in an unfamiliar school, it\'s even more critical. The best response doesn\'t eliminate the need — it channels it. Structured check-ins, nonverbal signals, and kept promises teach the student that connection is available AND that there are calmer ways to access it. Notice: the student was fine during GROUP work. The behavior only appeared during INDEPENDENT time. The environment told you the function before the behavior did.',
            },
            {
                id: 'edu1-s3',
                title: 'The Misread',
                situation: 'You are a 6th-grade teacher. A Black male student is rocking in his chair and humming during a quiz. Another teacher passing by your room comments: "You\'re letting him get away with that?"',
                studentBehavior: 'Rocking, humming, looking at quiz paper. Not disrupting peers. Appears focused despite the movement.',
                contextClues: [
                    'The student has an autism diagnosis documented in his IEP',
                    'Rocking and humming are documented self-regulatory behaviors',
                    'The student\'s quiz scores are consistently above average',
                    'The passing teacher does not know the student\'s IEP',
                ],
                behaviorFunction: 'sensory',
                primaryLens: 'meaning',
                gradeLevel: 'middle',
                choices: [
                    {
                        id: 'edu1-s3-a',
                        label: 'Stop the stimming to maintain classroom norms',
                        response: '"Marcus, sit still and be quiet during the quiz please."',
                        consequence: 'Marcus stops rocking. His body goes rigid. He stares at the quiz paper for 4 minutes without writing anything. His score drops from his usual B+ to a D. He is quiet for the rest of the day — not calm, but shut down. You\'ve removed his regulation tool during a high-demand cognitive task.',
                        theoryExplanation: 'The rocking and humming were sensory-function behaviors — Marcus\'s nervous system was self-regulating to maintain the focus needed for a quiz. Stopping the stim removed his regulation tool. His body went from ventral vagal (focused calm) to dorsal vagal (freeze/shutdown). The quiz score tells the story: without his regulatory behavior, his cognitive performance collapsed. The passing teacher\'s comment was about optics, not education.',
                        citation: 'Kapp et al. (2019): Suppressing stimming increases anxiety and reduces cognitive performance. Porges (2011): Regulation precedes cognition.',
                        rating: 'harmful',
                    },
                    {
                        id: 'edu1-s3-b',
                        label: 'Protect the stim and educate the colleague',
                        response: 'To the passing teacher, calmly: "He\'s self-regulating — it\'s in his support plan. He does some of his best work this way." Then continue monitoring the quiz normally.',
                        consequence: 'Marcus finishes his quiz with a B+. He never knew the exchange happened. The passing teacher pauses, nods, and continues walking. You\'ve protected your student\'s regulation, his dignity, and his academic performance — while also educating a colleague without shaming them.',
                        theoryExplanation: 'This response operates on two levels. First, you protected the student\'s documented self-regulatory behavior — honoring the IEP and the research. Second, you modeled presumed competence and culturally responsive practice for a colleague. The passing teacher\'s implicit assumption — that a Black male student moving in his chair is "getting away with something" — reflects the intersection of racial bias and ableism that Black neurodivergent students navigate daily.',
                        citation: 'Kapp et al. (2019): Safe stims must be protected. Donnellan (1984): Presume competence. Ladson-Billings (2009): Culturally responsive teaching requires interrogating whose "norms" the classroom serves.',
                        rating: 'best',
                    },
                    {
                        id: 'edu1-s3-c',
                        label: 'Quietly offer a fidget tool as a compromise',
                        response: 'Walk over and quietly hand Marcus a fidget tool. "Try this instead of rocking — it\'s quieter."',
                        consequence: 'Marcus takes the fidget but seems confused. He was already regulated. The fidget is unfamiliar and actually distracts him. His quiz takes 10 minutes longer. The message he received: "Your way of being in the world is not acceptable here, even when it works."',
                        theoryExplanation: 'This response is well-intentioned but unnecessary. Marcus was already self-regulating effectively. Replacing a working stim with a different tool introduces novelty during a high-stakes task and communicates that his natural regulation strategy is insufficient. The impulse to offer an alternative comes from the assumption that his current behavior is a problem — but it wasn\'t. If the stim were unsafe or genuinely disruptive, redirection would be appropriate. Here, it was neither.',
                        citation: 'Kapp et al. (2019): Don\'t fix what isn\'t broken. The appropriate response to a safe, effective stim is to protect it.',
                        rating: 'acceptable',
                    },
                ],
                debrief: 'This scenario brings together sensory processing, racial bias, and the politics of classroom "norms." Marcus\'s rocking and humming were documented, effective, and safe. The only "problem" was another adult\'s perception — filtered through a lens that reads Black male movement as defiance rather than regulation. As educators, we must ask: whose comfort are we centering? The student who is learning effectively, or the adult who is uncomfortable with how it looks? Protecting neurodivergent students\' regulatory behaviors is not just good pedagogy — for Black students, it is an act of racial justice.',
            },
        ],
        keyTakeaways: [
            'Always identify the FUNCTION before choosing a RESPONSE. The same behavior (e.g., calling out) requires different interventions depending on whether it serves escape, attention, tangible, or sensory needs.',
            'Consequences that add demand to an escape behavior ESCALATE the situation. Reduce the load first.',
            'For attention-seeking behaviors, PROACTIVE structured attention is more effective than reactive redirection.',
            'Safe stimming should ALWAYS be protected — it is a regulatory tool, not a behavioral problem.',
            'Racial bias shapes how we interpret student behavior. A Black student\'s movement, volume, or non-compliance may be read through stereotypes rather than understood as neurological.',
        ],
    },

    // ─────────────────────────────────────────
    // MODULE 2: REGULATION IN THE CLASSROOM
    // ─────────────────────────────────────────
    {
        id: 'edu-2-classroom-regulation',
        slug: 'classroom-regulation',
        order: 2,
        title: 'Regulation in the Classroom',
        subtitle: 'Creating a nervous-system-aware learning environment',
        whyThisMatters: `You cannot teach a dysregulated student. Period. And you cannot co-regulate a student when your own nervous system is in survival mode. This module teaches you to read nervous system states in your students, design a classroom environment that supports regulation, and — critically — tend to your own nervous system so you can be the anchor your students need. This isn't soft. This is the neuroscience of learning.`,
        learningObjectives: [
            'Identify the three nervous system states (ventral vagal, sympathetic, dorsal vagal) in students',
            'Design classroom environments that reduce unnecessary nervous system activation',
            'Apply co-regulation techniques during student dysregulation',
            'Develop a personal regulation plan for educator self-care',
        ],
        scholars: ['Dr. Stephen Porges', 'Dr. Mona Delahooke', 'Dr. Bruce Perry'],
        citation: 'Porges, S. W. (2011). The Polyvagal Theory. W. W. Norton.',
        targetRoles: ['teacher', 'paraprofessional', 'specialist'],
        icon: 'Activity',
        color: 'rose',
        pdCreditHours: 2.0,
        prerequisite: 'classroom-behavior-communication',
        scenarios: [
            {
                id: 'edu2-s1',
                title: 'The Shutdown',
                situation: 'You are a paraprofessional assigned to a 3rd-grade student with autism. During a fire drill (unannounced), the student drops to the floor, covers their ears, and goes completely still. The class is filing out. The lead teacher says "Just pick them up and carry them."',
                studentBehavior: 'On the floor, ears covered, eyes closed, body rigid then limp. Non-responsive to verbal prompts.',
                contextClues: [
                    'The fire alarm is extremely loud — 85+ decibels',
                    'There was no visual schedule warning for the drill',
                    'The student has documented sound sensitivity in their IEP',
                    'The student was in a calm state immediately before the alarm',
                ],
                behaviorFunction: 'sensory',
                primaryLens: 'nervous-system',
                gradeLevel: 'elementary',
                choices: [
                    {
                        id: 'edu2-s1-a',
                        label: 'Physically move the student',
                        response: 'Follow the lead teacher\'s instruction. Pick the student up and carry them outside.',
                        consequence: 'The student screams. Their body goes from freeze to fight — kicking, biting, scratching. You are now physically restraining a terrified child in a hallway full of other students. The student is re-traumatized. Other students are scared. An incident report is filed. The student refuses to come to school the next day.',
                        theoryExplanation: 'The student was in dorsal vagal shutdown — the deepest survival state. Their nervous system detected a life-threatening stimulus (the alarm) and shut down to conserve energy. Physical contact during dorsal shutdown is perceived as an additional threat, catapulting them into sympathetic activation (fight/flight). This is not defiance — it is a predictable neurological response to being grabbed while in survival mode.',
                        citation: 'Porges (2011): Uninvited touch during dorsal vagal shutdown triggers sympathetic activation. Perry (2006): "Regulate, relate, reason" — in that order, always.',
                        rating: 'harmful',
                    },
                    {
                        id: 'edu2-s1-b',
                        label: 'Stay, shield, and wait',
                        response: 'Kneel beside the student. Don\'t touch them. Shield them from foot traffic. Say once, calmly: "I\'m right here. You\'re safe. We\'ll go when you\'re ready." Put noise-canceling headphones nearby if available. Tell the lead teacher: "I\'ll bring them out in a moment — they need a minute to process."',
                        consequence: 'After 60-90 seconds, the student\'s body softens slightly. They reach for the headphones. You offer your hand — they take it. You walk them outside 2 minutes after the class, using a quiet side exit. The student recovers within 10 minutes. No incident report. They come to school the next day.',
                        theoryExplanation: 'You met the student in their dorsal vagal state with safety signals: calm voice, physical proximity without touch, reduced demands, time. The headphones addressed the sensory trigger directly. Offering your hand (rather than grabbing) respected their autonomy and gave them agency in the transition. You also advocated with the lead teacher — not by arguing, but by stating a plan. Co-regulation in practice.',
                        citation: 'Porges (2011): Safety signals (prosodic voice, calm face, non-threatening posture) activate the ventral vagal system. Delahooke (2019): Meet the child in their state, not in your expectation.',
                        rating: 'best',
                    },
                    {
                        id: 'edu2-s1-c',
                        label: 'Verbally coach them through it',
                        response: '"Come on, buddy, it\'s just a drill. Everyone else is going outside. You need to get up. Let\'s go. One, two, three — up!"',
                        consequence: 'The student does not respond. You repeat yourself louder. Still no response. You try counting again. The hallway empties. You are alone with a non-responsive student, increasingly frustrated. The student is deeper in shutdown because your escalating voice adds to their auditory overload.',
                        theoryExplanation: 'During dorsal vagal shutdown, the student\'s auditory processing is functionally offline. They cannot process your words, especially multi-step instructions ("get up, let\'s go"). Counting and verbal coaching add MORE auditory input to a system that crashed because of auditory overload. The louder you get, the deeper they go. This isn\'t a motivation problem — it\'s a neurological reality.',
                        citation: 'Porges (2011): Dorsal vagal shutdown reduces auditory processing capacity. Language-heavy interventions are ineffective in this state.',
                        rating: 'acceptable',
                    },
                ],
                debrief: 'Fire drills are one of the most predictable triggers for neurodivergent students, yet schools rarely plan for them. This scenario teaches three critical lessons: (1) know your student\'s sensory profile BEFORE the crisis, (2) dorsal vagal shutdown requires patience and safety signals, not force or language, and (3) paraprofessionals need the authority to override instructions that would harm the student. Proactive planning — visual schedule warnings, headphones ready, a quiet exit route — prevents most of these crises entirely.',
            },
            {
                id: 'edu2-s2',
                title: 'The After-Lunch Crash',
                situation: 'You are a 5th-grade teacher. Every day after lunch, 4-5 students are dysregulated — one is under the desk, two are arguing, one is crying, one is bouncing off the walls. It takes 20 minutes to get the class back on track. Your administrator told you to "tighten up your management."',
                studentBehavior: 'Multiple students showing varied dysregulation: hiding (freeze), conflict (fight), tears (overwhelm), hyperactivity (seeking). Not isolated to one child.',
                contextClues: [
                    'Lunch is in a cafeteria with 200+ students — extremely loud',
                    'Recess was cut to 10 minutes due to testing prep schedule',
                    'The cafeteria is the last noisy environment before a 90-minute academic block',
                    'This pattern happens EVERY day, not randomly',
                ],
                behaviorFunction: 'sensory',
                primaryLens: 'environment',
                gradeLevel: 'elementary',
                choices: [
                    {
                        id: 'edu2-s2-a',
                        label: 'Tighten management — add structure and consequences',
                        response: 'Post new rules: "Silent entry after lunch. Seats in 30 seconds. Loss of free time for non-compliance." Enforce with a behavior chart.',
                        consequence: 'The loud students get quieter, but the student under the desk stays there. The crying student now cries silently. Two students who were arguing shift to passive-aggressive behavior. You\'ve suppressed the symptoms but the CAUSE (sensory overload + inadequate recovery) is unchanged. Three weeks later, referrals to the office increase.',
                        theoryExplanation: 'This is a systemic problem being treated as an individual behavior problem. When 4-5 students crash at the same time every day, the cause is environmental, not personal. Adding consequences to a post-cafeteria nervous system crash is like punishing someone for being tired after running a marathon. The administrator\'s advice to "tighten management" reflects a compliance-first paradigm that ignores the biological reality of regulation.',
                        citation: 'Porges (2011): Chronic environmental stressors cause predictable dysregulation patterns. Perry (2006): Patterned dysregulation points to environmental design, not individual defiance.',
                        rating: 'harmful',
                    },
                    {
                        id: 'edu2-s2-b',
                        label: 'Design a regulation transition',
                        response: 'Build a 7-minute "re-entry" protocol after lunch: lights dimmed, soft instrumental music, a choice between silent reading, drawing, or a body break (stretching, wall push-ups). No academic demands for 7 minutes.',
                        consequence: 'Week 1: The transition is noisy as students learn the routine. Week 2: Students begin settling in 4 minutes. Week 3: Students enter the room and self-select their regulation activity without prompting. The 20-minute crash disappears. You actually GAIN 13 minutes of instruction time. You document the data and present it to your administrator.',
                        theoryExplanation: 'You addressed the ENVIRONMENT, not the students. The cafeteria blew out their nervous systems with noise, crowding, and social demand. The truncated recess removed their recovery time. Your 7-minute protocol provided what the schedule stole: a transition that allows nervous systems to downshift from sympathetic activation back to ventral vagal (ready to learn). The choice element gives students agency over their own regulation, building self-awareness.',
                        citation: 'Porges (2011): Environmental design is the most powerful regulatory intervention. Delahooke (2019): "Before we can teach, we must help them feel safe."',
                        rating: 'best',
                    },
                    {
                        id: 'edu2-s2-c',
                        label: 'Address each student individually',
                        response: 'Spend the first 10 minutes checking in with each dysregulated student. Help the one under the desk, mediate the argument, comfort the crier, redirect the hyperactive student.',
                        consequence: 'You successfully de-escalate each student, but it takes 15 minutes. The other 20 students waited, some productively, some not. You\'re exhausted. Tomorrow, the same thing happens. And the next day. You\'re treating 5 individual fires instead of fixing the sprinkler system.',
                        theoryExplanation: 'Individual co-regulation is essential — but when the same pattern repeats daily across multiple students, the intervention needs to move upstream. You\'re spending heroic effort on symptom management instead of environmental redesign. This path leads to teacher burnout — your nervous system takes the hit of regulating 5 students back to baseline every single afternoon.',
                        citation: 'Maslach & Leiter (2016): Systemic problems treated as individual interventions are the primary driver of educator burnout.',
                        rating: 'acceptable',
                    },
                ],
                debrief: 'This scenario shifts the frame from "what\'s wrong with these kids" to "what\'s wrong with this environment." When multiple students crash at the same predictable time every day, the data is screaming: the SYSTEM needs to change, not the students. The 7-minute regulation transition costs almost nothing — dimming lights and playing music is free — but recovers more instructional time than any consequence system ever could. Document it, present the data, and help administrators see that regulation IS classroom management.',
            },
            {
                id: 'edu2-s3',
                title: 'Your Own Nervous System',
                situation: 'It is your 5th period. You\'ve had 3 behavioral incidents today, a parent email complaint, and your administrator observed your class (unannounced) during your worst moment. You feel your jaw clenching. A student asks you a question and you snap: "I JUST explained that. Were you listening?"',
                studentBehavior: 'Student asked a legitimate question. They flinch at your tone and go quiet.',
                contextClues: [
                    'YOU are the one who is dysregulated',
                    'The student\'s question was reasonable — you missed it because you\'re activated',
                    'Your body is showing signs: clenched jaw, tight shoulders, shallow breathing',
                    'You have 2 more hours of teaching to go',
                ],
                behaviorFunction: 'escape',
                primaryLens: 'nervous-system',
                gradeLevel: 'all',
                choices: [
                    {
                        id: 'edu2-s3-a',
                        label: 'Push through — you can rest after school',
                        response: 'Keep teaching. Ignore your body\'s signals. You\'re a professional; you can handle it.',
                        consequence: 'You make it through the day but snap at two more students. You go home, collapse, and dread tomorrow. Over weeks, this pattern becomes chronic. You start calling in sick on Mondays. Your relationships with students deteriorate. You\'re considering leaving the profession.',
                        theoryExplanation: 'Ignoring your own dysregulation doesn\'t make it disappear — it leaks. Your students are reading your nervous system constantly. When you\'re activated, they detect threat, and THEIR nervous systems activate in response. You\'re inadvertently creating the very dysregulation you\'ll then have to manage. This is the burnout cycle: activated teacher → activated students → more behavioral incidents → more activation.',
                        citation: 'Porges (2011): Neuroception is bidirectional — students detect teacher dysregulation through voice tone, facial expression, and movement patterns. Maslach & Leiter (2016): Chronic emotional labor without recovery is the primary mechanism of burnout.',
                        rating: 'harmful',
                    },
                    {
                        id: 'edu2-s3-b',
                        label: 'Repair, regulate, reset',
                        response: 'Pause. Turn to the student: "I\'m sorry — that was my frustration, not yours. Your question was fine. Let me answer it." Then: "Class, I need you to read silently for 2 minutes while I reset." Step to the doorway. Three deep breaths. Return.',
                        consequence: 'The student\'s face softens — they were seen and repaired. The class reads quietly, sensing that you needed a moment. When you return, your voice is lower, your shoulders are down. The last 2 hours go measurably better. The student you snapped at stays after class and says "Are you okay, Miss?" Connection deepened, not broken.',
                        theoryExplanation: 'You modeled three critical skills: (1) REPAIR — acknowledging the impact of your dysregulation on someone else, (2) REGULATION — naming your need and taking action, (3) RESET — returning to ventral vagal before resuming demands. The 2-minute pause cost almost nothing instructionally but prevented an afternoon of escalation. And the student learned something no textbook teaches: adults can be wrong, apologize, and do better.',
                        citation: 'Tronick (2007): Repair after rupture strengthens relational bonds. Schore (2003): Co-regulation requires the adult to be regulated first.',
                        rating: 'best',
                    },
                    {
                        id: 'edu2-s3-c',
                        label: 'Apologize and keep going',
                        response: '"Sorry about that. Okay, so like I was saying..."',
                        consequence: 'The apology lands, but it\'s quick. The student nods but doesn\'t ask another question for the rest of class. You continue teaching from the same activated state. The apology was a repair, but without the regulation step, you\'re still running on fumes. The next trigger is one period away.',
                        theoryExplanation: 'Repair without regulation is incomplete. The apology addresses the relational rupture (good), but doesn\'t address the physiological state driving the rupture (your activated nervous system). Without pausing to actually regulate, you\'re likely to snap again. Repair + regulation = sustainable. Repair alone = a band-aid on a broken bone.',
                        citation: 'Tronick (2007): Repair is necessary but insufficient without the adult\'s return to a regulated state.',
                        rating: 'acceptable',
                    },
                ],
                debrief: 'This is the scenario nobody wants to talk about: the educator\'s own nervous system. You are a human being in a high-demand, under-resourced, emotionally taxing environment. Your dysregulation is not a personal failure — it\'s a predictable response to systemic conditions. But your students feel it, and they respond to it. The most important regulatory tool in your classroom is YOU. Taking 2 minutes to breathe is not weakness — it\'s the most sophisticated classroom management strategy that exists. And modeling repair teaches your students something they may never learn anywhere else: that it\'s possible to be wrong, to own it, and to do better.',
            },
        ],
        keyTakeaways: [
            'During dorsal vagal shutdown, reduce ALL input. No grabbing, no verbal coaching, no urgency. Offer safety signals and wait.',
            'When multiple students crash at the same time daily, redesign the ENVIRONMENT, not the consequence system.',
            'A 5-7 minute regulation transition after high-stimulus activities GAINS instructional time — it doesn\'t waste it.',
            'Your nervous system is the most powerful regulatory tool in the classroom. Tend to it.',
            'Repair after rupture is non-negotiable. Students need to see that adults can be wrong, apologize, and return to connection.',
        ],
    },

    // ─────────────────────────────────────────
    // MODULE 3: CULTURALLY RESPONSIVE NEURODIVERSITY
    // ─────────────────────────────────────────
    {
        id: 'edu-3-culturally-responsive',
        slug: 'culturally-responsive-neurodiversity',
        order: 3,
        title: 'Culturally Responsive Neurodiversity',
        subtitle: 'When race and neurology intersect in the classroom',
        whyThisMatters: `Black students are diagnosed with autism 3-4 years later than white students. They are twice as likely to be identified as having an emotional disturbance rather than autism. They receive harsher disciplinary action for the same behaviors. And when they ARE identified, they are more likely to be placed in restrictive settings. This isn't a knowledge gap — it's a system designed around white neurotypical norms. This module teaches you to see the intersection, name the bias, and design classrooms that honor both neurodivergent needs and cultural identity.`,
        learningObjectives: [
            'Identify how racial bias shapes the interpretation of neurodivergent behavior in schools',
            'Recognize the "double burden" that Black and Brown neurodivergent students face',
            'Apply culturally responsive practices specifically to neurodivergent students',
            'Design IEP accommodations that honor cultural identity alongside neurological needs',
        ],
        scholars: ['Dr. Gloria Ladson-Billings', 'Dr. Joy DeGruy', 'Resmaa Menakem', 'Dr. Claude Steele'],
        citation: 'Ladson-Billings, G. (2009). The Dreamkeepers: Successful Teachers of African American Children. Jossey-Bass.',
        targetRoles: ['teacher', 'administrator', 'specialist'],
        icon: 'Users',
        color: 'purple',
        pdCreditHours: 2.0,
        prerequisite: 'classroom-regulation',
        scenarios: [
            {
                id: 'edu3-s1',
                title: 'The Referral',
                situation: 'You are a school psychologist reviewing referral data. Two 3rd-grade boys were referred this month for "aggressive behavior." Student A (white) was referred with the note: "Possible autism — sensory meltdowns, needs evaluation." Student B (Black) was referred with the note: "Defiant, aggressive, needs behavioral intervention." You pull their behavioral data. The behaviors are nearly identical.',
                studentBehavior: 'Both students: throwing materials, leaving seat, hitting peers when overwhelmed. Both have high-frequency behaviors during transitions and unstructured time.',
                contextClues: [
                    'Student A and Student B have similar behavior frequencies and intensities',
                    'Student A was referred by a teacher who recently attended autism training',
                    'Student B was referred by a teacher with no specialized training',
                    'Student B has had 3 office discipline referrals; Student A has had 0',
                    'Student B\'s behaviors are described as "defiance"; Student A\'s as "meltdowns"',
                ],
                behaviorFunction: 'escape',
                primaryLens: 'lineage',
                gradeLevel: 'elementary',
                choices: [
                    {
                        id: 'edu3-s1-a',
                        label: 'Process both referrals as written',
                        response: 'Evaluate Student A for autism. Develop a behavior intervention plan for Student B focused on compliance. Trust the teachers\' framing.',
                        consequence: 'Student A receives an autism diagnosis, an IEP, and accommodations. His behavior improves with supports. Student B receives a behavior plan with consequences for non-compliance. His behavior worsens. By 5th grade, he is in a self-contained behavioral classroom. By 8th grade, he has been suspended 11 times. No one ever evaluated him for autism.',
                        theoryExplanation: 'This is the pipeline. Identical behaviors interpreted through different racial lenses produce radically different outcomes. Student A\'s teacher had language for neurodivergence; Student B\'s teacher saw defiance. The school psychologist who processes referrals as written — without interrogating the framing — becomes complicit in a system that sorts Black children into behavioral categories and white children into disability categories.',
                        citation: 'Mandell et al. (2009): Black children with autism are 5.1x more likely to be diagnosed with conduct disorder first. Harry & Klingner (2006): Why Are So Many Minority Students in Special Education?',
                        rating: 'harmful',
                    },
                    {
                        id: 'edu3-s1-b',
                        label: 'Flag the discrepancy and evaluate both for autism',
                        response: 'Call both referring teachers. Ask: "If this child were white, would the referral language be different?" Recommend autism evaluations for BOTH students. Document the pattern for your equity team.',
                        consequence: 'The conversation with Student B\'s teacher is uncomfortable but productive. She admits she hadn\'t considered autism because "he doesn\'t seem autistic — he\'s very social." You explain that autism presents differently across individuals and that social engagement doesn\'t rule it out. Both students are evaluated. Both receive autism diagnoses. Student B gets an IEP. His office referrals drop to zero within a semester.',
                        theoryExplanation: 'You did three things: (1) interrogated the racial bias in the referral language, (2) applied presumed competence by evaluating Student B with the same lens as Student A, and (3) documented the pattern for systemic change. The question "If this child were white, would the language be different?" is the single most powerful equity question in special education. Asking it isn\'t comfortable. But for Student B, it\'s the difference between support and the school-to-prison pipeline.',
                        citation: 'Ladson-Billings (2006): The education debt owed to Black students includes the debt of recognition. Donnellan (1984): The least dangerous assumption requires evaluation, not assumption.',
                        rating: 'best',
                    },
                    {
                        id: 'edu3-s1-c',
                        label: 'Recommend evaluation for Student B but don\'t address the bias',
                        response: 'Add an autism evaluation for Student B based on the behavioral data. Don\'t raise the discrepancy with either teacher.',
                        consequence: 'Student B gets evaluated and diagnosed. Good. But the system that produced the biased referral remains intact. Next month, another Black student is referred for "defiance" when the behavior is neurological. The pattern continues because no one named it.',
                        theoryExplanation: 'Individual correction without systemic intervention is necessary but insufficient. Student B benefits, but the next Student B won\'t — because the referring teacher\'s implicit bias was never surfaced, and the school has no mechanism to catch the pattern. Equity work requires both the individual save AND the systemic conversation.',
                        citation: 'Ladson-Billings (2006): Individual interventions within biased systems produce individual exceptions, not systemic change.',
                        rating: 'acceptable',
                    },
                ],
                debrief: 'This scenario is based on real data. The research consistently shows that identical behaviors in Black and white students are described with different language, referred through different pathways, and result in different outcomes. "Meltdown" vs. "aggression." "Needs support" vs. "needs discipline." The language on a referral form shapes a child\'s entire educational trajectory. Every educator in the referral chain — the teacher, the school psych, the administrator — has the power to interrupt the bias. The question is whether they choose to see it.',
            },
            {
                id: 'edu3-s2',
                title: 'The Culture Clash',
                situation: 'You are a 7th-grade teacher. A Black female student with ADHD is consistently animated in class discussions — interrupting, responding loudly, standing up when excited. Her contributions are insightful and demonstrate strong comprehension. Other teachers call her "disruptive" and "disrespectful."',
                studentBehavior: 'Calling out, standing during discussion, animated gesturing, loud voice. Contributions are on-topic and demonstrate engagement.',
                contextClues: [
                    'The student has a documented ADHD diagnosis',
                    'Her behavior is consistent with Black cultural communication styles (call-and-response, animation, embodied expression)',
                    'She is quiet and withdrawn in classes where she has been reprimanded for these behaviors',
                    'Her grades are A\'s and B\'s despite the behavioral concerns',
                ],
                behaviorFunction: 'attention',
                primaryLens: 'lineage',
                gradeLevel: 'middle',
                choices: [
                    {
                        id: 'edu3-s2-a',
                        label: 'Require her to conform to standard participation norms',
                        response: '"I appreciate your enthusiasm, but you need to raise your hand and wait to be called on like everyone else."',
                        consequence: 'She raises her hand. You call on her. Her answers are shorter, less energetic. By week three, she stops participating entirely. Her grade drops from an A to a C — not because she doesn\'t know the material, but because participation is graded and she\'s checked out. She tells her mother: "My teacher doesn\'t like how I talk."',
                        theoryExplanation: 'You asked a Black girl with ADHD to suppress both her cultural communication style AND her neurological impulse control differences simultaneously. The "standard participation norm" of silent hand-raising privileges white, neurotypical communication patterns. Her animated, embodied engagement IS learning — it is how she processes and demonstrates comprehension. Silencing it didn\'t improve her learning; it severed her connection to the class.',
                        citation: 'Smitherman (1977): Black communication patterns (call-and-response, animation, embodied expression) are culturally legitimate, not deficient. Ladson-Billings (2009): Culturally responsive teaching validates home culture in the classroom.',
                        rating: 'harmful',
                    },
                    {
                        id: 'edu3-s2-b',
                        label: 'Redesign participation to honor multiple styles',
                        response: 'Create a classroom that has MULTIPLE participation modes: a "hot seat" for students who want to respond immediately, a "think-then-speak" lane for those who need processing time, and a "silent response" option (whiteboard, chat). Use call-and-response deliberately as a teaching tool.',
                        consequence: 'The animated student thrives in the hot seat — and other students try it too. The quiet students use the think-then-speak lane. Engagement across the class increases. The "disruptive" student is now the model of engagement. Other teachers notice and ask what you\'re doing.',
                        theoryExplanation: 'You redesigned the system instead of fixing the student. By creating multiple participation channels, you honored ADHD neurology (impulse-friendly options), Black cultural communication (call-and-response as legitimate pedagogy), AND the needs of students who process differently. This is culturally responsive teaching meets universal design. The student didn\'t change. The classroom changed.',
                        citation: 'Ladson-Billings (2009): Culturally responsive classrooms validate home culture as a learning asset. CAST (2018): Universal Design for Learning — multiple means of engagement.',
                        rating: 'best',
                    },
                    {
                        id: 'edu3-s2-c',
                        label: 'Quietly give her more flexibility than other students',
                        response: 'Let her call out while holding other students to the hand-raising norm. Don\'t explicitly address it.',
                        consequence: 'It works temporarily. But other students notice the double standard. Some complain: "Why does she get to call out?" The quiet accommodation becomes a source of resentment. And the student senses she\'s being "allowed" rather than valued — tolerated, not included.',
                        theoryExplanation: 'Quiet individual accommodation without systemic redesign creates invisible hierarchies. The student doesn\'t need your permission to be who she is — she needs a classroom designed for multiple ways of being. And other students deserve the same flexibility. Universal design benefits everyone; individual exceptions benefit one student while fostering resentment.',
                        citation: 'CAST (2018): Universal Design for Learning — what helps one, helps all. Individual accommodations should be a bridge to systemic redesign, not a permanent workaround.',
                        rating: 'acceptable',
                    },
                ],
                debrief: 'This scenario sits at the intersection of ADHD, Black cultural communication, and whose participation norms the classroom privileges. The student\'s behavior is simultaneously ADHD (impulsive responding, difficulty waiting) AND culturally congruent (animated, embodied, call-and-response). Neither dimension makes it "wrong." The question is not "How do we fix her?" but "How do we fix the classroom to work for ALL kinds of minds and ALL kinds of culture?" That\'s the work.',
            },
        ],
        keyTakeaways: [
            'The same behavior in Black and white students is often described with different language — "meltdown" vs. "aggression," "sensory need" vs. "defiance." Learn to catch the discrepancy.',
            'Black students are diagnosed with autism 3-4 years later than white students. If a Black student\'s behavior could be neurological, evaluate FIRST.',
            'Culturally responsive neurodiversity means honoring BOTH a student\'s cultural identity AND their neurological needs — not asking them to suppress either.',
            'Redesign systems (participation structures, referral processes, classroom norms) rather than fixing individual students.',
            'Ask the equity question: "If this student were white, would my interpretation of this behavior be different?"',
        ],
    },

    // ─────────────────────────────────────────
    // MODULE 4: THE WHOLE CLASSROOM (EC FRAMEWORK)
    // ─────────────────────────────────────────
    {
        id: 'edu-4-whole-classroom',
        slug: 'the-whole-classroom',
        order: 4,
        title: 'The Whole Classroom',
        subtitle: 'Applying the Epigenetic Consciousness framework to school settings',
        whyThisMatters: `You now have the tools: function-based thinking, nervous system literacy, culturally responsive practice. This final module integrates them into the Epigenetic Consciousness framework — the four-lens approach that ensures you never see a student\'s behavior in isolation again. Every student walks into your classroom carrying their lineage, their environment, their nervous system state, and their need for dignity. When you learn to see all four, you stop managing behavior and start understanding human beings.`,
        learningObjectives: [
            'Apply the full 4-lens EC framework (Lineage, Environment, Nervous System, Meaning & Dignity) to classroom situations',
            'Design classroom practices that address all four lenses proactively',
            'Build an EC-informed Student Support Profile for neurodivergent students',
            'Create a professional development plan for continued growth',
        ],
        scholars: ['Eli Davis', 'Dr. Stephen Porges', 'Dr. Gloria Ladson-Billings', 'Dr. Joy DeGruy'],
        citation: 'Davis, E. (2025). Epigenetic Consciousness Framework. Developed for Giovanna Companion.',
        targetRoles: ['teacher', 'paraprofessional', 'administrator', 'specialist'],
        icon: 'Eye',
        color: 'purple',
        pdCreditHours: 2.5,
        prerequisite: 'culturally-responsive-neurodiversity',
        scenarios: [
            {
                id: 'edu4-s1',
                title: 'The Whole Picture',
                situation: 'You are a new special education teacher. You\'ve just received a caseload that includes a 10-year-old Black autistic boy named Jaylen. His file is thick: 14 office referrals, 3 suspensions, one restraint incident. He\'s been labeled a "frequent flyer" by staff. His mother has stopped attending meetings. You meet him for the first time tomorrow.',
                studentBehavior: 'Per file: elopement (running from class), "aggression" (hitting, throwing), non-compliance with directives, refusal to do written work.',
                contextClues: [
                    'Jaylen\'s father is incarcerated — he was arrested at home while Jaylen watched',
                    'His mother works two jobs and is exhausted from fighting the school',
                    'His IEP goals haven\'t been updated in 2 years',
                    'He loves dinosaurs and can identify 200+ species',
                    'The restraint incident occurred when a staff member grabbed his arm during elopement',
                    'No one has asked Jaylen what HE thinks is happening',
                ],
                behaviorFunction: 'escape',
                primaryLens: 'lineage',
                gradeLevel: 'elementary',
                choices: [
                    {
                        id: 'edu4-s1-a',
                        label: 'Review the file and prepare a behavior plan',
                        response: 'Read the entire file. Tally the referrals. Identify the highest-frequency behaviors. Create a new behavior plan targeting elopement and aggression with clear consequences.',
                        consequence: 'You walk in prepared with data — but only the school\'s data. Jaylen sees another adult with a clipboard. He reads your nervous system: you\'re cautious, slightly tense. He tests you within the first hour. Your behavior plan triggers within the first week. He runs. The cycle that 14 referrals documented continues with referral #15.',
                        theoryExplanation: 'You relied on the system\'s narrative about Jaylen without building your own. The file tells you what the SCHOOL experienced. It doesn\'t tell you what JAYLEN experienced. A behavior plan built on referral data — without understanding the child\'s world, their trauma, their regulatory profile, or their strengths — is a plan designed to manage the school\'s discomfort, not to support the student.',
                        citation: 'Davis (2025): The EC framework requires all four lenses. A plan built on referral data alone operates from only one lens (Environment) and misses three.',
                        rating: 'harmful',
                    },
                    {
                        id: 'edu4-s1-b',
                        label: 'Start with connection, not correction',
                        response: 'Put the file down. On day one, sit with Jaylen. Ask about dinosaurs. Spend 15 minutes learning about his 200 species. Don\'t mention behavior at all. Call his mother — not about behavior, but to say: "I met Jaylen today. He\'s incredible. I want to work WITH you both." Then, slowly, apply all four lenses.',
                        consequence: 'Jaylen is suspicious at first — adults with his name on their clipboard have never asked about dinosaurs. But within a week, he starts coming to you voluntarily. His mother cries on the phone — no one from school has ever called with something positive. You build a 4-lens profile: 🏛 Lineage — witnessed his father\'s arrest (ACE score likely high), mother\'s exhaustion signals toxic stress ecosystem. 🌍 Environment — written work is the primary trigger (fine motor difficulty?), elopement always happens during high-demand low-choice moments. 💓 Nervous System — hypervigilant (scans room constantly), tactile defensive (the restraint was a predictable trauma trigger). ✨ Meaning — has been labeled "bad" by 6 adults. Believes it. Dinosaur knowledge is the one thing no one can take away. Your IEP revision starts with strengths. His mother attends the meeting.',
                        theoryExplanation: 'You applied all four EC lenses before writing a single goal. Lineage revealed ACE exposure and intergenerational stress. Environment revealed the specific triggers (written work, lack of choice). Nervous System revealed hypervigilance and tactile defensiveness. Meaning & Dignity revealed a child who has internalized the label "bad." The dinosaur knowledge isn\'t a sidebar — it\'s the bridge. It\'s the only thing in this child\'s school experience that makes him feel competent. Start there.',
                        citation: 'Davis (2025): Epigenetic Consciousness requires seeing the whole child — history, environment, neurology, and dignity — before designing intervention. Perry (2006): "Regulate, relate, reason." You cannot reason (plan) before you relate (connect).',
                        rating: 'best',
                    },
                    {
                        id: 'edu4-s1-c',
                        label: 'Talk to previous teachers to get the real story',
                        response: 'Ask colleagues: "What works with Jaylen? What should I know?" Gather informal intel before meeting him.',
                        consequence: 'You get a mixed picture. One teacher: "He\'s impossible — good luck." Another: "He was great in art class." A third: "His mom doesn\'t care." You walk into the relationship carrying other people\'s frustrations, biases, and burnout. Jaylen detects it immediately — he\'s been reading adults for survival his entire life.',
                        theoryExplanation: 'Gathering colleague perspectives is reasonable, but the risk is high. You inherit their lens, their bias, their burnout. The teacher who says "his mom doesn\'t care" is projecting — his mother has been fighting this system while working two jobs. The teacher who says "he\'s impossible" told you more about their own capacity than about Jaylen. The most important data is the data you collect yourself, in relationship.',
                        citation: 'Ladson-Billings (2009): Culturally responsive teaching begins with the teacher\'s own assumptions. DeGruy (2005): Staff narratives about Black families often reflect systemic bias, not family reality.',
                        rating: 'acceptable',
                    },
                ],
                debrief: 'Jaylen\'s story is the story of tens of thousands of Black autistic children in American schools. A thick file. A tired mother. A label that became a prophecy. And a system that documented its own failure 14 times and called it the child\'s problem. The EC framework asks you to read the WHOLE picture before writing a single line of intervention. Jaylen doesn\'t need a better behavior plan. He needs an adult who sees him — his history, his pain, his genius, and his worth — and designs support from THAT starting point. That\'s what Pillar 2 is. That\'s what this training exists for.',
            },
        ],
        keyTakeaways: [
            'A student\'s file tells you what the SYSTEM documented. It doesn\'t tell you who the STUDENT is. Build your own relationship before writing a plan.',
            'Apply all four EC lenses (Lineage, Environment, Nervous System, Meaning & Dignity) before designing any intervention.',
            'Start with connection, not correction. Relationship IS the intervention.',
            'A student\'s strengths and interests are not sidebars — they are the foundation of every effective support plan.',
            'When a parent has stopped attending meetings, the system failed them. Rebuild trust before requesting participation.',
            'You are not just teaching content. You are shaping how a child understands their own worth. Make every interaction count.',
        ],
    },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getEducatorModuleBySlug(slug: string): EducatorModule | undefined {
    return EDUCATOR_MODULES.find(m => m.slug === slug);
}

export function getNextEducatorModule(currentSlug: string): EducatorModule | undefined {
    const current = EDUCATOR_MODULES.find(m => m.slug === currentSlug);
    if (!current) return undefined;
    return EDUCATOR_MODULES.find(m => m.order === current.order + 1);
}

export function getTotalPDHours(): number {
    return EDUCATOR_MODULES.reduce((sum, m) => sum + m.pdCreditHours, 0);
}

export function getModulesForRole(role: EducatorRole): EducatorModule[] {
    return EDUCATOR_MODULES.filter(m => m.targetRoles.includes(role));
}
