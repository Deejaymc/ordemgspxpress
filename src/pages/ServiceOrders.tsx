import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, X, FileDown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Client = Tables<"clients">;
type Technician = Tables<"technicians">;

const statusColor: Record<string, string> = {
  "Pendente": "bg-warning/20 text-warning",
  "Em andamento": "bg-primary/20 text-primary",
  "Concluída": "bg-success/20 text-success",
};

const ServiceOrders = () => {
  const { isAdmin, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ client_id: "", technician_id: "", descricao: "", status: "Pendente" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [ordersRes, clientsRes, techsRes] = await Promise.all([
      supabase.from("service_orders").select("*, clients(nome, nif, endereco, cidade, telefone, email), technicians(nome)").order("created_at", { ascending: false }),
      supabase.from("clients").select("*").order("nome"),
      supabase.from("technicians").select("*").order("nome"),
    ]);
    setOrders(ordersRes.data || []);
    setClients(clientsRes.data || []);
    setTechnicians(techsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = orders.filter((o) =>
    [o.numero, o.clients?.nome, o.technicians?.nome].some((v) => (v || "").toLowerCase().includes(search.toLowerCase()))
  );

  const openNew = () => { setForm({ client_id: "", technician_id: "", descricao: "", status: "Pendente" }); setModalOpen(true); };

  const save = async () => {
    if (!form.client_id) return;
    setSaving(true);
    const count = orders.length + 1;
    const numero = `OS-${String(count).padStart(3, "0")}`;
    const { error } = await supabase.from("service_orders").insert({
      numero,
      client_id: form.client_id,
      technician_id: form.technician_id || null,
      descricao: form.descricao,
      status: form.status,
      created_by: user?.id,
    });
    if (error) toast.error(error.message); else toast.success("OS criada");
    setSaving(false);
    setModalOpen(false);
    fetchAll();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("service_orders").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("OS removida"); fetchAll(); }
  };

  const exportPDF = async (order: any) => {
    const { data: company } = await supabase.from("company_settings").select("*").limit(1).single();
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
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 15px; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="header">
        <div class="logo"><span>e</span>GPS<br/>express</div>
        <div style="text-align: right;">
          <h2 style="margin: 0; color: #2196F3;">ORDEM DE SERVIÇO</h2>
          <p style="margin: 4px 0; font-size: 18px; font-weight: bold;">${order.numero}</p>
          <p style="margin: 4px 0; font-size: 14px;">Data: ${new Date(order.created_at).toLocaleDateString("pt-PT")}</p>
        </div>
      </div>
      <div class="info">
        <h3>Dados da Empresa</h3>
        <p><strong>${company?.nome || "GPSXPRESS"}</strong></p>
        <p>NIF: ${company?.nif || ""} | Tel: ${company?.telefone || ""}</p>
        <p>${company?.endereco || ""} - ${company?.cidade || ""}</p>
        <p>Email: ${company?.email || ""}</p>
      </div>
      <div class="info">
        <h3>Dados do Cliente</h3>
        <p><strong>${order.clients?.nome || ""}</strong></p>
        <p>NIF: ${order.clients?.nif || ""} | Tel: ${order.clients?.telefone || ""}</p>
        <p>${order.clients?.endereco || ""} - ${order.clients?.cidade || ""}</p>
        <p>Email: ${order.clients?.email || ""}</p>
      </div>
      <div class="info">
        <h3>Detalhes do Serviço</h3>
        <p><strong>Técnico:</strong> ${order.technicians?.nome || "-"}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Descrição:</strong> ${order.descricao || "-"}</p>
      </div>
      <div style="margin-top: 60px; display: flex; justify-content: space-between;">
        <div style="text-align: center; width: 200px;"><div style="border-top: 1px solid #333; padding-top: 8px; font-size: 13px;">Assinatura do Cliente</div></div>
        <div style="text-align: center; width: 200px;"><div style="border-top: 1px solid #333; padding-top: 8px; font-size: 13px;">Assinatura do Técnico</div></div>
      </div>
      <div class="footer">${company?.nome || "GPSXPRESS"} - Sistema de Ordens de Serviço</div>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

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
                  <td className="px-6 py-3 text-foreground">{o.clients?.nome || "-"}</td>
                  <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">{o.technicians?.nome || "-"}</td>
                  <td className="px-6 py-3 text-muted-foreground hidden sm:table-cell">{new Date(o.created_at).toLocaleDateString("pt-PT")}</td>
                  <td className="px-6 py-3"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[o.status] || "bg-secondary text-foreground"}`}>{o.status}</span></td>
                  <td className="px-6 py-3 text-right space-x-1">
                    <button onClick={() => exportPDF(o)} className="p-1.5 rounded-md hover:bg-success/10 text-success transition-colors" title="Exportar PDF"><FileDown className="h-4 w-4" /></button>
                    {isAdmin && <button onClick={() => remove(o.id)} className="p-1.5 rounded-md hover:bg-accent/10 text-accent transition-colors"><Trash2 className="h-4 w-4" /></button>}
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
                <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Selecione um cliente</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Técnico</label>
                <select value={form.technician_id} onChange={(e) => setForm({ ...form, technician_id: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Selecione um técnico</option>
                  {technicians.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</label>
                <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Criar OS
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ServiceOrders;
