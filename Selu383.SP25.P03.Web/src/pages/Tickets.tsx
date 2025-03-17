import "../styles/Tickets.css"; 

const tickets = [
    {
        id: 1,
        movie: "The Dark Knight",
        theater: "Lion's Den Uptown",
        date: "March 15, 2025",
        time: "7:30 PM",
        seats: ["G7", "G8"]
    },
    {
        id: 2,
        movie: "Inception",
        theater: "Lion's Den Downtown",
        date: "March 22, 2025",
        time: "8:00 PM",
        seats: ["D5"]
    }
];

const Tickets = () => {
    return (
        <div className="tickets-container">
            <h1 className="tickets-title">My Tickets</h1>
            <div className="tickets-list">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-item">
                        <h2>{ticket.movie}</h2>
                        <p className="ticket-theater">{ticket.theater}</p>
                        <p className="ticket-date-and-time">{ticket.date} • {ticket.time}</p>
                        <p className="ticket-date-and-time">Seats: <strong>{ticket.seats.join(", ")}</strong></p>
                        <button className="view-ticket-btn">View Ticket</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tickets;
