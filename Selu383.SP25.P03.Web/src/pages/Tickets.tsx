import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import "../styles/Tickets.css";
import { UserDto } from "../models/UserDto"; // <-- important to import your UserDto

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

// Add this interface to define props properly
interface TicketsProps {
  currentUser?: UserDto;
}

const Tickets: React.FC<TicketsProps> = ({ currentUser }) => {
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [showtimes, setShowtimes] = useState<ShowtimeDto[]>([]);
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [theaters, setTheaters] = useState<TheaterDto[]>([]);
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, showtimesRes, moviesRes, theatersRes, seatsRes] =
          await Promise.all([
            fetch("/api/tickets"),
            fetch("/api/showtimes"),
            fetch("/api/movie"),
            fetch("/api/theaters"),
            fetch("/api/seats"),
          ]);

        if (
          !ticketsRes.ok ||
          !showtimesRes.ok ||
          !moviesRes.ok ||
          !theatersRes.ok ||
          !seatsRes.ok
        ) {
          throw new Error("Failed to fetch some data");
        }

        const ticketsData = await ticketsRes.json();
        const showtimesData = await showtimesRes.json();
        const moviesData = await moviesRes.json();
        const theatersData = await theatersRes.json();
        const seatsData = await seatsRes.json();

        setTickets(ticketsData);
        setShowtimes(showtimesData);
        setMovies(moviesData);
        setTheaters(theatersData);
        setSeats(seatsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getShowtimeInfo = (showtimeId: number) => {
    const showtime = showtimes.find((s) => s.id === showtimeId);
    const movie = movies.find((m) => m.id === showtime?.movieId);
    const theater = theaters.find((t) => t.id === showtime?.theaterId);

    const dateObj = showtime?.showtimeDate
      ? new Date(showtime.showtimeDate)
      : new Date(`${showtime?.showDate}T${showtime?.showTime}`);

    return {
      movieTitle: movie?.title || "Unknown Movie",
      theaterName: theater?.name || "Unknown Theater",
      date: dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getSeatNumber = (seatId: number) => {
    const seat = seats.find((s) => s.id === seatId);
    return seat?.seatNumber || `Seat ${seatId}`;
  };

  if (loading) return <div className="loading">Loading tickets...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!currentUser)
    return <div className="error">Please sign in to view your tickets.</div>;

  return (
    <div className="tickets-container">
      <h1 className="tickets-title">My Tickets</h1>
      <div className="tickets-list">
        {tickets.filter((ticket) => ticket.userId === Number(currentUser.id))
          .length === 0 ? (
          <div className="no-tickets-message">No tickets yet.</div>
        ) : (
          tickets
            .filter((ticket) => ticket.userId === Number(currentUser.id))
            .map((ticket) => {
              const { movieTitle, theaterName, date, time } = getShowtimeInfo(
                ticket.showtimeId
              );
              const seatNumber = getSeatNumber(ticket.seatId);

              const qrData = JSON.stringify({
                ticketId: ticket.id,
                movie: movieTitle,
                theater: theaterName,
                date,
                time,
                seat: seatNumber,
              });

              return (
                <div key={ticket.id} className="ticket-item">
                  <h2>{movieTitle}</h2>
                  <p className="ticket-theater">{theaterName}</p>
                  <p className="ticket-date-and-time">
                    {date} • {time}
                  </p>
                  <p className="ticket-date-and-time">
                    Seat: <strong>{seatNumber}</strong>
                  </p>
                  <div className="ticket-qr">
                    <QRCodeSVG
                      value={qrData}
                      size={128}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default Tickets;
