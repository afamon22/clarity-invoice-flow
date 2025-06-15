import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/Layout';

const Settings = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Notifications par email</Label>
                  <p className="text-sm text-gray-500">Recevoir des notifications pour les nouveaux paiements</p>
                </div>
                <Switch id="email-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminder-notifications">Rappels automatiques</Label>
                  <p className="text-sm text-gray-500">Envoyer des rappels automatiques pour les factures en retard</p>
                </div>
                <Switch id="reminder-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">Rapports hebdomadaires</Label>
                  <p className="text-sm text-gray-500">Recevoir un résumé hebdomadaire de l'activité</p>
                </div>
                <Switch id="weekly-reports" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-gray-500">Ajouter une couche de sécurité supplémentaire</p>
                </div>
                <Button variant="outline">Configurer</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mot de passe</Label>
                  <p className="text-sm text-gray-500">Dernière modification il y a 30 jours</p>
                </div>
                <Button variant="outline">Modifier</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Facturation et abonnement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Plan actuel</Label>
                  <p className="text-sm text-gray-500">Plan Professionnel - 29€/mois</p>
                </div>
                <Button variant="outline">Gérer l'abonnement</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Méthode de paiement</Label>
                  <p className="text-sm text-gray-500">•••• •••• •••• 1234</p>
                </div>
                <Button variant="outline">Modifier</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="w-5 h-5 mr-2" />
                Préférences générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">Sauvegarde automatique</Label>
                  <p className="text-sm text-gray-500">Sauvegarder automatiquement les brouillons</p>
                </div>
                <Switch id="auto-save" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Mode sombre</Label>
                  <p className="text-sm text-gray-500">Utiliser le thème sombre</p>
                </div>
                <Switch id="dark-mode" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
