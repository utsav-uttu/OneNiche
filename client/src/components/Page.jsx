function Page({ title, subtitle, children }) {
    return (
        <div className="page">
            <div className="page-header">
                <h1>{title}</h1>
                {subtitle && <p className="muted">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

export default Page;