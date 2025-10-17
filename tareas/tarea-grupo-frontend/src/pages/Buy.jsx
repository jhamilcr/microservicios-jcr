import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuthStore } from "../store/auth";

export default function Buy() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get(`/events/${eventId}`).then(({data}) => setEvent(data));
  }, [eventId]);

  const onBuy = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      
      const totalAmount = (event?.precio || 0) * quantity;
      const payload = {
        eventId: String(eventId),
        userEmail: user.email,
        quantity,
        totalAmount,
        paid: false
      };
      const { data } = await api.post("/purchases", payload);
      
      navigate("/purchases");
    } catch (e) {
      setErr(e?.response?.data?.error || "No se pudo crear la compra");
    }
  };

  if (!event) return <p>Cargando...</p>;

  return (
    <form onSubmit={onBuy} style={{maxWidth:420}}>
      <h2>Comprar: {event.nombre}</h2>
      {err && <p style={{color:"crimson"}}>{err}</p>}
      <p>Precio: ${event.precio}</p>
      <label>
        Cantidad:
        <input type="number" min={1} max={event.capacidad} value={quantity}
          onChange={(e)=>setQuantity(+e.target.value)} />
      </label>
      <p>Total: <b>${(event.precio * quantity).toFixed(2)}</b></p>
      <button type="submit">Crear compra</button>
    </form>
  );
}
