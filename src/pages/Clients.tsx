import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Client = Tables<"clients">;
const emptyForm = { nome: "", nif: "", telefone: "", endereco: "", cidade: "", email: "" };

const Clients = () => {
  const { isAdmin } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").order("nome");
    setClients(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const filtered = clients.filter((c) =>
    [c.nome, c.nif, c.cidade].some((v) => (v || "").toLowerCase().includes(search.toLowerCase()))
  );

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (c: Client) => { setEditing(c); setForm({ nome: c.nome, nif: c.nif || "", telefone: c.telefone || "", endereco: c.endereco || "", cidade: c.cidade || "", email: c.email || "" }); setModalOpen(true); };

  const save = async () => {
    if (!form.nome) return;
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("clients").update(form).eq("id", editing.id);
      if (error) toast.error(error.message); else toast.success("Cliente atualizado");
    } else {
      const { error } = await supabase.from("clients").insert(form);
      if (error) toast.error(error.message); else toast.success("Cliente criado");
    }
    setSaving(false);
    setModalOpen(false);
    fetchClients();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Cliente removido"); fetchClients(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seus clientes</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 glow-primary transition-all">
          <Plus className="h-4 w-4" /> Novo Cliente
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar clientes..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-left border-b border-border">
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">NIF</th>
                <th className="px-6 py-3 font-medium">Telefone</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Cidade</th>
                <th className="px-6 py-3 font-medium hidden lg:table-cell">Email</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" /></td></tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-3 text-foreground font-medium">{c.nome}</td>
                  <td className="px-6 py-3 text-muted-foreground font-mono">{c.nif}</td>
                  <td className="px-6 py-3 text-muted-foreground">{c.telefone}</td>
                  <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">{c.cidade}</td>
                  <td className="px-6 py-3 text-muted-foreground hidden lg:table-cell">{c.email}</td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                    {isAdmin && <button onClick={() => remove(c.id)} className="p-1.5 rounded-md hover:bg-accent/10 text-accent transition-colors"><Trash2 className="h-4 w-4" /></button>}
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Nenhum cliente encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-6 w-full max-w-lg space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-foreground">{editing ? "Editar Cliente" : "Novo Cliente"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["nome", "nif", "telefone", "endereco", "cidade", "email"] as const).map((field) => (
                <div key={field} className={field === "endereco" ? "sm:col-span-2" : ""}>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{field === "endereco" ? "Endereço" : field === "nif" ? "NIF" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Salvar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Clients;
