import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    console.log('AI Assistant request:', { message, userId });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Fetch reminder and invoice data for context
    const { data: reminders, error: remindersError } = await supabase
      .from('reminders')
      .select(`
        *,
        invoices (
          invoice_number,
          amount,
          due_date,
          clients (
            name,
            email
          )
        )
      `);

    if (remindersError) {
      console.error('Error fetching reminders:', remindersError);
    }

    // Create AI system prompt with context
    const systemPrompt = `Tu es un assistant IA spécialisé dans la gestion des rappels de paiement et du recouvrement. 

Contexte des données actuelles:
${reminders ? `- ${reminders.length} rappels en cours
- Statuts: ${reminders.map(r => r.status).join(', ')}
- Clients concernés: ${reminders.map(r => r.invoices?.clients?.name).filter(Boolean).join(', ')}` : '- Aucune donnée de rappel disponible'}

Tes capacités principales:
1. Analyser les tendances de retard de paiement
2. Générer des messages de rappel personnalisés et efficaces
3. Recommander des stratégies d'optimisation du recouvrement
4. Proposer des actions prioritaires basées sur les montants et délais

Réponds de manière professionnelle, concise et actionnable. Utilise les données fournies pour donner des conseils personnalisés.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      context: {
        remindersCount: reminders?.length || 0,
        hasData: !!reminders && reminders.length > 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant-reminders function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackResponse: "Je rencontre une difficulté technique. Veuillez réessayer dans quelques instants."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});