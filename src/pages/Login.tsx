import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!login(email, password)) {
      setError("Credenciais inválidas. Use admin@gpsxpress.com / admin123");
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass rounded-2xl p-8 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <img src={logo} alt="GPSXPRESS" className="h-16 w-auto" />
            <div className="text-center">
              <h1 className="text-xl font-display font-bold text-foreground">Sistema de Ordens de Serviço</h1>
              <p className="text-sm text-muted-foreground mt-1">Acesse sua conta para continuar</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-accent">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 glow-primary transition-all duration-200"
            >
              Entrar
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Demo: admin@gpsxpress.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
