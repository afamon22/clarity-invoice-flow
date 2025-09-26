
import React, { useState } from 'react';
import { Plus, Trash2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export const InvoiceForm = ({ isOpen, onClose }: InvoiceFormProps) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`);
  const [dueDate, setDueDate] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: 'Conformité Loi 25 - Audit initial', quantity: 1, price: 500.00 },
    { id: '2', description: 'Enregistrement nom de domaine (.com)', quantity: 1, price: 15.99 },
    { id: '3', description: 'Hébergement web - Plan professionnel (1 an)', quantity: 1, price: 120.00 }
  ]);
  const [province, setProvince] = useState('QC'); // Défaut Québec pour TPS + TVQ
  const { toast } = useToast();

  // Taux de taxes canadiens
  const TAX_RATES = {
    'QC': { tps: 0.05, tvq: 0.09975, name: 'Québec' },
    'ON': { tps: 0.13, tvq: 0, name: 'Ontario (HST)' },
    'BC': { tps: 0.05, tvq: 0.07, name: 'Colombie-Britannique' },
    'AB': { tps: 0.05, tvq: 0, name: 'Alberta' },
    'SK': { tps: 0.05, tvq: 0.06, name: 'Saskatchewan' },
    'MB': { tps: 0.05, tvq: 0.07, name: 'Manitoba' },
    'NB': { tps: 0.15, tvq: 0, name: 'Nouveau-Brunswick (HST)' },
    'NS': { tps: 0.15, tvq: 0, name: 'Nouvelle-Écosse (HST)' },
    'PE': { tps: 0.15, tvq: 0, name: 'Île-du-Prince-Édouard (HST)' },
    'NL': { tps: 0.15, tvq: 0, name: 'Terre-Neuve-et-Labrador (HST)' },
    'YT': { tps: 0.05, tvq: 0, name: 'Yukon' },
    'NT': { tps: 0.05, tvq: 0, name: 'Territoires du Nord-Ouest' },
    'NU': { tps: 0.05, tvq: 0, name: 'Nunavut' }
  };

  // Services types prédéfinis
  const SERVICE_TEMPLATES = [
    { description: 'Conformité Loi 25 - Audit initial', price: 500.00 },
    { description: 'Conformité Loi 25 - Mise en conformité complète', price: 1200.00 },
    { description: 'Conformité Loi 25 - Suivi annuel', price: 300.00 },
    { description: 'Enregistrement nom de domaine (.com)', price: 15.99 },
    { description: 'Enregistrement nom de domaine (.ca)', price: 19.99 },
    { description: 'Renouvellement nom de domaine (.com)', price: 15.99 },
    { description: 'Hébergement web - Plan basique (1 an)', price: 60.00 },
    { description: 'Hébergement web - Plan professionnel (1 an)', price: 120.00 },
    { description: 'Hébergement web - Plan entreprise (1 an)', price: 240.00 },
    { description: 'Migration hébergement', price: 150.00 },
    { description: 'Configuration SSL', price: 50.00 },
    { description: 'Maintenance mensuelle', price: 75.00 }
  ];

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const calculateTPS = () => {
    return calculateSubtotal() * TAX_RATES[province as keyof typeof TAX_RATES].tps;
  };

  const calculateTVQ = () => {
    return calculateSubtotal() * TAX_RATES[province as keyof typeof TAX_RATES].tvq;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTPS() + calculateTVQ();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Find client by name or create new one
      let clientId = null;
      const { data: existingClients } = await supabase
        .from('clients')
        .select('id')
        .eq('nom', clientName)
        .eq('user_id', user.id);

      if (existingClients && existingClients.length > 0) {
        clientId = existingClients[0].id;
      }

      const invoiceData = {
        user_id: user.id,
        client_id: clientId,
        numero_facture: invoiceNumber,
        montant: calculateTotal(),
        date_facture: new Date().toISOString().split('T')[0],
        date_echeance: dueDate,
        statut: 'pending',
        statut_label: 'En attente',
        items: lineItems,
        sous_total: calculateSubtotal(),
        tps: calculateTPS(),
        tvq: calculateTVQ(),
        total: calculateTotal(),
        province
      };

      const { error } = await supabase
        .from('invoices')
        .insert([invoiceData]);

      if (error) throw error;

      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès.",
      });

      resetForm();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setInvoiceNumber(`FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`);
    setDueDate('');
    setLineItems([
      { id: '1', description: 'Conformité Loi 25 - Audit initial', quantity: 1, price: 500.00 },
      { id: '2', description: 'Enregistrement nom de domaine (.com)', quantity: 1, price: 15.99 },
      { id: '3', description: 'Hébergement web - Plan professionnel (1 an)', quantity: 1, price: 120.00 }
    ]);
    setProvince('QC');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Créer une nouvelle facture
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations client */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations client</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Nom du client *</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nom de l'entreprise ou du client"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email du client *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="contact@client.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations facture */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la facture</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Numéro de facture</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="FAC-2024-001"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Date d'échéance *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province/Territoire *</Label>
                  <Select value={province} onValueChange={setProvince}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une province" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TAX_RATES).map(([code, data]) => (
                        <SelectItem key={code} value={code}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lignes de facturation */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Services</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLineItem}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un service
                </Button>
              </div>

              {/* Services templates */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Services suggérés</h4>
                    <p className="text-sm text-blue-700">Cliquez pour ajouter rapidement un service à votre facture</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_TEMPLATES.map((template, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => {
                        const newItem: LineItem = {
                          id: Date.now().toString(),
                          description: template.description,
                          quantity: 1,
                          price: template.price
                        };
                        setLineItems([...lineItems, newItem]);
                      }}
                    >
                      {template.description} - {template.price.toFixed(2)} $ CAD
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      <Label htmlFor={`description-${item.id}`}>Description</Label>
                      <Input
                        id={`description-${item.id}`}
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        placeholder="Ex: Conformité Loi 25, Nom de domaine, Hébergement..."
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`quantity-${item.id}`}>Quantité</Label>
                      <Input
                        id={`quantity-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`price-${item.id}`}>Prix unitaire ($ CAD)</Label>
                      <Input
                        id={`price-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateLineItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Label>Total</Label>
                      <div className="h-10 flex items-center justify-center bg-gray-50 rounded-md text-sm font-medium">
                        {(item.quantity * item.price).toFixed(2)} $
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length === 1}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-end">
                  <div className="text-right space-y-2 min-w-[200px]">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total:</span>
                      <span>{calculateSubtotal().toFixed(2)} $ CAD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>TPS ({(TAX_RATES[province as keyof typeof TAX_RATES].tps * 100).toFixed(1)}%):</span>
                      <span>{calculateTPS().toFixed(2)} $ CAD</span>
                    </div>
                    {TAX_RATES[province as keyof typeof TAX_RATES].tvq > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>TVQ ({(TAX_RATES[province as keyof typeof TAX_RATES].tvq * 100).toFixed(3)}%):</span>
                        <span>{calculateTVQ().toFixed(2)} $ CAD</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                      <span>Total:</span>
                      <span>{calculateTotal().toFixed(2)} $ CAD</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Créer la facture
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
