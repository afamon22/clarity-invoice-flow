import React from 'react';
import { Users, Plus, Search, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

const Clients = () => {
  const clients = [
    {
      id: 1,
      name: 'Entreprise ABC',
      email: 'contact@entreprise-abc.fr',
      phone: '+33 1 23 45 67 89',
      invoices: 12,
      totalAmount: '15 750,00 €'
    },
    {
      id: 2,
      name: 'Société XYZ',
      email: 'info@societe-xyz.com',
      phone: '+33 1 98 76 54 32',
      invoices: 8,
      totalAmount: '22 100,00 €'
    },
    {
      id: 3,
      name: 'Start-up DEF',
      email: 'hello@startup-def.io',
      phone: '+33 1 11 22 33 44',
      invoices: 5,
      totalAmount: '8 750,00 €'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau client
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Rechercher un client..." className="pl-10" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.invoices} factures</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {client.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {client.phone}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-lg font-semibold text-gray-900">{client.totalAmount}</p>
                  <p className="text-sm text-gray-500">Total facturé</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Clients;
