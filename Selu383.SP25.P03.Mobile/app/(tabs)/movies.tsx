import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';

type Movie = {
  id: string;
  title: string;
  time: string;
};

const MOVIES: Movie[] = [
  { id: '1', title: 'The Dark Knight', time: '7:30 PM' },
  { id: '2', title: 'Inception', time: '8:00 PM' },
  { id: '3', title: 'Interstellar', time: '6:45 PM' },
];

export default function MoviesScreen() {
  const router = useRouter();

  const handleBuyTickets = (movie: Movie) => {
    Alert.alert(
      "Ticket Purchase",
      `You're about to purchase tickets for ${movie.title} at ${movie.time}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Continue", 
          onPress: () => {
            Alert.alert("Success", "Your ticket purchase is being processed!");
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Now Playing</Text>
      
      <FlatList
        data={MOVIES}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.movieTime}>{item.time}</Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => handleBuyTickets(item)}
            >
              <Text style={styles.buttonText}>Buy Tickets</Text>
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
  movieItem: {
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
  movieTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1F3A4D',
  },
  movieTime: {
    fontSize: 16,
    marginTop: 4,
    color: '#4A6375',
  },
  button: {
    backgroundColor: '#0C6184',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    width: 120,
  },
  buttonText: {
    color: '#E8EEF2',
    fontWeight: 'bold',
    fontSize: 16,
  },
});