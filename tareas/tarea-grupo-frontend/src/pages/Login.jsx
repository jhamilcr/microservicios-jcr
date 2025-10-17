import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(form);
      navigate("/");
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={onSubmit} style={{maxWidth:420}}>
      <h2>Login</h2>
      {err && <p style={{color:"crimson"}}>{err}</p>}
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e)=>setForm(f=>({...f,email:e.target.value}))}
        style={{display:"block",width:"100%",margin:"8px 0"}}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e)=>setForm(f=>({...f,password:e.target.value}))}
        style={{display:"block",width:"100%",margin:"8px 0"}}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
