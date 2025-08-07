import React from 'react';
import { Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/Layout';

const Branding = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Branding</h1>
          <Button className="bg-primary hover:bg-primary/90">
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Glissez votre logo ici ou cliquez pour parcourir</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG jusqu'à 5MB</p>
              </div>
              <Button variant="outline" className="w-full">
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
                  <div className="w-10 h-10 bg-primary rounded-lg border"></div>
                  <Input id="primary-color" value="#7F3DFF" className="flex-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary-color">Couleur secondaire</Label>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg border"></div>
                  <Input id="secondary-color" value="#F3F4F6" className="flex-1" />
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
                  <Input id="company-name" placeholder="Votre entreprise" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="siret">SIRET</Label>
                  <Input id="siret" placeholder="123 456 789 00012" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" placeholder="123 Rue de la Paix" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="postal-code">Code postal</Label>
                  <Input id="postal-code" placeholder="75001" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" placeholder="Paris" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Input id="country" placeholder="France" className="mt-2" />
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
