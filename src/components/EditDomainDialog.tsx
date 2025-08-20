import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Edit } from 'lucide-react';

interface Domaine {
  id: string;
  nom_client: string;
  nom_domaine: string;
  date_expiration: string;
  date_rappel: string | null;
  hebergement: boolean;
}

interface EditDomainDialogProps {
  domaine: Domaine;
  onUpdate: (updatedDomain: Domaine) => void;
}

export const EditDomainDialog: React.FC<EditDomainDialogProps> = ({ domaine, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom_client: domaine.nom_client,
    nom_domaine: domaine.nom_domaine,
    date_expiration: domaine.date_expiration,
    date_rappel: domaine.date_rappel || '',
    hebergement: domaine.hebergement,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('domaines')
        .update({
          nom_client: formData.nom_client,
          nom_domaine: formData.nom_domaine,
          date_expiration: formData.date_expiration,
          date_rappel: formData.date_rappel || null,
          hebergement: formData.hebergement,
          updated_at: new Date().toISOString(),
        })
        .eq('id', domaine.id)
        .select()
        .single();

      if (error) throw error;

      onUpdate(data);
      toast({
        title: "Succès",
        description: "Domaine modifié avec succès",
      });
      setOpen(false);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le domaine",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le domaine</DialogTitle>
          <DialogDescription>
            Modifiez les informations du domaine "{domaine.nom_domaine}".
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom_client">Nom du client</Label>
            <Input
              id="nom_client"
              value={formData.nom_client}
              onChange={(e) => setFormData({ ...formData, nom_client: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nom_domaine">Nom de domaine</Label>
            <Input
              id="nom_domaine"
              value={formData.nom_domaine}
              onChange={(e) => setFormData({ ...formData, nom_domaine: e.target.value })}
              placeholder="exemple.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date_expiration">Date d'expiration</Label>
            <Input
              id="date_expiration"
              type="date"
              value={formData.date_expiration}
              onChange={(e) => setFormData({ ...formData, date_expiration: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date_rappel">Date de rappel (optionnel)</Label>
            <Input
              id="date_rappel"
              type="date"
              value={formData.date_rappel}
              onChange={(e) => setFormData({ ...formData, date_rappel: e.target.value })}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="hebergement"
              checked={formData.hebergement}
              onCheckedChange={(checked) => setFormData({ ...formData, hebergement: checked })}
            />
            <Label htmlFor="hebergement">Hébergement inclus</Label>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};