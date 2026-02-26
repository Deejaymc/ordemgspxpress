import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const { login, signup, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && !authLoading) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isSignup) {
      const { error } = await signup(email, password, displayName);
      if (error) setError(error);
      else setSuccess("Conta criada! Verifique seu e-mail para confirmar.");
    } else {
      const { error } = await login(email, password);
      if (error) setError(error);
      else navigate("/", { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
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
              <h1 className="text-xl font-display font-bold text-foreground">
                {isSignup ? "Criar Conta" : "Sistema de Ordens de Serviço"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isSignup ? "Preencha os dados para criar sua conta" : "Acesse sua conta para continuar"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nome</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Seu nome"
                  required
                />
              </div>
            )}
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
                  minLength={6}
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

            {error && <p className="text-sm text-accent">{error}</p>}
            {success && <p className="text-sm text-success">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 glow-primary transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignup ? "Criar Conta" : "Entrar"}
            </button>
          </form>

          <button
            onClick={() => { setIsSignup(!isSignup); setError(""); setSuccess(""); }}
            className="w-full text-sm text-center text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignup ? "Já tem conta? Entrar" : "Não tem conta? Criar conta"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
