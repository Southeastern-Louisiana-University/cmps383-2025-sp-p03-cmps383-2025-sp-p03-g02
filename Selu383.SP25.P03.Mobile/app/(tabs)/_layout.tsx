import React from 'react';
import { Platform, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

function CustomHapticTab(props: BottomTabBarButtonProps) {
  const focused = props.accessibilityState?.selected;
  
  return (
    <View style={{
      flex: 1,
      backgroundColor: focused ? 'rgba(10, 126, 164, 0.20)' : 'transparent',
      borderTopWidth: focused ? 2 : 0,
      borderTopColor: Colors[useColorScheme() ?? 'light'].tint,
      paddingTop: focused ? 0 : 2,
    }}>
      <HapticTab {...props} />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const renderIcon = (iosIconName: string, androidIconName: string, color: string) => {
    if (Platform.OS === 'ios') {
      return <IconSymbol size={28} name={iosIconName as any} color={color} />;
    } else {
      return <Ionicons name={androidIconName as any} size={28} color={color} />;
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: CustomHapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
        },
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="movies"
        options={{
          title: 'Movies',
          tabBarIcon: ({ color }) => renderIcon("film", "film-outline", color),
        }}
      />
      <Tabs.Screen
        name="theaters"
        options={{
          title: 'Theaters',
          tabBarIcon: ({ color }) => renderIcon("location.fill", "location-outline", color),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color }) => renderIcon("ticket", "ticket-outline", color),
        }}
      />
      <Tabs.Screen
        name="concessions"
        options={{
          title: 'Food',
          tabBarIcon: ({ color }) => renderIcon("fork.knife", "fast-food-outline", color),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => renderIcon("person", "person-outline", color),
        }}
      />
    </Tabs>
  );
}