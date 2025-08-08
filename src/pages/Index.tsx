import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Shield,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: FileText,
      title: "Gestion des factures",
      description: "Créez, suivez et gérez toutes vos factures en un seul endroit"
    },
    {
      icon: Users,
      title: "Gestion des clients",
      description: "Organisez votre base de clients avec des profils détaillés"
    },
    {
      icon: TrendingUp,
      title: "Rappels automatiques",
      description: "Automatisez vos relances pour les paiements en retard"
    },
    {
      icon: BarChart3,
      title: "Analyses avancées",
      description: "Obtenez des insights sur vos performances financières"
    },
    {
      icon: Shield,
      title: "Sécurité renforcée",
      description: "Vos données sont protégées par les dernières technologies"
    },
    {
      icon: DollarSign,
      title: "Suivi des revenus",
      description: "Monitirez vos revenus en temps réel avec des tableaux de bord"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Gestion <span className="text-primary">GroupeOBV</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            La solution complète pour gérer vos factures, clients et finances avec simplicité et efficacité
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/auth')}
            >
              Commencer maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              En savoir plus
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-card rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-center mb-8">Pourquoi choisir notre solution ?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Interface intuitive</h3>
                  <p className="text-muted-foreground text-sm">Une interface moderne et facile à utiliser pour tous les niveaux</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Automatisation intelligente</h3>
                  <p className="text-muted-foreground text-sm">Automatisez vos tâches répétitives et gagnez du temps</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Support réactif</h3>
                  <p className="text-muted-foreground text-sm">Une équipe support disponible pour vous accompagner</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Données sécurisées</h3>
                  <p className="text-muted-foreground text-sm">Vos informations sont protégées par un chiffrement de niveau bancaire</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Accès multi-appareils</h3>
                  <p className="text-muted-foreground text-sm">Travaillez depuis n'importe quel appareil, n'importe où</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Mises à jour continues</h3>
                  <p className="text-muted-foreground text-sm">Bénéficiez des dernières fonctionnalités automatiquement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;