import { NavLink, Outlet } from "react-router-dom";
import "../../styles/admin.css";

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className="admin-sidebar">
                <h3>Admin Panel</h3>

                <nav>
                    <NavLink to="/admin" end>
                        Dashboard
                    </NavLink>

                    <NavLink to="/admin/communities">
                        Communities
                    </NavLink>

                    <NavLink to="/admin/events">
                        Events
                    </NavLink>

                    <NavLink to="/admin/resources">
                        Resources
                    </NavLink>

                    <NavLink to="/admin/opportunities">
                        Opportunities
                    </NavLink>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}