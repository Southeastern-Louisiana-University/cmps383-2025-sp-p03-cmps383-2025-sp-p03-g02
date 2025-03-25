import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Movies from "./pages/Movies.tsx";
import Theaters from "./pages/Theaters.tsx";
import Tickets from "./pages/Tickets.tsx";
import Food from "./pages/Food.tsx";
import Account from "./pages/Account.tsx";
import Navbar from "./components/Navbar.tsx";
import { AddFoodItemForm } from './pages/TestFoodMenu.tsx'; // Import the form

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Movies />} />
                <Route path="/theaters" element={<Theaters />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/food" element={<Food />} />
                <Route path="/account" element={<Account />} />
                <Route path="/testmenu" element={<AddFoodItemForm onAddFoodSuccess={() => {}} />} /> {/* Add route for the form */}
            </Routes>
        </Router>
    );
}

export default App;




