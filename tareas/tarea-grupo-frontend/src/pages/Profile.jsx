import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import api from "../lib/api";

export default function Profile() {
  const { user, fetchMe } = useAuthStore();
  const [serverMe, setServerMe] = useState(null);

  useEffect(() => {
    fetchMe().then(setServerMe).catch(()=>{});
  }, [fetchMe]);

  return (
    <div>
      <h2>Perfil</h2>
      <pre style={{background:"#f6f6f6",padding:12}}>
        {JSON.stringify({ clientUser: user, serverMe }, null, 2)}
      </pre>
    </div>
  );
}
