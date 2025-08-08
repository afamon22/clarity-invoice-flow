import React, { useState, useEffect } from 'react';
import { FileText, Plus, Filter, Search, Send, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { InvoiceForm } from '@/components/InvoiceForm';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  numero_facture: string;
  montant: number;
  date_facture: string;
  date_echeance: string;
  statut: string;
  statut_label: string;
  clients?: {
    nom: string;
  };
}

const Invoices = () => {
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (
            nom
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des factures:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les factures.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.numero_facture.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.clients?.nom || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-foreground">Factures</h1>
          <Button 
            onClick={() => setIsInvoiceFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle facture
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Rechercher une facture..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'Aucune facture trouvée.' : 'Aucune facture. Créez votre première facture.'}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-lg">Facture #{invoice.numero_facture}</h3>
                        <Badge 
                          variant="secondary" 
                          className={getStatusColor(invoice.statut)}
                        >
                          {invoice.statut_label}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><span className="font-medium">Client:</span> {invoice.clients?.nom || 'Non spécifié'}</p>
                        <p><span className="font-medium">Date:</span> {new Date(invoice.date_facture).toLocaleDateString('fr-FR')}</p>
                        <p><span className="font-medium">Échéance:</span> {new Date(invoice.date_echeance).toLocaleDateString('fr-FR')}</p>
                        <p><span className="font-medium">Montant:</span> <span className="font-semibold text-lg">{invoice.montant.toFixed(2)} €</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm">
                        <Send className="w-4 h-4 mr-1" />
                        Envoyer
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

        <InvoiceForm 
          isOpen={isInvoiceFormOpen} 
          onClose={() => {
            setIsInvoiceFormOpen(false);
            fetchInvoices(); // Refresh invoices after creating one
          }} 
        />
    </Layout>
  );
};

export default Invoices;
