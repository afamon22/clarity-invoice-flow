-- Créer la table domaines
CREATE TABLE public.domaines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nom_client TEXT NOT NULL,
  nom_domaine TEXT NOT NULL,
  date_expiration DATE NOT NULL,
  date_rappel DATE,
  hebergement BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.domaines ENABLE ROW LEVEL SECURITY;

-- Politiques RLS - les utilisateurs ne voient que leurs propres domaines
CREATE POLICY "Users can view their own domaines" 
ON public.domaines 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own domaines" 
ON public.domaines 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own domaines" 
ON public.domaines 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own domaines" 
ON public.domaines 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger pour mise à jour automatique du timestamp
CREATE TRIGGER update_domaines_updated_at
BEFORE UPDATE ON public.domaines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour optimiser les requêtes
CREATE INDEX idx_domaines_user_id ON public.domaines(user_id);
CREATE INDEX idx_domaines_date_expiration ON public.domaines(date_expiration);