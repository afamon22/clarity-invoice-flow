import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY");
const mailgunDomain = Deno.env.get("MAILGUN_DOMAIN") || "sandboxXXX.mailgun.org"; // Utilisez votre domaine Mailgun

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
  };
  clientData: {
    nom: string;
    email: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoiceData, clientData }: SendInvoiceRequest = await req.json();

    // Generate invoice HTML
    const invoiceHtml = generateInvoiceHtml(invoiceData, clientData);

    // Préparer les données pour Mailgun
    const formData = new FormData();
    formData.append("from", `GroupeOBV <noreply@${mailgunDomain}>`);
    formData.append("to", clientData.email);
    formData.append("subject", `Facture ${invoiceData.numero_facture} - Client: ${clientData.nom}`);
    formData.append("html", invoiceHtml);

    // Envoyer l'email via Mailgun
    const emailResponse = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`api:${mailgunApiKey}`)}`,
      },
      body: formData,
    });

    const emailResult = await emailResponse.json();
    
    if (!emailResponse.ok) {
      throw new Error(`Erreur Mailgun: ${emailResult.message || 'Erreur inconnue'}`);
    }

    console.log("Invoice email sent successfully via Mailgun:", emailResult);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-invoice-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateInvoiceHtml(invoiceData: any, clientData: any): string {
  const itemsHtml = invoiceData.items.map((item: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.description}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} €</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(item.quantity * item.price).toFixed(2)} €</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Facture ${invoiceData.numero_facture}</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 800px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #6366f1; color: white; padding: 30px;">
          <h1 style="margin: 0; font-size: 28px;">GroupeOBV</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Gestion domaines</p>
        </div>
        
        <!-- Invoice Info -->
        <div style="padding: 30px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div>
              <h2 style="color: #374151; margin: 0 0 10px 0;">Facture</h2>
              <p style="margin: 0; color: #6b7280;"><strong>Numéro:</strong> ${invoiceData.numero_facture}</p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> ${new Date(invoiceData.date_facture).toLocaleDateString('fr-FR')}</p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Échéance:</strong> ${new Date(invoiceData.date_echeance).toLocaleDateString('fr-FR')}</p>
            </div>
            <div style="text-align: right;">
              <h3 style="color: #374151; margin: 0;">Facturé à:</h3>
              <p style="margin: 5px 0; color: #6b7280;"><strong>${clientData.nom}</strong></p>
              <p style="margin: 5px 0; color: #6b7280;">${clientData.email}</p>
            </div>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #374151;">Description</th>
                <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #374151;">Qté</th>
                <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #374151;">Prix unitaire</th>
                <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #374151;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="margin-left: auto; width: 300px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #6b7280;">Sous-total:</span>
              <span style="color: #374151; font-weight: 500;">${invoiceData.sous_total.toFixed(2)} €</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #6b7280;">TPS (5%):</span>
              <span style="color: #374151; font-weight: 500;">${invoiceData.tps.toFixed(2)} €</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <span style="color: #6b7280;">TVQ (9.975%):</span>
              <span style="color: #374151; font-weight: 500;">${invoiceData.tvq.toFixed(2)} €</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <span style="color: #374151; font-weight: 600; font-size: 18px;">Total:</span>
              <span style="color: #6366f1; font-weight: 700; font-size: 20px;">${invoiceData.total.toFixed(2)} €</span>
            </div>
          </div>

          <!-- Footer -->
          <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
            <p style="margin: 0;">Merci pour votre confiance !</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">GroupeOBV - Gestion domaines</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);