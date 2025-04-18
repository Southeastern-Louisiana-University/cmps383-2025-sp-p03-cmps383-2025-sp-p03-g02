import React, { useState } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  View, 
  Modal, 
  Text, 
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import QRCode from 'react-native-qrcode-svg';

type Ticket = {
  id: string;
  movieTitle: string;
  theater: string;
  date: string;
  time: string;
  seats: string;
};

// Sample Ticket Data - Upcoming Movies
const TICKETS: Ticket[] = [
  { 
    id: 't1', 
    movieTitle: 'The Dark Knight', 
    theater: "Lion's Den New York", 
    date: 'May  7, 2025', 
    time: '7:30 PM',
    seats: 'G7, G8'
  },
  { 
    id: 't2', 
    movieTitle: 'Inception', 
    theater: "Lion's Den New Orleans", 
    date: 'May 15, 2025', 
    time: '8:00 PM',
    seats: 'D5'
  },
  { 
    id: 't3', 
    movieTitle: 'Dune: Part Two', 
    theater: "Lion's Den Los Angeles", 
    date: 'June 24, 2025', 
    time: '6:45 PM',
    seats: 'J12, J13, J14'
  }
];

export default function TicketsScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleViewTicket = (ticket: Ticket) => {
    try {
      setTimeout(() => {
        setSelectedTicket(ticket);
        setModalVisible(true);
      }, 100);
    } catch (error) {
      console.error('Error opening ticket:', error);
      Alert.alert(
        "Ticket Details",
        `Movie: ${ticket.movieTitle}\nTheater: ${ticket.theater}\nDate: ${ticket.date} at ${ticket.time}\nSeats: ${ticket.seats}\nTicket ID: ${ticket.id.toUpperCase()}`
      );
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // QR code placeholder
  const getQRCodeData = (ticket: Ticket) => {
    return `LIONS-${ticket.id}-${ticket.seats.replace(/,\s/g, '')}-${ticket.date.replace(/,\s/g, '')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <Text style={styles.pageTitle}>My Tickets</Text>
      </View>
      
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
                activeOpacity={0.7}
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
                    activeOpacity={0.7}
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
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Browse Movies</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/*Ticket Modal*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>
          
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={closeModal}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <IconSymbol name="xmark" size={24} color="#4A6375" />
            </TouchableOpacity>
            
            {selectedTicket && (
              <>
                <Text style={styles.modalTitle}>{selectedTicket.movieTitle}</Text>
                
                <View style={styles.qrContainer}>
                  <View style={styles.qrCode}>
                    <QRCode
                      value={getQRCodeData(selectedTicket)}
                      size={180}
                      color="#000000"
                      backgroundColor="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.qrHelpText}>Present this code at the theater</Text>
                </View>
                
                <View style={styles.ticketInfoContainer}>
                  <View style={styles.ticketInfoRow}>
                    <Text style={styles.ticketInfoLabel}>Theater:</Text>
                    <Text style={styles.ticketInfoValue}>{selectedTicket.theater}</Text>
                  </View>
                  
                  <View style={styles.ticketInfoRow}>
                    <Text style={styles.ticketInfoLabel}>Date & Time:</Text>
                    <Text style={styles.ticketInfoValue}>
                      {selectedTicket.date} at {selectedTicket.time}
                    </Text>
                  </View>
                  
                  <View style={styles.ticketInfoRow}>
                    <Text style={styles.ticketInfoLabel}>Seats:</Text>
                    <Text style={styles.ticketInfoValue}>{selectedTicket.seats}</Text>
                  </View>
                  
                  <View style={styles.ticketInfoRow}>
                    <Text style={styles.ticketInfoLabel}>Ticket ID:</Text>
                    <Text style={styles.ticketInfoValue}>{selectedTicket.id.toUpperCase()}</Text>
                  </View>
                </View>
                
                <View style={styles.separator} />
                
                <View style={styles.reminderContainer}>
                  <IconSymbol name="info.circle" size={20} color="#0C6184" />
                  <Text style={styles.reminderText}>
                    Please arrive 15 minutes before showtime. Enjoy your movie!
                  </Text>
                </View>
              </>
            )}
            
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={closeModal}
              activeOpacity={0.7}
            >
              <Text style={styles.doneButtonText}>Done</Text>
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
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(21, 47, 62, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#F0F4F8',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    padding: 5,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F3A4D',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE2E5',
    marginBottom: 10,
  },
  qrPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F3A4D',
  },
  qrPlaceholderSmall: {
    fontSize: 8,
    color: '#4A6375',
    textAlign: 'center',
    padding: 10,
  },
  qrHelpText: {
    fontSize: 14,
    color: '#4A6375',
  },
  ticketInfoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  ticketInfoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ticketInfoLabel: {
    width: '35%',
    fontSize: 16,
    color: '#4A6375',
  },
  ticketInfoValue: {
    flex: 1,
    fontSize: 16,
    color: '#1F3A4D',
    fontWeight: '500',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#DDE2E5',
    marginBottom: 20,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 97, 132, 0.1)',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  reminderText: {
    fontSize: 14,
    color: '#1F3A4D',
    marginLeft: 10,
    flex: 1,
  },
  doneButton: {
    backgroundColor: '#0C6184',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});