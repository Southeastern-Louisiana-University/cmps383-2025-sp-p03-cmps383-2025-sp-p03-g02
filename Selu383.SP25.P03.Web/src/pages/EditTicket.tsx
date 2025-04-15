import React, { useState, useEffect } from "react";
import "../styles/EditShowTimes.css";

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
  row: number;
  column: number;
}

interface TheaterDto {
  id: number;
  name: string;
}

interface MovieDto {
  id: number;
  title: string;
}

export function AddTicketForm() {
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [showtimes, setShowtimes] = useState<ShowtimeDto[]>([]);
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [theaters, setTheaters] = useState<TheaterDto[]>([]);
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [userId, setUserId] = useState<number | "">(""); // Will be set dynamically from logged-in user
  const [showtimeId, setShowtimeId] = useState<number | "">("");
  const [seatId, setSeatId] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUserId(currentUser); // Set the user ID

    fetchShowtimes();
    fetchSeats();
    fetchTheaters();
    fetchMovies();
    fetchTickets(); 
  }, []);

  const getCurrentUser = () => {
    return 1; // Example: assuming user ID 1 is logged in
  };

  const fetchShowtimes = () => {
    fetch("api/showtimes")
      .then((response) => response.json())
      .then((data: ShowtimeDto[]) => setShowtimes(data))
      .catch(() => setFormError("Failed to fetch showtimes"));
  };

  const fetchSeats = () => {
    fetch("api/seats")
      .then((response) => response.json())
      .then((data: SeatDto[]) => setSeats(data))
      .catch(() => setFormError("Failed to fetch seats"));
  };

  const fetchTheaters = () => {
    fetch("api/theaters")
      .then((response) => response.json())
      .then((data: TheaterDto[]) => setTheaters(data))
      .catch(() => setFormError("Failed to fetch theaters"));
  };

  const fetchMovies = () => {
    fetch("api/movie")
      .then((response) => response.json())
      .then((data: MovieDto[]) => setMovies(data))
      .catch(() => setFormError("Failed to fetch movies"));
  };

  const fetchTickets = () => {
    fetch("api/tickets")
      .then((response) => response.json())
      .then((data: TicketDto[]) => setTickets(data))
      .catch(() => setFormError("Failed to fetch tickets"));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setLoading(true);

    const ticket = {
      userId: userId === "" ? 0 : Number(userId),
      showtimeId: showtimeId === "" ? 0 : Number(showtimeId),
      seatId: seatId === "" ? 0 : Number(seatId),
      paymentMethod: paymentMethod,
    };

    fetch("api/tickets", {
      method: "POST",
      body: JSON.stringify(ticket),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setTickets((prevTickets) => [...prevTickets, data]); 
        resetForm();
      })
      .catch(() => setFormError("Failed to create ticket"))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setUserId("");
    setShowtimeId("");
    setSeatId("");
    setPaymentMethod("");
  };

  const formatShowtimeDate = (showtimeDate: string) => {
    const dateTime = new Date(showtimeDate);
    const date = dateTime.toLocaleDateString();
    const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const renderSeatGrid = () => {
    const rows = 7; // Adjust based on your theater's row count
    const columns = 10; // Adjust based on your theater's column count
    const seatGrid = [];
    for (let row = 1; row <= rows; row++) {
      const seatRow = [];
      for (let col = 1; col <= columns; col++) {
        const seat = seats.find((s) => s.row === row && s.column === col);
        if (seat) {
          seatRow.push(
            <button
              key={seat.id}
              className={`seat ${seat.isBooked ? "booked" : "available"}`}
              onClick={() => handleSeatClick(seat)}
              disabled={seat.isBooked}
            >
              {seat.row}-{seat.column}
            </button>
          );
        }
      }
      seatGrid.push(
        <div key={row} className="seat-row">
          {seatRow}
        </div>
      );
    }
    return seatGrid;
  };

  const handleSeatClick = (seat: SeatDto) => {
    setSeatId(seat.id); 
  };

  return (
    <div className="ticket-form">
      <h1>Manage Tickets</h1>
      <form className="form-example" onSubmit={handleFormSubmit}>
        <div className="form-example">
          <label htmlFor="userId">User ID: </label>
          <input
            type="number"
            name="userId"
            id="userId"
            required
            value={userId}
            onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : "")}
          />
        </div>

        <div className="form-example">
          <label htmlFor="showtimeId">Showtime: </label>
          <select
            name="showtimeId"
            id="showtimeId"
            required
            value={showtimeId}
            onChange={(e) => setShowtimeId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">Select Showtime</option>
            {showtimes.map((showtime) => {
              const movie = movies.find((movie) => movie.id === showtime.movieId);
              return (
                <option key={showtime.id} value={showtime.id}>
                  {movie?.title} - {showtime.showDate} {showtime.showTime}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-example">
          <label htmlFor="seatId">Seat: </label>
          <div className="seat-grid">{renderSeatGrid()}</div>
        </div>

        <div className="form-example">
          <label htmlFor="paymentMethod">Payment Method: </label>
          <input
            type="text"
            name="paymentMethod"
            id="paymentMethod"
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>

        {formError ? <p style={{ color: "red" }}>{formError}</p> : null}

        <div className="form-example">
          <input
            type="submit"
            value={loading ? "Loading..." : "Create Ticket"}
            disabled={loading}
          />
        </div>
      </form>

      <h2>Tickets List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Showtime</th>
            <th>Seat</th>
            <th>Payment Method</th>
            <th>Theater</th>
            <th>Ticket Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            const showtime = showtimes.find((s) => s.id === ticket.showtimeId);
            const theater = showtime ? theaters.find((t) => t.id === showtime.theaterId) : undefined;
            const movie = showtime ? movies.find((m) => m.id === showtime.movieId) : undefined;
            const { date, time } = showtime ? formatShowtimeDate(showtime.showDate) : { date: "", time: "" };
            return (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.userId}</td>
                <td>{movie?.title} - {date} {time}</td>
                <td>{ticket.seatId}</td>
                <td>{ticket.paymentMethod}</td>
                <td>{theater?.name}</td>
                <td>${showtime?.ticketPrice?.toFixed(2)}</td>
                <td>
                  <button onClick={() => alert("Ticket edited")}>Edit</button>
                  <button onClick={() => alert("Ticket deleted")}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
