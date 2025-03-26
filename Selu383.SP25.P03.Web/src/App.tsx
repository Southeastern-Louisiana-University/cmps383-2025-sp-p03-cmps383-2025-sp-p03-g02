import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Movies from "./pages/Movies.tsx";
import Theaters from "./pages/Theaters.tsx";
import Tickets from "./pages/Tickets.tsx";
import Food from "./pages/Food.tsx";
import Account from "./pages/Account.tsx";
import Management from "./pages/Management.tsx"; // Import Management page
import Navbar from "./components/Navbar.tsx";
import { AddFoodItemForm } from './pages/EditFoodMenu.tsx';

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
                <Route path="/management" element={<Management />} /> {/* Added Management route */}
                <Route path="/editmenu" element={<AddFoodItemForm onAddFoodSuccess={() => {}} />} /> {/* Add route for the form */}
            </Routes>
        </Router>
    );
}

export default App;
