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
  Platform,
  ScrollView,
  Modal
} from 'react-native';

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
    description: 'Fresh baked pizza slice with your choice of toppings.',
    category: 'food',
    image: require('@/assets/images/concessions/pizza.jpeg'),
  },
];

export default function ConcessionsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ConcessionItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  
  // Filter items based on selected category
  const filteredItems = selectedCategory 
    ? CONCESSIONS.filter(item => item.category === selectedCategory)
    : CONCESSIONS;

  // Calculate total cart items
  const totalCartItems = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);

  // Calculate total order price
  const calculateTotalPrice = () => {
    return Object.entries(cartItems).reduce((sum, [itemId, quantity]) => {
      const item = CONCESSIONS.find(c => c.id === itemId);
      if (item) {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * quantity);
      }
      return sum;
    }, 0).toFixed(2);
  };

  const handleOpenQuantitySelector = (item: ConcessionItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setModalVisible(true);
  };

  const handleAddToOrder = () => {
    if (selectedItem) {
      setCartItems(prev => ({
        ...prev,
        [selectedItem.id]: (prev[selectedItem.id] || 0) + quantity
      }));
      setModalVisible(false);
    }
  };

  const handleViewOrder = () => {
    setOrderModalVisible(true);
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => {
      const newCart = { ...prev };
      delete newCart[itemId];
      return newCart;
    });
  };

  const handleUpdateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    
    setCartItems(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  const handleCheckout = () => {
    setOrderModalVisible(false);
    Alert.alert("Order Confirmed", "Your items will be delivered to your seat shortly!");
    setCartItems({});
  };

  // Quantity Selector Modal
  const renderQuantityModal = () => {
    if (!selectedItem) return null;
    
    const itemPrice = parseFloat(selectedItem.price.replace('$', ''));
    const totalPrice = (itemPrice * quantity).toFixed(2);
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.itemPreview}>
              <Image 
                source={selectedItem.image} 
                style={styles.modalImage}
                resizeMode="cover"
              />
              <Text style={styles.modalPrice}>${totalPrice}</Text>
            </View>
            
            <View style={styles.quantitySelector}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                  onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  <Text style={[styles.quantityButtonText, quantity <= 1 && styles.quantityButtonTextDisabled]}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantityValue}>{quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => setQuantity(prev => prev + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.modalAddButton}
              onPress={handleAddToOrder}
            >
              <Text style={styles.modalAddButtonText}>
                Add {quantity > 1 ? `${quantity} Items` : 'to Order'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Order Summary
  const renderOrderModal = () => {
    type OrderItemType = {
      id: string;
      item: ConcessionItem;
      quantity: number;
      price: string;
    };

    // Maps cart items
    const orderItems: OrderItemType[] = Object.entries(cartItems)
      .map(([itemId, quantity]): OrderItemType | null => {
        const item = CONCESSIONS.find(c => c.id === itemId);
        if (!item) return null;
        
        const itemPrice = parseFloat(item.price.replace('$', ''));
        const totalItemPrice = (itemPrice * quantity).toFixed(2);
        
        return {
          id: itemId,
          item: item,
          quantity: quantity,
          price: totalItemPrice
        };
      })
      .filter((item): item is OrderItemType => item !== null);
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={orderModalVisible}
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.orderModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Order</Text>
              <TouchableOpacity 
                onPress={() => setOrderModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.orderItemsList}>
              {orderItems.length > 0 ? (
                orderItems.map((orderItem) => (
                  <View key={orderItem.id} style={styles.orderItem}>
                    <View style={styles.orderItemImageContainer}>
                      <Image 
                        source={orderItem.item.image} 
                        style={styles.orderItemImage}
                        resizeMode="cover"
                      />
                    </View>
                    
                    <View style={styles.orderItemDetails}>
                      <Text style={styles.orderItemName}>{orderItem.item.name}</Text>
                      <Text style={styles.orderItemPrice}>${orderItem.price}</Text>
                      
                      <View style={styles.orderItemActions}>
                        <View style={styles.quantityControls}>
                          <TouchableOpacity 
                            style={[styles.quantityButton, styles.smallButton]}
                            onPress={() => handleUpdateItemQuantity(orderItem.id, orderItem.quantity - 1)}
                          >
                            <Text style={styles.quantityButtonText}>-</Text>
                          </TouchableOpacity>
                          
                          <Text style={styles.quantityValue}>{orderItem.quantity}</Text>
                          
                          <TouchableOpacity 
                            style={[styles.quantityButton, styles.smallButton]}
                            onPress={() => handleUpdateItemQuantity(orderItem.id, orderItem.quantity + 1)}
                          >
                            <Text style={styles.quantityButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity 
                          style={styles.removeButton}
                          onPress={() => handleRemoveItem(orderItem.id)}
                        >
                          <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyCartContainer}>
                  <Text style={styles.emptyCartText}>Your cart is empty</Text>
                </View>
              )}
            </ScrollView>
            
            {orderItems.length > 0 && (
              <>
                <View style={styles.orderSummary}>
                  <Text style={styles.orderSummaryText}>Total:</Text>
                  <Text style={styles.orderSummaryPrice}>${calculateTotalPrice()}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.checkoutButton}
                  onPress={handleCheckout}
                >
                  <Text style={styles.checkoutButtonText}>Checkout</Text>
                </TouchableOpacity>
              </>
            )}
            
            <TouchableOpacity 
              style={[styles.continueShoppingButton, orderItems.length === 0 && styles.fullWidthButton]}
              onPress={() => setOrderModalVisible(false)}
            >
              <Text style={[
                styles.continueShoppingText, 
                orderItems.length === 0 && { color: '#FFFFFF' }
              ]}>
                {orderItems.length > 0 ? 'Continue Shopping' : 'Back to Concessions'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>Concessions</Text>
          <Text style={styles.subtitle}>Order food & drinks to your seat</Text>
        </View>
        
        {/* Category Filters */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[
                styles.categoryButton, 
                selectedCategory === 'food' && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(selectedCategory === 'food' ? null : 'food')}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === 'food' && styles.selectedCategoryText
              ]}>
                Food
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton, 
                selectedCategory === 'drink' && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(selectedCategory === 'drink' ? null : 'drink')}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === 'drink' && styles.selectedCategoryText
              ]}>
                Drinks
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton, 
                selectedCategory === 'snack' && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(selectedCategory === 'snack' ? null : 'snack')}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === 'snack' && styles.selectedCategoryText
              ]}>
                Snacks
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryButton, 
                selectedCategory === 'combo' && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(selectedCategory === 'combo' ? null : 'combo')}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === 'combo' && styles.selectedCategoryText
              ]}>
                Combos
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            totalCartItems > 0 && { paddingBottom: 80 } 
          ]}
          renderItem={({ item }) => {
            const itemQuantity = cartItems[item.id] || 0;
            
            return (
              <View style={styles.concessionCard}>
                {/* Top section with title and description */}
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemName}>
                      {item.name}
                      {itemQuantity > 0 && (
                        <Text style={styles.quantityBadge}> ({itemQuantity})</Text>
                      )}
                    </Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                  </View>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
                
                {/* Image section */}
                <View style={styles.imageSection}>
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
                
                {/* Button section */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleOpenQuantitySelector(item)}
                  >
                    <Text style={styles.buttonText}>Add to Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        
        {/*Total items in the cart*/}
        {totalCartItems > 0 && (
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity 
              style={styles.viewOrderButton}
              onPress={handleViewOrder}
            >
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
              </View>
              <Text style={styles.viewOrderText}>View Order</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Quantity selector modal */}
        {renderQuantityModal()}
        
        {/* Order summary modal */}
        {renderOrderModal()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#152F3E',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#152F3E',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#E8EEF2',
  },
  subtitle: {
    fontSize: 16,
    color: '#A4B5C5',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20, 
    paddingVertical: 4, 
  },
  categoryButton: {
    backgroundColor: 'rgba(12, 137, 182, 0.3)', 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(12, 157, 202, 0.6)', 
  },
  selectedCategoryButton: {
    backgroundColor: '#0C6184', 
    borderColor: '#0C6184',
  },
  categoryButtonText: {
    color: '#8ED4F1', 
    fontWeight: '600',
    fontSize: 15,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  concessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F3A4D',
    flex: 1,
    marginRight: 8,
  },
  quantityBadge: {
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C6184',
  },
  itemDescription: {
    fontSize: 14,
    color: '#4A6375',
    lineHeight: 20,
  },
  imageSection: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#0C6184',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 12,
    paddingTop: 8,
  },
  addButton: {
    backgroundColor: '#0C6184',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  // Completed the View Order button
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: '#152F3E', 
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)', 
    zIndex: 1000, 
  },
  viewOrderButton: {
    backgroundColor: '#0C6184',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewOrderText: {
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
  },
  
  // Quantity Selector
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F3A4D',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#687076',
    fontWeight: 'bold',
  },
  itemPreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C6184',
  },
  quantitySelector: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F3A4D',
    marginBottom: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: '#0C6184',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  quantityButtonDisabled: {
    backgroundColor: '#C4C9CC',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
    textAlign: 'center',
  },
  quantityButtonTextDisabled: {
    color: '#FFFFFF',
  },
  quantityValue: {
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F3A4D',
    minWidth: 30,
    textAlign: 'center',
  },
  modalAddButton: {
    backgroundColor: '#0C6184',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAddButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Order Modal styles
  orderModalContent: {
    maxHeight: '85%',
    width: '90%',
  },
  orderItemsList: {
    maxHeight: 400,
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF2',
  },
  orderItemImageContainer: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  orderItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F3A4D',
    marginBottom: 2,
  },
  orderItemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0C6184',
    marginBottom: 10,
  },
  orderItemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    padding: 5,
  },
  removeButtonText: {
    color: '#E74C3C',
    fontSize: 14,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF2',
    marginBottom: 15,
  },
  orderSummaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F3A4D',
  },
  orderSummaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C6184',
  },
  checkoutButton: {
    backgroundColor: '#0C6184',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  continueShoppingButton: {
    backgroundColor: 'transparent',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0C6184',
  },
  fullWidthButton: {
    backgroundColor: '#0C6184',
    borderWidth: 0,
  },
  continueShoppingText: {
    color: '#0C6184',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyCartContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#4A6375',
    textAlign: 'center',
  }
});