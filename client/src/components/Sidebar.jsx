import { useNavigate } from "react-router-dom";
function Sidebar({ setActivePage, activePage }) {
     const navigate = useNavigate();
  return (
    <div
      style={{
        width: "220px",
        background: "#0f172a",
        color: "red",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>Admin Panel</h2>

      <button
        onClick={() => navigate("/admin")}
        style={{
          display: "block",
          marginBottom: "10px",
          background:
            activePage === "dashboard" ? "#202f48" : "transparent",
          color: "white",
          padding: "10px",
          width: "100%",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        Dashboard
      </button>

      <button
        onClick={() => navigate("/admin/add")}
        style={{
          display: "block",
          marginBottom: "10px",
          background:
            activePage === "add" ? "#202f48" : "transparent",
          color: "white",
          padding: "10px",
          width: "100%",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        Add Movie
      </button>
    
    <button
  onClick={() => navigate("/admin/bookings")}
  style={{
    display: "block",
    marginBottom: "10px",
    background: activePage === "bookings" ? "#202f48" : "transparent",
    color: "white",
    padding: "10px",
    width: "100%",
    border: "none",
    textAlign: "left",
  }}
>
  All Bookings
</button>

    </div>
  );
}

export default Sidebar;