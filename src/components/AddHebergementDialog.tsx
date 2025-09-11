import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

const formSchema = z.object({
  nom_client: z.string().min(1, "Le nom du client est requis"),
  serveur: z.string().min(1, "Le nom du serveur est requis"),
  type_hebergement: z.string().min(1, "Le type d'hébergement est requis"),
  date_expiration: z.date({
    required_error: "La date d'expiration est requise",
  }),
  date_rappel: z.date().optional(),
});

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

interface AddHebergementDialogProps {
  onAdd?: (hebergement: HebergementEntry) => void;
}

export function AddHebergementDialog({ onAdd }: AddHebergementDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom_client: "",
      serveur: "",
      type_hebergement: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter un hébergement");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('hebergements')
        .insert([
          {
            user_id: user.id,
            nom_client: values.nom_client,
            serveur: values.serveur,
            type_hebergement: values.type_hebergement,
            date_expiration: values.date_expiration.toISOString().split('T')[0],
            date_rappel: values.date_rappel 
              ? values.date_rappel.toISOString().split('T')[0] 
              : null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Hébergement ajouté avec succès");
      form.reset();
      setOpen(false);
      
      if (onAdd && data) {
        onAdd(data);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout de l'hébergement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel hébergement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un hébergement</DialogTitle>
          <DialogDescription>
            Renseignez les informations du nouvel hébergement.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom_client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du client</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serveur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serveur</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: server1.exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type_hebergement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'hébergement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="shared">Hébergement partagé</SelectItem>
                      <SelectItem value="vps">VPS</SelectItem>
                      <SelectItem value="dedicated">Serveur dédié</SelectItem>
                      <SelectItem value="cloud">Cloud</SelectItem>
                      <SelectItem value="managed">Hébergement géré</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_expiration"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date d'expiration</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_rappel"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de rappel (optionnel)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Ajout en cours..." : "Ajouter l'hébergement"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}