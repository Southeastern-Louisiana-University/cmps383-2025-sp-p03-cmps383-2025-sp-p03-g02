import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        headerTitle: "",
        animation: "fade"
      }}
    >
      <Stack.Screen 
        name="SignIn&SignUp" 
        options={{
          headerShown: false,
          title: ""
        }} 
      />
    </Stack>
  );
}