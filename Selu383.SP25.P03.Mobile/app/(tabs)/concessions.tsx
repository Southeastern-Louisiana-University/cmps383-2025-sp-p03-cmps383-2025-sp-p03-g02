import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, Alert, Image } from 'react-native';

type ConcessionItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  category: 'food' | 'drink' | 'snack';
};

const CONCESSIONS: ConcessionItem[] = [
  {
    id: 'c1',
    name: 'Popcorn',
    price: '$7.99',
    description: 'Freshly popped buttery popcorn',
    category: 'food'
  },
  {
    id: 'c2',
    name: 'Nachos',
    price: '$8.99',
    description: 'Tortilla chips with cheese sauce',
    category: 'food'
  },
  {
    id: 'c3',
    name: 'Soda',
    price: '$5.99',
    description: 'Your choice of soft drink (32oz)',
    category: 'drink'
  },
  {
    id: 'c4',
    name: 'Candy',
    price: '$4.99',
    description: 'Assorted movie theater candy',
    category: 'snack'
  },
  {
    id: 'c5',
    name: 'Hot Dog',
    price: '$6.99',
    description: 'All-beef hot dog with condiments',
    category: 'food'
  },
];

export default function ConcessionsScreen() {
  const handleAddToOrder = (item: ConcessionItem) => {
    Alert.alert(
      "Add to Order",
      `Add ${item.name} to your order?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Add", 
          onPress: () => {
            Alert.alert("Success", `${item.name} added to your order!`);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Concessions</Text>
      <Text style={styles.subtitle}>Order food & drinks to your seat</Text>
      
      <FlatList
        data={CONCESSIONS}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.concessionItem}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddToOrder(item)}
            >
              <Text style={styles.buttonText}>Add to Order</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.buttonText}>View Order</Text>
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
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 40,
    color: '#E8EEF2',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: '#A4B5C5',
  },
  list: {
    width: '100%',
    marginBottom: 80, 
  },
  concessionItem: {
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
  itemDetails: {
    flexDirection: 'column',
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F3A4D',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C6184',
    marginTop: 2,
  },
  itemDescription: {
    fontSize: 14,
    color: '#4A6375',
    marginTop: 4,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#0C6184',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    width: 120,
  },
  buttonText: {
    color: '#E8EEF2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#0C6184',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});