import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(scriptDir, '..');
const repoRoot = resolve(webDir, '..', '..');
const functionsDir = resolve(repoRoot, 'functions');

function section(title) {
    console.log(`\n== ${title} ==`);
}

function run(command, cwd) {
    console.log(`$ ${command}`);
    execSync(command, {
        cwd,
        stdio: 'inherit',
        env: process.env,
    });
}

function checkFile(path, label) {
    const present = existsSync(path);
    console.log(`${present ? 'OK' : 'MISSING'}  ${label}: ${path}`);
    return present;
}

section('Local Preflight');
const hasWebEnv = checkFile(resolve(webDir, '.env'), 'Frontend env');
const hasFunctionsEnv = checkFile(resolve(functionsDir, '.env'), 'Functions env');

if (!hasWebEnv || !hasFunctionsEnv) {
    console.log('\nOne or more env files are missing. Copy the examples before running live validation.');
}

section('Verification');
run('npm run build', webDir);
run('npm run test:logic', webDir);
run('npm run build', functionsDir);

section('Manual Live Smoke Test');
[
    'Sign in with Google and confirm first-time users land on /onboarding.',
    'Complete onboarding and confirm the app redirects to /dashboard.',
    'Create an ABC log and confirm it appears in history.',
    'Send one Oracle message and confirm AI usage only increments once.',
    'Generate one share packet and confirm share usage increments once.',
    'Open a public share link and confirm the packet renders.',
    'Open Respite Care, choose Browse Sample Providers, and open a demo detail page.',
    'Run Use My Location on the hosted app and confirm nearby providers load.',
    'Start Stripe checkout, verify success/cancel return URLs, then open the customer portal.',
    'Check Functions logs for the first AI request and first Stripe checkout/webhook.',
].forEach((item) => console.log(`- ${item}`));

section('Deploy Order');
[
    'firebase deploy --only functions',
    'firebase deploy --only hosting',
    'firebase deploy --only firestore',
].forEach((item) => console.log(`- ${item}`));
