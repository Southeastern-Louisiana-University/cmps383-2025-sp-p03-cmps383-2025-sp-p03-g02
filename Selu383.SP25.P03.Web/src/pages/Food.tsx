import "../styles/Food.css"; 

const foodItems = [
    { id: 1, name: "Popcorn", price: "$7.99", description: "Freshly popped buttery popcorn" },
    { id: 2, name: "Nachos", price: "$8.99", description: "Tortilla chips with cheese sauce" },
    { id: 3, name: "Soda", price: "$5.99", description: "Your choice of soft drink (32oz)" },
    { id: 4, name: "Candy", price: "$4.99", description: "Assorted movie theater candy" }
];

const Food = () => {
    return (
        <div className="food-container">
            <h1 className="food-title">Concessions</h1>
            <p className="food-subtitle">Order food & drinks to your seat</p>
            <div className="food-list">
                {foodItems.map((item) => (
                    <div key={item.id} className="food-item">
                        <h2>{item.name} <br/> <span className="food-price">{item.price}</span></h2>
                        <p className="food-description">{item.description}</p>
                        <button className="add-to-order-btn">Add to Order</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Food;
