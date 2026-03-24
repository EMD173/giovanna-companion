import test from 'node:test';
import assert from 'node:assert/strict';
import { getPostAuthRedirect, hasCompletedFamilySetup, shouldResetUsageCycle, toDate, } from '../src/lib/launchGuards.js';
test('hasCompletedFamilySetup returns true when at least one child exists', () => {
    assert.equal(hasCompletedFamilySetup({ children: [{ id: 'child-1' }] }), true);
});
test('hasCompletedFamilySetup returns false for missing or empty children', () => {
    assert.equal(hasCompletedFamilySetup(null), false);
    assert.equal(hasCompletedFamilySetup({ children: [] }), false);
});
test('getPostAuthRedirect sends complete families to dashboard', () => {
    assert.equal(getPostAuthRedirect({ children: [{ id: 'child-1' }] }), '/dashboard');
});
test('getPostAuthRedirect sends incomplete families to onboarding', () => {
    assert.equal(getPostAuthRedirect({ children: [] }), '/onboarding');
    assert.equal(getPostAuthRedirect(undefined), '/onboarding');
});
test('toDate unwraps Firestore-style toDate objects', () => {
    const value = new Date('2026-03-01T00:00:00.000Z');
    assert.deepEqual(toDate({ toDate: () => value }), value);
});
test('shouldResetUsageCycle resets when month changes', () => {
    assert.equal(shouldResetUsageCycle(new Date('2026-02-28T12:00:00.000Z'), new Date('2026-03-01T12:00:00.000Z')), true);
});
test('shouldResetUsageCycle does not reset within the same month', () => {
    assert.equal(shouldResetUsageCycle(new Date('2026-03-01T12:00:00.000Z'), new Date('2026-03-24T12:00:00.000Z')), false);
});
