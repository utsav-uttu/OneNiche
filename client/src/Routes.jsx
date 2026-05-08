import { Routes, Route } from "react-router-dom";

/* Public pages */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Interests from "./pages/Interests";

/* User pages */
import Communities from "./pages/Communities";
import Events from "./pages/Events";
import Resources from "./pages/Resources";
import Opportunities from "./pages/Opportunities";

/* Admin layout & pages */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateCommunity from "./pages/admin/CreateCommunity";
import CreateEvent from "./pages/admin/CreateEvent";
import CreateResource from "./pages/admin/CreateResource";
import CreateOpportunity from "./pages/admin/CreateOpportunity";

/* Route guard */
import AdminRoute from "./components/AdminRoute";

function AppRoutes() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/interests" element={<Interests />} />

            {/* USER */}
            <Route path="/communities" element={<Communities />} />
            <Route path="/events" element={<Events />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/opportunities" element={<Opportunities />} />

            {/* ADMIN */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="communities" element={<CreateCommunity />} />
                <Route path="events" element={<CreateEvent />} />
                <Route path="resources" element={<CreateResource />} />
                <Route path="opportunities" element={<CreateOpportunity />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;