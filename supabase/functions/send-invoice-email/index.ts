import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SendInvoiceRequest {
  invoiceData: {
    numero_facture: string;
    montant: number;
    date_facture: string;
    date_echeance: string;
    items: Array<{
      description: string;
      quantity: number;
      price: number;
    }>;
    sous_total: number;
    tps: number;
    tvq: number;
    total: number;
    province: string;
    user_id: string;
  };
  clientData: {
    nom: string;
    email: string;
    telephone?: string;
    adresse?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!mailgunApiKey || !mailgunDomain || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables:', {
        hasApiKey: !!mailgunApiKey,
        hasDomain: !!mailgunDomain,
        hasSupabaseUrl: !!supabaseUrl,
        hasSupabaseKey: !!supabaseServiceKey
      });
      return new Response(
        JSON.stringify({ 
          error: 'Configuration manquante', 
          details: 'Variables d\'environnement manquantes'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const { invoiceData, clientData }: SendInvoiceRequest = await req.json();
    
    console.log('Processing invoice email:', {
      invoiceNumber: invoiceData.numero_facture,
      clientEmail: clientData.email,
      total: invoiceData.total
    });

    // Fetch branding settings
    const brandingSettings = await fetchBrandingSettings(supabaseUrl, supabaseServiceKey, invoiceData.user_id);

    // Generate the HTML content
    const htmlContent = generateInvoiceHtml(invoiceData, clientData, brandingSettings);

// Prepare form data for Mailgun
const formData = new FormData();
const fromHeader = Deno.env.get('MAILGUN_FROM') || `Factures ${brandingSettings?.company_name || 'Votre Entreprise'} <noreply@${mailgunDomain}>`;
formData.append('from', fromHeader);
formData.append('to', clientData.email);
formData.append('subject', `Facture ${invoiceData.numero_facture} - ${brandingSettings?.company_name || 'Votre Entreprise'}`);
formData.append('html', htmlContent);

// Resolve preferred region order
const preferredRegion = (Deno.env.get('MAILGUN_REGION') || '').toLowerCase();
const mailgunUrls = preferredRegion === 'eu'
  ? ['https://api.eu.mailgun.net', 'https://api.mailgun.net']
  : ['https://api.mailgun.net', 'https://api.eu.mailgun.net'];

let lastError: any = null;
for (const baseUrl of mailgunUrls) {
  try {
    const url = `${baseUrl}/v3/${mailgunDomain}/messages`;
    console.log('Attempting to send via', { url, from: fromHeader, to: clientData.email });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`,
      },
      body: formData,
    });

    const contentType = response.headers.get('content-type') || '';
    let bodyJson: any = null;
    let bodyText = '';
    try {
      if (contentType.includes('application/json')) {
        bodyJson = await response.json();
      } else {
        bodyText = await response.text();
      }
    } catch (_) {
      try { bodyText = await response.text(); } catch { /* ignore */ }
    }

    if (response.ok) {
      const result = bodyJson || { message: bodyText };
      console.log('Email sent successfully', { result, baseUrl });
      return new Response(
        JSON.stringify({
          success: true,
          message: result.message || 'Email envoyé avec succès',
          id: result.id,
          region_base_url: baseUrl,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    } else {
      const errInfo = {
        status: response.status,
        statusText: response.statusText,
        baseUrl,
        body: bodyJson || bodyText,
        hint: (response.status === 401 || response.status === 403)
          ? 'Vérifiez l’API key, le domaine Mailgun et l’adresse expéditrice validée.'
          : undefined,
      };
      console.error('Mailgun error', errInfo);
      lastError = errInfo;
      // Try next region if available
      continue;
    }
  } catch (error) {
    console.error('Network error with Mailgun', { baseUrl, error });
    lastError = { baseUrl, error: String(error) };
  }
}

// Return detailed error to the client (200 to surface details in UI)
return new Response(
  JSON.stringify({ success: false, error: 'MailgunError', details: lastError }),
  { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
);

  } catch (error: any) {
    console.error('Error in send-invoice-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'envoi de l\'email', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function fetchBrandingSettings(supabaseUrl: string, supabaseServiceKey: string, userId: string) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/company_settings?user_id=eq.${userId}`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log('No branding settings found, using defaults');
      return null;
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching branding settings:', error);
    return null;
  }
}

function generateInvoiceHtml(invoiceData: any, clientData: any, brandingSettings: any = null): string {
  const itemsHtml = invoiceData.items.map((item: any) => `
    <tr>
      <td>${item.description}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">${item.price.toFixed(2)} €</td>
      <td style="text-align: right;">${(item.quantity * item.price).toFixed(2)} €</td>
    </tr>
  `).join('');

  const companyName = brandingSettings?.company_name || 'Votre Entreprise';
  const logoUrl = brandingSettings?.logo_url;
  const primaryColor = brandingSettings?.primary_color || '#3b82f6';
  const companyAddress = brandingSettings?.address || '123 Rue de l\'Exemple\n75000 Paris, France';
  const companyPhone = brandingSettings?.phone || '01 23 45 67 89';
  const companyEmail = brandingSettings?.email || 'contact@votreentreprise.fr';
  const companySiret = brandingSettings?.siret || '';
  const companyWebsite = brandingSettings?.website || '';

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Facture ${invoiceData.numero_facture}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .invoice-container {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 3px solid ${primaryColor};
          padding-bottom: 20px;
        }
        .company-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .company-logo {
          max-width: 120px;
          max-height: 80px;
          object-fit: contain;
        }
        .company-details {
          flex: 1;
        }
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: ${primaryColor};
          margin-bottom: 10px;
        }
        .invoice-details {
          text-align: right;
          flex: 1;
        }
        .invoice-title {
          font-size: 32px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }
        .invoice-number {
          font-size: 18px;
          color: #666;
        }
        .parties {
          display: flex;
          justify-content: space-between;
          margin: 40px 0;
        }
        .party {
          flex: 1;
          margin-right: 20px;
        }
        .party h3 {
          color: ${primaryColor};
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .items-table th {
          background: ${primaryColor};
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: 600;
        }
        .items-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #e5e7eb;
        }
        .items-table tbody tr:hover {
          background-color: #f8f9fa;
        }
        .total-section {
          margin-top: 30px;
          text-align: right;
        }
        .total-line {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .total-line.final {
          font-size: 20px;
          font-weight: bold;
          color: ${primaryColor};
          border-bottom: 3px solid ${primaryColor};
          padding: 15px 0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 14px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        .thank-you {
          background: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid ${primaryColor};
          margin: 30px 0;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="company-info">
            ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" class="company-logo" />` : ''}
            <div class="company-details">
              <div class="company-name">${companyName}</div>
              <div style="white-space: pre-line;">${companyAddress}</div>
              ${companyPhone ? `<div>Tél: ${companyPhone}</div>` : ''}
              ${companyEmail ? `<div>Email: ${companyEmail}</div>` : ''}
              ${companyWebsite ? `<div>Web: ${companyWebsite}</div>` : ''}
              ${companySiret ? `<div>SIRET: ${companySiret}</div>` : ''}
            </div>
          </div>
          <div class="invoice-details">
            <div class="invoice-title">FACTURE</div>
            <div class="invoice-number">#${invoiceData.numero_facture}</div>
            <div style="margin-top: 15px;">
              <div><strong>Date:</strong> ${new Date(invoiceData.date_facture).toLocaleDateString('fr-FR')}</div>
              <div><strong>Échéance:</strong> ${new Date(invoiceData.date_echeance).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
        </div>

        <div class="parties">
          <div class="party">
            <h3>Facturé à:</h3>
            <div><strong>${clientData.nom}</strong></div>
            <div>${clientData.email}</div>
            ${clientData.telephone ? `<div>${clientData.telephone}</div>` : ''}
            ${clientData.adresse ? `<div>${clientData.adresse}</div>` : ''}
          </div>
          <div class="party">
            <h3>Informations de paiement:</h3>
            <div>Veuillez effectuer le paiement avant la date d'échéance.</div>
            <div style="margin-top: 10px;">
              <strong>Montant total: ${invoiceData.total} €</strong>
            </div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Quantité</th>
              <th style="text-align: right;">Prix unitaire</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-line">
            <span><strong>Sous-total:</strong></span>
            <span>${invoiceData.sous_total} €</span>
          </div>
          <div class="total-line">
            <span><strong>TPS (${invoiceData.province === 'QC' ? '5%' : 'Variable'}):</strong></span>
            <span>${invoiceData.tps} €</span>
          </div>
          <div class="total-line">
            <span><strong>TVQ (${invoiceData.province === 'QC' ? '9.975%' : 'Variable'}):</strong></span>
            <span>${invoiceData.tvq} €</span>
          </div>
          <div class="total-line final">
            <span>TOTAL:</span>
            <span>${invoiceData.total} €</span>
          </div>
        </div>

        <div class="thank-you">
          <p><strong>Merci pour votre confiance!</strong></p>
          <p>Pour toute question concernant cette facture, n'hésitez pas à nous contacter.</p>
        </div>

        <div class="footer">
          <p>Cette facture a été générée automatiquement par notre système de facturation.</p>
          <p>${companyName} - Tous droits réservés © ${new Date().getFullYear()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);