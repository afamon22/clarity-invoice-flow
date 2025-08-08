
import { 
  UserPlus, 
  Calendar, 
  Send, 
  Bell,
  Shield,
  Server,
  Globe,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const actionCards = [
    {
      title: "Ajouter un client",
      description: "Enregistrer un nouveau client dans votre base de données",
      icon: UserPlus,
      href: "/clients",
      bgClass: "border-l-4 border-primary/50 bg-gradient-to-r from-primary/5 to-background",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Voir les échéances", 
      description: "Consulter les renouvellements et dates importantes",
      icon: Calendar,
      href: "/reminders",
      bgClass: "border-l-4 border-emerald-500/50 bg-gradient-to-r from-emerald-500/5 to-background",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      title: "Envoyer une facture",
      description: "Créer et envoyer une facture à vos clients",
      icon: Send,
      href: "/invoices",
      bgClass: "border-l-4 border-purple-500/50 bg-gradient-to-r from-purple-500/5 to-background",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Envoyer un rappel",
      description: "Relancer vos clients pour les paiements en retard",
      icon: Bell,
      href: "/reminders",
      bgClass: "border-l-4 border-orange-500/50 bg-gradient-to-r from-orange-500/5 to-background",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-xl border">
          <div className="relative p-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Server className="w-8 h-8 text-primary" />
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Plateforme de Gestion
                <span className="block text-primary">Domaines & Hébergement</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Gérez efficacement tous les domaines et services d'hébergement de vos clients. 
                Une solution complète et sécurisée pour le Groupe OBV.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                  Gestion centralisée des domaines
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                  Facturation automatisée
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                  Suivi des renouvellements
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards Section */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Actions Rapides</h2>
            <p className="text-muted-foreground text-lg">Accédez rapidement aux fonctionnalités principales de la plateforme</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actionCards.map((card, index) => (
              <Card 
                key={index} 
                className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${card.bgClass}`}
                onClick={() => navigate(card.href)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-foreground mb-2">
                        {card.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground leading-relaxed">
                        {card.description}
                      </CardDescription>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats Section */}
        <Card className="bg-card border">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">247</div>
                <div className="text-muted-foreground">Domaines actifs</div>
              </div>
              <div className="text-center border-l border-r border-border md:border-l-0 md:border-r-0">
                <div className="text-3xl font-bold text-emerald-500 mb-2">98.9%</div>
                <div className="text-muted-foreground">Temps de fonctionnement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">156</div>
                <div className="text-muted-foreground">Clients satisfaits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
