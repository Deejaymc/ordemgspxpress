import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Phone, Mail } from "lucide-react";

interface Technician {
  id: string;
  nome: string;
  especialidade: string;
  telefone: string;
  email: string;
}

const initialTechs: Technician[] = [
  { id: "1", nome: "Carlos Mendes", especialidade: "Instalação GPS", telefone: "+351 914 567 890", email: "carlos@gpsxpress.com" },
  { id: "2", nome: "Ana Costa", especialidade: "Manutenção", telefone: "+351 915 678 901", email: "ana@gpsxpress.com" },
  { id: "3", nome: "Bruno Lima", especialidade: "Suporte Técnico", telefone: "+351 916 789 012", email: "bruno@gpsxpress.com" },
];

const emptyTech: Omit<Technician, "id"> = { nome: "", especialidade: "", telefone: "", email: "" };

const Technicians = () => {
  const [techs, setTechs] = useState<Technician[]>(initialTechs);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Technician | null>(null);
  const [form, setForm] = useState(emptyTech);

  const openNew = () => { setEditing(null); setForm(emptyTech); setModalOpen(true); };
  const openEdit = (t: Technician) => { setEditing(t); setForm(t); setModalOpen(true); };

  const save = () => {
    if (!form.nome) return;
    if (editing) {
      setTechs(techs.map((t) => (t.id === editing.id ? { ...form, id: editing.id } : t)));
    } else {
      setTechs([...techs, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const remove = (id: string) => setTechs(techs.filter((t) => t.id !== id));

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
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{t.nome}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">{t.especialidade}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(t.id)} className="p-1.5 rounded-md hover:bg-accent/10 text-accent transition-colors"><Trash2 className="h-4 w-4" /></button>
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
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {field === "especialidade" ? "Especialidade" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={save} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all">Salvar</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Technicians;
