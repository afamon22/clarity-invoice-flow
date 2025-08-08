import React, { useEffect, useState } from 'react';
import { UserPlus, Settings, Shield, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { AddTeamMemberDialog } from '@/components/AddTeamMemberDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Team = () => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'comptable': return Settings;
      case 'observateur': return Eye;
      default: return UserPlus;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'comptable': return 'bg-blue-100 text-blue-800';
      case 'observateur': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'comptable': return 'Comptable';
      case 'observateur': return 'Observateur';
      case 'user': return 'Utilisateur';
      default: return role;
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      // Fetch team members
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (profilesError) throw profilesError;

      // Fetch pending invitations
      const { data: invitations, error: invitationsError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (invitationsError) throw invitationsError;

      setTeamMembers(profiles || []);
      setPendingInvitations(invitations || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de l'équipe.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendInvitation = async (invitationId: string, email: string) => {
    try {
      const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) throw error;

      toast({
        title: "Invitation renvoyée",
        description: `L'invitation a été renvoyée à ${email}.`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de renvoyer l'invitation.",
        variant: "destructive",
      });
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'expired' })
        .eq('id', invitationId);

      if (error) throw error;

      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
      toast({
        title: "Invitation annulée",
        description: "L'invitation a été annulée avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler l'invitation.",
        variant: "destructive",
      });
    }
  };

  const roleCounts = teamMembers.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Équipe & Rôles</h1>
          <AddTeamMemberDialog>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Inviter un membre
            </Button>
          </AddTeamMemberDialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">{roleCounts.admin || 0}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Administrateur</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">{roleCounts.comptable || 0}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Comptable</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-gray-600" />
                <span className="text-2xl font-bold text-gray-900">{roleCounts.user || 0}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Utilisateur</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">{roleCounts.observateur || 0}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Observateur</p>
            </CardContent>
          </Card>
        </div>

        {pendingInvitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Invitations en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingInvitations.map((invitation) => {
                  const RoleIcon = getRoleIcon(invitation.role);
                  return (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-6 h-6 text-yellow-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{invitation.email}</h3>
                          <p className="text-sm text-gray-500">Invitation envoyée le {new Date(invitation.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getRoleColor(invitation.role)}>
                            {getRoleDisplayName(invitation.role)}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">En attente</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => resendInvitation(invitation.id, invitation.email)}
                          >
                            Renvoyer
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => cancelInvitation(invitation.id)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Membres de l'équipe</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chargement...</p>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun membre dans l'équipe pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member) => {
                  const RoleIcon = getRoleIcon(member.role);
                  return (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <RoleIcon className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.display_name}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getRoleColor(member.role)}>
                            {getRoleDisplayName(member.role)}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">Actif</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Modifier
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Team;
