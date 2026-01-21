# Core Foundations Review Table

> **Phase A**: Review this table before any other scholars files are created.

---

## Categories

| Category | Meaning |
|----------|---------|
| **Evidence** | Peer-reviewed research, RCT, or controlled study |
| **Influence** | Clinical book, community knowledge, or conceptual framework |

---

## Core Foundations (10)

| # | Foundation | Category | Claim (One Sentence) | Feature/File Mapping | Verification | Citation |
|---|------------|----------|----------------------|---------------------|--------------|----------|
| 1 | Functional Communication Training | **Evidence** | Challenging behaviors often serve a communicative function; teaching alternative communication reduces the behavior. | `learningContent.ts` (FCT article), ABC Logger "function" field | ✅ Verified | Carr, E. G., & Durand, V. M. (1985). Reducing behavior problems through functional communication training. *JABA*, 18(2), 111–126. [DOI: 10.1901/jaba.1985.18-111](https://doi.org/10.1901/jaba.1985.18-111) |
| 2 | Autistic Stimming as Regulation | **Evidence** | Stimming serves essential regulatory functions for autistic people; suppression causes harm. | `learningContent.ts` (Stimming article), `guardrails.ts` (blocks "quiet hands") | ✅ Verified | Kapp, S. K., et al. (2019). "People should be allowed to do what they like": Autistic adults' views and experiences of stimming. *Autism*, 23(7), 1782–1792. [DOI: 10.1177/1362361319829628](https://doi.org/10.1177/1362361319829628) |
| 3 | Meltdown vs Tantrum Distinction | **Influence** | Meltdowns are involuntary neurological responses; tantrums are goal-oriented. | `learningContent.ts` (Meltdown article) | ✅ Verified | Child Mind Institute. (n.d.). Autism and Meltdowns. [URL](https://childmind.org/article/autism-and-meltdowns/) |
| 4 | Polyvagal Theory | **Evidence** | The autonomic nervous system has three states (calm/fight-flight/freeze) that explain behavioral responses to threat. | `lensCards.ts` → Nervous System lens, regulation language throughout | ✅ Verified | Porges, S. W. (2011). *The Polyvagal Theory*. W. W. Norton. ISBN: 978-0393707007 |
| 5 | Neurodiversity Paradigm | **Influence** | Neurological differences are natural variations, not deficits to cure. | `guardrails.ts` (blocks "cure", "suffering from"), AI system prompt | ✅ Verified | Singer, J. (1998). *Odd People In* (Honours thesis). UTS. See also: Walker, N. (2014). "Neurodiversity: Some Basic Terms." [URL](https://neurocosmopolitanism.com/neurodiversity-some-basic-terms-definitions/) |
| 6 | Co-Regulation | **Influence** | Children learn self-regulation through repeated co-regulation with calm adults. | `lensCards.ts` (all lenses reference caregiver state), `homeplaceSupports.ts` (Trusted People) | ✅ Verified | Tronick, E. (2007). *Neurobehavioral and Social-Emotional Development*. Norton. ISBN: 978-0393705171 |
| 7 | Presuming Competence | **Influence** | When competence is unknown, assume it—underestimating causes more harm than overestimating. | `functions/src/index.ts` (AI prompt: "Assume competence"), `guardrails.ts` (blocks "mental age") | ✅ Verified | Donnellan, A. M. (1984). The criterion of the least dangerous assumption. *Behavioral Disorders*, 9(2), 141–150. [DOI: 10.1177/019874298400900201](https://doi.org/10.1177/019874298400900201) |
| 8 | Beyond Behaviors | **Influence** | Look beneath behavior to the nervous system state driving it. | `lensCards.ts` → "Behavior as Message" prompt | ✅ Verified | Delahooke, M. (2019). *Beyond Behaviors*. PESI Publishing. ISBN: 978-1683731191 |
| 9 | Trauma-Informed Care | **Influence** | Recognize how trauma affects behavior and design responses to avoid re-traumatization. | `personalSupportPlan.ts` → Crisis Plan ("what helps/what makes worse") | ✅ Verified | SAMHSA. (2014). *Concept of Trauma and Guidance for a Trauma-Informed Approach*. HHS Pub. (SMA) 14-4884. [URL](https://store.samhsa.gov/product/SAMHSA-s-Concept-of-Trauma-and-Guidance-for-a-Trauma-Informed-Approach/SMA14-4884) |
| 10 | Epigenetic Consciousness | **Influence** | Behavior understood through 4 lenses: Lineage & Story, Environment & Load, Nervous System, Meaning & Dignity. | `lensCards.ts` (entire 4-lens architecture), `familyProfile.ts` (cultural context) | ⚠️ Designer Framework | Davis, E. (2025). Created for Giovanna. *Not external research—designer attribution.* |

---

## Status Summary

- **✅ Verified**: 9 foundations
- **⚠️ Designer Framework**: 1 (Epigenetic Consciousness)
- **❌ Needs Verification**: 0

---

## Approval Request

Please review this table and confirm:

1. Are these the right 10 foundations?
2. Is the Evidence vs Influence categorization accurate?
3. Should any be added or removed?
4. Should I proceed to create the full markdown files (FRAMEWORKS.md, RESEARCHERS.md, PRINCIPLES.md, LANGUAGE_GUIDE.md)?
