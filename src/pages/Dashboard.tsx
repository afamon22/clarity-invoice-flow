
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

export default function Dashboard() {
  const actionCards = [
    {
      title: "Ajouter un client",
      description: "Enregistrer un nouveau client dans votre base de données",
      icon: UserPlus,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverScale: "hover:scale-105"
    },
    {
      title: "Voir les échéances", 
      description: "Consulter les renouvellements et dates importantes",
      icon: Calendar,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      hoverScale: "hover:scale-105"
    },
    {
      title: "Envoyer une facture",
      description: "Créer et envoyer une facture à vos clients",
      icon: Send,
      color: "from-purple-500 to-purple-600", 
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      hoverScale: "hover:scale-105"
    },
    {
      title: "Envoyer un rappel",
      description: "Relancer vos clients pour les paiements en retard",
      icon: Bell,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50", 
      iconColor: "text-orange-600",
      hoverScale: "hover:scale-105"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        
        <div className="relative px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <Server className="w-8 h-8 text-white" />
                </div>
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Plateforme de Gestion
              <span className="block text-primary-200">Domaines & Hébergement</span>
            </h1>
            
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Gérez efficacement tous les domaines et services d'hébergement de vos clients. 
              Une solution complète et sécurisée pour le Groupe OBV, avec facturation automatisée, 
              suivi des échéances et gestion centralisée de tous vos services.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-200">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-300 rounded-full mr-2" />
                Gestion centralisée des domaines
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-300 rounded-full mr-2" />
                Facturation automatisée
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-300 rounded-full mr-2" />
                Suivi des renouvellements
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards Section */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Actions Rapides</h2>
            <p className="text-gray-600 text-lg">Accédez rapidement aux fonctionnalités principales de la plateforme</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {actionCards.map((card, index) => (
              <Card key={index} className={`group cursor-pointer transition-all duration-300 ${card.hoverScale} hover:shadow-xl border-0 overflow-hidden`}>
                <div className={`h-2 bg-gradient-to-r ${card.color}`} />
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 ${card.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {card.description}
                  </CardDescription>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-primary-600 hover:text-primary-700 hover:bg-primary-50 group/btn"
                  >
                    <span>Accéder</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">247</div>
                  <div className="text-gray-600">Domaines actifs</div>
                </div>
                <div className="text-center border-l border-r border-gray-200 md:border-l-0 md:border-r-0 md:border-t-0 md:border-b-0">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">98.9%</div>
                  <div className="text-gray-600">Temps de fonctionnement</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
                  <div className="text-gray-600">Clients satisfaits</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
