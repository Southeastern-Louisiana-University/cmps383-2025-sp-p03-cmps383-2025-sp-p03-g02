import React, { useState, useEffect } from "react";
import "../styles/EditTicket.css";

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

export function AddTicketForm() {
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [showtimes, setShowtimes] = useState<ShowtimeDto[]>([]);
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [theaters, setTheaters] = useState<TheaterDto[]>([]);
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [userId, setUserId] = useState<number | "">("");            //placeholder do prop
  const [showtimeId, setShowtimeId] = useState<number | "">("");
  const [seatId, setSeatId] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState<"add" | "edit">("add");
  const [editingTicketId, setEditingTicketId] = useState<number | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();    
    setUserId(currentUser);

    fetchShowtimes();
    fetchSeats();
    fetchTheaters();
    fetchMovies();
    fetchTickets();
  }, []);

  const getCurrentUser = () => {            //placeholder
    return 1;
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

  const updateSeatBooking = async (seatId: number, isBooked: boolean) => {
    try {
      const seat = seats.find((s) => s.id === seatId);
      if (!seat) {
        throw new Error("Seat not found");
      }
      const response = await fetch(`api/seats/${seatId}`, {
        method: "PUT",
        body: JSON.stringify({
          id: seatId,
          isBooked,
          showtimeId: seat.showtimeId,
          seatNumber: seat.seatNumber,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update seat booking: ${errorText}`);
      }
      await fetchSeats();
    } catch (error: any) {
      setFormError(error.message || "Failed to update seat booking");
      throw error;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setLoading(true);

    await fetchSeats();

    const ticket = {
      userId: userId === "" ? 0 : Number(userId),
      showtimeId: showtimeId === "" ? 0 : Number(showtimeId),
      seatId: seatId === "" ? 0 : Number(seatId),
      paymentMethod: paymentMethod,
    };

    try {
      if (operation === "edit" && editingTicketId) {
        const oldTicket = tickets.find((t) => t.id === editingTicketId);
        if (oldTicket && oldTicket.seatId !== ticket.seatId) {
          await updateSeatBooking(oldTicket.seatId, false);
        }
        await updateSeatBooking(ticket.seatId, true);

        const response = await fetch(`api/tickets/${editingTicketId}`, {
          method: "PUT",
          body: JSON.stringify(ticket),
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          if (oldTicket && oldTicket.seatId !== ticket.seatId) {
            await updateSeatBooking(ticket.seatId, false);
            await updateSeatBooking(oldTicket.seatId, true);
          }
          const errorText = await response.text();
          throw new Error(`Failed to update ticket: ${errorText}`);
        }
        const updatedTicket = await response.json();
        setTickets((prevTickets) =>
          prevTickets.map((t) =>
            t.id === editingTicketId ? updatedTicket : t
          )
        );
      } else {
        const selectedSeat = seats.find((s) => s.id === ticket.seatId);
        if (!selectedSeat) {
          throw new Error("Selected seat not found");
        }
        if (selectedSeat.isBooked) {
          throw new Error("Selected seat is already booked");
        }

        const response = await fetch("api/tickets", {
          method: "POST",
          body: JSON.stringify(ticket),
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create ticket: ${errorText}`);
        }
        const newTicket = await response.json();
        setTickets((prevTickets) => [...prevTickets, newTicket]);
        await fetchSeats();
      }
      resetForm();
    } catch (error: any) {
      setFormError(error.message || `Failed to ${operation === "add" ? "create" : "update"} ticket`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ticket: TicketDto) => {
    setOperation("edit");
    setEditingTicketId(ticket.id || null);
    setUserId(ticket.userId);
    setShowtimeId(ticket.showtimeId);
    setSeatId(ticket.seatId);
    setPaymentMethod(ticket.paymentMethod);
  };

  const handleDelete = async (ticketId: number, seatId: number) => {
    if (loading) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      await updateSeatBooking(seatId, false);
      const response = await fetch(`api/tickets/${ticketId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete ticket: ${errorText}`);
      }
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== ticketId)
      );
    } catch (error: any) {
      setFormError(error.message || "Failed to delete ticket");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOperation("add");
    setEditingTicketId(null);
    setUserId("");
    setShowtimeId("");
    setSeatId("");
    setPaymentMethod("");
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

  return (
    <div className="ticket-form">
      <h1>Manage Tickets</h1>
      <div className="form-example">
        <label htmlFor="operation">Operation: </label>
        <select
          id="operation"
          value={operation}
          onChange={(e) => setOperation(e.target.value as "add" | "edit")}
        >
          <option value="add">Add Ticket</option>
          <option value="edit">Edit Ticket</option>
        </select>
      </div>

      <form className="form-example" onSubmit={handleFormSubmit}>
        <div className="form-example">
          <label htmlFor="userId">User ID: </label>
          <input
            type="number"
            name="userId"
            id="userId"
            required
            value={userId}
            onChange={(e) =>
              setUserId(e.target.value ? Number(e.target.value) : "")
            }
          />
        </div>

        <div className="form-example">
          <label htmlFor="showtimeId">Showtime: </label>
          <select
            name="showtimeId"
            id="showtimeId"
            required
            value={showtimeId}
            onChange={(e) =>
              setShowtimeId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">Select Showtime</option>
            {showtimes.map((showtime) => {
              const movie = movies.find(
                (movie) => movie.id === showtime.movieId
              );
              const { date, time } = formatShowtimeDate(showtime.showtimeDate);
              return (
                <option key={showtime.id} value={showtime.id}>
                  {movie?.title} - {date} {time}
                </option>
              );
            })}
          </select>
        </div>

        {showtimeId !== "" && (
          <div className="form-example">
            <label>Seat: </label>
            <div className="grid-container">
              {seats
                .filter((seat) => seat.showtimeId === showtimeId)
                .map((seat) => (
                  <div
                    key={seat.id}
                    className={`seat-block ${
                      seat.isBooked ? "booked" : "available"
                    } ${seatId === seat.id ? "selected" : ""}`}
                    onClick={() => {
                      if (!seat.isBooked) {
                        setSeatId(seat.id);
                      }
                    }}
                  >
                    {seat.seatNumber}
                  </div>
                ))}
            </div>
          </div>
        )}

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

        {formError && <p style={{ color: "red" }}>{formError}</p>}

        <div className="form-example">
          <input
            type="submit"
            value={
              loading
                ? "Loading..."
                : operation === "add"
                ? "Create Ticket"
                : "Update Ticket"
            }
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
            const theater = showtime
              ? theaters.find((t) => t.id === showtime.theaterId)
              : undefined;
            const movie = showtime
              ? movies.find((m) => m.id === showtime.movieId)
              : undefined;
            const seat = seats.find((s) => s.id === ticket.seatId);
            const { date, time } = showtime
              ? formatShowtimeDate(showtime.showtimeDate)
              : { date: "", time: "" };
            return (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.userId}</td>
                <td>
                  {movie?.title} - {date} {time}
                </td>
                <td>
                  {seat ? `${seat.seatNumber} (ID: ${ticket.seatId})` : ticket.seatId}
                </td>
                <td>{ticket.paymentMethod}</td>
                <td>{theater?.name}</td>
                <td>${showtime?.ticketPrice?.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(ticket)}>Edit</button>
                  <button
                    onClick={() => ticket.id && handleDelete(ticket.id, ticket.seatId)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}