import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useStripe } from '@stripe/stripe-react-native';

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

// Mock payment methods for initial state
const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm1',
    type: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025,
    isDefault: true,
  },
  {
    id: 'pm2',
    type: 'MasterCard',
    last4: '5678',
    expMonth: 8,
    expYear: 2026,
    isDefault: false,
  },
];

const PaymentService = {
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    return PAYMENT_METHODS;
  },
  
  createSetupIntent: async (): Promise<{ clientSecret: string }> => {
    return { clientSecret: 'mock_setup_intent_secret' };
  },
  
  setDefaultPaymentMethod: async (paymentMethodId: string): Promise<PaymentMethod[]> => {
    return PAYMENT_METHODS.map(method => ({
      ...method,
      isDefault: method.id === paymentMethodId,
    }));
  },
  
  deletePaymentMethod: async (paymentMethodId: string): Promise<PaymentMethod[]> => {
    return PAYMENT_METHODS.filter(method => method.id !== paymentMethodId);
  }
};

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    const methods = await PaymentService.getPaymentMethods();
    setPaymentMethods(methods);
    setIsLoading(false);
  };

  const handleAddPaymentMethod = async () => {
    setIsProcessing(true);
    
    const { clientSecret } = await PaymentService.createSetupIntent();
    
    const { error: initError } = await initPaymentSheet({
      setupIntentClientSecret: clientSecret,
      merchantDisplayName: "Lion's Den Cinemas",
    });
    
    if (initError) {
      Alert.alert('Error', 'Unable to initialize payment method setup');
      setIsProcessing(false);
      return;
    }
    
    const { error: presentError } = await presentPaymentSheet();
    
    if (presentError) {
      if (presentError.code !== 'Canceled') {
        Alert.alert('Error', presentError.message || 'Something went wrong');
      }
      setIsProcessing(false);
      return;
    }
    
    Alert.alert('Success', 'Your payment method has been added successfully');
    await loadPaymentMethods();
    setIsProcessing(false);
  };

  const handleSetDefault = async (id: string) => {
    setIsProcessing(true);
    const updatedMethods = await PaymentService.setDefaultPaymentMethod(id);
    setPaymentMethods(updatedMethods);
    Alert.alert("Default Updated", "Your default payment method has been updated.");
    setIsProcessing(false);
  };

  const handleDeletePaymentMethod = (id: string) => {
    Alert.alert(
      "Delete Payment Method",
      "Are you sure you want to delete this payment method?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsProcessing(true);
            const updatedMethods = await PaymentService.deletePaymentMethod(id);
            setPaymentMethods(updatedMethods);
            Alert.alert("Deleted", "Payment method has been removed");
            setIsProcessing(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: "Payment Methods",
        headerShown: true,
        headerStyle: {
          backgroundColor: '#152F3E',
        },
        headerTintColor: '#E8EEF2',
      }} />

      <Text style={styles.pageSubtitle}>Your Payment Methods</Text>
      
      {isLoading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#0C6184" />
          <Text style={styles.loadingText}>Loading payment methods...</Text>
        </View>
      ) : paymentMethods.length > 0 ? (
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.paymentMethodCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>{item.type} •••• {item.last4}</Text>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.expiryDate}>Expires {item.expMonth}/{item.expYear}</Text>
              
              <View style={styles.buttonRow}>
                {!item.isDefault && (
                  <TouchableOpacity 
                    style={[styles.setDefaultButton, isProcessing && styles.disabledButton]}
                    onPress={() => !isProcessing && handleSetDefault(item.id)}
                    disabled={isProcessing}
                  >
                    <Text style={styles.buttonText}>Set as Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={[styles.deleteButton, isProcessing && styles.disabledButton]}
                  onPress={() => !isProcessing && handleDeletePaymentMethod(item.id)}
                  disabled={isProcessing}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No payment methods found.</Text>
        </View>
      )}
      
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.addButton, isProcessing && styles.disabledButton]}
        onPress={() => !isProcessing && handleAddPaymentMethod()}
        disabled={isProcessing}
      >
        <Text style={styles.addButtonText}>Add New Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#152F3E',
  },
  pageSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    color: '#E8EEF2',
  },
  list: {
    flex: 1,
    marginBottom: 16,
  },
  paymentMethodCard: {
    backgroundColor: '#F0F4F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#0A1822',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F3A4D',
  },
  defaultBadge: {
    backgroundColor: '#0C6184',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  expiryDate: {
    fontSize: 14,
    color: '#4A6375',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  setDefaultButton: {
    backgroundColor: '#0C6184',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  deleteButtonText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#E8EEF2',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#0C6184',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E8EEF2',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});