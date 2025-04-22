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
import { useTheaterMode } from '@/components/TheaterMode';

function CustomHapticTab(props: BottomTabBarButtonProps) {
  const focused = props.accessibilityState?.selected;
  const colorScheme = useColorScheme();
  const { isTheaterMode } = useTheaterMode();
  
  const tintColor = isTheaterMode 
    ? '#FFFFFF' 
    : Colors[colorScheme ?? 'light'].tint;
  
  const bgColor = isTheaterMode
    ? (focused ? 'rgba(255, 255, 255, 0.15)' : 'transparent')
    : (focused ? 'rgba(10, 126, 164, 0.20)' : 'transparent');
  
  return (
    <View style={{
      flex: 1,
      backgroundColor: bgColor,
      borderTopWidth: focused ? 2 : 0,
      borderTopColor: tintColor,
      paddingTop: focused ? 0 : 2,
    }}>
      <HapticTab {...props} />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isTheaterMode } = useTheaterMode();

  const renderIcon = (iosIconName: string, androidIconName: string, color: string) => {
    if (Platform.OS === 'ios') {
      return <IconSymbol size={28} name={iosIconName as any} color={color} />;
    } else {
      return <Ionicons name={androidIconName as any} size={28} color={color} />;
    }
  };

  const activeTintColor = isTheaterMode 
    ? '#FFFFFF' 
    : Colors[colorScheme ?? 'light'].tint;

  const inactiveTintColor = isTheaterMode
    ? '#888888'
    : Colors[colorScheme ?? 'light'].tabIconDefault;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        headerShown: false,
        tabBarButton: CustomHapticTab,
        tabBarBackground: () => <TabBarBackground isTheaterMode={isTheaterMode} />,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
        },
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: isTheaterMode ? 'rgba(0, 0, 0, 0.8)' : undefined,
          },
          default: {
            backgroundColor: isTheaterMode ? '#000000' : undefined,
          },
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