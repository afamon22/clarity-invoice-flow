import React from 'react';
import { UserPlus, Settings, Shield, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@entreprise.com',
      role: 'Administrateur',
      roleColor: 'bg-purple-100 text-purple-800',
      icon: Shield,
      lastActive: 'En ligne'
    },
    {
      id: 2,
      name: 'Marie Martin',
      email: 'marie.martin@entreprise.com',
      role: 'Comptable',
      roleColor: 'bg-blue-100 text-blue-800',
      icon: Settings,
      lastActive: 'Il y a 2h'
    },
    {
      id: 3,
      name: 'Pierre Durand',
      email: 'pierre.durand@entreprise.com',
      role: 'Observateur',
      roleColor: 'bg-green-100 text-green-800',
      icon: Eye,
      lastActive: 'Il y a 1 jour'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Équipe & Rôles</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Inviter un membre
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">1</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Administrateur</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">1</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Comptable</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">1</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Observateur</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Membres de l'équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <member.icon className="w-6 h-6 text-primary-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={member.roleColor}>
                        {member.role}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{member.lastActive}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Modifier
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Team;
