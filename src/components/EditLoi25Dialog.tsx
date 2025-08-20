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
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';

interface Loi25Entry {
  id: string;
  nom_client: string;
  domaine: string;
  date_expiration: string;
  date_rappel: string | null;
}

interface EditLoi25DialogProps {
  entry: Loi25Entry;
  onUpdate: () => void;
}

export const EditLoi25Dialog: React.FC<EditLoi25DialogProps> = ({ entry, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom_client: entry.nom_client,
    domaine: entry.domaine,
    date_expiration: entry.date_expiration,
    date_rappel: entry.date_rappel || '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('loi25_entries')
        .update({
          nom_client: formData.nom_client,
          domaine: formData.domaine,
          date_expiration: formData.date_expiration,
          date_rappel: formData.date_rappel || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entry.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'entrée Loi 25 a été modifiée avec succès",
      });
      
      setOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'entrée Loi 25",
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
          <Settings className="w-4 h-4 mr-2" />
          Gérer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'entrée Loi 25</DialogTitle>
          <DialogDescription>
            Modifiez les informations de conformité pour "{entry.nom_client}".
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
            <Label htmlFor="domaine">Domaine</Label>
            <Input
              id="domaine"
              value={formData.domaine}
              onChange={(e) => setFormData({ ...formData, domaine: e.target.value })}
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