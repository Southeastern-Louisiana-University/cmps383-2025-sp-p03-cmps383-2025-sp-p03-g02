import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';

type Ticket = {
  id: string;
  movieTitle: string;
  theater: string;
  date: string;
  time: string;
  seats: string;
};

// Sample Ticket Data
const TICKETS: Ticket[] = [
  { 
    id: 't1', 
    movieTitle: 'The Dark Knight', 
    theater: "Lion's Den Baton Rouge", 
    date: 'March 15, 2025', 
    time: '7:30 PM',
    seats: 'G7, G8'
  },
  { 
    id: 't2', 
    movieTitle: 'Inception', 
    theater: "Lion's Den Hammond", 
    date: 'March 22, 2025', 
    time: '8:00 PM',
    seats: 'D5'
  },
  { 
    id: 't3', 
    movieTitle: 'Dune: Part Two', 
    theater: "Lion's Den Mandeville", 
    date: 'April 5, 2025', 
    time: '6:45 PM',
    seats: 'J12, J13, J14'
  }
];

export default function TicketsScreen() {
  const router = useRouter();

  const handleViewTicket = (ticket: Ticket) => {
    Alert.alert(
      "Ticket Details",
      `Movie: ${ticket.movieTitle}\nTheater: ${ticket.theater}\nDate: ${ticket.date}\nTime: ${ticket.time}\nSeats: ${ticket.seats}`,
      [
        { text: "Close", style: "cancel" }
      ]
    );
  };

  const handleOpenScanner = () => {
    try {
      router.push("../scanner/");
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Navigation Error", "Could not open scanner. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.fixedHeader}>
        <Text style={styles.pageTitle}>My Tickets</Text>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={handleOpenScanner}
        >
          <Text style={styles.scanButtonText}>⚃ Scan</Text>
        </TouchableOpacity>
      </View>
      
      {}
      <View style={styles.content}>
        {TICKETS.length > 0 ? (
          <FlatList
            data={TICKETS}
            keyExtractor={(item) => item.id}
            style={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.ticketItem}
                onPress={() => handleViewTicket(item)}
              >
                <Text style={styles.movieTitle}>{item.movieTitle}</Text>
                <Text style={styles.ticketDetails}>{item.theater}</Text>
                <Text style={styles.ticketDetails}>{item.date} • {item.time}</Text>
                <View style={styles.seatsContainer}>
                  <Text style={styles.seatsLabel}>Seats:</Text>
                  <Text style={styles.seats}>{item.seats}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.button}
                    onPress={() => handleViewTicket(item)}
                  >
                    <Text style={styles.buttonText}>View Ticket</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>You don't have any tickets yet.</Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/movies')}
            >
              <Text style={styles.buttonText}>Browse Movies</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#152F3E',
  },
  fixedHeader: {
    position: 'absolute',
    top: 70, 
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#E8EEF2',
  },
  scanButton: {
    backgroundColor: '#0C6184',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingTop: 140, 
    paddingHorizontal: 16,
  },
  list: {
    width: '100%',
  },
  ticketItem: {
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
  ticketDetails: {
    fontSize: 16,
    marginTop: 2,
    color: '#4A6375',
  },
  seatsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  seatsLabel: {
    fontSize: 16,
    color: '#4A6375',
    marginRight: 4,
  },
  seats: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F3A4D',
  },
  buttonContainer: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: '#0C6184',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: 120,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E8EEF2',
    marginBottom: 20,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: '#0C6184',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: 160,
  },
});