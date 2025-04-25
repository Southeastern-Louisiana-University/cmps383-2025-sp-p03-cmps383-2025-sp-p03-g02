import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Location from 'expo-location';

type Theater = {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance: string | null;
};

const THEATERS: Theater[] = [
  { 
    id: '1', 
    name: "Lion's Den New York", 
    address: '570 2nd Ave, New York, NY 10016', 
    coordinates: {
      latitude: 40.7478,
      longitude: -73.9756
    },
    distance: null 
  },
  { 
    id: '2', 
    name: "Lion's Den New Orleans", 
    address: '636 N Broad St, New Orleans, LA 70119', 
    coordinates: {
      latitude: 29.9682,
      longitude: -90.0777
    },
    distance: null 
  },
  { 
    id: '3', 
    name: "Lion's Den Los Angeles", 
    address: '4020 Marlton Ave, Los Angeles, CA 90008', 
    coordinates: {
      latitude: 34.0118,
      longitude: -118.3378
    },
    distance: null 
  },
];

export default function EditProfileScreen() {
  const router = useRouter();
  
  // Initial user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@yahoo.com',
    phone: '555-123-4567',
    defaultTheater: '2' 
  });

  const [theaters, setTheaters] = useState<Theater[]>(THEATERS);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    getLocationAndCalculateDistances();
  }, []);

  async function getLocationAndCalculateDistances() {
    setLoading(true);
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      setLocationError('Location permission denied');
      // Use default distances
      setTheaters(THEATERS.map(theater => ({
        ...theater,
        distance: 'Unknown distance'
      })));
      setLoading(false);
      return;
    }

    try {
      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      
      // Calculate distances and update theaters
      const theatersWithDistances = THEATERS.map(theater => {
        const distance = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          theater.coordinates.latitude,
          theater.coordinates.longitude
        );
        
        return {
          ...theater,
          distance: `${distance.toFixed(1)} mi away`
        };
      });
      
      setTheaters(theatersWithDistances);
    } catch (error) {
      setLocationError('Could not get your location');
      setTheaters(THEATERS.map(theater => ({
        ...theater,
        distance: 'Unknown distance'
      })));
    } finally {
      setLoading(false);
    }
  }

  // Calculate distance between two points
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3958.8; 
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  }

  function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  const handleSave = () => {
    Alert.alert(
      "Profile Updated",
      "Your profile has been successfully updated.",
      [
        { 
          text: "OK", 
          onPress: () => router.back() 
        }
      ]
    );
  };

  // Select a theater as default
  const selectTheater = (theaterId: string) => {
    setUserData({...userData, defaultTheater: theaterId});
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ 
        title: "Edit Profile",
        headerShown: true,
        headerStyle: {
          backgroundColor: '#152F3E',
        },
        headerTintColor: '#E8EEF2',
      }} />
      
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={userData.name}
            onChangeText={(text) => setUserData({...userData, name: text})}
            placeholder="Enter your name"
            placeholderTextColor="#90A4AE"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={userData.email}
            onChangeText={(text) => setUserData({...userData, email: text})}
            placeholder="Enter your email"
            placeholderTextColor="#90A4AE"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={userData.phone}
            onChangeText={(text) => setUserData({...userData, phone: text})}
            placeholder="Enter your phone number"
            placeholderTextColor="#90A4AE"
            keyboardType="phone-pad"
          />
        </View>
      </View>
      
      <View style={styles.theaterContainer}>
        <Text style={styles.sectionTitle}>Default Theater</Text>
        <Text style={styles.sectionDescription}>
          Set your default theater for movie browsing and ticket purchases.
        </Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E8EEF2" />
            <Text style={styles.loadingText}>Calculating distances...</Text>
          </View>
        ) : (
          theaters.map(theater => (
            <TouchableOpacity 
              key={theater.id}
              style={[
                styles.theaterItem,
                userData.defaultTheater === theater.id ? styles.selectedTheater : null
              ]}
              onPress={() => selectTheater(theater.id)}
            >
              <View style={styles.theaterInfo}>
                <Text style={styles.theaterName}>{theater.name}</Text>
                <Text style={styles.theaterAddress}>{theater.address}</Text>
                <Text style={styles.theaterDistance}>{theater.distance}</Text>
              </View>
              {userData.defaultTheater === theater.id && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedText}>Default</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
        
        {locationError && (
          <Text style={styles.errorText}>
            {locationError}. Distances may not be accurate.
          </Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
      
      <View style={{height: 30}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#152F3E',
  },
  formContainer: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#E8EEF2',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#A4B5C5',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#E8EEF2',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#F0F4F8',
    borderColor: '#DDE2E5',
    color: '#1F3A4D',
  },
  theaterContainer: {
    padding: 16,
    marginBottom: 16,
  },
  theaterItem: {
    backgroundColor: '#F0F4F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedTheater: {
    borderWidth: 2,
    borderColor: '#0C6184',
  },
  theaterInfo: {
    flex: 1,
  },
  theaterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F3A4D',
  },
  theaterAddress: {
    fontSize: 14,
    color: '#4A6375',
    marginTop: 2,
  },
  theaterDistance: {
    fontSize: 12,
    color: '#6B7D8A',
    marginTop: 4,
    fontStyle: 'italic',
  },
  selectedIndicator: {
    backgroundColor: '#0C6184',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#0C6184',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#E8EEF2',
    fontSize: 14,
  },
  errorText: {
    color: '#FF8A80',
    marginTop: 8,
    fontSize: 14,
    fontStyle: 'italic',
  },
});