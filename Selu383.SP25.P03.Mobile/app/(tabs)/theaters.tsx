import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';

type Theater = {
  id: string;
  name: string;
  address: string;
  distance?: string;
};

const THEATERS: Theater[] = [
  { id: '1', name: "Lion's Den Uptown", address: '123 Main St, Anytown, USA', distance: '1.2 mi' },
  { id: '2', name: "Lion's Den Downtown", address: '456 Broadway, Anytown, USA', distance: '3.5 mi' },
  { id: '3', name: "Lion's Den West Side", address: '789 Sunset Blvd, Anytown, USA', distance: '5.8 mi' },
];

export default function TheatersScreen() {
  const router = useRouter();

  const handleViewShowtimes = (theater: Theater) => {
    Alert.alert(
      "Theater Selected",
      `Showing movie times for ${theater.name}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Continue", 
          onPress: () => {
            Alert.alert("Success", "Loading showtimes for this theater!");
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Our Theaters</Text>
      
      <FlatList
        data={THEATERS}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.theaterItem}>
            <Text style={styles.theaterName}>{item.name}</Text>
            <Text style={styles.theaterAddress}>{item.address}</Text>
            {item.distance && <Text style={styles.theaterDistance}>{item.distance} away</Text>}
            <TouchableOpacity 
              style={styles.button}
              onPress={() => handleViewShowtimes(item)}
            >
              <Text style={styles.buttonText}>View Showtimes</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
  list: {
    width: '100%',
  },
  theaterItem: {
    padding: 16,
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#0A1822',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  theaterName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1F3A4D',
  },
  theaterAddress: {
    fontSize: 16,
    marginTop: 4,
    color: '#4A6375',
  },
  theaterDistance: {
    fontSize: 14,
    marginTop: 4,
    color: '#4A6375',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#0C6184',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    width: 140,
  },
  buttonText: {
    color: '#E8EEF2',
    fontWeight: 'bold',
    fontSize: 16,
  },
});