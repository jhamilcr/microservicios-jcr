import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";        
import { useEffect } from "react";
import { useAuthStore } from "./store/auth";     

export default function App() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}
