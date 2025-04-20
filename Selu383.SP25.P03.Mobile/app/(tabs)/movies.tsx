import React, { useState } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  View, 
  Text, 
  Alert, 
  Image, 
  Dimensions,
  Modal,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Movie = {
  id: string;
  title: string;
  time: string;
  image: any; 
  description?: string;
};

type SeatStatus = 'available' | 'selected' | 'occupied';

type Seat = {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
};

const saveTicket = async (
  movieTitle: string,
  theater: string,
  date: string,
  time: string,
  seats: string
) => {
  
  const newTicket = {
    id: 't' + Date.now().toString(), 
    movieTitle,
    theater: "Lion's Den Cinema",
    date,
    time,
    seats,
  };
  
  const existingTicketsJson = await AsyncStorage.getItem('userTickets');
  const existingTickets = existingTicketsJson ? JSON.parse(existingTicketsJson) : [];
  
  const updatedTickets = [...existingTickets, newTicket];
  
  await AsyncStorage.setItem('userTickets', JSON.stringify(updatedTickets));
  
  return true;
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

const generateTheaterLayout = (): Seat[][] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const seatsPerRow = 8;
  
  const layout = rows.map(row => {
    const rowSeats: Seat[] = [];
    for (let i = 1; i <= seatsPerRow; i++) {
      let status: SeatStatus = 'available';
      
      if ((row === 'D' && (i === 5 || i === 6)) || 
          (row === 'F' && (i === 1 || i === 2)) ||
          (row === 'B' && i === 4) ||
          (row === 'J' && i === 7)) {
        status = 'occupied';
      }
      
      rowSeats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status
      });
    }
    return rowSeats;
  });
  
  return layout;
};

const { width } = Dimensions.get('window');
const numColumns = 2;

export default function MoviesScreen() {
  const router = useRouter();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [theaterLayout, setTheaterLayout] = useState<Seat[][]>(generateTheaterLayout());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [seatSelectionModalVisible, setSeatSelectionModalVisible] = useState(false);

  const handleBuyTickets = (movie: Movie) => {
    setSelectedMovie(movie);
    setTicketModalVisible(true);
  };

  const handleTicketCountConfirm = () => {
    setTicketModalVisible(false);
    resetSeatSelection();
    setSeatSelectionModalVisible(true);
  };

  const resetSeatSelection = () => {
    setTheaterLayout(generateTheaterLayout());
    setSelectedSeats([]);
  };

  // Handle seat selection
  const handleSeatPress = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    
    const updatedLayout = [...theaterLayout];
    const rowIndex = updatedLayout.findIndex(row => row.some(s => s.id === seat.id));
    const seatIndex = updatedLayout[rowIndex].findIndex(s => s.id === seat.id);
    
    if (seat.status === 'available') {
      // Prevent selecting more seats than tickets
      if (selectedSeats.length >= ticketCount) {
        Alert.alert(
          "Maximum Seats Selected",
          `You can only select ${ticketCount} seat${ticketCount > 1 ? 's' : ''} for this order.`
        );
        return;
      }
      
      // Update seat status
      updatedLayout[rowIndex][seatIndex].status = 'selected';
      setSelectedSeats([...selectedSeats, updatedLayout[rowIndex][seatIndex]]);
    } else if (seat.status === 'selected') {
      // Deselect seat
      updatedLayout[rowIndex][seatIndex].status = 'available';
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    }
    
    setTheaterLayout(updatedLayout);
  };

  const renderSeat = (seat: Seat) => {
    const seatStyle = [styles.seat];
    let seatTextColor = styles.seatTextAvailable;
    
    switch (seat.status) {
      case 'selected':
        seatStyle.push(styles.selectedSeat);
        seatTextColor = styles.seatTextSelected;
        break;
      case 'occupied':
        seatStyle.push(styles.occupiedSeat);
        seatTextColor = styles.seatTextOccupied;
        break;
      case 'available':
      default:
        break;
    }
    
    return (
      <TouchableOpacity
        key={seat.id}
        style={seatStyle}
        onPress={() => handleSeatPress(seat)}
        disabled={seat.status === 'occupied'}
      >
        <Text style={seatTextColor}>{seat.number}</Text>
      </TouchableOpacity>
    );
  };

  const renderLegend = () => (
    <View style={styles.legendContainer}>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, {backgroundColor: '#2C5364'}]} />
        <Text style={styles.legendText}>Available</Text>
      </View>
      
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, {backgroundColor: '#E63946', borderColor: '#FFFFFF', borderWidth: 2}]} />
        <Text style={styles.legendText}>Selected</Text>
      </View>
      
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, {backgroundColor: '#505B65'}]} />
        <Text style={styles.legendText}>Occupied</Text>
      </View>
    </View>
  );

  const handleContinue = () => {
    if (selectedSeats.length < ticketCount) {
      Alert.alert(
        "Seat Selection Incomplete",
        `Please select ${ticketCount} seat${ticketCount > 1 ? 's' : ''} to continue.`
      );
      return;
    }
    
    if (!selectedMovie) return;
    
    const seatsList = selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ');
    
    setSeatSelectionModalVisible(false);
    
    Alert.alert(
      "Confirm Purchase",
      `You're purchasing ${ticketCount} ticket${ticketCount > 1 ? 's' : ''} for ${selectedMovie.title} at ${selectedMovie.time}\n\nSelected seats: ${seatsList}\n\nTotal: $${(ticketCount * 12.99).toFixed(2)}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm Purchase",
          onPress: async () => {
            const today = new Date();
            const monthNames = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const formattedDate = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
            await saveTicket(
              selectedMovie.title,
              "Lion's Den Cinema",
              formattedDate,
              selectedMovie.time,
              seatsList
            );
            
            Alert.alert(
              "Success", 
              "Your tickets have been purchased! Check your tickets tab to view them.",
              [
                {
                  text: "View Tickets",
                  onPress: () => router.push('/tickets')
                },
                {
                  text: "Continue Shopping",
                  style: "cancel"
                }
              ]
            );
          }
        }
      ]
    );
  };

  const renderRow = (row: Seat[], rowIndex: number) => (
    <View key={`row-${rowIndex}`} style={styles.row}>
      <Text style={styles.rowLabel}>{row[0].row}</Text>
      <View style={styles.seats}>
        {row.map(seat => renderSeat(seat))}
      </View>
    </View>
  );
  
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

      {/* Ticket Count Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ticketModalVisible}
        onRequestClose={() => setTicketModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How many tickets?</Text>
            {selectedMovie && (
              <Text style={styles.modalMovieTitle}>{selectedMovie.title} - {selectedMovie.time}</Text>
            )}
            
            <View style={styles.ticketCountContainer}>
              <TouchableOpacity 
                style={styles.countButton}
                onPress={() => setTicketCount(Math.max(1, ticketCount - 1))}
              >
                <Text style={styles.countButtonText}>-</Text>
              </TouchableOpacity>
              
              <Text style={styles.ticketCount}>{ticketCount}</Text>
              
              <TouchableOpacity 
                style={styles.countButton}
                onPress={() => setTicketCount(Math.min(10, ticketCount + 1))}
              >
                <Text style={styles.countButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.ticketPrice}>
              Total: ${(ticketCount * 12.99).toFixed(2)}
            </Text>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setTicketModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleTicketCountConfirm}
              >
                <Text style={styles.confirmButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Seat Selection Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={seatSelectionModalVisible}
        onRequestClose={() => setSeatSelectionModalVisible(false)}
      >
        <View style={styles.seatSelectionContainer}>
          <View style={styles.seatSelectionHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setSeatSelectionModalVisible(false);
                setTicketModalVisible(true);
              }}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            
            {selectedMovie && (
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>{selectedMovie.title}</Text>
                <Text style={styles.headerSubtitle}>{selectedMovie.time} • Lion's Den Cinema</Text>
              </View>
            )}
            
            <View style={{ width: 50 }} />
          </View>
          
          <ScrollView 
            contentContainerStyle={styles.seatSelectionContent}
            showsVerticalScrollIndicator={true}
          >
            {}
            <View style={styles.screenContainer}>
              <View style={styles.screenCurve} />
              <View style={styles.screen}>
                <Text style={styles.screenText}>SCREEN</Text>
              </View>
            </View>
            
            <View style={styles.theaterContainer}>
              {theaterLayout.map((row, index) => renderRow(row, index))}
            </View>
            
            {renderLegend()}
          </ScrollView>
          
          <View style={styles.seatSelectionFooter}>
            <View style={styles.selectedSeatsInfo}>
              <Text style={styles.selectedSeatsTitle}>
                Selected: {selectedSeats.length} of {ticketCount}
              </Text>
              <Text style={styles.selectedSeatsList}>
                {selectedSeats.length > 0 
                  ? selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')
                  : 'No seats selected'}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.continueButton,
                selectedSeats.length < ticketCount && styles.disabledButton
              ]}
              onPress={handleContinue}
              disabled={selectedSeats.length < ticketCount}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontWeight: '500',
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
    fontWeight: '500',
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
    fontWeight: '500',
    fontSize: 14,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#0A1822',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#E8EEF2',
    marginBottom: 10,
  },
  modalMovieTitle: {
    fontSize: 16,
    color: '#A4B5C5',
    marginBottom: 20,
    textAlign: 'center',
  },
  ticketCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  countButton: {
    width: 40,
    height: 40,
    backgroundColor: '#0C6184',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countButtonText: {
    color: '#E8EEF2',
    fontSize: 20,
    fontWeight: '500',
  },
  ticketCount: {
    fontSize: 24,
    fontWeight: '500',
    color: '#E8EEF2',
    marginHorizontal: 20,
  },
  ticketPrice: {
    fontSize: 18,
    color: '#E8EEF2',
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E8EEF2',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#E8EEF2',
    fontWeight: '500',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#0C6184',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#E8EEF2',
    fontWeight: '500',
    fontSize: 16,
  },
  
  // Seat selection styles
  seatSelectionContainer: {
    flex: 1,
    backgroundColor: '#0A1822',
  },
  seatSelectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#152F3E',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#E8EEF2',
    fontSize: 16,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#E8EEF2',
    fontSize: 18,
    fontWeight: '500',
  },
  headerSubtitle: {
    color: '#A4B5C5',
    fontSize: 14,
  },
  seatSelectionContent: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 120,
  },
  screenContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  screenCurve: {
    width: '80%',
    height: 20,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    backgroundColor: 'transparent',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#305362',
  },
  screen: {
    width: '80%',
    height: 20,
    backgroundColor: '#1D3D47',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -2,
  },
  screenText: {
    color: '#E8EEF2',
    fontWeight: '500',
    fontSize: 12,
  },
  theaterContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6, 
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  rowLabel: {
    color: '#E8EEF2',
    fontSize: 14,
    fontWeight: '500',
    width: 20,
    textAlign: 'center',
    marginRight: 10,
  },
  seats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seat: {
    width: 32, 
    height: 32,
    margin: 2, 
    borderRadius: 6,
    backgroundColor: '#2C5364',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1D3D47',
    borderBottomWidth: 3,
    borderBottomColor: '#1A2A36',
  },
  seatTextAvailable: {
    color: '#E8EEF2',
    fontSize: 12,
    fontWeight: '500',
  },
  seatTextSelected: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  seatTextOccupied: {
    color: '#687076',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedSeat: {
    backgroundColor: '#E63946', 
    borderColor: '#FFFFFF',
    width: 32,
    height: 32,
    margin: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 3,
    borderBottomColor: '#C5303B',
  },
  occupiedSeat: {
    backgroundColor: '#505B65',
    borderColor: '#4A6375',
    width: 32,
    height: 32,
    margin: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 3,
    borderBottomColor: '#3A444D',
  },
  // Legend styling
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1D3D47',
    borderBottomWidth: 3,
    borderBottomColor: '#1A2A36',
  },
  legendText: {
    color: '#E8EEF2',
    fontSize: 14,
  },
  seatSelectionFooter: {
    padding: 16,
    backgroundColor: '#152F3E',
    borderTopWidth: 1,
    borderTopColor: '#1D3D47',
  },
  selectedSeatsInfo: {
    marginBottom: 12,
  },
  selectedSeatsTitle: {
    color: '#E8EEF2',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedSeatsList: {
    color: '#A4B5C5',
    fontSize: 14,
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: '#0C6184',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#E8EEF2',
    fontWeight: '500',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#687076',
    opacity: 0.8,
  },
});