export function hasCompletedFamilySetup(family) {
    return Array.isArray(family?.children) && family.children.length > 0;
}
export function getPostAuthRedirect(family) {
    return hasCompletedFamilySetup(family) ? '/dashboard' : '/onboarding';
}
export function toDate(value) {
    if (value instanceof Date)
        return value;
    if (value && typeof value === 'object' && 'toDate' in value) {
        const maybeToDate = value.toDate;
        if (typeof maybeToDate === 'function') {
            return maybeToDate();
        }
    }
    return new Date(0);
}
export function shouldResetUsageCycle(lastResetDate, now = new Date()) {
    const lastReset = toDate(lastResetDate);
    return now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
}
