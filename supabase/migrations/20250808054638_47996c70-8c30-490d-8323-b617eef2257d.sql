-- Create a table for Loi 25 compliance entries
CREATE TABLE public.loi25_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nom_client TEXT NOT NULL,
  domaine TEXT NOT NULL,
  date_expiration DATE NOT NULL,
  date_rappel DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.loi25_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own loi25 entries" 
ON public.loi25_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loi25 entries" 
ON public.loi25_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loi25 entries" 
ON public.loi25_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own loi25 entries" 
ON public.loi25_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_loi25_entries_updated_at
BEFORE UPDATE ON public.loi25_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();