import React from 'react';
import { Shield, Plus, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { AddLoi25Dialog } from '@/components/AddLoi25Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Loi25 = () => {
  const entrees = [
    {
      id: 1,
      nomClient: 'Groupe OBV',
      domaine: 'edenstore.ca',
      dateExpiration: '2025-12-15',
      dateRappel: '2025-11-15',
      statut: 'Conforme'
    },
    {
      id: 2,
      nomClient: 'TechCorp Inc.',
      domaine: 'lectubinspire.ca',
      dateExpiration: '2025-08-20',
      dateRappel: '2025-07-20',
      statut: 'À vérifier'
    },
    {
      id: 3,
      nomClient: 'Services MCCan',
      domaine: 'servicesmccan.com',
      dateExpiration: '2025-10-10',
      dateRappel: '2025-09-10',
      statut: 'Conforme'
    }
  ];

  const getStatusVariant = (statut: string) => {
    switch (statut) {
      case 'Conforme':
        return 'default';
      case 'À vérifier':
        return 'secondary';
      case 'Non conforme':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Loi 25</h1>
              <p className="text-muted-foreground">Gestion de la conformité Loi 25</p>
            </div>
          </div>
          <AddLoi25Dialog onAdd={(loi25) => console.log('Nouvelle entrée Loi 25:', loi25)} />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Rechercher un client..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
              {entrees.filter(e => e.statut === 'Conforme').length} Conformes
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
              {entrees.filter(e => e.statut === 'À vérifier').length} À vérifier
            </Badge>
            <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
              {entrees.filter(e => e.statut === 'Non conforme').length} Non conformes
            </Badge>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Nom du client</TableHead>
                <TableHead className="font-semibold">Domaine</TableHead>
                <TableHead className="font-semibold">Date d'expiration</TableHead>
                <TableHead className="font-semibold">Date de rappel</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entrees.map((entree) => (
                <TableRow key={entree.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {entree.nomClient}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entree.domaine}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(entree.dateExpiration).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(entree.dateRappel).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(entree.statut)}>
                      {entree.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Gérer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Affichage de {entrees.length} entrées au total
          </div>
          <div className="flex items-center gap-2">
            <span>Lignes par page: 10</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Loi25;