import { Routes, Route } from "react-router-dom";
import Movies from "./pages/Movies";
import Theaters from "./pages/Theaters";
import Tickets from "./pages/Tickets";
import Food from "./pages/Food";
import Account from "./pages/Account";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Movies />} />
            <Route path="/theaters" element={<Theaters />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/food" element={<Food />} />
            <Route path="/account" element={<Account />} />
        </Routes>
    );
};

export default AppRoutes;
