import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Package, FileText, Wrench, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const statusColor: Record<string, string> = {
  "Pendente": "bg-warning/20 text-warning",
  "Em andamento": "bg-primary/20 text-primary",
  "Concluída": "bg-success/20 text-success",
};

const Dashboard = () => {
  const [stats, setStats] = useState({ clients: 0, orders: 0, products: 0, technicians: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [c, o, p, t] = await Promise.all([
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("service_orders").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("technicians").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        clients: c.count || 0,
        orders: o.count || 0,
        products: p.count || 0,
        technicians: t.count || 0,
      });

      const { data } = await supabase
        .from("service_orders")
        .select("*, clients(nome), technicians(nome)")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentOrders(data || []);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Clientes", value: stats.clients, icon: Users, color: "text-primary" },
    { label: "Ordens Abertas", value: stats.orders, icon: FileText, color: "text-warning" },
    { label: "Produtos", value: stats.products, icon: Package, color: "text-success" },
    { label: "Técnicos", value: stats.technicians, icon: Wrench, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-display font-semibold text-foreground">Ordens Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-left border-b border-border">
                <th className="px-6 py-3 font-medium">Nº</th>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Técnico</th>
                <th className="px-6 py-3 font-medium">Data</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-3 font-mono text-primary">{order.numero}</td>
                  <td className="px-6 py-3 text-foreground">{order.clients?.nome || "-"}</td>
                  <td className="px-6 py-3 text-foreground">{order.technicians?.nome || "-"}</td>
                  <td className="px-6 py-3 text-muted-foreground">{new Date(order.created_at).toLocaleDateString("pt-PT")}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[order.status] || "bg-secondary text-foreground"}`}>{order.status}</span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Nenhuma ordem registada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
