import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  role: z.enum(['admin', 'user', 'comptable', 'observateur'], {
    message: "Veuillez sélectionner un rôle valide.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface AddTeamMemberDialogProps {
  children: React.ReactNode;
}

export function AddTeamMemberDialog({ children }: AddTeamMemberDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user" as const,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        toast({
          title: "Erreur",
          description: "Cet utilisateur est déjà membre de l'équipe.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Check if invitation already exists
      const { data: existingInvitation } = await supabase
        .from('team_invitations')
        .select('email')
        .eq('email', data.email)
        .eq('status', 'pending')
        .single();

      if (existingInvitation) {
        toast({
          title: "Erreur",
          description: "Une invitation est déjà en cours pour cet email.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Send invitation using Supabase Auth
      const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/`,
          data: {
            display_name: data.name,
            role: data.role
          }
        }
      );

      if (inviteError) {
        throw inviteError;
      }

      // Create invitation record
      const { error: insertError } = await supabase
        .from('team_invitations')
        .insert({
          email: data.email,
          role: data.role,
          invited_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (insertError) {
        throw insertError;
      }
      
      toast({
        title: "Invitation envoyée",
        description: `Une invitation a été envoyée à ${data.email} avec le rôle ${data.role}.`,
      });
      
      form.reset();
      setOpen(false);
    } catch (error: any) {
      console.error('Invitation error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'invitation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inviter un membre</DialogTitle>
          <DialogDescription>
            Invitez un nouveau membre à rejoindre votre équipe.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="jean.dupont@entreprise.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="comptable">Comptable</SelectItem>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="observateur">Observateur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Envoyer l'invitation
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}