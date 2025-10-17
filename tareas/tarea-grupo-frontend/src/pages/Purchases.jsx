import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Purchases() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get("/purchases");
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const pay = async (p) => {
    await api.post(`/purchases/${p.id || p._id}/pagar`);
    await load();
  };

  return (
    <div>
      <h2>Mis compras</h2>
      <ul>
        {items.map(p => (
          <li key={p.id || p._id} style={{margin:"8px 0"}}>
            Evento: {p.eventId} — Cant: {p.quantity} — Total: ${p.totalAmount} — Pagado: {String(p.paid)}
            {!p.paid && (
              <>
                {" | "}
                <button onClick={()=>pay(p)}>Pagar</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <p style={{opacity:.8,marginTop:12}}>
        Al pagar, tu backend marca la compra como pagada y envía un mensaje a RabbitMQ. 
        El servicio de Notificaciones consume ese mensaje y envía el email al usuario.
      </p>
    </div>
  );
}
