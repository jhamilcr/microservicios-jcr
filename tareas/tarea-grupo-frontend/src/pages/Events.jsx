import { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";

function normalizeEvents(data) {
  
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.events)) return data.events;
  return []; 
}

export default function Events({ admin = false }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ nombre:"", fecha:"", lugar:"", capacidad:0, precio:0 });
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/events");
      const data = res?.data;
      setEvents(normalizeEvents(data));
      setErr("");
    } catch (e) {
      
      const msg = e?.response?.data || e?.message || "Error cargando eventos";
      setErr(typeof msg === "string" ? msg : JSON.stringify(msg));
      setEvents([]); 
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/events", form);
      setForm({ nombre:"", fecha:"", lugar:"", capacidad:0, precio:0 });
      await load();
    } catch (e) {
      setErr(e?.response?.data?.error || "Error creando evento");
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar evento?")) return;
    await api.delete(`/events/${id}`);
    await load();
  };

  return (
    <div>
      <h2>Eventos</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {events.length === 0 && !err && <p>No hay eventos.</p>}
      <ul>
        {events.map(ev => {
          const id = ev._id || ev.id;
          return (
            <li key={id} style={{ margin: "8px 0" }}>
              <b>{ev.nombre}</b> — {ev.fecha} — {ev.lugar} — cap: {ev.capacidad} — ${ev.precio}
              {" "}
              <Link to={`/buy/${id}`}>Comprar</Link>
              {admin && (
                <>
                  {" | "}
                  <button onClick={() => remove(id)}>Eliminar</button>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {admin && (
        <form onSubmit={create} style={{ marginTop: 16 }}>
          <h3>Crear evento</h3>
          <input placeholder="Nombre" value={form.nombre}
                 onChange={(e)=>setForm(f=>({...f,nombre:e.target.value}))}/>
          <input type="date" value={form.fecha}
                 onChange={(e)=>setForm(f=>({...f,fecha:e.target.value}))}/>
          <input placeholder="Lugar" value={form.lugar}
                 onChange={(e)=>setForm(f=>({...f,lugar:e.target.value}))}/>
          <input type="number" placeholder="Capacidad" value={form.capacidad}
                 onChange={(e)=>setForm(f=>({...f,capacidad:+e.target.value}))}/>
          <input type="number" step="0.01" placeholder="Precio" value={form.precio}
                 onChange={(e)=>setForm(f=>({...f,precio:+e.target.value}))}/>
          <button type="submit">Crear</button>
        </form>
      )}
    </div>
  );
}
