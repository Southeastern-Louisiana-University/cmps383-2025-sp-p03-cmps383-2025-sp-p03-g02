import { useEffect, useState } from "react";
import "../styles/Food.css";
import { FaTrash } from "react-icons/fa";
import { Toast } from "../components/Toast";

interface FoodItemDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface SeatDto {
  id: number;
  isBooked: boolean;
  showtimeId: number;
  seatNumber: string;
}

interface TicketDto {
  id?: number;
  userId: number;
  showtimeId: number;
  seatId: number;
  paymentMethod: string;
}

interface ShowtimeDto {
  id: number;
  movieId: number;
  showtimeDate: string;
}

interface MovieDto {
  id: number;
  title: string;
}

interface UserDto {
  id: number;
  userName: string;
  roles: string[];
}

interface OrderDto {
  id?: number;
  userId: number;
  seatId: number;
  foodItemId: number;
  quantity: number;
  paymentMethod: string;
  totalPrice: number;
  status: string;
}

const Food = () => {
  const [foodItems, setFoodItems] = useState<FoodItemDto[]>([]);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [showCart, setShowCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [userTickets, setUserTickets] = useState<TicketDto[]>([]);
  const [availableSeats, setAvailableSeats] = useState<SeatDto[]>([]);
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);
  const [showtimes, setShowtimes] = useState<ShowtimeDto[]>([]);
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [allTickets, setAllTickets] = useState<TicketDto[]>([]);
  const [allSeats, setAllSeats] = useState<SeatDto[]>([]);
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/authentication/me");
      if (!response.ok) {
        throw new Error("Failed to fetch current user");
      }
      const user: UserDto = await response.json();
      setCurrentUser(user);
      
      // Load user-specific cart data
      const userCart = localStorage.getItem(`cart_${user.id}`);
      if (userCart) {
        setCart(JSON.parse(userCart));
      }
      
      const userQuantities = localStorage.getItem(`quantities_${user.id}`);
      if (userQuantities) {
        setQuantities(JSON.parse(userQuantities));
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setCurrentUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchFoodItems();
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Save user-specific cart data
      localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart));
      localStorage.setItem(`quantities_${currentUser.id}`, JSON.stringify(quantities));
    } else {
      // Clear cart if no user
      setCart({});
      setQuantities({});
    }
  }, [cart, quantities, currentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      const filteredTickets = allTickets.filter(ticket => ticket.userId === currentUser.id);
      setUserTickets(filteredTickets);
      
      if (filteredTickets.length === 0) {
        setAvailableSeats([]);
        return;
      }

      const userSeatIds = filteredTickets.map(t => t.seatId);
      const userSeats = allSeats.filter(seat => userSeatIds.includes(seat.id));
      setAvailableSeats(userSeats);
      
      if (userSeats.length > 0) {
        setSelectedSeatId(userSeats[0].id);
      }
    } else {
      setUserTickets([]);
      setAvailableSeats([]);
    }
  }, [currentUser, allTickets, allSeats]);

  const fetchInitialData = async () => {
    try {
      const [ticketsRes, seatsRes, showtimesRes, moviesRes] = await Promise.all([
        fetch("/api/tickets"),
        fetch("/api/seats"),
        fetch("/api/showtimes"),
        fetch("/api/movie")
      ]);

      if (!ticketsRes.ok || !seatsRes.ok || !showtimesRes.ok || !moviesRes.ok) {
        throw new Error("Failed to fetch initial data");
      }

      const [tickets, seats, showtimes, movies] = await Promise.all([
        ticketsRes.json(),
        seatsRes.json(),
        showtimesRes.json(),
        moviesRes.json()
      ]);

      setAllTickets(tickets);
      setAllSeats(seats);
      setShowtimes(showtimes);
      setMovies(movies);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setToastMessage("Error loading data. Please try again.");
      setShowToast(true);
    }
  };

  const fetchFoodItems = () => {
    fetch("api/fooditem")
      .then((response) => response.json())
      .then((data: FoodItemDto[]) => {
        setFoodItems(data);
        const uniqueCategories = Array.from(
          new Set(data.map((item) => item.category))
        );
        setCategories(["All", ...uniqueCategories]);
      })
      .catch(() => {
        setError("Failed to fetch food items.");
      });
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      setToastMessage("Please log in to complete your order.");
      setShowToast(true);
      return;
    }

    if (!selectedSeatId) {
      setToastMessage("Please select a seat first.");
      setShowToast(true);
      return;
    }

    setIsCheckingOut(true);
    setToastMessage("Processing your order...");
    setShowToast(true);

    try {
      const orderPromises = Object.entries(cart).map(async ([foodItemId, quantity]) => {
        const foodItem = foodItems.find(item => item.id === parseInt(foodItemId));
        if (!foodItem) return;

        const orderData: OrderDto = {
          userId: currentUser.id,
          seatId: selectedSeatId,
          foodItemId: parseInt(foodItemId),
          quantity: quantity,
          paymentMethod: paymentMethod,
          totalPrice: foodItem.price * quantity,
          status: "Pending" // Default status
        };

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) throw new Error(`Failed to create order for item ${foodItemId}`);
        return response.json();
      });

      await Promise.all(orderPromises);
      setCart({});
      setQuantities({});
      if (currentUser) {
        localStorage.removeItem(`cart_${currentUser.id}`);
        localStorage.removeItem(`quantities_${currentUser.id}`);
      }
      setShowCart(false);
      setToastMessage("Order placed successfully! Your food will be delivered shortly.");
    } catch (error) {
      console.error("Checkout failed:", error);
      setToastMessage("Failed to place your order. Please try again.");
    } finally {
      setIsCheckingOut(false);
      setTimeout(() => setShowToast(false), 2750);
    }
  };

  const formatShowtimeDate = (showtimeDate: string) => {
    try {
      const dateTime = new Date(showtimeDate);
      
      const date = dateTime.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });

      const time = dateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      return { date, time };
    } catch (error) {
      console.error("Error formatting showtime date:", error);
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  };

  const filteredFoodItems =
    selectedCategory === "All"
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  const updateQuantity = (itemId: number, amount: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) + amount, 0),
    }));
  };

  const addToCart = (itemId: number) => {
    if (!currentUser) {
      setToastMessage("Please log in to order food.");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2750);
      return;
    }

    const qtyToAdd = quantities[itemId] || 0;
    if (qtyToAdd === 0) return;

    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + qtyToAdd,
    }));

    setQuantities((prev) => ({
      ...prev,
      [itemId]: 0,
    }));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  if (loadingUser) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="food-container">
      <h1 className="food-title">Concessions</h1>
      <p className="food-subtitle">Order food & drinks to your seat</p>
  
      {error && <p style={{ color: "red" }}>{error}</p>}
  
      <div className="food-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`food-tab ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
  
      <div className="food-list">
        {filteredFoodItems.map((item) => (
          <div key={item.id} className="food-item">
            {cart[item.id] > 0 && (
              <span className="food-quantity-badge">x{cart[item.id]}</span>
            )}
            <h2>{item.name}</h2>
            <div className="food-image-wrapper">
              <img src={item.imageUrl} alt={item.name} className="food-image" />
            </div>
            <p className="food-description">{item.description}</p>
            <p className="food-price">${item.price.toFixed(2)}</p>
  
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span>{quantities[item.id] || 0}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
            <button
              className="add-to-cart-btn"
              onClick={() => addToCart(item.id)}
              disabled={(quantities[item.id] || 0) === 0}
            >
              Add to Cart
              {quantities[item.id] > 0 ? ` (${quantities[item.id]})` : ""}
            </button>
          </div>
        ))}
      </div>
  
      {Object.keys(cart).length > 0 && (
        <button className="view-cart-btn" onClick={() => setShowCart(true)}>
          View Cart
        </button>
      )}
  
      {showCart && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <h2>Your Cart</h2>
  
            {currentUser ? (
              availableSeats.length > 0 ? (
                <>
                  <div className="seat-selection">
                    <label htmlFor="seat-select">Deliver to Seat:</label>
                    <select
                      id="seat-select"
                      value={selectedSeatId || ''}
                      onChange={(e) => setSelectedSeatId(Number(e.target.value))}
                      className="seat-dropdown"
                    >
                      {availableSeats.map(seat => {
                        const ticket = userTickets.find(t => t.seatId === seat.id);
                        const showtime = ticket ? showtimes.find(s => s.id === ticket.showtimeId) : undefined;
                        const movie = showtime ? movies.find(m => m.id === showtime.movieId) : undefined;
                        const showtimeInfo = showtime ? formatShowtimeDate(showtime.showtimeDate) : null;
                        
                        return (
                          <option key={seat.id} value={seat.id}>
                            {seat.seatNumber} 
                            {ticket && showtime && movie && showtimeInfo && 
                              ` (${movie.title} - ${showtimeInfo.date} ${showtimeInfo.time})`}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="payment-method-section">
                    <label htmlFor="payment-method">Payment Method:</label>
                    <input
                      type="text"
                      id="payment-method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      placeholder="Enter payment method"
                    />
                  </div>
                </>
              ) : (
                <div className="seat-warning">
                  You don't have any booked seats. Please purchase a ticket first.
                </div>
              )
            ) : (
              <div className="seat-warning">
                Please log in to see your available seats.
              </div>
            )}
  
            <ul>
              {Object.entries(cart).map(([id, qty]) => {
                const itemId = parseInt(id);
                const item = foodItems.find((i) => i.id === itemId);
                if (!item) return null;
                return (
                  <li key={id} className="cart-item">
                    <span>{item.name}</span>
                    <div className="cart-item-controls">
                      <span>= ${(item.price * qty).toFixed(2)}</span>
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            setCart((prev) => {
                              const newQty = Math.max(
                                (prev[itemId] || 0) - 1,
                                0
                              );
                              if (newQty === 0) {
                                const updated = { ...prev };
                                delete updated[itemId];
                                return updated;
                              }
                              return { ...prev, [itemId]: newQty };
                            })
                          }
                        >
                          -
                        </button>
                        <span>{qty}</span>
                        <button
                          onClick={() =>
                            setCart((prev) => ({
                              ...prev,
                              [itemId]: (prev[itemId] || 0) + 1,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="remove-cart-item-btn"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
  
            <div className="cart-total">
              Total: $
              {Object.entries(cart)
                .reduce((total, [id, qty]) => {
                  const itemId = parseInt(id);
                  const item = foodItems.find((i) => i.id === itemId);
                  return item ? total + item.price * qty : total;
                }, 0)
                .toFixed(2)}
            </div>
  
            <button
              className="close-cart-btn"
              onClick={() => setShowCart(false)}
            >
              Close
            </button>
            
            <button
              className={`checkout-btn ${
                availableSeats.length === 0 || !selectedSeatId ? 'disabled' : ''
              }`}
              onClick={handleCheckout}
              disabled={
                availableSeats.length === 0 || 
                !selectedSeatId || 
                isCheckingOut ||
                Object.keys(cart).length === 0
              }
            >
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>
  
            {availableSeats.length === 0 && currentUser && (
              <p className="seat-warning">
                You need to have a booked seat to place an order
              </p>
            )}
          </div>
        </div>
      )}
  
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default Food;