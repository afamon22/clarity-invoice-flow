import React, { useState } from 'react';
import { Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';

const Branding = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    logo: null as File | null,
    primaryColor: '#7F3DFF',
    secondaryColor: '#F3F4F6',
    companyName: '',
    siret: '',
    address: '',
    postalCode: '',
    city: '',
    country: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "Le fichier ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }
      setFormData(prev => ({ ...prev, logo: file }));
      toast({
        title: "Logo téléchargé",
        description: `Fichier ${file.name} ajouté avec succès`
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos paramètres de branding ont été mis à jour"
    });
  };

  const handleBrowseFiles = () => {
    document.getElementById('logo-upload')?.click();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Branding</h1>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Logo de l'entreprise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={handleBrowseFiles}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {formData.logo ? `Logo sélectionné: ${formData.logo.name}` : 'Glissez votre logo ici ou cliquez pour parcourir'}
                </p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG jusqu'à 5MB</p>
              </div>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" className="w-full" onClick={handleBrowseFiles}>
                Parcourir les fichiers
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Couleurs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primary-color">Couleur principale</Label>
                <div className="flex items-center space-x-3 mt-2">
                  <div 
                    className="w-10 h-10 rounded-lg border" 
                    style={{ backgroundColor: formData.primaryColor }}
                  ></div>
                  <Input 
                    id="primary-color" 
                    value={formData.primaryColor} 
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="flex-1" 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary-color">Couleur secondaire</Label>
                <div className="flex items-center space-x-3 mt-2">
                  <div 
                    className="w-10 h-10 rounded-lg border" 
                    style={{ backgroundColor: formData.secondaryColor }}
                  ></div>
                  <Input 
                    id="secondary-color" 
                    value={formData.secondaryColor} 
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="flex-1" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informations légales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input 
                    id="company-name" 
                    placeholder="Votre entreprise" 
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="mt-2" 
                  />
                </div>
                <div>
                  <Label htmlFor="siret">SIRET</Label>
                  <Input 
                    id="siret" 
                    placeholder="123 456 789 00012" 
                    value={formData.siret}
                    onChange={(e) => handleInputChange('siret', e.target.value)}
                    className="mt-2" 
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input 
                    id="address" 
                    placeholder="123 Rue de la Paix" 
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="mt-2" 
                  />
                </div>
                <div>
                  <Label htmlFor="postal-code">Code postal</Label>
                  <Input 
                    id="postal-code" 
                    placeholder="75001" 
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="mt-2" 
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input 
                    id="city" 
                    placeholder="Paris" 
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="mt-2" 
                  />
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Input 
                    id="country" 
                    placeholder="France" 
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="mt-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Aperçu du modèle de facture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-white">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="w-24 h-16 bg-gray-200 rounded mb-2"></div>
                    <h2 className="text-xl font-bold text-primary">GroupeObv</h2>
                  </div>
                  <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-900">FACTURE</h1>
                    <p className="text-gray-600">N° INV-001</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Facturé à:</h3>
                    <p className="text-gray-600">Nom du client</p>
                    <p className="text-gray-600">Adresse du client</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Détails:</h3>
                    <p className="text-gray-600">Date: 15/12/2024</p>
                    <p className="text-gray-600">Échéance: 15/01/2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Branding;
