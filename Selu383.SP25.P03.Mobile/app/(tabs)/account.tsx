import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const USER = {
  name: 'John Doe',
  email: 'john.doe@yahoo.com'
};

export default function AccountScreen() {
  const navigation = useNavigation();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "You have been signed out.");
  };

  const handleMenuOption = (option: string) => {
    Alert.alert(option, `It works`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>My Account</Text>

      <View style={styles.profileCard}>
        <Text style={styles.userName}>{USER.name}</Text>
        <Text style={styles.userEmail}>{USER.email}</Text>
      </View>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => handleMenuOption('Edit Profile')}
      >
        <Text style={styles.menuText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => handleMenuOption('Payment Methods')}
      >
        <Text style={styles.menuText}>Payment Methods</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => handleMenuOption('Help Center')}
      >
        <Text style={styles.menuText}>Help Center</Text>
      </TouchableOpacity>

      {/* Management Button (Navigates to EditTablesPage) */}
      <TouchableOpacity 
        style={styles.managementButton}
        onPress={() => navigation.navigate('EditTablesPage')}
      >
        <Text style={styles.managementText}>Management</Text>
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
  managementButton: {
    backgroundColor: '#3498DB',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  managementText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
});
