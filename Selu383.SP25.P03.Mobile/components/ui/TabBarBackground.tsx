import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';

interface TabBarBackgroundProps {
  isTheaterMode?: boolean;
}

export default function TabBarBackground({ isTheaterMode = false }: TabBarBackgroundProps) {
  const colorScheme = useColorScheme();
  
  const appearance = isTheaterMode ? 'dark' : colorScheme === 'dark' ? 'dark' : 'light';
  
  if (Platform.OS !== 'ios' && isTheaterMode) {
    return <View style={styles.solidBackground} />;
  }
  
  if (Platform.OS === 'ios') {
    return <BlurView intensity={isTheaterMode ? 90 : 80} style={styles.container} tint={appearance} />;
  }
  
  return <View style={[
    styles.container, 
    { backgroundColor: isTheaterMode ? '#000000' : (colorScheme === 'dark' ? '#151718' : '#FFFFFF') }
  ]} />;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  solidBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
});