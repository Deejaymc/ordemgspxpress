import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Phone, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Technician = Tables<"technicians">;
const emptyForm = { nome: "", especialidade: "", telefone: "", email: "" };

const Technicians = () => {
  const { isAdmin } = useAuth();
  const [techs, setTechs] = useState<Technician[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Technician | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from("technicians").select("*").order("nome");
    setTechs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (t: Technician) => { setEditing(t); setForm({ nome: t.nome, especialidade: t.especialidade || "", telefone: t.telefone || "", email: t.email || "" }); setModalOpen(true); };

  const save = async () => {
    if (!form.nome) return;
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("technicians").update(form).eq("id", editing.id);
      if (error) toast.error(error.message); else toast.success("Técnico atualizado");
    } else {
      const { error } = await supabase.from("technicians").insert(form);
      if (error) toast.error(error.message); else toast.success("Técnico criado");
    }
    setSaving(false);
    setModalOpen(false);
    fetch();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("technicians").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Técnico removido"); fetch(); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Técnicos</h1>
          <p className="text-sm text-muted-foreground mt-1">Equipe técnica</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 glow-primary transition-all">
          <Plus className="h-4 w-4" /> Novo Técnico
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {techs.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{t.nome}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">{t.especialidade}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                {isAdmin && <button onClick={() => remove(t.id)} className="p-1.5 rounded-md hover:bg-accent/10 text-accent transition-colors"><Trash2 className="h-4 w-4" /></button>}
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{t.telefone}</div>
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{t.email}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-6 w-full max-w-lg space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-foreground">{editing ? "Editar Técnico" : "Novo Técnico"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["nome", "especialidade", "telefone", "email"] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{field === "especialidade" ? "Especialidade" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
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

export default Technicians;
