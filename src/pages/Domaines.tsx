import React from 'react';
import { Globe, Plus, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Domaines = () => {
  const domaines = [
    {
      id: 1,
      nom: 'edenstore.ca',
      statut: 'Actif',
      expiration: '2028-04-15',
      statusColor: 'bg-green-500'
    },
    {
      id: 2,
      nom: 'lectubinspire.ca',
      statut: 'Actif',
      expiration: '2026-07-23',
      statusColor: 'bg-green-500'
    },
    {
      id: 3,
      nom: 'annuaireobv.ca',
      statut: 'Expiré',
      expiration: '2026-07-19',
      statusColor: 'bg-red-500'
    },
    {
      id: 4,
      nom: '100deplacer.ca',
      statut: 'Actif',
      expiration: '2026-06-21',
      statusColor: 'bg-green-500'
    },
    {
      id: 5,
      nom: 'mutualadvoyage.com',
      statut: 'Expirant',
      expiration: '2026-06-02',
      statusColor: 'bg-orange-500'
    },
    {
      id: 6,
      nom: 'servicesmccan.com',
      statut: 'Actif',
      expiration: '2026-05-31',
      statusColor: 'bg-green-500'
    },
    {
      id: 7,
      nom: 'obvnews.ca',
      statut: 'Actif',
      expiration: '2026-05-13',
      statusColor: 'bg-green-500'
    },
    {
      id: 8,
      nom: '3kfamegroup.ca',
      statut: 'Actif',
      expiration: '2026-05-01',
      statusColor: 'bg-green-500'
    }
  ];

  const getStatusVariant = (statut: string) => {
    switch (statut) {
      case 'Actif':
        return 'default';
      case 'Expiré':
        return 'destructive';
      case 'Expirant':
        return 'secondary';
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
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Domaines</h1>
              <p className="text-muted-foreground">Gestion des noms de domaine</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un domaine
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Rechercher un domaine..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
              {domaines.filter(d => d.statut === 'Actif').length} Actifs
            </Badge>
            <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-200">
              {domaines.filter(d => d.statut === 'Expirant').length} Expirants
            </Badge>
            <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
              {domaines.filter(d => d.statut === 'Expiré').length} Expirés
            </Badge>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Domaine</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold">Expiration</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domaines.map((domaine) => (
                <TableRow key={domaine.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {domaine.nom}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(domaine.statut)}>
                      {domaine.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(domaine.expiration).toLocaleDateString('fr-FR')}
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
            Affichage de {domaines.length} domaines au total
          </div>
          <div className="flex items-center gap-2">
            <span>Lignes par page: 10</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Domaines;