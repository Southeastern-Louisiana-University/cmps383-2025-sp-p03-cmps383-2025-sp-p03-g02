import React, { useState } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text, 
  SafeAreaView,
  FlatList,
  Linking,
  Platform,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

type Theater = {
  id: string;
  name: string;
  address: string;
  distance?: string;
  location: {
    lat: number;
    lng: number;
  };
  amenities: string[];
};

const THEATERS: Theater[] = [
  { 
    id: '1', 
    name: "Lion's Den Baton Rouge", 
    address: '10000 Perkins Rowe, Baton Rouge, LA 70810', 
    distance: '1.2 mi',
    location: { lat: 30.3921, lng: -91.1453 },
    amenities: ['IMAX', 'Dine-in', 'Reserved Seating', 'Dolby Atmos']
  },
  { 
    id: '2', 
    name: "Lion's Den Hammond", 
    address: '1200 W University Ave, Hammond, LA 70401', 
    distance: '14.2 mi',
    location: { lat: 30.5102, lng: -90.4692 },
    amenities: ['Digital 3D', 'Premium Recliners', 'Bar', 'IMAX']
  },
  { 
    id: '3', 
    name: "Lion's Den Denham Springs", 
    address: '2200 S Range Ave, Denham Springs, LA 70726', 
    distance: '8.5 mi',
    location: { lat: 30.4628, lng: -90.9567 },
    amenities: ['Dolby Cinema', 'Reserved Seating', 'Arcade']
  },
  { 
    id: '4', 
    name: "Lion's Den Gonzales", 
    address: '921 Cabelas Pkwy, Gonzales, LA 70737', 
    distance: '20.3 mi',
    location: { lat: 30.2094, lng: -90.9192 },
    amenities: ['Premium Format', 'Recliners', 'Full Bar']
  },
  { 
    id: '5', 
    name: "Lion's Den Lafayette", 
    address: '2315 Kaliste Saloom Rd, Lafayette, LA 70508', 
    distance: '48.6 mi',
    location: { lat: 30.1708, lng: -91.9875 },
    amenities: ['RPX', 'Studio Grill', 'VIP Seating', 'Full Bar']
  },
];

export default function TheatersScreen() {
  const router = useRouter();
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(null);

  const handleViewShowtimes = (theater: Theater) => {
    router.push({
      pathname: '/(tabs)/movies',
      params: { theaterId: theater.id }
    });
  };

  const handleGetDirections = (theater: Theater) => {
    const address = encodeURIComponent(theater.address);
    const url = Platform.select({
      ios: `maps:q=${address}`,
      android: `google.navigation:q=${theater.location.lat},${theater.location.lng}`,
      default: `https://www.google.com/maps/search/?api=1&query=${address}`
    });
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const toggleTheaterDetails = (theaterId: string) => {
    setSelectedTheaterId(selectedTheaterId === theaterId ? null : theaterId);
  };

  const renderAmenities = (amenities: string[]) => {
    return (
      <View style={styles.amenitiesContainer}>
        {amenities.map((amenity, index) => (
          <View key={index} style={styles.amenityTag}>
            <ThemedText style={styles.amenityText}>{amenity}</ThemedText>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>Our Theaters</Text>
          <Text style={styles.subtitle}>Find a theater near you</Text>
        </View>
        
        <FlatList
          data={THEATERS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.theaterItem}>
              <TouchableOpacity 
                style={styles.theaterCard}
                onPress={() => toggleTheaterDetails(item.id)}
                activeOpacity={0.9}
              >
                <View style={styles.cardContent}>
                  <ThemedText style={styles.theaterName}>{item.name}</ThemedText>
                  
                  <View style={styles.locationRow}>
                    <IconSymbol size={16} name="location.fill" color="#0C6184" />
                    <ThemedText style={styles.theaterDistance}>
                      {item.distance} away
                    </ThemedText>
                  </View>
                </View>
                
                <View style={styles.chevronContainer}>
                  <IconSymbol 
                    size={22} 
                    name={selectedTheaterId === item.id ? "chevron.up" : "chevron.down"} 
                    color="#4A6375" 
                  />
                </View>
              </TouchableOpacity>
              
              {selectedTheaterId === item.id && (
                <View style={styles.detailsContainer}>
                  <ThemedText style={styles.theaterAddress}>{item.address}</ThemedText>
                  
                  {renderAmenities(item.amenities)}
                  
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                      style={styles.directionsButton}
                      onPress={() => handleGetDirections(item)}
                    >
                      <IconSymbol size={18} name="location.fill" color="#FFFFFF" />
                      <Text style={styles.directionsButtonText}>Directions</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.showtimesButton}
                      onPress={() => handleViewShowtimes(item)}
                    >
                      <IconSymbol size={18} name="ticket.fill" color="#FFFFFF" />
                      <Text style={styles.showtimesButtonText}>View Showtimes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#152F3E',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#152F3E',
  },
  headerContainer: {
    marginTop: Platform.OS === 'ios' ? 10 : 20,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#E8EEF2',
    includeFontPadding: false,
    padding: 0,
  },
  subtitle: {
    fontSize: 16,
    color: '#A4B5C5',
    includeFontPadding: false,
    padding: 0,
  },
  list: {
    width: '100%',
    paddingBottom: 20,
  },
  theaterItem: {
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#0A1822',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  theaterCard: {
    padding: 16,
    backgroundColor: '#F0F4F8',
    position: 'relative',
    flexDirection: 'row',
  },
  cardContent: {
    flex: 1,
    paddingRight: 35,
  },
  theaterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F3A4D',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  theaterDistance: {
    fontSize: 14,
    color: '#4A6375',
    marginLeft: 4,
  },
  chevronContainer: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    width: 30,
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  theaterAddress: {
    fontSize: 16,
    color: '#4A6375',
    marginBottom: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  amenityTag: {
    backgroundColor: 'rgba(12, 97, 132, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 12,
    color: '#0C6184',
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  directionsButton: {
    backgroundColor: '#4A6375',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  showtimesButton: {
    backgroundColor: '#0C6184',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  showtimesButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
});