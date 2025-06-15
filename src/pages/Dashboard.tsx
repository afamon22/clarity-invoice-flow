import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Euro, 
  FileText, 
  Clock, 
  AlertTriangle,
  Plus,
  Eye,
  Send,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { InvoiceForm } from "@/components/InvoiceForm";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const monthlyData = [
  { name: 'Jan', payees: 12500, impayees: 3200 },
  { name: 'Fév', payees: 15600, impayees: 2800 },
  { name: 'Mar', payees: 18900, impayees: 4100 },
  { name: 'Avr', payees: 22300, impayees: 1900 },
  { name: 'Mai', payees: 19800, impayees: 5200 },
  { name: 'Jun', payees: 24500, impayees: 3800 },
];

const statusData = [
  { name: 'Payées', value: 68, color: '#10B981' },
  { name: 'En attente', value: 22, color: '#F59E0B' },
  { name: 'En retard', value: 10, color: '#EF4444' },
];

const recentInvoices = [
  {
    id: 'FAC-2024-001',
    client: 'TechCorp SARL',
    amount: 2450,
    status: 'paid',
    date: '2024-01-15',
    dueDate: '2024-02-15'
  },
  {
    id: 'FAC-2024-002',
    client: 'Design Studio',
    amount: 1680,
    status: 'pending',
    date: '2024-01-12',
    dueDate: '2024-02-12'
  },
  {
    id: 'FAC-2024-003',
    client: 'Commerce Plus',
    amount: 3200,
    status: 'overdue',
    date: '2023-12-20',
    dueDate: '2024-01-20'
  },
  {
    id: 'FAC-2024-004',
    client: 'Innovation Lab',
    amount: 1950,
    status: 'sent',
    date: '2024-01-10',
    dueDate: '2024-02-10'
  },
];

const upcomingReminders = [
  {
    client: 'TechCorp SARL',
    invoice: 'FAC-2024-005',
    amount: 1800,
    daysOverdue: 3,
    priority: 'high'
  },
  {
    client: 'Design Studio',
    invoice: 'FAC-2024-006',
    amount: 2200,
    daysOverdue: 1,
    priority: 'medium'
  },
  {
    client: 'Commerce Plus',
    invoice: 'FAC-2024-007',
    amount: 950,
    daysOverdue: 7,
    priority: 'high'
  },
];

export default function Dashboard() {
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de votre activité de facturation</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Voir tout
            </Button>
            <Button 
              className="bg-gradient-primary hover:opacity-90"
              onClick={() => setIsInvoiceFormOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Facture
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Revenus ce mois</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">24 500€</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+12.5%</span>
                    <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Euro className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Factures émises</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">142</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600 font-medium">+8.2%</span>
                    <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">En attente</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">8 420€</p>
                  <div className="flex items-center mt-2">
                    <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-yellow-600 font-medium">31 factures</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">En retard</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">3 180€</p>
                  <div className="flex items-center mt-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600 font-medium">14 factures</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="premium-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Évolution des revenus</CardTitle>
              <CardDescription>Comparaison des factures payées vs impayées</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    formatter={(value) => [`${value}€`, '']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="payees" fill="#7F3DFF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="impayees" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Statut des factures</CardTitle>
              <CardDescription>Répartition par statut</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <Card className="premium-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Factures récentes</CardTitle>
                  <CardDescription>Dernières factures émises</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvoices.map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{invoice.id}</p>
                        <p className="font-semibold text-gray-900">{invoice.amount}€</p>
                      </div>
                      <p className="text-sm text-gray-600">{invoice.client}</p>
                      <p className="text-xs text-gray-500">Échéance: {invoice.dueDate}</p>
                    </div>
                    <div className="ml-4">
                      <Badge 
                        className={`
                          ${invoice.status === 'paid' ? 'stat-indicator-success' : ''}
                          ${invoice.status === 'pending' ? 'stat-indicator-warning' : ''}
                          ${invoice.status === 'overdue' ? 'stat-indicator-danger' : ''}
                          ${invoice.status === 'sent' ? 'stat-indicator bg-blue-100 text-blue-800' : ''}
                        `}
                      >
                        {invoice.status === 'paid' ? 'Payée' : ''}
                        {invoice.status === 'pending' ? 'En attente' : ''}
                        {invoice.status === 'overdue' ? 'En retard' : ''}
                        {invoice.status === 'sent' ? 'Envoyée' : ''}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Reminders */}
          <Card className="premium-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Rappels à envoyer</CardTitle>
                  <CardDescription>Factures nécessitant un suivi</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                  <Send className="w-4 h-4 mr-1" />
                  Gérer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingReminders.map((reminder, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{reminder.invoice}</p>
                        <p className="font-semibold text-gray-900">{reminder.amount}€</p>
                      </div>
                      <p className="text-sm text-gray-600">{reminder.client}</p>
                      <p className="text-xs text-gray-500">En retard de {reminder.daysOverdue} jours</p>
                    </div>
                    <div className="ml-4">
                      <Badge 
                        className={`
                          ${reminder.priority === 'high' ? 'stat-indicator-danger' : 'stat-indicator-warning'}
                        `}
                      >
                        {reminder.priority === 'high' ? 'Urgent' : 'Modéré'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Form Modal */}
      <InvoiceForm 
        isOpen={isInvoiceFormOpen}
        onClose={() => setIsInvoiceFormOpen(false)}
      />
    </div>
  );
}
