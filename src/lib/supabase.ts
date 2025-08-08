import { createClient } from '@supabase/supabase-js';

// Configuration Supabase pour l'intégration Lovable
const supabaseUrl = 'https://abymjoxmtdgralfzswnk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFieW1qb3htdGRncmFsZnpzd25rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjIwMTgsImV4cCI6MjA3MDE5ODAxOH0.uUcWuv42TibfxxKzPIFhpLVeCzVuW1qiYVT1qRCo9vE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);