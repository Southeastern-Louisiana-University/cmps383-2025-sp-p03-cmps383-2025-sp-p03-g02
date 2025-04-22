import "../styles/Movies.css";
import { useState, useEffect } from "react";

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  category: string; 
}

interface Showtime {
  id: number;
  movieId: number;
  showtimeDate: string;  
  price?: number;  
}

interface Seat {
  id?: number;
  seatNumber: string;
  showtimeId: number;
  isBooked: boolean;
  isSelected?: boolean;  
}

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [message, setMessage] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [hoveredMovieId, setHoveredMovieId] = useState<number | null>(null);
  
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [bookingComplete, setBookingComplete] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

  
  const DEFAULT_PRICE = 12.50;

  useEffect(() => {
    fetchMovies();
    fetchShowtimes();
  }, []);

  useEffect(() => {
    
    if (selectedShowtime) {
      const price = selectedShowtime.price || DEFAULT_PRICE;
      setTotalPrice(selectedSeats.length * price);
    }
  }, [selectedSeats, selectedShowtime]);

  useEffect(() => {
   
    if (selectedShowtime) {
      fetchSeats(selectedShowtime.id);
    }
  }, [selectedShowtime]);

  const fetchMovies = () => {
    fetch("/api/movie")
      .then((response) => response.json())
      .then((data: Movie[]) => {
        setMovies(data);
        const uniqueCategories = Array.from(new Set(data.map((movie) => movie.category)));
        setCategories(["All", ...uniqueCategories]);
      })
      .catch(() => {
        setMessage("Failed to fetch movies.");
        setShowMessage(true);
      });
  };

  const fetchShowtimes = () => {
    fetch("/api/showtimes")
      .then((response) => response.json())
      .then((data: Showtime[]) => {
        
        const showtimesWithPrices = data.map(showtime => {
          if (!showtime.price) {
           
            const date = new Date(showtime.showtimeDate);
            const hour = date.getHours();
            let price = DEFAULT_PRICE;
            
            
            if (hour < 12) price = 8.50;      
            else if (hour < 17) price = 10.50; 
            else price = 12.50;                
            
            return { ...showtime, price };
          }
          return showtime;
        });
        
        setShowtimes(showtimesWithPrices);
      })
      .catch(() => {
        setMessage("Failed to fetch showtimes.");
        setShowMessage(true);
      });
  };

  const fetchSeats = (showtimeId: number) => {
    fetch("/api/seats")
      .then((response) => response.json())
      .then((data: Seat[]) => {
        
        const showtimeSeats = data
          .filter(seat => seat.showtimeId === showtimeId)
          .map(seat => ({ ...seat, isSelected: false })); 
        
        setSeats(showtimeSeats);
        setSelectedSeats([]);
      })
      .catch(() => {
        setMessage("Failed to fetch seats.");
        setShowMessage(true);
      });
  };

  const handleButtonClick = (action: string, title: string) => {
    setMessage(`${action} for "${title}"`);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const openBookingModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowBookingModal(true);
    
    
    const movieShowtimes = showtimes.filter(st => st.movieId === movie.id);
    if (movieShowtimes.length > 0) {
      setSelectedShowtime(movieShowtimes[0]);
      
    } else {
      setSeats([]);
      setSelectedSeats([]);
    }
    
    setBookingComplete(false);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  const handleSeatClick = (clickedSeat: Seat) => {
    if (clickedSeat.isBooked) return; 
    setSeats(seats.map(seat => {
      if (seat.id === clickedSeat.id) {
        const isSelected = !seat.isSelected;
        
     
        if (isSelected) {
          setSelectedSeats([...selectedSeats, seat]);
        } else {
          setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        }
        
        return { ...seat, isSelected };
      }
      return seat;
    }));
  };
  
  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      setMessage("Please select at least one seat");
      setShowMessage(true);
      return;
    }
    
    
    const seatsToUpdate = selectedSeats.map(seat => ({
      ...seat,
      isBooked: true,
      isSelected: false
    }));
    
  
    Promise.all(seatsToUpdate.map(seat => 
      fetch(`/api/seats/${seat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seat)
      })
    ))
    .then(() => {
      
      setSeats(seats.map(seat => {
        if (selectedSeats.some(selected => selected.id === seat.id)) {
          return { ...seat, isBooked: true, isSelected: false };
        }
        return seat;
      }));
      
      setSelectedSeats([]);
      setBookingComplete(true);
      
      setMessage(`Successfully booked tickets for "${selectedMovie?.title}"`);
      setShowMessage(true);
  
      setTimeout(() => {
        setBookingComplete(false);
        setShowMessage(false);
      }, 3000);
    })
    .catch(() => {
      setMessage("Failed to book seats. Please try again.");
      setShowMessage(true);
    });
  };

  const renderSeats = () => {
    
    const seatsByRow: Record<string, Seat[]> = {};
    
    seats.forEach(seat => {
   
      const row = seat.seatNumber.charAt(0);
      if (!seatsByRow[row]) {
        seatsByRow[row] = [];
      }
      seatsByRow[row].push(seat);
    });
    
    
    const sortedRows = Object.keys(seatsByRow).sort();
    
    return sortedRows.map(row => (
      <div key={row} className="seat-row">
        <div className="row-label">{row}</div>
        <div className="seats">
          {seatsByRow[row]
            
            .sort((a, b) => {
              const numA = parseInt(a.seatNumber.substring(1));
              const numB = parseInt(b.seatNumber.substring(1));
              return numA - numB;
            })
            .map(seat => (
              <div
                key={seat.id}
                className={`seat ${seat.isBooked ? 'booked' : ''} ${seat.isSelected ? 'selected' : ''}`}
                onClick={() => handleSeatClick(seat)}
              >
                {seat.seatNumber.substring(1)} {}
              </div>
            ))}
        </div>
      </div>
    ));
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredMovies = selectedCategory === "All" ? movies : movies.filter((movie) => movie.category === selectedCategory);

  return (
    <div className="movies-container">
      <h1 className="movies-title">Now Playing</h1>

      {showMessage && <div className="message-popup">{message}</div>}

      {/* Tabs for categories */}
      <div className="movies-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`movies-tab ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="movies-list">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img src={movie.imageUrl} alt={movie.title} className="movie-image" />
            <h2>{movie.title}</h2>
            <div className="movie-actions">
              <button className="buy-tickets-btn" onClick={() => openBookingModal(movie)}>
                Buy Tickets
              </button>
              <button
                className="description-btn"
                onMouseEnter={() => setHoveredMovieId(movie.id)}
                onMouseLeave={() => setHoveredMovieId(null)}
                onClick={() => handleButtonClick("Viewing description", movie.title)}
              >
                Description
                {hoveredMovieId === movie.id && <div className="description-popup">{movie.description}</div>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedMovie && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <button className="close-modal" onClick={closeBookingModal}>×</button>
            
            <div className="movie-info">
              <h2>{selectedMovie.title}</h2>
              <div className="movie-details">
                <img src={selectedMovie.imageUrl} alt={selectedMovie.title} className="movie-poster" />
                <div className="movie-details-text">
                  <p className="movie-description">{selectedMovie.description}</p>
                  <p><strong>Category:</strong> {selectedMovie.category}</p>
                </div>
              </div>
            </div>
            
            <div className="booking-section">
              <h3>Select Showtime</h3>
              <div className="showtimes">
                {showtimes
                  .filter(showtime => showtime.movieId === selectedMovie.id)
                  .map(showtime => {
                    const { date, time } = formatDateTime(showtime.showtimeDate);
                    return (
                      <button
                        key={showtime.id}
                        className={`showtime-btn ${selectedShowtime?.id === showtime.id ? 'active' : ''}`}
                        onClick={() => setSelectedShowtime(showtime)}
                      >
                        {date} - {time} - ${showtime.price?.toFixed(2)}
                      </button>
                    );
                  })}
              </div>
              
              {selectedShowtime && (
                <>
                  <h3>Select your seats</h3>
                  
                  <div className="legend">
                    <div className="legend-item">
                      <div className="seat available"></div>
                      <span>Available</span>
                    </div>
                    <div className="legend-item">
                      <div className="seat selected"></div>
                      <span>Selected</span>
                    </div>
                    <div className="legend-item">
                      <div className="seat booked"></div>
                      <span>Booked</span>
                    </div>
                  </div>
                  
                  <div className="screen">Screen</div>
                  
                  <div className="seating-plan">
                    {seats.length > 0 ? (
                      renderSeats()
                    ) : (
                      <p>No seats available for this showtime.</p>
                    )}
                  </div>
                  
                  <div className="booking-summary">
                    <p>Selected seats: {selectedSeats.map(seat => seat.seatNumber).join(", ") || "None"}</p>
                    <p>Total: ${totalPrice.toFixed(2)}</p>
                    <button 
                      className="book-button" 
                      onClick={handleBooking}
                      disabled={selectedSeats.length === 0}
                    >
                      Book Tickets
                    </button>
                  </div>
                  
                  {bookingComplete && (
                    <div className="booking-complete">
                      <p>Your booking is complete! Enjoy the movie.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;