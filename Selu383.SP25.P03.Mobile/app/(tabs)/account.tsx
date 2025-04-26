import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheaterMode } from '@/components/TheaterMode';

const USER = {
  name: 'John Doe',
  email: 'john.doe@yahoo.com'
};

export default function AccountScreen() {
  const router = useRouter();
  const { isTheaterMode, toggleTheaterMode } = useTheaterMode();
  const [isEnabled, setIsEnabled] = useState(isTheaterMode);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "You have been signed out.");
  };

  const handleMenuOption = (option: string, route?: string) => {
    if (route) {
      router.push(route as any);
    } else {
      Alert.alert(option, `It works`);
    }
  };

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    toggleTheaterMode();
  };

  return (
    <View style={[
      styles.container,
      isEnabled && { backgroundColor: '#000' }
    ]}>
      <Text style={[
        styles.pageTitle,
        isEnabled && { color: '#FFF' }
      ]}>My Account</Text>
      
      <View style={styles.profileCard}>
        <Text style={styles.userName}>{USER.name}</Text>
        <Text style={styles.userEmail}>{USER.email}</Text>
      </View>
      
      {/* Theater Mode Toggle */}
      <View style={styles.menuItem}>
        <View style={styles.theaterModeRow}>
          <Text style={styles.menuText}>Theater Mode</Text>
          <Switch
            value={isEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: "#767577", true: "#0C6184" }}
            thumbColor={isEnabled ? "#E8EEF2" : "#f4f3f4"}
          />
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => handleMenuOption('Edit Profile', '/edit-profile')}
      >
        <Text style={styles.menuText}>Edit Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => handleMenuOption('Payment Methods', '/payment-methods')}
      >
        <Text style={styles.menuText}>Payment Methods</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => handleMenuOption('Help Center', '/help-center')}
      >
        <Text style={styles.menuText}>Help Center</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#152F3E',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 40,
    color: '#E8EEF2',
  },
  profileCard: {
    padding: 16,
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#0A1822',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F3A4D',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#4A6375',
  },
  menuItem: {
    backgroundColor: '#F0F4F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 16,
    color: '#1F3A4D',
  },
  signOutButton: {
    backgroundColor: '#E74C3C',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  theaterModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});