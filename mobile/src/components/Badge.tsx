import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/theme';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', size = 'md' }) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: colors.successBg, text: colors.successText, border: colors.successBg };
      case 'warning':
        return { bg: colors.warningBg, text: colors.warningText, border: colors.warningBg };
      case 'danger':
        return { bg: colors.dangerBg, text: colors.dangerText, border: colors.dangerBg };
      case 'info':
        return { bg: colors.infoBg, text: colors.infoText, border: colors.infoBg };
      case 'secondary':
        return { bg: colors.secondaryBg, text: colors.secondary, border: colors.secondaryBg };
      case 'neutral':
        return { bg: colors.background, text: colors.textSecondary, border: colors.border };
      case 'primary':
      default:
        return { bg: colors.primaryBg, text: colors.primary, border: colors.primaryBg };
    }
  };

  const scheme = getColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: scheme.bg, borderColor: scheme.border },
        isSm ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <Text style={[styles.text, { color: scheme.text }, isSm ? styles.textSm : styles.textMd]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.round,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeMd: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    fontWeight: '700',
  },
  textSm: {
    fontSize: 10,
  },
  textMd: {
    fontSize: 11,
  },
});
