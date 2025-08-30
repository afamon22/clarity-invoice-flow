import React, { useState, useEffect } from 'react';
import { Globe, Search, Settings, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { AddDomainDialog } from '@/components/AddDomainDialog';
import { EditDomainDialog } from '@/components/EditDomainDialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Domaine {
  id: string;
  nom_client: string;
  nom_domaine: string;
  date_expiration: string;
  date_rappel: string | null;
  hebergement: boolean;
  created_at: string;
  updated_at: string;
}

const Domaines = () => {
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const getStatut = (dateExpiration: string) => {
    const today = new Date();
    const expiration = new Date(dateExpiration);
    const diffDays = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expiré';
    if (diffDays <= 30) return 'Expirant';
    return 'Actif';
  };

  const getRappelStatus = (dateRappel: string | null) => {
    if (!dateRappel) return null;
    
    const today = new Date();
    const rappel = new Date(dateRappel);
    const diffDays = Math.ceil((rappel.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Rappel aujourd\'hui';
    if (diffDays <= 30) return `Rappel dans ${diffDays}j`;
    return null;
  };

  const fetchDomaines = async () => {
    try {
      const { data, error } = await supabase
        .from('domaines')
        .select('*')
        .order('date_expiration', { ascending: true });

      if (error) throw error;
      setDomaines(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des domaines:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les domaines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDomaine = async (id: string) => {
    try {
      const { error } = await supabase
        .from('domaines')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDomaines(domaines.filter(d => d.id !== id));
      toast({
        title: "Succès",
        description: "Domaine supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le domaine",
        variant: "destructive",
      });
    }
  };

  const handleDomainAdded = (newDomain: Domaine) => {
    setDomaines([...domaines, newDomain]);
  };

  const handleDomainUpdated = (updatedDomain: Domaine) => {
    setDomaines(domaines.map(d => d.id === updatedDomain.id ? updatedDomain : d));
  };

  useEffect(() => {
    fetchDomaines();
  }, []);

  const filteredDomaines = domaines.filter(domaine =>
    domaine.nom_domaine.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domaine.nom_client.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </Layout>
    );
  }

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
          <AddDomainDialog onAdd={handleDomainAdded} />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Rechercher un domaine..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
              {filteredDomaines.filter(d => getStatut(d.date_expiration) === 'Actif').length} Actifs
            </Badge>
            <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-200">
              {filteredDomaines.filter(d => getStatut(d.date_expiration) === 'Expirant').length} Expirants
            </Badge>
            <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
              {filteredDomaines.filter(d => getStatut(d.date_expiration) === 'Expiré').length} Expirés
            </Badge>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Domaine</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold">Expiration</TableHead>
                <TableHead className="font-semibold">Rappel</TableHead>
                <TableHead className="font-semibold">Hébergement</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDomaines.map((domaine) => {
                const statut = getStatut(domaine.date_expiration);
                const rappelStatus = getRappelStatus(domaine.date_rappel);
                return (
                  <TableRow key={domaine.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        {domaine.nom_domaine}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {domaine.nom_client}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(statut)}>
                        {statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(domaine.date_expiration).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {rappelStatus ? (
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-200">
                          {rappelStatus}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={domaine.hebergement ? "default" : "secondary"}>
                        {domaine.hebergement ? "Oui" : "Non"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <EditDomainDialog 
                          domaine={domaine} 
                          onUpdate={handleDomainUpdated} 
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer le domaine</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer le domaine "{domaine.nom_domaine}" ? 
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteDomaine(domaine.id)}>
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Affichage de {filteredDomaines.length} domaines sur {domaines.length} au total
          </div>
          <div className="flex items-center gap-2">
            <span>Mise à jour en temps réel</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Domaines;