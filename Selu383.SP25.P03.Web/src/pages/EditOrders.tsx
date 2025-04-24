import React, { useState, useEffect } from "react";
import "../styles/EditOrders.css";

interface OrderDto {
  id: number;
  userId: number;
  seatId: number;
  foodItemId: number;
  quantity: number;
  paymentMethod: string;
  totalPrice: number;
  status: string;
}

interface SeatDto {
  id: number;
  seatNumber: string;
  showtimeId: number;
}

interface FoodItemDto {
  id: number;
  name: string;
}

interface ShowtimeDto {
  id: number;
  movieId: number;
  theaterId: number;
  showtimeDate: string;
}

interface TheaterDto {
  id: number;
  name: string;
}

interface MovieDto {
  id: number;
  title: string;
}

const ViewOrdersPage = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItemDto[]>([]);
  const [showtimes, setShowtimes] = useState<ShowtimeDto[]>([]);
  const [theaters, setTheaters] = useState<TheaterDto[]>([]);
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchWithErrorHandling = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      return await response.json();
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [ordersData, seatsData, foodData, showtimesData, theatersData, moviesData] = await Promise.all([
          fetchWithErrorHandling("/api/orders"),
          fetchWithErrorHandling("/api/seats"),
          fetchWithErrorHandling("/api/fooditem"),
          fetchWithErrorHandling("/api/showtimes"),
          fetchWithErrorHandling("/api/theaters"),
          fetchWithErrorHandling("/api/movie")
        ]);

        setOrders(ordersData);
        setSeats(seatsData);
        setFoodItems(foodData);
        setShowtimes(showtimesData);
        setTheaters(theatersData);
        setMovies(moviesData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete order");
      }
      
      setOrders(orders.filter(order => order.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while deleting");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    setLoading(true);
    try {
      const orderToUpdate = orders.find(order => order.id === id);
      if (!orderToUpdate) {
        throw new Error("Order not found");
      }

      const updatedOrder = {
        ...orderToUpdate,
        status: newStatus
      };

      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedOrder)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update order status");
      }
      
      const updatedOrderData = await response.json();
      setOrders(orders.map(order => 
        order.id === id ? updatedOrderData : order
      ));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while updating status");
      }
    } finally {
      setLoading(false);
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

  const getSeatInfo = (seatId: number) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return `Seat (${seatId})`;
    
    const showtime = showtimes.find(s => s.id === seat.showtimeId);
    if (!showtime) return `${seat.seatNumber} (No Showtime)`;
    
    const theater = theaters.find(t => t.id === showtime.theaterId);
    const movie = movies.find(m => m.id === showtime.movieId);
    const showtimeInfo = formatShowtimeDate(showtime.showtimeDate);
    
    return `${seat.seatNumber} (${theater?.name || 'Unknown Theater'}) - ${movie?.title || 'Unknown Movie'} - ${showtimeInfo.date} ${showtimeInfo.time}`;
  };

  const getFoodName = (foodItemId: number) => {
    const food = foodItems.find(f => f.id === foodItemId);
    return food ? food.name : `Item (${foodItemId})`;
  };

  const filteredOrders = statusFilter === "All" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="orders-container">
      <h1>Order Management</h1>
      
      <div className="filter-controls">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Seat (Theater - Movie - Showtime)</th>
            <th>Food Item</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userId}</td>
              <td>{getSeatInfo(order.seatId)}</td>
              <td>{getFoodName(order.foodItemId)}</td>
              <td>{order.quantity}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>{order.paymentMethod}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={loading}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <button 
                  onClick={() => handleDelete(order.id)}
                  disabled={loading}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewOrdersPage;