import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  return (
    <nav style={{display:"flex",gap:12,padding:12,borderBottom:"1px solid #ddd"}}>
      <Link to="/">Eventos</Link>
      {user && <Link to="/purchases">Mis Compras</Link>}
      {user?.role === "admin" && <Link to="/events/admin">Admin Eventos</Link>}
      <div style={{marginLeft:"auto"}}>
        {!user ? (
          <>
            <Link to="/login">Login</Link>{" | "}
            <Link to="/register">Registro</Link>
          </>
        ) : (
          <>
            <Link to="/profile">{user.email} ({user.role})</Link>{" | "}
            <button onClick={logout}>Salir</button>
          </>
        )}
      </div>
    </nav>
  );
}
