export const colors = {
  primary: '#4F46E5',       // Indigo 600
  primaryLight: '#6366F1',  // Indigo 500
  primaryDark: '#3730A3',   // Indigo 800
  primaryBg: '#EEF2FF',     // Indigo 50

  secondary: '#7C3AED',     // Violet 600
  secondaryBg: '#F5F3FF',

  accent: '#06B6D4',        // Cyan 500
  accentBg: '#ECFEFF',

  success: '#10B981',       // Emerald 500
  successBg: '#D1FAE5',
  successText: '#065F46',

  warning: '#F59E0B',       // Amber 500
  warningBg: '#FEF3C7',
  warningText: '#92400E',

  danger: '#EF4444',        // Red 500
  dangerBg: '#FEE2E2',
  dangerText: '#991B1B',

  info: '#3B82F6',          // Blue 500
  infoBg: '#DBEAFE',
  infoText: '#1E40AF',

  // Neutrals
  white: '#FFFFFF',
  background: '#F8FAFC',    // Slate 50
  cardBg: '#FFFFFF',
  border: '#E2E8F0',        // Slate 200
  borderDark: '#CBD5E1',    // Slate 300

  textPrimary: '#0F172A',   // Slate 900
  textSecondary: '#475569', // Slate 600
  textMuted: '#94A3B8',     // Slate 400
  textPlaceholder: '#CBD5E1',

  // Role accents
  roles: {
    ADMIN: {
      color: '#4F46E5',
      bg: '#EEF2FF',
      border: '#C7D2FE',
      label: 'Admin',
    },
    TEACHER: {
      color: '#D97706',
      bg: '#FEF3C7',
      border: '#FDE68A',
      label: "O'qituvchi",
    },
    STUDENT: {
      color: '#0284C7',
      bg: '#E0F2FE',
      border: '#BAE6FD',
      label: 'Talaba',
    },
    PARENT: {
      color: '#059669',
      bg: '#D1FAE5',
      border: '#A7F3D0',
      label: 'Ota-ona',
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
};
