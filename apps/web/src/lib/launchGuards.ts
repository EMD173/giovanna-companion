interface FamilySetupLike {
    children?: unknown[] | null;
}

export function hasCompletedFamilySetup(family: FamilySetupLike | null | undefined): boolean {
    return Array.isArray(family?.children) && family.children.length > 0;
}

export function getPostAuthRedirect(family: FamilySetupLike | null | undefined): '/dashboard' | '/onboarding' {
    return hasCompletedFamilySetup(family) ? '/dashboard' : '/onboarding';
}

export function toDate(value: unknown): Date {
    if (value instanceof Date) return value;

    if (value && typeof value === 'object' && 'toDate' in value) {
        const maybeToDate = (value as { toDate?: () => Date }).toDate;
        if (typeof maybeToDate === 'function') {
            return maybeToDate();
        }
    }

    return new Date(0);
}

export function shouldResetUsageCycle(lastResetDate: unknown, now: Date = new Date()): boolean {
    const lastReset = toDate(lastResetDate);
    return now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
}
