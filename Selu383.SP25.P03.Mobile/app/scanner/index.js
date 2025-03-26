import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function ScannerScreen() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSimulateScan = () => {
    setScanning(true);
    
    // Simulate scanning process with a delay
    setTimeout(() => {
      setScanning(false);
      setShowSuccess(true);
      
      // Show success alert
      Alert.alert(
        "Ticket Verified",
        "Welcome to Lion's Den Cinemas!\n\nMovie: The Dark Knight\nTheater: 4\nTime: 7:30 PM\nSeats: G7, G8\n\nEnjoy your movie!",
        [
          { 
            text: "OK", 
            onPress: () => {
              setTimeout(() => {
                setShowSuccess(false);
              }, 500);
            }
          }
        ]
      );
    }, 2000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <Text style={styles.helpText}>Need help?</Text>
        </View>
      </View>
      
      {}
      <View style={styles.content}>
        <Text style={styles.title}>Ticket Scanner</Text>
        <Text style={styles.description}>
          Position your ticket's QR code within the frame
        </Text>
        
        {}
        <View style={styles.scannerContainer}>
          {scanning ? (
            <View style={styles.scanningOverlay}>
              <View style={styles.scanningLine} />
            </View>
          ) : null}
          
          {showSuccess ? (
            <View style={styles.successOverlay}>
              <View style={styles.checkmarkContainer}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            </View>
          ) : null}
          
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
          
          <Text style={styles.cameraText}>Camera Preview</Text>
        </View>
        
        <Text style={styles.instructions}>
          Your ticket will be automatically validated once scanned
        </Text>
        
        {/* Bottom Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.scanButton, scanning ? styles.scanningButton : null]}
            onPress={handleSimulateScan}
            disabled={scanning}
          >
            <Text style={styles.buttonText}>
              {scanning ? 'Scanning...' : 'Simulate Scan'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Theater Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>LION'S DEN</Text>
          <Text style={styles.cinemaText}>CINEMAS</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#152F3E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  headerRight: {
    padding: 10,
  },
  helpText: {
    color: '#0C6184',
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: '#A4B5C5',
    textAlign: 'center',
    marginBottom: 30,
  },
  scannerContainer: {
    width: 280,
    height: 280,
    backgroundColor: '#0A1822',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#0C6184',
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#0C6184',
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#0C6184',
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#0C6184',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(12, 97, 132, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  scanningLine: {
    width: '80%',
    height: 2,
    backgroundColor: '#0C6184',
    shadowColor: '#0C6184',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(39, 174, 96, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(39, 174, 96, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 50,
  },
  cameraText: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.7,
  },
  instructions: {
    fontSize: 14,
    color: '#A4B5C5',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#0C6184',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  scanningButton: {
    backgroundColor: 'rgba(12, 97, 132, 0.6)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  logoContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  logoText: {
    color: '#E8EEF2',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  cinemaText: {
    color: '#A4B5C5',
    fontSize: 14,
    letterSpacing: 4,
  }
});