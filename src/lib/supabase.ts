import { createClient } from '@supabase/supabase-js';

// Configuration Supabase pour l'intégration Lovable
const supabaseUrl = 'https://abymjomtdgraffsvnk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFieW1qb210ZGdyYWZmc3ZuayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzU0NjIzNzc3LCJleHAiOjIwNzAyODM3Nzd9.PAbEUhbK8aJCvmtV-t8DUxQ6qLPPT4K_FKPJnSHFkZs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);