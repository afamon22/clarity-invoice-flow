-- Create hebergements table
CREATE TABLE public.hebergements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nom_client TEXT NOT NULL,
  serveur TEXT NOT NULL,
  type_hebergement TEXT NOT NULL,
  date_expiration DATE NOT NULL,
  date_rappel DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hebergements ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own hebergements" 
ON public.hebergements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hebergements" 
ON public.hebergements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hebergements" 
ON public.hebergements 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hebergements" 
ON public.hebergements 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hebergements_updated_at
BEFORE UPDATE ON public.hebergements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();