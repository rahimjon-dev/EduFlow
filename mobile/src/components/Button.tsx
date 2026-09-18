import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    let baseStyle: ViewStyle = { ...styles.button };

    if (size === 'sm') baseStyle = { ...baseStyle, ...styles.sizeSm };
    if (size === 'lg') baseStyle = { ...baseStyle, ...styles.sizeLg };

    switch (variant) {
      case 'secondary':
        return { ...baseStyle, backgroundColor: colors.secondary };
      case 'outline':
        return { ...baseStyle, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.borderDark };
      case 'danger':
        return { ...baseStyle, backgroundColor: colors.danger };
      case 'ghost':
        return { ...baseStyle, backgroundColor: 'transparent' };
      case 'primary':
      default:
        return { ...baseStyle, backgroundColor: colors.primary };
    }
  };

  const getTextStyle = () => {
    let baseText: TextStyle = { ...styles.text };

    if (size === 'sm') baseText = { ...baseText, fontSize: 12 };
    if (size === 'lg') baseText = { ...baseText, fontSize: 16 };

    if (variant === 'outline' || variant === 'ghost') {
      return { ...baseText, color: colors.textPrimary };
    }
    return { ...baseText, color: colors.white };
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        getContainerStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} size="small" />
      ) : (
        <>
          {icon && icon}
          <Text style={[getTextStyle(), icon ? { marginLeft: spacing.xs + 2 } : null, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  sizeSm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  sizeLg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  text: {
    fontWeight: '700',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.6,
  },
});
