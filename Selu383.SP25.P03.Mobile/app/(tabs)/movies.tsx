import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, Alert, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

type Movie = {
  id: string;
  title: string;
  time: string;
  image: any; 
  description?: string;
};

const MOVIES: Movie[] = [
  { 
    id: '1', 
    title: 'The Dark Knight', 
    time: '7:30 PM',
    image: require('@/assets/images/movie-images/dark-knight.jpeg'),
    description: 'When the menace known as the Joker wreaks havoc on Gotham City, Batman must accept one of the greatest tests of his ability to fight injustice.'
  },
  { 
    id: '2', 
    title: 'Inception', 
    time: '8:00 PM',
    image: require('@/assets/images/movie-images/inception.jpeg'),
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
  },
  { 
    id: '3', 
    title: 'Interstellar', 
    time: '6:45 PM',
    image: require('@/assets/images/movie-images/interstellar.jpeg'),
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
  },
  { 
    id: '4', 
    title: 'Novocaine', 
    time: '9:15 PM',
    image: require('@/assets/images/movie-images/novocaine.jpeg'),
    description: 'A dentist finds himself caught up in a web of sex, drugs, and murder after meeting a seductive new patient.'
  },
  { 
    id: '5', 
    title: 'Oppenheimer', 
    time: '7:00 PM',
    image: require('@/assets/images/movie-images/oppenheimer.jpeg'),
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.'
  },
  { 
    id: '6', 
    title: 'Dune: Part Two', 
    time: '8:30 PM',
    image: require('@/assets/images/movie-images/dune.jpeg'),
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.'
  },
];

const { width } = Dimensions.get('window');
const numColumns = 2;

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

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.movieCard}>
      <Image
        source={item.image}
        style={styles.moviePoster}
      />
      <Text style={styles.movieTitle}>{item.title}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => handleBuyTickets(item)}
      >
        <Text style={styles.buttonText}>Buy Tickets</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Now Playing</Text>
      
      <FlatList
        data={MOVIES}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={renderMovieItem}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
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
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  movieCard: {
    width: (width - 40) / 2, 
    backgroundColor: '#0A1822',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
  },
  moviePoster: {
    width: '100%',
    height: 270,
    backgroundColor: '#0A1822',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E8EEF2',
    padding: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0C6184',
    padding: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#E8EEF2',
    fontWeight: 'bold',
    fontSize: 14,
  },
});