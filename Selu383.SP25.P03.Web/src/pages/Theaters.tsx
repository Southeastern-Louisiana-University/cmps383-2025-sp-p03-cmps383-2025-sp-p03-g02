import "../styles/Theaters.css"; 

const theaters = [
    {
        id: 1,
        name: "Lion's Den Uptown",
        address: "123 Main St, Anytown, USA",
        distance: "1.2 mi away"
    },
    {
        id: 2,
        name: "Lion's Den Downtown",
        address: "456 Broadway, Anytown, USA",
        distance: "3.5 mi away"
    },
    {
        id: 3,
        name: "Lion's Den West Side",
        address: "789 Sunset Blvd, Anytown, USA",
        distance: "5.8 mi away"
    }
];

const Theaters = () => {
    return (
        <div className="theaters-container">
            <h1 className="theaters-title">Our Theaters</h1>
            <div className="theaters-list">
                {theaters.map((theater) => (
                    <div key={theater.id} className="theater-item">
                        <h2>{theater.name}</h2>
                        <p className="theater-address">{theater.address}</p>
                        <p className="theater-distance">{theater.distance}</p>
                        <button className="view-showtimes-btn">View Showtimes</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Theaters;
