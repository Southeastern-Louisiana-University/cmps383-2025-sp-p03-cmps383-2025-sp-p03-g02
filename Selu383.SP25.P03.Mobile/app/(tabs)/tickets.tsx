import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  View, 
  Modal, 
  Text, 
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheaterMode } from '@/components/TheaterMode';

type Ticket = {
  id: string;
  movieTitle: string;
  theater: string;
  date: string;
  time: string;
  seats: string;
};

// Sample Ticket Data
const SAMPLE_TICKETS: Ticket[] = [
  { 
    id: 't1', 
    movieTitle: 'The Dark Knight', 
    theater: "Lion's Den New York", 
    date: 'May 7, 2025', 
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
  const isFocused = useIsFocused(); 
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { isTheaterMode } = useTheaterMode();
  
  // Load tickets from AsyncStorage
  useEffect(() => {
    const loadTickets = async () => {
      const storedTickets = await AsyncStorage.getItem('userTickets');
      
      if (storedTickets) {
        const parsedTickets = JSON.parse(storedTickets);
        const allTickets = [...parsedTickets, ...SAMPLE_TICKETS];
        setTickets(allTickets);
      } else {
        setTickets(SAMPLE_TICKETS);
      }
    };
    
    if (isFocused) {
      loadTickets();
    }
  }, [isFocused]);

  const handleViewTicket = (ticket: Ticket) => {
    setTimeout(() => {
      setSelectedTicket(ticket);
      setModalVisible(true);
    }, 100);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // QR code placeholder
  const getQRCodeData = (ticket: Ticket) => {
    return `LIONS-${ticket.id}-${ticket.seats.replace(/,\s/g, '')}-${ticket.date.replace(/,\s/g, '')}`;
  };

  return (
    <View style={[
      styles.container,
      isTheaterMode && { backgroundColor: '#000000' }
    ]}>
      <View style={styles.fixedHeader}>
        <Text style={[
          styles.pageTitle,
          isTheaterMode && { color: '#FFFFFF' }
        ]}>My Tickets</Text>
      </View>
      
      <View style={styles.content}>
        {tickets.length > 0 ? (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.id}
            style={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.ticketItem,
                  isTheaterMode && { 
                    backgroundColor: '#222222',
                    shadowColor: '#000000' 
                  }
                ]}
                onPress={() => handleViewTicket(item)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.movieTitle,
                  isTheaterMode && { color: '#FFFFFF' }
                ]}>{item.movieTitle}</Text>
                <Text style={[
                  styles.ticketDetails,
                  isTheaterMode && { color: '#AAAAAA' }
                ]}>{item.theater}</Text>
                <Text style={[
                  styles.ticketDetails,
                  isTheaterMode && { color: '#AAAAAA' }
                ]}>{item.date} • {item.time}</Text>
                <View style={styles.seatsContainer}>
                  <Text style={[
                    styles.seatsLabel,
                    isTheaterMode && { color: '#AAAAAA' }
                  ]}>Seats:</Text>
                  <Text style={[
                    styles.seats,
                    isTheaterMode && { color: '#FFFFFF' }
                  ]}>{item.seats}</Text>
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
            <Text style={[
              styles.emptyStateText,
              isTheaterMode && { color: '#FFFFFF' }
            ]}>You don't have any tickets yet.</Text>
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
          
          <View style={[
            styles.modalContent,
            isTheaterMode && { backgroundColor: '#222222' }
          ]}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={closeModal}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <IconSymbol 
                name="xmark" 
                size={24} 
                color={isTheaterMode ? '#AAAAAA' : '#4A6375'} 
              />
            </TouchableOpacity>
            
            {selectedTicket && (
              <>
                <Text style={[
                  styles.modalTitle,
                  isTheaterMode && { color: '#FFFFFF' }
                ]}>{selectedTicket.movieTitle}</Text>
                
                <View style={styles.qrContainer}>
                  <View style={styles.qrCode}>
                    <QRCode
                      value={getQRCodeData(selectedTicket)}
                      size={180}
                      color="#000000"
                      backgroundColor="#FFFFFF"
                    />
                  </View>
                  <Text style={[
                    styles.qrHelpText,
                    isTheaterMode && { color: '#AAAAAA' }
                  ]}>Present this code at the theater</Text>
                </View>
                
                <View style={styles.ticketInfoContainer}>
                  <View style={styles.ticketInfoRow}>
                    <Text style={[
                      styles.ticketInfoLabel,
                      isTheaterMode && { color: '#AAAAAA' }
                    ]}>Theater:</Text>
                    <Text style={[
                      styles.ticketInfoValue,
                      isTheaterMode && { color: '#FFFFFF' }
                    ]}>{selectedTicket.theater}</Text>
                  </View>
                  
                  <View style={styles.ticketInfoRow}>
                    <Text style={[
                      styles.ticketInfoLabel,
                      isTheaterMode && { color: '#AAAAAA' }
                    ]}>Date & Time:</Text>
                    <Text style={[
                      styles.ticketInfoValue,
                      isTheaterMode && { color: '#FFFFFF' }
                    ]}>
                      {selectedTicket.date} at {selectedTicket.time}
                    </Text>
                  </View>
                  
                  <View style={styles.ticketInfoRow}>
                    <Text style={[
                      styles.ticketInfoLabel,
                      isTheaterMode && { color: '#AAAAAA' }
                    ]}>Seats:</Text>
                    <Text style={[
                      styles.ticketInfoValue,
                      isTheaterMode && { color: '#FFFFFF' }
                    ]}>{selectedTicket.seats}</Text>
                  </View>
                  
                  <View style={styles.ticketInfoRow}>
                    <Text style={[
                      styles.ticketInfoLabel,
                      isTheaterMode && { color: '#AAAAAA' }
                    ]}>Ticket ID:</Text>
                    <Text style={[
                      styles.ticketInfoValue,
                      isTheaterMode && { color: '#FFFFFF' }
                    ]}>{selectedTicket.id.toUpperCase()}</Text>
                  </View>
                </View>
                
                <View style={[
                  styles.separator,
                  isTheaterMode && { backgroundColor: '#444444' }
                ]} />
                
                <View style={[
                  styles.reminderContainer,
                  isTheaterMode && { backgroundColor: 'rgba(12, 97, 132, 0.2)' }
                ]}>
                  <IconSymbol 
                    name="info.circle" 
                    size={20} 
                    color={isTheaterMode ? '#8ED4F1' : '#0C6184'} 
                  />
                  <Text style={[
                    styles.reminderText,
                    isTheaterMode && { color: '#FFFFFF' }
                  ]}>
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