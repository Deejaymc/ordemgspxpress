import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";

interface Product {
  id: string;
  nome: string;
  referencia: string;
  preco: string;
  descricao: string;
}

const initialProducts: Product[] = [
  { id: "1", nome: "Rastreador GPS V4", referencia: "GPS-V4-001", preco: "89.90", descricao: "Rastreador veicular com monitoramento em tempo real" },
  { id: "2", nome: "Sensor de Temperatura", referencia: "SENS-T-002", preco: "45.00", descricao: "Sensor de temperatura para câmaras frigoríficas" },
];

const emptyProduct: Omit<Product, "id"> = { nome: "", referencia: "", preco: "", descricao: "" };

const Products = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const filtered = products.filter((p) =>
    [p.nome, p.referencia].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  const openNew = () => { setEditing(null); setForm(emptyProduct); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm(p); setModalOpen(true); };

  const save = () => {
    if (!form.nome) return;
    if (editing) {
      setProducts(products.map((p) => (p.id === editing.id ? { ...form, id: editing.id } : p)));
    } else {
      setProducts([...products, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const remove = (id: string) => setProducts(products.filter((p) => p.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Produtos</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seus produtos e equipamentos</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 glow-primary transition-all">
          <Plus className="h-4 w-4" /> Novo Produto
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produtos..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{p.nome}</h3>
                <p className="text-xs font-mono text-muted-foreground">{p.referencia}</p>
              </div>
              <span className="text-primary font-bold">€{p.preco}</span>
            </div>
            <p className="text-sm text-muted-foreground">{p.descricao}</p>
            <div className="flex gap-2 pt-2 border-t border-border/50">
              <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(p.id)} className="p-1.5 rounded-md hover:bg-accent/10 text-accent transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-6 w-full max-w-lg space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-foreground">{editing ? "Editar Produto" : "Novo Produto"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["nome", "referencia", "preco"] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{field === "referencia" ? "Referência" : field === "preco" ? "Preço (€)" : "Nome"}</label>
                  <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</label>
                <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
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

export default Products;
