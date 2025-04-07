import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Theaters.css";

// Define the Theater type
interface Theater {
  id: string;
  name: string;
  address: string;
  distance: string;
  location: {
    lat: number;
    lng: number;
  };
  amenities: string[];
}

// Theater data with proper typing
const theaters: Theater[] = [
  { 
    id: '1', 
    name: "Lion's Den Baton Rouge", 
    address: '10000 Perkins Rowe, Baton Rouge, LA 70810', 
    distance: '1.2 mi',
    location: { lat: 30.3921, lng: -91.1453 },
    amenities: ['IMAX', 'Dine-in', 'Reserved Seating', 'Dolby Atmos']
  },
  { 
    id: '2', 
    name: "Lion's Den Hammond", 
    address: '1200 W University Ave, Hammond, LA 70401', 
    distance: '14.2 mi',
    location: { lat: 30.5102, lng: -90.4692 },
    amenities: ['Digital 3D', 'Premium Recliners', 'Bar', 'IMAX']
  },
  { 
    id: '3', 
    name: "Lion's Den Denham Springs", 
    address: '2200 S Range Ave, Denham Springs, LA 70726', 
    distance: '8.5 mi',
    location: { lat: 30.4628, lng: -90.9567 },
    amenities: ['Dolby Cinema', 'Reserved Seating', 'Arcade']
  },
  { 
    id: '4', 
    name: "Lion's Den Gonzales", 
    address: '921 Cabelas Pkwy, Gonzales, LA 70737', 
    distance: '20.3 mi',
    location: { lat: 30.2094, lng: -90.9192 },
    amenities: ['Premium Format', 'Recliners', 'Full Bar']
  },
  { 
    id: '5', 
    name: "Lion's Den Lafayette", 
    address: '2315 Kaliste Saloom Rd, Lafayette, LA 70508', 
    distance: '48.6 mi',
    location: { lat: 30.1708, lng: -91.9875 },
    amenities: ['RPX', 'Studio Grill', 'VIP Seating', 'Full Bar']
  },
];

const Theaters: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(null);

  // Add explicit Theater type to parameters
  const handleViewShowtimes = (theater: Theater): void => {
    navigate(`/movies?theaterId=${theater.id}`);
  };

  const handleGetDirections = (theater: Theater): void => {
    const address = encodeURIComponent(theater.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  const toggleTheaterDetails = (theaterId: string): void => {
    setSelectedTheaterId(selectedTheaterId === theaterId ? null : theaterId);
  };

  return (
    <div className="theaters-container">
      <div className="theaters-header">
        <h1 className="theaters-title">Our Theaters</h1>
        <p className="theaters-subtitle">Find a theater near you</p>
      </div>
      
      <div className="theaters-list">
        {theaters.map((theater) => (
          <div key={theater.id} className="theater-item">
            <div 
              className="theater-card" 
              onClick={() => toggleTheaterDetails(theater.id)}
            >
              <div className="theater-card-content">
                <h2 className="theater-name">{theater.name}</h2>
                <div className="location-row">
                  <svg className="location-icon" viewBox="0 0 24 24">
                    <path fill="#0C6184" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span className="theater-distance">{theater.distance} away</span>
                </div>
              </div>
              <div className="chevron-container">
                <svg className="chevron-icon" viewBox="0 0 24 24">
                  <path 
                    fill="#4A6375" 
                    d={selectedTheaterId === theater.id 
                      ? "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" 
                      : "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                    } 
                  />
                </svg>
              </div>
            </div>
            
            {selectedTheaterId === theater.id && (
              <div className="details-container">
                <p className="theater-address">{theater.address}</p>
                
                <div className="amenities-container">
                  {theater.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                </div>
                
                <div className="buttons-container">
                  <button 
                    className="directions-button"
                    onClick={() => handleGetDirections(theater)}
                  >
                    <svg className="button-icon" viewBox="0 0 24 24">
                      <path fill="#FFFFFF" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    Directions
                  </button>
                  
                  <button 
                    className="showtimes-button"
                    onClick={() => handleViewShowtimes(theater)}
                  >
                    <svg className="button-icon" viewBox="0 0 24 24">
                      <path fill="#FFFFFF" d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"/>
                    </svg>
                    View Showtimes
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Theaters;