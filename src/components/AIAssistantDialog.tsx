import React, { useState } from 'react';
import { Brain, Send, Sparkles, MessageSquare, TrendingUp, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIAssistantDialogProps {
  children: React.ReactNode;
}

export const AIAssistantDialog = ({ children }: AIAssistantDialogProps) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    // Add user message to conversation
    const newConversation = [...conversation, { role: 'user' as const, content: userMessage }];
    setConversation(newConversation);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Call AI assistant edge function
      const { data, error } = await supabase.functions.invoke('ai-assistant-reminders', {
        body: { 
          message: userMessage,
          userId: user?.id 
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      const aiResponse = {
        role: 'assistant' as const,
        content: data.response || data.fallbackResponse || "Je rencontre une difficulté technique."
      };
      
      setConversation([...newConversation, aiResponse]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de contacter l'assistant IA",
        variant: "destructive"
      });
      
      // Add error message to conversation
      const errorResponse = {
        role: 'assistant' as const,
        content: "Je rencontre une difficulté technique. Veuillez réessayer dans quelques instants."
      };
      setConversation([...newConversation, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    {
      icon: MessageSquare,
      title: "Générer un rappel personnalisé",
      description: "Créer un message de rappel adapté au profil du client",
      action: () => setMessage("Génère un message de rappel professionnel pour une facture de 2 100€ en retard de 3 jours")
    },
    {
      icon: TrendingUp,
      title: "Analyser les tendances",
      description: "Identifier les patterns dans les retards de paiement",
      action: () => setMessage("Analyse les tendances de mes rappels et propose des améliorations")
    },
    {
      icon: FileText,
      title: "Optimiser la stratégie",
      description: "Recommandations pour améliorer le taux de recouvrement",
      action: () => setMessage("Quelles sont les meilleures pratiques pour améliorer mon taux de recouvrement ?")
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Assistant IA - Gestion des Rappels
          </DialogTitle>
          <DialogDescription>
            Votre assistant intelligent pour optimiser la gestion des rappels et améliorer le recouvrement
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Suggestions Panel */}
          <div className="w-1/3 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Suggestions</h3>
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={suggestion.action}>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <suggestion.icon className="w-4 h-4" />
                    {suggestion.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {suggestion.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
            
            <div className="pt-4 border-t">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                IA Activée
              </Badge>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
              {conversation.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Posez-moi une question sur la gestion de vos rappels</p>
                </div>
              ) : (
                conversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background border'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-background border p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Textarea
                placeholder="Posez votre question à l'assistant IA..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="resize-none"
                rows={2}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim() || isLoading}
                size="icon"
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistantDialog;