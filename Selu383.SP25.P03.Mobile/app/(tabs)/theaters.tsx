import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text, 
  SafeAreaView,
  Linking,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Location from 'expo-location';

// Function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; 
  
  return distance;
}

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
    name: "Lion's Den New York", 
    address: '570 2nd Ave, New York, NY 10016', 
    distance: '0.8 mi',
    location: { lat: 40.7459, lng: -73.9739 },
    amenities: ['IMAX', 'Dine-in', 'Reserved Seating', 'Dolby Atmos']
  },
  { 
    id: '2', 
    name: "Lion's Den New Orleans", 
    address: '636 N Broad St, New Orleans, LA 70119', 
    distance: '1.5 mi',
    location: { lat: 29.9694, lng: -90.0794 },
    amenities: ['Digital 3D', 'Premium Recliners', 'Bar', 'IMAX']
  },
  { 
    id: '3', 
    name: "Lion's Den Los Angeles", 
    address: '4020 Marlton Ave, Los Angeles, CA 90008', 
    distance: '3.2 mi',
    location: { lat: 34.0163, lng: -118.3374 },
    amenities: ['Dolby Cinema', 'Reserved Seating', 'Arcade', 'VIP Experience']
  }
];

export default function TheatersScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [nearestTheater, setNearestTheater] = useState<Theater | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const findNearestTheater = async () => {
      try {
        setIsLoading(true);
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          setNearestTheater(THEATERS[0]);
          setIsLoading(false);
          return;
        }

        // Get the user's current location
        const location = await Location.getCurrentPositionAsync({});
        const userLat = location.coords.latitude;
        const userLng = location.coords.longitude;
        
        // Calculate distance to each theater
        const theatersWithDistance = THEATERS.map(theater => {
          const distance = calculateDistance(
            userLat, 
            userLng, 
            theater.location.lat, 
            theater.location.lng
          );
          
          return {
            ...theater,
            distanceInMiles: distance,
            distance: `${distance.toFixed(1)} mi`
          };
        });
        
        // Sort theaters by distance (closest first)
        theatersWithDistance.sort((a, b) => a.distanceInMiles - b.distanceInMiles);
        
        // Get the closest theater
        const nearestTheater = theatersWithDistance[0];
        setNearestTheater(nearestTheater);
        setIsLoading(false);
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationError('Could not determine your location');
        setNearestTheater(THEATERS[0]);
        setIsLoading(false);
      }
    };

    findNearestTheater();
  }, []);

  const handleViewShowtimes = () => {
    if (nearestTheater) {
      router.push({
        pathname: '/(tabs)/movies',
        params: { theaterId: nearestTheater.id }
      });
    }
  };

  const handleGetDirections = () => {
    if (!nearestTheater) return;
    
    try {
      const address = encodeURIComponent(nearestTheater.address);
      const lat = nearestTheater.location.lat;
      const lng = nearestTheater.location.lng;
      const name = encodeURIComponent(nearestTheater.name);
      
      const mapUrls = [
        `geo:0,0?q=${lat},${lng}(${name})`,
        `google.navigation:q=${lat},${lng}`,
        `waze://?ll=${lat},${lng}&navigate=yes`,
        `https://www.google.com/maps/search/?api=1&query=${address}`
      ];
      
      const tryNextUrl = (index: number) => {
        if (index >= mapUrls.length) {
          Alert.alert(
            "Navigation Error",
            "Could not open maps. Try manually entering the address: " + nearestTheater.address
          );
          return;
        }
        
        const url = mapUrls[index];
        Linking.canOpenURL(url)
          .then(supported => {
            if (supported) {
              return Linking.openURL(url);
            } else {
              tryNextUrl(index + 1);
            }
          })
          .catch(err => {
            tryNextUrl(index + 1);
          });
      };
      
      tryNextUrl(0);
      
    } catch (error) {
      Alert.alert("Navigation Error", "Please try again.");
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0C6184" />
          <Text style={styles.loadingText}>Finding your nearest theater...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>Our Theaters</Text>
          <Text style={styles.subtitle}>We've selected the closest theater to you</Text>
        </View>
        
        {locationError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{locationError}</Text>
          </View>
        )}

        {nearestTheater && (
          <View style={styles.theaterItem}>
            <TouchableOpacity 
              style={styles.theaterCard}
              onPress={toggleExpanded}
              activeOpacity={0.9}
            >
              <View style={styles.cardContent}>
                <ThemedText style={styles.theaterName}>{nearestTheater.name}</ThemedText>
                
                <View style={styles.locationRow}>
                  <IconSymbol size={16} name="location.fill" color="#0C6184" />
                  <ThemedText style={styles.theaterDistance}>
                    {nearestTheater.distance} away
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.chevronContainer}>
                <IconSymbol 
                  size={22} 
                  name={expanded ? "chevron.up" : "chevron.down"} 
                  color="#4A6375" 
                />
              </View>
            </TouchableOpacity>
            
            {expanded && (
              <View style={styles.detailsContainer}>
                <ThemedText style={styles.theaterAddress}>{nearestTheater.address}</ThemedText>
                
                {renderAmenities(nearestTheater.amenities)}
                
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity 
                    style={styles.directionsButton}
                    onPress={handleGetDirections}
                  >
                    <IconSymbol size={18} name="location.fill" color="#FFFFFF" />
                    <Text style={styles.directionsButtonText}>Directions</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.showtimesButton}
                    onPress={handleViewShowtimes}
                  >
                    <IconSymbol size={18} name="ticket.fill" color="#FFFFFF" />
                    <Text style={styles.showtimesButtonText}>View Showtimes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.infoContainer}>
          <ThemedText style={styles.infoText}>
            Your movie experience is automatically set to this theater. You can change your default theater in account settings.
          </ThemedText>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#152F3E',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#E8EEF2',
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
  errorContainer: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
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
  infoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0C6184',
  },
  infoText: {
    fontSize: 14,
    color: '#A4B5C5',
    lineHeight: 20,
  },
});