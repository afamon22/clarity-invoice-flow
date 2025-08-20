import React, { useState, useEffect } from 'react';
import { Shield, Plus, Search, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { AddLoi25Dialog } from '@/components/AddLoi25Dialog';
import { EditLoi25Dialog } from '@/components/EditLoi25Dialog';
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

interface Loi25Entry {
  id: string;
  nom_client: string;
  domaine: string;
  date_expiration: string;
  date_rappel: string | null;
  created_at: string;
  updated_at: string;
}

const Loi25 = () => {
  const [entrees, setEntrees] = useState<Loi25Entry[]>([]);
  const [filteredEntrees, setFilteredEntrees] = useState<Loi25Entry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('loi25_entries')
        .select('*')
        .order('date_expiration', { ascending: true });

      if (error) throw error;
      
      setEntrees(data || []);
      setFilteredEntrees(data || []);
    } catch (error) {
      console.error('Error fetching Loi 25 entries:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les entrées Loi 25",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    const filtered = entrees.filter(entree =>
      entree.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entree.domaine.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEntrees(filtered);
  }, [searchTerm, entrees]);

  const handleAddEntry = async (newEntry: { nomClient: string; domaine: string; dateExpiration: Date; dateRappel: Date }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('loi25_entries')
        .insert([{
          nom_client: newEntry.nomClient,
          domaine: newEntry.domaine,
          date_expiration: newEntry.dateExpiration.toISOString().split('T')[0],
          date_rappel: newEntry.dateRappel.toISOString().split('T')[0],
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'entrée Loi 25 a été ajoutée avec succès",
      });

      fetchEntries();
    } catch (error) {
      console.error('Error adding Loi 25 entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'entrée Loi 25",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) return;

    try {
      const { error } = await supabase
        .from('loi25_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'entrée Loi 25 a été supprimée",
      });

      fetchEntries();
    } catch (error) {
      console.error('Error deleting Loi 25 entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entrée",
        variant: "destructive",
      });
    }
  };

  const getStatut = (dateExpiration: string) => {
    const today = new Date();
    const expDate = new Date(dateExpiration);
    const daysDiff = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysDiff < 0) return 'Non conforme';
    if (daysDiff <= 30) return 'À vérifier';
    return 'Conforme';
  };

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
          <AddLoi25Dialog onAdd={handleAddEntry} />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Rechercher un client..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
              {filteredEntrees.filter(e => getStatut(e.date_expiration) === 'Conforme').length} Conformes
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
              {filteredEntrees.filter(e => getStatut(e.date_expiration) === 'À vérifier').length} À vérifier
            </Badge>
            <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
              {filteredEntrees.filter(e => getStatut(e.date_expiration) === 'Non conforme').length} Non conformes
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredEntrees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {searchTerm ? 'Aucun résultat trouvé' : 'Aucune entrée Loi 25'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntrees.map((entree) => {
                  const statut = getStatut(entree.date_expiration);
                  return (
                    <TableRow key={entree.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          {entree.nom_client}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {entree.domaine}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(entree.date_expiration).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {entree.date_rappel ? new Date(entree.date_rappel).toLocaleDateString('fr-FR') : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(statut)}>
                          {statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <EditLoi25Dialog 
                            entry={entree} 
                            onUpdate={fetchEntries} 
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEntry(entree.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Affichage de {filteredEntrees.length} sur {entrees.length} entrées
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