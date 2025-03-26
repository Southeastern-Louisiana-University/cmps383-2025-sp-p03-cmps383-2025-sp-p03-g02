import { useEffect, useState } from "react";
import "../styles/Food.css";

interface FoodItemDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Food = () => {
  const [foodItems, setFoodItems] = useState<FoodItemDto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5249/api/fooditem")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch food items");
        }
        return response.json();
      })
      .then((data: FoodItemDto[]) => setFoodItems(data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load food items.");
      });
  }, []);

  return (
    <div className="food-container">
      <h1 className="food-title">Concessions</h1>
      <p className="food-subtitle">Order food & drinks to your seat</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="food-list">
        {foodItems.map((item) => (
          <div key={item.id} className="food-item">
          <div>
            <h2>
              {item.name}
              <br />
              <span className="food-price">${item.price.toFixed(2)}</span>
            </h2>
            <p className="food-description">{item.description}</p>
            <button className="add-to-order-btn">Add to Order</button>
          </div>
        
          {item.imageUrl && (
            <img src={item.imageUrl} alt={item.name} className="food-image" />
          )}
        </div>
        ))}
      </div>
    </div>
  );
};

export default Food;
