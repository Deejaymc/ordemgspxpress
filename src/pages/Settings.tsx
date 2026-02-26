import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Save, UserPlus, X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

const Settings = () => {
  const { isAdmin } = useAuth();
  const [company, setCompany] = useState({ id: "", nome: "", nif: "", endereco: "", cidade: "", telefone: "", email: "" });
  const [users, setUsers] = useState<any[]>([]);
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      const { data } = await supabase.from("company_settings").select("*").limit(1).single();
      if (data) setCompany({ id: data.id, nome: data.nome, nif: data.nif || "", endereco: data.endereco || "", cidade: data.cidade || "", telefone: data.telefone || "", email: data.email || "" });
    };
    const fetchUsers = async () => {
      const { data } = await supabase.from("profiles").select("*, user_roles(role)");
      setUsers(data || []);
    };
    fetchCompany();
    fetchUsers();
  }, []);

  const saveCompany = async () => {
    setSaving(true);
    const { id, ...rest } = company;
    const { error } = await supabase.from("company_settings").update(rest).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Dados salvos");
    setSaving(false);
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;
    setCreatingUser(true);
    const { error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      options: { data: { display_name: newUser.name } },
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Usuário criado! Verifique o e-mail para confirmar.");
      setNewUser({ name: "", email: "", password: "" });
      setShowNewUser(false);
    }
    setCreatingUser(false);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Dados da empresa e gestão de usuários</p>
      </div>

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
          {(["nome", "nif", "endereco", "cidade", "telefone", "email"] as const).map((field) => (
            <div key={field}>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {field === "nif" ? "NIF" : field === "endereco" ? "Endereço" : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                value={company[field]}
                onChange={(e) => setCompany({ ...company, [field]: e.target.value })}
                disabled={!isAdmin}
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              />
            </div>
          ))}
        </div>

        {isAdmin && (
          <button onClick={saveCompany} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
          </button>
        )}
      </motion.div>

      {isAdmin && (
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
                  <p className="text-sm font-medium text-foreground">{u.display_name || "Sem nome"}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.user_roles?.some((r: any) => r.role === "admin") ? "bg-accent/20 text-accent" : "bg-primary/15 text-primary"}`}>
                  {u.user_roles?.some((r: any) => r.role === "admin") ? "Admin" : "Usuário"}
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
                <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Senha (min. 6 caracteres)"
                  className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 sm:col-span-2" />
              </div>
              <button onClick={createUser} disabled={creatingUser} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50">
                {creatingUser && <Loader2 className="h-4 w-4 animate-spin" />} Criar Usuário
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Settings;
