import React from 'react';
import { Bell, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';

const Reminders = () => {
  const reminders = [
    {
      id: 1,
      invoice: 'INV-002',
      client: 'Société XYZ',
      amount: '2 100,00 €',
      daysOverdue: 3,
      lastReminder: '10/12/2024',
      status: 'pending'
    },
    {
      id: 2,
      invoice: 'INV-003',
      client: 'Start-up DEF',
      amount: '875,00 €',
      daysOverdue: 7,
      lastReminder: '08/12/2024',
      status: 'escalated'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'escalated': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Rappels</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <Bell className="w-4 h-4 mr-2" />
            Assistant IA
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-2xl font-bold text-gray-900">12</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Rappels en attente</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-gray-900">3</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Rappels escaladés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">28</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Rappels résolus ce mois</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rappels actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      {getStatusIcon(reminder.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{reminder.invoice}</h3>
                      <p className="text-sm text-gray-500">{reminder.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{reminder.amount}</p>
                      <p className="text-sm text-gray-500">{reminder.daysOverdue} jours de retard</p>
                    </div>
                    <Badge className={getStatusColor(reminder.status)}>
                      {reminder.status === 'pending' ? 'En attente' : 'Escaladé'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Envoyer rappel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reminders;
