import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Save, UserPlus, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const Settings = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState({
    nome: "GPSXPRESS",
    nif: "123456789",
    endereco: "Rua da Tecnologia, 100",
    cidade: "Lisboa",
    telefone: "+351 210 000 000",
    email: "info@gpsxpress.com",
  });

  const [users, setUsers] = useState([
    { id: "1", name: "Administrador", email: "admin@gpsxpress.com", role: "admin" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
  const [showNewUser, setShowNewUser] = useState(false);

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers([...users, { ...newUser, id: Date.now().toString() }]);
    setNewUser({ name: "", email: "", password: "", role: "user" });
    setShowNewUser(false);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Dados da empresa e gestão de usuários</p>
      </div>

      {/* Company Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-display font-semibold text-foreground">Dados da Empresa</h2>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <div>
            <p className="font-semibold text-foreground">{company.nome}</p>
            <p className="text-xs text-muted-foreground">Logomarca da empresa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.keys(company) as Array<keyof typeof company>).map((field) => (
            <div key={field}>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {field === "nif" ? "NIF" : field === "endereco" ? "Endereço" : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                value={company[field]}
                onChange={(e) => setCompany({ ...company, [field]: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          ))}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all">
          <Save className="h-4 w-4" /> Salvar
        </button>
      </motion.div>

      {/* Users */}
      {user?.role === "admin" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-display font-semibold text-foreground">Gestão de Usuários</h2>
            </div>
            <button onClick={() => setShowNewUser(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all">
              <UserPlus className="h-4 w-4" /> Novo
            </button>
          </div>

          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === "admin" ? "bg-accent/20 text-accent" : "bg-primary/15 text-primary"}`}>
                  {u.role === "admin" ? "Admin" : "Usuário"}
                </span>
              </div>
            ))}
          </div>

          {showNewUser && (
            <div className="p-4 rounded-lg border border-border bg-secondary/30 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Novo Usuário</p>
                <button onClick={() => setShowNewUser(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="Nome"
                  className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="E-mail"
                  className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Senha"
                  className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <button onClick={addUser} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all">Criar Usuário</button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Settings;
