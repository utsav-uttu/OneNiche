import "../styles/admin.css";

function AdminLayout({ title, children }) {
    return (
        <div className="admin-page">
            <div className="admin-card">
                <h1>{title}</h1>
                {children}
            </div>
        </div>
    );
}

export default AdminLayout;