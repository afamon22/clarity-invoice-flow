import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AddHebergementDialog } from "@/components/AddHebergementDialog";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Pencil, Trash2, Server } from "lucide-react";
import { toast } from "sonner";

interface HebergementEntry {
  id: string;
  nom_client: string;
  serveur: string;
  type_hebergement: string;
  date_expiration: string;
  date_rappel?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function Hebergement() {
  const { user } = useAuth();
  const [hebergements, setHebergements] = useState<HebergementEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatut = (dateExpiration: string) => {
    const today = new Date();
    const expiration = new Date(dateExpiration);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Expiré", variant: "destructive" as const };
    if (diffDays <= 30) return { text: "Expire bientôt", variant: "secondary" as const };
    return { text: "Actif", variant: "default" as const };
  };

  const getRappelStatus = (dateRappel?: string) => {
    if (!dateRappel) return null;
    
    const today = new Date();
    const rappel = new Date(dateRappel);
    const diffTime = rappel.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { text: "Rappel envoyé", variant: "destructive" as const };
    if (diffDays <= 7) return { text: "Rappel imminent", variant: "secondary" as const };
    return { text: `Rappel dans ${diffDays}j`, variant: "outline" as const };
  };

  const fetchHebergements = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('hebergements')
        .select('*')
        .eq('user_id', user.id)
        .order('date_expiration', { ascending: true });

      if (error) throw error;
      setHebergements(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des hébergements:', error);
      toast.error("Erreur lors du chargement des hébergements");
    } finally {
      setLoading(false);
    }
  };

  const deleteHebergement = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('hebergements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHebergements(hebergements.filter(h => h.id !== id));
      toast.success("Hébergement supprimé avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleHebergementAdded = (newHebergement: HebergementEntry) => {
    setHebergements([...hebergements, newHebergement]);
  };

  useEffect(() => {
    fetchHebergements();
  }, [user]);

  const filteredHebergements = hebergements.filter(hebergement =>
    hebergement.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hebergement.serveur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hebergement.type_hebergement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Expiré":
        return "destructive";
      case "Expire bientôt":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hébergements</h1>
            <p className="text-muted-foreground">
              Gérez vos services d'hébergement et leurs renouvellements
            </p>
          </div>
          <AddHebergementDialog onAdd={handleHebergementAdded} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Services d'hébergement
            </CardTitle>
            <CardDescription>
              {filteredHebergements.length} hébergement(s) trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par client, serveur ou type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Serveur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Rappel</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHebergements.map((hebergement) => {
                  const statut = getStatut(hebergement.date_expiration);
                  const rappelStatus = getRappelStatus(hebergement.date_rappel);

                  return (
                    <TableRow key={hebergement.id}>
                      <TableCell className="font-medium">
                        {hebergement.nom_client}
                      </TableCell>
                      <TableCell>{hebergement.serveur}</TableCell>
                      <TableCell>{hebergement.type_hebergement}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(statut.text)}>
                          {statut.text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(hebergement.date_expiration).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        {rappelStatus ? (
                          <Badge variant={rappelStatus.variant}>
                            {rappelStatus.text}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer l'hébergement</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cet hébergement ? Cette action ne peut pas être annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteHebergement(hebergement.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
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

            {filteredHebergements.length === 0 && (
              <div className="text-center py-8">
                <Server className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun hébergement trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Aucun résultat pour votre recherche." : "Commencez par ajouter votre premier hébergement."}
                </p>
                {!searchTerm && (
                  <AddHebergementDialog onAdd={handleHebergementAdded} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}