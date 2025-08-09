import React, { useState, useEffect } from 'react';
import { FileText, Plus, Filter, Search, Send, Eye, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { InvoiceForm } from '@/components/InvoiceForm';
import { EditInvoiceForm } from '@/components/EditInvoiceForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
  items?: any[];
  sous_total: number;
  tps: number;
  tvq: number;
  total: number;
  clients?: {
    nom: string;
    email: string;
  };
}

const Invoices = () => {
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sendingInvoice, setSendingInvoice] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (
            nom,
            email
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

  const handleSendInvoice = async (invoice: Invoice) => {
    if (!invoice.clients?.nom) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la facture : client non trouvé.",
        variant: "destructive",
      });
      return;
    }

    setSendingInvoice(invoice.id);
    
    try {
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          invoiceData: {
            numero_facture: invoice.numero_facture,
            montant: invoice.montant,
            date_facture: invoice.date_facture,
            date_echeance: invoice.date_echeance,
            items: invoice.items || [],
            sous_total: invoice.sous_total,
            tps: invoice.tps,
            tvq: invoice.tvq,
            total: invoice.total,
          },
          clientData: {
            nom: invoice.clients.nom,
            email: invoice.clients.email || 'client@email.com',
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Facture ${invoice.numero_facture} envoyée par email.`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la facture:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la facture par email.",
        variant: "destructive",
      });
    } finally {
      setSendingInvoice(null);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditDialogOpen(true);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceToDelete.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Facture supprimée avec succès.",
      });

      fetchInvoices();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la facture.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setInvoiceToDelete(null);
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleSendInvoice(invoice)}
                        disabled={sendingInvoice === invoice.id}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        {sendingInvoice === invoice.id ? 'Envoi...' : 'Envoyer'}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteInvoice(invoice)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

        {/* Dialog de modification */}
        <EditInvoiceForm
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedInvoice(null);
            fetchInvoices();
          }}
          invoice={selectedInvoice}
        />

        {/* Dialog de visualisation */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Facture #{selectedInvoice?.numero_facture}</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Informations client</h3>
                    <p><strong>Nom:</strong> {selectedInvoice.clients?.nom || 'Non spécifié'}</p>
                    <p><strong>Email:</strong> {selectedInvoice.clients?.email || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Détails facture</h3>
                    <p><strong>Date:</strong> {new Date(selectedInvoice.date_facture).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Échéance:</strong> {new Date(selectedInvoice.date_echeance).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Statut:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(selectedInvoice.statut)}`}>
                        {selectedInvoice.statut_label}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Services</h3>
                  <div className="space-y-2">
                    {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                      selectedInvoice.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{item.description}</p>
                            <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{(item.quantity * item.price).toFixed(2)} €</p>
                            <p className="text-sm text-gray-600">{item.price.toFixed(2)} € / unité</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Aucun service spécifié</p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <div className="text-right space-y-2 min-w-[200px]">
                      <div className="flex justify-between">
                        <span>Sous-total:</span>
                        <span>{selectedInvoice.sous_total.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TPS:</span>
                        <span>{selectedInvoice.tps.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TVQ:</span>
                        <span>{selectedInvoice.tvq.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>{selectedInvoice.total.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmation de suppression */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer la facture</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer la facture #{invoiceToDelete?.numero_facture} ? 
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteInvoice}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </Layout>
  );
};

export default Invoices;
