import { Routes, Route } from "react-router-dom";
import Movies from "./pages/Movies";
import Theaters from "./pages/Theaters";
import Tickets from "./pages/Tickets";
import Food from "./pages/Food";
import Account from "./pages/Account";
import Management from "./pages/Management.tsx";
import { AddFoodItemForm } from './pages/EditFoodMenu.tsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Movies />} />
            <Route path="/theaters" element={<Theaters />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/food" element={<Food />} />
            <Route path="/account" element={<Account />} />
            <Route path="/management" element={<Management />} /> {/* Added Management route */}
            <Route path="/editmenu" element={<AddFoodItemForm /> } />
        </Routes>
    );
};

export default AppRoutes;
