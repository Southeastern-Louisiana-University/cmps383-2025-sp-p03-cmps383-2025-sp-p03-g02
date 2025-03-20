import React, { useState } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  View, 
  Text, 
  Alert, 
  Image,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SFSymbol } from 'expo-symbols';

type ConcessionItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  category: 'food' | 'drink' | 'snack' | 'combo';
  image: any; 
  popular?: boolean;
};

const CONCESSIONS: ConcessionItem[] = [
  {
    id: 'c1',
    name: 'Buttered Popcorn',
    price: '$7.99',
    description: 'Freshly popped buttery popcorn, available in small, medium, or large sizes.',
    category: 'food',
    image: require('@/assets/images/concessions/popcorn.jpeg'),
    popular: true,
  },
  {
    id: 'c2',
    name: 'Loaded Nachos',
    price: '$8.99',
    description: 'Tortilla chips topped with warm cheese sauce, jalapeños, and salsa.',
    category: 'food',
    image: require('@/assets/images/concessions/nachos.jpeg'),
    popular: true,
  },
  {
    id: 'c3',
    name: 'Large Fountain Soda',
    price: '$5.99',
    description: 'Your choice of soft drink (32oz) with free refills during your movie.',
    category: 'drink',
    image: require('@/assets/images/concessions/soda.jpeg'),
  },
  {
    id: 'c4',
    name: 'Assorted Candy',
    price: '$4.99',
    description: 'Choose from a variety of movie theater candy classics.',
    category: 'snack',
    image: require('@/assets/images/concessions/candy.jpeg'),
  },
  {
    id: 'c5',
    name: 'Gourmet Hot Dog',
    price: '$6.99',
    description: 'All-beef hot dog served with your choice of toppings.',
    category: 'food',
    image: require('@/assets/images/concessions/hotdog.jpeg'),
  },
  {
    id: 'c6',
    name: 'Movie Night Combo',
    price: '$16.99',
    description: 'Large popcorn, two medium drinks, and one candy of your choice.',
    category: 'combo',
    image: require('@/assets/images/concessions/combo.jpeg'),
    popular: true,
  },
  {
    id: 'c7',
    name: 'Craft Beer',
    price: '$8.99',
    description: 'Selection of local craft beers (21+ ID required).',
    category: 'drink',
    image: require('@/assets/images/concessions/beer.jpeg'),
  },
  {
    id: 'c8',
    name: 'Pizza Slice',
    price: '$6.99',
    description: 'Fresh-baked pizza slice with your choice of toppings.',
    category: 'food',
    image: require('@/assets/images/concessions/pizza.jpeg'),
  },
];

export default function ConcessionsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Map<string, number>>(new Map());
  
  // Filter items based on selected category
  const filteredItems = selectedCategory 
    ? CONCESSIONS.filter(item => item.category === selectedCategory)
    : CONCESSIONS;

  // Calculate total cart items
  const totalCartItems = Array.from(cartItems.values()).reduce((sum, quantity) => sum + quantity, 0);

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
            const newCart = new Map(cartItems);
            const currentQuantity = cartItems.get(item.id) || 0;
            newCart.set(item.id, currentQuantity + 1);
            setCartItems(newCart);
            
            Alert.alert("Success", `${item.name} added to your order!`);
          }
        }
      ]
    );
  };

  const handleViewOrder = () => {
    // Create a formatted list of items in the cart
    const cartItemsList = Array.from(cartItems.entries()).map(([itemId, quantity]) => {
      const item = CONCESSIONS.find(c => c.id === itemId);
      return item ? `${quantity}x ${item.name} (${item.price})` : '';
    }).join('\n');
    
    // Calculate total price 
    const totalPrice = Array.from(cartItems.entries()).reduce((sum, [itemId, quantity]) => {
      const item = CONCESSIONS.find(c => c.id === itemId);
      if (item) {
    
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * quantity);
      }
      return sum;
    }, 0).toFixed(2);
    
    Alert.alert(
      "Your Order",
      `${cartItemsList}\n\nTotal: $${totalPrice}`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { 
          text: "Checkout", 
          onPress: () => {
            Alert.alert("Order Confirmed", "Your items will be delivered to your seat shortly!");
            // Clear the cart after checkout
            setCartItems(new Map());
          } 
        }
      ]
    );
  };

  const renderCategoryButton = (category: string, label: string, icon: SFSymbol) => (
    <TouchableOpacity 
      style={[
        styles.categoryButton, 
        selectedCategory === category && styles.selectedCategoryButton
      ]}
      onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
    >
      <IconSymbol size={18} name={icon} color={selectedCategory === category ? "#FFFFFF" : "#0C6184"} />
      <Text 
        style={[
          styles.categoryButtonText,
          selectedCategory === category && styles.selectedCategoryText
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>Concessions</Text>
          <Text style={styles.subtitle}>Order food & drinks to your seat</Text>
        </View>
        
        <View style={styles.categoriesContainer}>
          {renderCategoryButton('food', 'Food', 'fork.knife')}
          {renderCategoryButton('drink', 'Drinks', 'cup.and.saucer')}
          {renderCategoryButton('snack', 'Snacks', 'bag')}
          {renderCategoryButton('combo', 'Combos', 'star')}
        </View>
        
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.concessionItem}>
              <View style={styles.itemImageContainer}>
                <Image 
                  source={item.image} 
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                {item.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Popular</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.itemDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => handleAddToOrder(item)}
                >
                  <IconSymbol size={18} name="plus" color="#FFFFFF" />
                  <Text style={styles.buttonText}>Add to Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        
        {totalCartItems > 0 && (
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleViewOrder}
            >
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
              </View>
              <Text style={styles.checkoutText}>View Order</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 16,
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
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 97, 132, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#0C6184',
  },
  categoryButtonText: {
    color: '#0C6184',
    marginLeft: 4,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  list: {
    width: '100%',
  },
  listContent: {
    paddingBottom: 120, 
  },
  concessionItem: {
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#0A1822',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  itemImageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  itemImage: {
    width: 120,
    height: 120,
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0C6184',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
    padding: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F3A4D',
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C6184',
  },
  itemDescription: {
    fontSize: 14,
    color: '#4A6375',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#0C6184',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 90, 
    paddingTop: 10,
    backgroundColor: '#152F3E', 
  },
  checkoutButton: {
    backgroundColor: '#0C6184',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartBadge: {
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cartBadgeText: {
    color: '#0C6184',
    fontWeight: 'bold',
    fontSize: 14,
  }
});