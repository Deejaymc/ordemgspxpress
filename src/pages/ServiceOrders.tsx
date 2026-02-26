import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Eye, Trash2, X, FileDown } from "lucide-react";

interface ServiceOrder {
  id: string;
  numero: string;
  clienteNome: string;
  tecnicoNome: string;
  data: string;
  status: "Pendente" | "Em andamento" | "Concluída";
  descricao: string;
  produtos: string[];
}

const initialOrders: ServiceOrder[] = [
  { id: "1", numero: "OS-001", clienteNome: "João Silva", tecnicoNome: "Carlos Mendes", data: "2026-02-25", status: "Em andamento", descricao: "Instalação de rastreador GPS no veículo", produtos: ["Rastreador GPS V4"] },
  { id: "2", numero: "OS-002", clienteNome: "Maria Santos", tecnicoNome: "Ana Costa", data: "2026-02-24", status: "Concluída", descricao: "Manutenção preventiva do sistema GPS", produtos: ["Sensor de Temperatura"] },
  { id: "3", numero: "OS-003", clienteNome: "Pedro Oliveira", tecnicoNome: "Bruno Lima", data: "2026-02-24", status: "Pendente", descricao: "Configuração de alarme e cerca virtual", produtos: ["Rastreador GPS V4", "Sensor de Temperatura"] },
];

const statusColor: Record<string, string> = {
  "Pendente": "bg-warning/20 text-warning",
  "Em andamento": "bg-primary/20 text-primary",
  "Concluída": "bg-success/20 text-success",
};

const ServiceOrders = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewing, setViewing] = useState<ServiceOrder | null>(null);
  const [form, setForm] = useState({ clienteNome: "", tecnicoNome: "", descricao: "", status: "Pendente" as const });

  const filtered = orders.filter((o) =>
    [o.numero, o.clienteNome, o.tecnicoNome].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  const openNew = () => { setViewing(null); setForm({ clienteNome: "", tecnicoNome: "", descricao: "", status: "Pendente" }); setModalOpen(true); };

  const save = () => {
    if (!form.clienteNome) return;
    const newOrder: ServiceOrder = {
      id: Date.now().toString(),
      numero: `OS-${String(orders.length + 1).padStart(3, "0")}`,
      ...form,
      data: new Date().toISOString().split("T")[0],
      produtos: [],
    };
    setOrders([newOrder, ...orders]);
    setModalOpen(false);
  };

  const remove = (id: string) => setOrders(orders.filter((o) => o.id !== id));

  const exportPDF = (order: ServiceOrder) => {
    // Simple print-based PDF generation
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>OS ${order.numero}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #222; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2196F3; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #2196F3; }
        .logo span { color: #E63946; }
        .info { margin-bottom: 20px; }
        .info h3 { color: #2196F3; margin-bottom: 8px; }
        .info p { margin: 4px 0; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
        th { background: #2196F3; color: white; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 15px; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="header">
        <div class="logo"><span>e</span>GPS<br/>express</div>
        <div style="text-align: right;">
          <h2 style="margin: 0; color: #2196F3;">ORDEM DE SERVIÇO</h2>
          <p style="margin: 4px 0; font-size: 18px; font-weight: bold;">${order.numero}</p>
          <p style="margin: 4px 0; font-size: 14px;">Data: ${order.data}</p>
        </div>
      </div>
      <div class="info">
        <h3>Dados da Empresa</h3>
        <p><strong>GPSXPRESS</strong></p>
        <p>NIF: 123456789 | Tel: +351 210 000 000</p>
        <p>Rua da Tecnologia, 100 - Lisboa, Portugal</p>
        <p>Email: info@gpsxpress.com</p>
      </div>
      <div class="info">
        <h3>Dados do Cliente</h3>
        <p><strong>${order.clienteNome}</strong></p>
      </div>
      <div class="info">
        <h3>Detalhes do Serviço</h3>
        <p><strong>Técnico:</strong> ${order.tecnicoNome}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Descrição:</strong> ${order.descricao}</p>
      </div>
      ${order.produtos.length > 0 ? `
      <table>
        <thead><tr><th>Produto/Equipamento</th><th>Qtd</th></tr></thead>
        <tbody>${order.produtos.map(p => `<tr><td>${p}</td><td>1</td></tr>`).join("")}</tbody>
      </table>` : ""}
      <div style="margin-top: 60px; display: flex; justify-content: space-between;">
        <div style="text-align: center; width: 200px;">
          <div style="border-top: 1px solid #333; padding-top: 8px; font-size: 13px;">Assinatura do Cliente</div>
        </div>
        <div style="text-align: center; width: 200px;">
          <div style="border-top: 1px solid #333; padding-top: 8px; font-size: 13px;">Assinatura do Técnico</div>
        </div>
      </div>
      <div class="footer">GPSXPRESS - Sistema de Ordens de Serviço</div>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Ordens de Serviço</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie as ordens de serviço</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 glow-primary transition-all">
          <Plus className="h-4 w-4" /> Nova OS
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar ordens..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-left border-b border-border">
                <th className="px-6 py-3 font-medium">Nº</th>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Técnico</th>
                <th className="px-6 py-3 font-medium hidden sm:table-cell">Data</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-3 font-mono text-primary">{o.numero}</td>
                  <td className="px-6 py-3 text-foreground">{o.clienteNome}</td>
                  <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">{o.tecnicoNome}</td>
                  <td className="px-6 py-3 text-muted-foreground hidden sm:table-cell">{o.data}</td>
                  <td className="px-6 py-3"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span></td>
                  <td className="px-6 py-3 text-right space-x-1">
                    <button onClick={() => exportPDF(o)} className="p-1.5 rounded-md hover:bg-success/10 text-success transition-colors" title="Exportar PDF"><FileDown className="h-4 w-4" /></button>
                    <button onClick={() => remove(o.id)} className="p-1.5 rounded-md hover:bg-accent/10 text-accent transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Nenhuma ordem encontrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-6 w-full max-w-lg space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-foreground">Nova Ordem de Serviço</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</label>
                <input value={form.clienteNome} onChange={(e) => setForm({ ...form, clienteNome: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Técnico</label>
                <input value={form.tecnicoNome} onChange={(e) => setForm({ ...form, tecnicoNome: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</label>
                <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={save} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all">Criar OS</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ServiceOrders;
