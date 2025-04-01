import React, { useState, useEffect } from "react";
import "../styles/EditTicket.css";

interface TicketDto {
  id?: number;
  showtimeId: number;
  userId: number;
  seatNumber: number;
  ticketPrice: number;
  purchaseDate: string;
  theaterId: number;
}

export function AddTicketForm() {
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [showtimeId, setShowtimeId] = useState(0);
  const [userId, setUserId] = useState(0);
  const [seatNumber, setSeatNumber] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [theaterId, setTheaterId] = useState(0);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState("add");
  const [selectedTicket, setSelectedTicket] = useState<TicketDto | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    fetch("api/tickets")
      .then((response) => response.json())
      .then((data: TicketDto[]) => setTickets(data))
      .catch(() => {
        setFormError("Failed to fetch tickets.");
      });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setLoading(true);

    const ticket = { showtimeId, userId, seatNumber, ticketPrice, purchaseDate, theaterId };

    if (operation === "add") {
      fetch("api/tickets", {
        method: "POST",
        body: JSON.stringify(ticket),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          setTickets([...tickets, data]);
          resetForm();
        })
        .catch(() => setFormError("Failed to add ticket"))
        .finally(() => setLoading(false));
    } else if (operation === "edit" && selectedTicket?.id) {
      fetch(`api/tickets/${selectedTicket.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...ticket, id: selectedTicket.id }),
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          const updatedTickets = tickets.map((item) =>
            item.id === selectedTicket.id ? { ...selectedTicket, ...ticket } : item
          );
          setTickets(updatedTickets);
          resetForm();
        })
        .catch(() => setFormError("Failed to update ticket"))
        .finally(() => setLoading(false));
    }
  };

  const handleDelete = (id: number) => {
    fetch(`api/tickets/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTickets(tickets.filter((item) => item.id !== id));
      })
      .catch(() => setFormError("Failed to delete ticket"));
  };

  const resetForm = () => {
    setShowtimeId(0);
    setUserId(0);
    setSeatNumber(0);
    setTicketPrice(0);
    setPurchaseDate("");
    setTheaterId(0);
    setSelectedTicket(null);
    setOperation("add");
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label>Select Operation:</label>
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="add">Add Ticket</option>
          <option value="edit">Edit Ticket</option>
        </select>
        
        <label>Showtime ID:</label>
        <input type="number" value={showtimeId} onChange={(e) => setShowtimeId(Number(e.target.value))} required />
        
        <label>User ID:</label>
        <input type="number" value={userId} onChange={(e) => setUserId(Number(e.target.value))} required />
        
        <label>Seat Number:</label>
        <input type="number" value={seatNumber} onChange={(e) => setSeatNumber(Number(e.target.value))} required />
        
        <label>Ticket Price:</label>
        <input type="number" step="0.01" value={ticketPrice} onChange={(e) => setTicketPrice(Number(e.target.value))} required />
        
        <label>Purchase Date:</label>
        <input type="datetime-local" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
        
        <label>Theater ID:</label>
        <input type="number" value={theaterId} onChange={(e) => setTheaterId(Number(e.target.value))} required />
        
        {formError && <p style={{ color: "red" }}>{formError}</p>}
        
        <button type="submit" disabled={loading}>{loading ? "Loading..." : operation === "add" ? "Add Ticket" : "Update Ticket"}</button>
      </form>

      <h2>Ticket List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Showtime ID</th>
            <th>User ID</th>
            <th>Seat Number</th>
            <th>Price</th>
            <th>Purchase Date</th>
            <th>Theater ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.showtimeId}</td>
              <td>{ticket.userId}</td>
              <td>{ticket.seatNumber}</td>
              <td>${ticket.ticketPrice.toFixed(2)}</td>
              <td>{ticket.purchaseDate}</td>
              <td>{ticket.theaterId}</td>
              <td>
                <button onClick={() => { setOperation("edit"); setSelectedTicket(ticket); setShowtimeId(ticket.showtimeId); setUserId(ticket.userId); setSeatNumber(ticket.seatNumber); setTicketPrice(ticket.ticketPrice); setPurchaseDate(ticket.purchaseDate); setTheaterId(ticket.theaterId); }}>Edit</button>
                <button onClick={() => ticket.id && handleDelete(ticket.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
