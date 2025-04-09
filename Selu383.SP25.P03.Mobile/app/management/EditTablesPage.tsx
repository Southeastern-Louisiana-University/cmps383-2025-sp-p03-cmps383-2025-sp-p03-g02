import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EditTablesPage() {
  const navigation = useNavigation();

  const handleNavigateToFoodMenu = () => {
    // @ts-ignore
    navigation.navigate('foodMenu');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Table Management</Text>

      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={handleNavigateToFoodMenu}
      >
        <Text style={styles.menuButtonText}>Edit Food Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#152F3E',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#E8EEF2',
  },
  menuButton: {
    backgroundColor: '#3498DB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    width: '80%',
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});