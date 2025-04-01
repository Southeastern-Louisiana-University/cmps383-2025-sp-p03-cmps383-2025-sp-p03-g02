import { useEffect, useState } from "react";
import "../styles/Food.css";

interface FoodItemDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; 
}

const Food = () => {
  const [foodItems, setFoodItems] = useState<FoodItemDto[]>([]);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = () => {
    fetch("api/fooditem")
      .then((response) => response.json())
      .then((data: FoodItemDto[]) => {
        setFoodItems(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((item) => item.category))
        );
        setCategories(["All", ...uniqueCategories]); 
      })
      .catch(() => {
        setError("Failed to fetch food items.");
      });
  };

  // Filter food items based on selected category
  const filteredFoodItems =
    selectedCategory === "All"
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="food-container">
      <h1 className="food-title">Concessions</h1>
      <p className="food-subtitle">Order food & drinks to your seat</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Tabs for categories */}
      <div className="food-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`food-tab ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="food-list">
        {filteredFoodItems.map((item) => (
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
