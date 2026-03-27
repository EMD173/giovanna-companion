/**
 * Sovereign Cloud: Zero-Knowledge Proof (ZKP) Cryptography Layer
 * 
 * Implements client-side AES-GCM encryption for absolute data sovereignty.
 * Sensitive data (e.g., ABC behaviors and context) is encrypted perfectly *before* 
 * Firebase can receive it. Firebase only stores the base64 ciphertext and IV.
 * 
 * MVP Implementation: The master key is generated locally and stored exclusively 
 * in the browser's localStorage as an exported JWK. The server never sees it.
 */

const KEY_STORAGE_NAME = 'giovanna_zkp_master_key_v1';
const ALGORITHM = 'AES-GCM';

// ============================================
// KEY MANAGEMENT
// ============================================

export async function getZkpKey(): Promise<CryptoKey> {
    // 1. Check local storage
    const stored = localStorage.getItem(KEY_STORAGE_NAME);
    
    if (stored) {
        try {
            const jwk = JSON.parse(stored);
            return await window.crypto.subtle.importKey(
                'jwk',
                jwk,
                { name: ALGORITHM },
                true,
                ['encrypt', 'decrypt']
            );
        } catch (e) {
            console.warn("Failed to parse stored ZKP key, generating a new one.", e);
        }
    }

    // 2. Generate new key if not found
    const key = await window.crypto.subtle.generateKey(
        { name: ALGORITHM, length: 256 },
        true, // extractable
        ['encrypt', 'decrypt']
    );

    // 3. Store the key locally (as a JSON Web Key)
    const jwk = await window.crypto.subtle.exportKey('jwk', key);
    localStorage.setItem(KEY_STORAGE_NAME, JSON.stringify(jwk));

    return key;
}

// ============================================
// ENCRYPTION
// ============================================

/**
 * Encrypts a plaintext string and returns a combined Base64 string of IV + Ciphertext
 */
export async function encryptField(plainText: string): Promise<string> {
    if (!plainText) return plainText;

    const key = await getZkpKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    
    // AES-GCM needs a unique 12-byte IV for every single encryption operation
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: ALGORITHM, iv },
        key,
        data
    );

    // Combine IV (first 12 bytes) + Ciphertext into one packed ArrayBuffer
    const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(cipherBuffer), iv.length);

    // Convert to Base64 (using browser environment helpers)
    const base64 = btoa(String.fromCharCode(...combined));
    return `ZKP_V1::${base64}`;
}

// ============================================
// DECRYPTION
// ============================================

/**
 * Decrypts a previously encrypted Base64 string back into plaintext
 */
export async function decryptField(encryptedString: string): Promise<string> {
    if (!encryptedString) return encryptedString;
    
    // Pass-through for legacy unencrypted data
    if (!encryptedString.startsWith('ZKP_V1::')) {
        return encryptedString;
    }

    try {
        const base64 = encryptedString.substring('ZKP_V1::'.length);
        const binaryString = atob(base64);
        
        const combined = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            combined[i] = binaryString.charCodeAt(i);
        }

        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);

        const key = await getZkpKey();

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: ALGORITHM, iv },
            key,
            ciphertext
        );

        const decoder = new TextDecoder();
        return decoder.decode(decryptedBuffer);
        
    } catch (e) {
        console.error("ZKP Decryption Failed:", e);
        // Fallback: return a generic privacy message instead of crashing the UI
        return "[Data locked. Provide Recovery Key to view]";
    }
}
