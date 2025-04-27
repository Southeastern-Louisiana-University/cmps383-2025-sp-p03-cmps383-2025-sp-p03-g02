import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import "../styles/EditBookings.css";

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
  showDate: string;
  showTime: string;
  showtimeDate: string;
  ticketPrice: number;
  theaterId: number;
}

interface SeatDto {
  id: number;
  isBooked: boolean;
  showtimeId: number;
  seatNumber: string;
}

interface TheaterDto {
  id: number;
  name: string;
}

interface MovieDto {
  id: number;
  title: string;
}

const groupTickets = (tickets: TicketDto[]) => {
  const groups: Record<string, TicketDto[]> = {};

  tickets.forEach(ticket => {
    const key = `${ticket.userId}-${ticket.showtimeId}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(ticket);
  });

  return Object.values(groups);
};

const ViewBookingsPage = () => {
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [showtimes, setShowtimes] = useState<ShowtimeDto[]>([]);
  const [theaters, setTheaters] = useState<TheaterDto[]>([]);
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      
      try {
        const fetchTickets = async () => {
          const response = await fetch("/api/tickets");
          if (!response.ok) throw new Error("Failed to fetch tickets");
          return await response.json();
        };

        const fetchShowtimes = async () => {
          const response = await fetch("/api/showtimes");
          if (!response.ok) throw new Error("Failed to fetch showtimes");
          return await response.json();
        };

        const fetchTheaters = async () => {
          const response = await fetch("/api/theaters");
          if (!response.ok) throw new Error("Failed to fetch theaters");
          return await response.json();
        };

        const fetchMovies = async () => {
          const response = await fetch("/api/movie");
          if (!response.ok) throw new Error("Failed to fetch movies");
          return await response.json();
        };

        const fetchSeats = async () => {
          const response = await fetch("/api/seats");
          if (!response.ok) throw new Error("Failed to fetch seats");
          return await response.json();
        };

        const [ticketsData, showtimesData, theatersData, moviesData, seatsData] = await Promise.all([
          fetchTickets(),
          fetchShowtimes(),
          fetchTheaters(),
          fetchMovies(),
          fetchSeats()
        ]);

        setTickets(ticketsData);
        setShowtimes(showtimesData);
        setTheaters(theatersData);
        setMovies(moviesData);
        setSeats(seatsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatShowtimeDate = (showtime: ShowtimeDto) => {
    try {
      const dateStr = showtime.showtimeDate || `${showtime.showDate}T${showtime.showTime}`;
      const date = new Date(dateStr);
      
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      const formattedTime = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      return { date: formattedDate, time: formattedTime };
    } catch (error) {
      console.error("Error formatting showtime date:", error);
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  };

  const getShowtimeInfo = (showtimeId: number) => {
    const showtime = showtimes.find(s => s.id === showtimeId);
    if (!showtime) return { movie: 'Unknown', theater: 'Unknown', date: 'Unknown', time: 'Unknown', ticketPrice: 0 };
    
    const theater = theaters.find(t => t.id === showtime.theaterId);
    const movie = movies.find(m => m.id === showtime.movieId);
    const { date, time } = formatShowtimeDate(showtime);
    
    return {
      movie: movie?.title || 'Unknown Movie',
      theater: theater?.name || 'Unknown Theater',
      date,
      time,
      ticketPrice: showtime.ticketPrice
    };
  };

  const getSeatNumbers = (tickets: TicketDto[]) => {
    return tickets.map(ticket => {
      const seat = seats.find(s => s.id === ticket.seatId);
      return seat ? seat.seatNumber : `Seat ${ticket.seatId}`;
    }).join(", ");
  };

  const calculateTotalPrice = (tickets: TicketDto[]) => {
    if (tickets.length === 0) return 0;
    const showtime = showtimes.find(s => s.id === tickets[0].showtimeId);
    return tickets.length * (showtime?.ticketPrice || 0);
  };

  const toggleExpandGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const generateGroupQRData = (tickets: TicketDto[]) => {
    const showtimeInfo = getShowtimeInfo(tickets[0].showtimeId);
    const seatNumbers = tickets.map(ticket => 
      seats.find(s => s.id === ticket.seatId)?.seatNumber || `Seat ${ticket.seatId}`
    ).join(", ");

    return JSON.stringify({
      groupId: `${tickets[0].userId}-${tickets[0].showtimeId}`,
      movie: showtimeInfo.movie,
      theater: showtimeInfo.theater,
      showtime: `${showtimeInfo.date} ${showtimeInfo.time}`,
      seats: seatNumbers,
      totalTickets: tickets.length,
      totalPrice: calculateTotalPrice(tickets),
      ticketIds: tickets.map(t => t.id)
    });
  };

  const ticketGroups = groupTickets(tickets);

  if (loading) return <div className="loading">Loading tickets...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tickets-management-container">
      <h1>Tickets Management</h1>
      
      <table className="tickets-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Movie</th>
            <th>Theater</th>
            <th>Showtime</th>
            <th>Tickets</th>
            <th>Seats</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {ticketGroups.map((group, index) => {
            const groupId = `${group[0].userId}-${group[0].showtimeId}-${index}`;
            const showtimeInfo = getShowtimeInfo(group[0].showtimeId);
            const totalPrice = calculateTotalPrice(group);
            const seatNumbers = getSeatNumbers(group);
            
            return (
              <React.Fragment key={groupId}>
                <tr>
                  <td>{group[0].userId}</td>
                  <td>{showtimeInfo.movie}</td>
                  <td>{showtimeInfo.theater}</td>
                  <td>{showtimeInfo.date} {showtimeInfo.time}</td>
                  <td>{group.length}</td>
                  <td>{seatNumbers}</td>
                  <td>${totalPrice.toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => toggleExpandGroup(groupId)}
                      className="generate-tickets-btn"
                    >
                      {expandedGroup === groupId ? 'Hide Tickets' : 'Show Tickets'}
                    </button>
                  </td>
                </tr>
                {expandedGroup === groupId && (
                  <tr className="tickets-row">
                    <td colSpan={8}>
                      <div className="tickets-container">
                        <h4>Tickets for {showtimeInfo.movie} on {showtimeInfo.date}</h4>
                        <div className="group-ticket">
                          <div className="group-ticket-info">
                            <h5>{showtimeInfo.movie}</h5>
                            <p><strong>Theater:</strong> {showtimeInfo.theater}</p>
                            <p><strong>Showtime:</strong> {showtimeInfo.date} {showtimeInfo.time}</p>
                            <p><strong>Seats:</strong> {seatNumbers}</p>
                            <p><strong>Total Tickets:</strong> {group.length}</p>
                            <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
                            <p><strong>User ID:</strong> {group[0].userId}</p>
                          </div>
                          <div className="group-ticket-qr">
                            <QRCodeSVG 
                              value={generateGroupQRData(group)}
                              size={180}
                              level="H"
                              includeMargin={true}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ViewBookingsPage;