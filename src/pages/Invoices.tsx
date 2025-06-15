import React from 'react';
import { FileText, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';

const Invoices = () => {
  const invoices = [
    {
      id: 'INV-001',
      client: 'Entreprise ABC',
      amount: '1 250,00 €',
      date: '15/12/2024',
      status: 'paid',
      statusLabel: 'Payée'
    },
    {
      id: 'INV-002',
      client: 'Société XYZ',
      amount: '2 100,00 €',
      date: '12/12/2024',
      status: 'pending',
      statusLabel: 'En attente'
    },
    {
      id: 'INV-003',
      client: 'Start-up DEF',
      amount: '875,00 €',
      date: '08/12/2024',
      status: 'overdue',
      statusLabel: 'En retard'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Factures</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle facture
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Rechercher une facture..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
        </div>

        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{invoice.id}</h3>
                      <p className="text-sm text-gray-500">{invoice.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{invoice.amount}</p>
                      <p className="text-sm text-gray-500">{invoice.date}</p>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.statusLabel}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Invoices;
