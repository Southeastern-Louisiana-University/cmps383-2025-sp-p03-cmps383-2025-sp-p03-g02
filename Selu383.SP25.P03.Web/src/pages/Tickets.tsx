import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import "../styles/Tickets.css";
import { UserDto } from "../models/UserDto";

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
      ticketPrice: showtime?.ticketPrice || 0,
    };
  };

  const getSeatNumber = (seatId: number) => {
    const seat = seats.find((s) => s.id === seatId);
    return seat?.seatNumber || `Seat ${seatId}`;
  };

  const groupTickets = (tickets: TicketDto[]) => {
    const groups: Record<string, TicketDto[]> = {};

    tickets.forEach((ticket) => {
      const key = `${ticket.userId}-${ticket.showtimeId}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(ticket);
    });

    return Object.values(groups);
  };

  if (loading) return <div className="loading">Loading tickets...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!currentUser)
    return <div className="error">Please sign in to view your tickets.</div>;

  const userTickets = tickets.filter(
    (ticket) => ticket.userId === Number(currentUser.id)
  );
  const ticketGroups = groupTickets(userTickets);

  return (
    <div className="tickets-container">
      <h1 className="tickets-title">My Tickets</h1>
      <div className="tickets-list">
        {ticketGroups.length === 0 ? (
          <div className="no-tickets-message">No tickets yet.</div>
        ) : (
          ticketGroups.map((group, index) => {
            const { movieTitle, theaterName, date, time, ticketPrice } =
              getShowtimeInfo(group[0].showtimeId);
            const seatNumbers = group
              .map((ticket) => getSeatNumber(ticket.seatId))
              .join(", ");
            const totalPrice = ticketPrice * group.length;

            const qrData = JSON.stringify({
              groupId: `${group[0].userId}-${group[0].showtimeId}`,
              movie: movieTitle,
              theater: theaterName,
              date,
              time,
              seats: seatNumbers,
              totalTickets: group.length,
              totalPrice: totalPrice.toFixed(2),
              ticketIds: group.map((t) => t.id),
            });

            return (
              <div key={index} className="ticket-item">
                <h2>{movieTitle}</h2>
                <p className="ticket-theater">{theaterName}</p>
                <p className="ticket-date-and-time">
                  {date} • {time}
                </p>
                <p className="ticket-date-and-time">
                  Seats: <strong>{seatNumbers}</strong>
                </p>
                <p className="ticket-date-and-time">
                  Total Price: <strong>${totalPrice.toFixed(2)}</strong>
                </p>
                <div className="ticket-qr">
                  <QRCodeSVG
                    value={qrData}
                    size={180}
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
