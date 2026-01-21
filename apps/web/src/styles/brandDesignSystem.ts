/**
 * Giovanna Brand Design System
 * 
 * Visual identity based on the hand-woven Giovanna patch.
 * Digital homeplace aesthetic: warm, tactile, handmade, protective, joyful.
 */

// ============================================
// COLOR PALETTE (extracted from patch)
// ============================================

export const GIOVANNA_COLORS = {
    // Primary Brand Colors (from woven patch)
    terracotta: {
        50: '#FDF2F0',
        100: '#F9E0DB',
        200: '#F2BAB0',
        300: '#E68A7A',
        400: '#D65A47',
        500: '#C1412B',  // Primary - rich terracotta red
        600: '#A33623',
        700: '#852B1C',
        800: '#672115',
        900: '#4A180F',
    },
    golden: {
        50: '#FEF9E7',
        100: '#FCF0C3',
        200: '#F9E38A',
        300: '#F5D24F',
        400: '#EDBF22',
        500: '#E5B83A',  // Primary - golden yellow
        600: '#C79B1F',
        700: '#A67D19',
        800: '#856014',
        900: '#64480F',
    },
    forest: {
        50: '#E8F5E9',
        100: '#C8E6C9',
        200: '#A5D6A7',
        300: '#81C784',
        400: '#5CB860',
        500: '#3D8B40',  // Primary - forest green
        600: '#357A38',
        700: '#2D682F',
        800: '#255727',
        900: '#1B4520',
    },
    ocean: {
        50: '#E3F2FD',
        100: '#BBDEFB',
        200: '#90CAF9',
        300: '#64B5F6',
        400: '#42A5F5',
        500: '#2B5AA3',  // Primary - deep blue
        600: '#254D8C',
        700: '#1F4075',
        800: '#19335E',
        900: '#132647',
    },
    // Warm neutrals (from wood background)
    warmth: {
        50: '#FDFBF7',
        100: '#F8F4ED',
        200: '#F0E8DA',
        300: '#E5D8C3',
        400: '#D4C4A8',
        500: '#B8A080',  // Warm neutral
        600: '#9A8468',
        700: '#7C6850',
        800: '#5E4C38',
        900: '#403020',
    },
    // Background wood tone
    wood: {
        light: '#D4C4A8',
        medium: '#9A8468',
        dark: '#5E4C38',
    },
} as const;

// ============================================
// TYPOGRAPHY (warm, readable, homey)
// ============================================

export const TYPOGRAPHY = {
    // Display/Logo font - handwritten feel
    display: "'Caveat', cursive",

    // Body font - warm, readable
    body: "'Nunito', 'Segoe UI', system-ui, sans-serif",

    // Accent font for labels
    accent: "'Quicksand', sans-serif",
};

// ============================================
// DESIGN TOKENS
// ============================================

export const DESIGN_TOKENS = {
    // Rounded corners (soft, approachable)
    radius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
    },

    // Shadows (warm, soft)
    shadow: {
        sm: '0 1px 3px rgba(94, 76, 56, 0.12)',
        md: '0 4px 6px rgba(94, 76, 56, 0.10), 0 1px 3px rgba(94, 76, 56, 0.08)',
        lg: '0 10px 25px rgba(94, 76, 56, 0.15), 0 4px 10px rgba(94, 76, 56, 0.10)',
        glow: '0 0 20px rgba(229, 184, 58, 0.25)',
    },

    // Borders (hand-stitched feel)
    border: {
        subtle: '1px solid rgba(184, 160, 128, 0.3)',
        warm: '2px solid rgba(193, 65, 43, 0.3)',
        stitched: '2px dashed rgba(94, 76, 56, 0.4)',
    },
};

// ============================================
// TEXTURE PATTERNS (woven feel)
// ============================================

export const TEXTURES = {
    // Subtle woven texture overlay
    woven: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239A8468' fill-opacity='0.03'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E")`,

    // Subtle linen texture
    linen: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%239A8468' fill-opacity='0.04'/%3E%3C/svg%3E")`,
};

// ============================================
// COMPONENT STYLES
// ============================================

export const COMPONENT_STYLES = {
    // Card styles (warm, tactile)
    card: {
        base: `
            background: linear-gradient(135deg, #FDFBF7 0%, #F8F4ED 100%);
            border-radius: 16px;
            border: 1px solid rgba(184, 160, 128, 0.25);
            box-shadow: 0 4px 6px rgba(94, 76, 56, 0.08);
        `,
        elevated: `
            background: linear-gradient(135deg, #FFFFFF 0%, #FDFBF7 100%);
            border-radius: 20px;
            border: 2px solid rgba(184, 160, 128, 0.15);
            box-shadow: 0 10px 25px rgba(94, 76, 56, 0.12);
        `,
    },

    // Button styles (joyful, inviting)
    button: {
        primary: `
            background: linear-gradient(135deg, #C1412B 0%, #D65A47 100%);
            color: white;
            border-radius: 12px;
            font-weight: 600;
            box-shadow: 0 4px 14px rgba(193, 65, 43, 0.35);
        `,
        secondary: `
            background: linear-gradient(135deg, #3D8B40 0%, #5CB860 100%);
            color: white;
            border-radius: 12px;
            font-weight: 600;
            box-shadow: 0 4px 14px rgba(61, 139, 64, 0.30);
        `,
        warm: `
            background: linear-gradient(135deg, #E5B83A 0%, #F5D24F 100%);
            color: #5E4C38;
            border-radius: 12px;
            font-weight: 600;
            box-shadow: 0 4px 14px rgba(229, 184, 58, 0.35);
        `,
    },
};

// ============================================
// GRADIENT PRESETS
// ============================================

export const GRADIENTS = {
    // Warm sunset (terracotta to golden)
    sunset: 'linear-gradient(135deg, #C1412B 0%, #E5B83A 100%)',

    // Forest morning (green to golden)
    forest: 'linear-gradient(135deg, #3D8B40 0%, #E5B83A 100%)',

    // Ocean depth (blue to forest)
    ocean: 'linear-gradient(135deg, #2B5AA3 0%, #3D8B40 100%)',

    // Warm paper (for backgrounds)
    paper: 'linear-gradient(180deg, #FDFBF7 0%, #F0E8DA 100%)',

    // Rainbow weave (all brand colors)
    weave: 'linear-gradient(135deg, #C1412B 0%, #E5B83A 33%, #3D8B40 66%, #2B5AA3 100%)',
};
