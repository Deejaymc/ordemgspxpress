import { motion } from "framer-motion";
import { Users, Package, FileText, Wrench, TrendingUp, Clock } from "lucide-react";

const stats = [
  { label: "Clientes", value: "124", icon: Users, color: "text-primary" },
  { label: "Ordens Abertas", value: "18", icon: FileText, color: "text-warning" },
  { label: "Produtos", value: "56", icon: Package, color: "text-success" },
  { label: "Técnicos", value: "8", icon: Wrench, color: "text-accent" },
];

const recentOrders = [
  { id: "OS-001", client: "João Silva", status: "Em andamento", date: "2026-02-25", tech: "Carlos Mendes" },
  { id: "OS-002", client: "Maria Santos", status: "Concluída", date: "2026-02-24", tech: "Ana Costa" },
  { id: "OS-003", client: "Pedro Oliveira", status: "Pendente", date: "2026-02-24", tech: "Bruno Lima" },
  { id: "OS-004", client: "Lucia Ferreira", status: "Em andamento", date: "2026-02-23", tech: "Carlos Mendes" },
];

const statusColor: Record<string, string> = {
  "Pendente": "bg-warning/20 text-warning",
  "Em andamento": "bg-primary/20 text-primary",
  "Concluída": "bg-success/20 text-success",
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl overflow-hidden"
      >
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
                  <td className="px-6 py-3 font-mono text-primary">{order.id}</td>
                  <td className="px-6 py-3 text-foreground">{order.client}</td>
                  <td className="px-6 py-3 text-foreground">{order.tech}</td>
                  <td className="px-6 py-3 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
