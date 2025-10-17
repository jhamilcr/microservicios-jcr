import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"user" });
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      navigate("/");
    } catch (e) {
      setErr(e?.response?.data?.error || "Register failed");
    }
  };

  return (
    <form onSubmit={onSubmit} style={{maxWidth:480}}>
      <h2>Registro</h2>
      {err && <p style={{color:"crimson"}}>{err}</p>}
      <input placeholder="Nombre" value={form.name}
        onChange={(e)=>setForm(f=>({...f,name:e.target.value}))}
        style={{display:"block",width:"100%",margin:"8px 0"}}
      />
      <input placeholder="Email" value={form.email}
        onChange={(e)=>setForm(f=>({...f,email:e.target.value}))}
        style={{display:"block",width:"100%",margin:"8px 0"}}
      />
      <input type="password" placeholder="Password" value={form.password}
        onChange={(e)=>setForm(f=>({...f,password:e.target.value}))}
        style={{display:"block",width:"100%",margin:"8px 0"}}
      />
      <select value={form.role} onChange={(e)=>setForm(f=>({...f,role:e.target.value}))}>
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
      <button type="submit">Crear cuenta</button>
    </form>
  );
}
