import { Stack } from 'expo-router';
import React from 'react';

export default function ScannerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#152F3E' },
      }}
    />
  );
}