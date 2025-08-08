import { createClient } from '@supabase/supabase-js';

// Configuration Supabase pour l'intégration Lovable
const supabaseUrl = 'https://abymjoxmtdgralfzswnk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFieW1qb210ZGdyYWxmemF3bmsiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc1NDYyMjAxOCwiZXhwIjoyMDcwMTk4MDE4fQ.uUcWuv42TibfxxKzPIFhpLVeCzVuW1qiYVT1qRCo9vE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);