import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { AIAssistantDialog } from '@/components/AIAssistantDialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  invoice_id: string;
  statut: string;
  jours_retard: number;
  derniere_relance: string | null;
  invoices?: {
    numero_facture: string;
    montant: number;
    clients?: {
      nom: string;
    };
  };
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    escalated: 0,
    resolved: 0
  });
  const { toast } = useToast();

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select(`
          *,
          invoices (
            numero_facture,
            montant,
            clients (
              nom
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReminders(data || []);
      
      // Calculate stats
      const pending = data?.filter(r => r.statut === 'pending').length || 0;
      const escalated = data?.filter(r => r.statut === 'escalated').length || 0;
      const resolved = data?.filter(r => r.statut === 'resolved').length || 0;
      
      setStats({ pending, escalated, resolved });
    } catch (error) {
      console.error('Erreur lors du chargement des rappels:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rappels.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleSendReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ 
          derniere_relance: new Date().toISOString().split('T')[0],
          statut: 'escalated'
        })
        .eq('id', reminderId);

      if (error) throw error;

      toast({
        title: "Rappel envoyé",
        description: "Le rappel a été envoyé avec succès.",
      });

      fetchReminders();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du rappel:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le rappel.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'escalated': return <AlertCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold text-foreground">Rappels</h1>
          <AIAssistantDialog>
            <Button>
              <AlertCircle className="w-4 h-4 mr-2" />
              Assistant IA
            </Button>
          </AIAssistantDialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Rappels en attente</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Rappels escaladés</p>
                  <p className="text-2xl font-bold text-foreground">{stats.escalated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Rappels résolus ce mois</p>
                  <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rappels actifs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : reminders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Aucun rappel actif.</div>
            ) : (
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(reminder.statut)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-foreground">{reminder.invoices?.numero_facture}</h4>
                          <Badge className={getStatusColor(reminder.statut)}>
                            {reminder.statut === 'pending' ? 'En attente' : 
                             reminder.statut === 'escalated' ? 'Escaladé' : 'Résolu'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{reminder.invoices?.clients?.nom || 'Client non spécifié'}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>Montant: {reminder.invoices?.montant?.toFixed(2) || '0'} €</span>
                          <span>Retard: {reminder.jours_retard} jours</span>
                          {reminder.derniere_relance && (
                            <span>Dernier rappel: {new Date(reminder.derniere_relance).toLocaleDateString('fr-FR')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleSendReminder(reminder.id)}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Envoyer rappel
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reminders;