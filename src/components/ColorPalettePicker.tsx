import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COMMON_KIT_COLORS, THEME } from '../constants/theme';

interface ColorPalettePickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  title?: string;
}

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  selectedColor,
  onSelectColor,
  title,
}) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.grid}>
        {COMMON_KIT_COLORS.map(color => {
          const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
          const isLight = ['#ffffff', '#ffd700', '#ffe600', '#00e676', '#00bfff', '#00fa9a', '#ff69b4'].includes(
            color.toLowerCase()
          );

          return (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                isSelected && styles.selectedCircle,
              ]}
              onPress={() => onSelectColor(color)}
              activeOpacity={0.8}
            >
              {isSelected && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={isLight ? '#000000' : '#FFFFFF'}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: THEME.spacing.sm,
  },
  title: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: THEME.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedCircle: {
    borderColor: THEME.colors.gold,
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
  },
});
