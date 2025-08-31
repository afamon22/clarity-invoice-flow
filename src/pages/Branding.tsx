import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';

const Branding = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [brandingData, setBrandingData] = useState({
    logo: null as File | null,
    companyName: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    address: '',
    siret: '',
    phone: '',
    email: '',
    website: ''
  });

  useEffect(() => {
    fetchBrandingData();
  }, []);

  const fetchBrandingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching branding data:', error);
        return;
      }

      if (data) {
        setBrandingData({
          logo: null,
          companyName: data.company_name || '',
          primaryColor: data.primary_color || '#3b82f6',
          secondaryColor: data.secondary_color || '#64748b',
          address: data.address || '',
          siret: data.siret || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || ''
        });
        setLogoPreview(data.logo_url);
      }
    } catch (error) {
      console.error('Error fetching branding data:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erreur",
          description: "Le fichier ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setBrandingData(prev => ({ ...prev, logo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Logo sélectionné",
        description: "Le logo sera sauvegardé lors de l'enregistrement"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBrandingData(prev => ({ ...prev, [field]: value }));
  };

  const uploadLogo = async (file: File, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour sauvegarder",
          variant: "destructive"
        });
        return;
      }

      let logoUrl = logoPreview;

      // Upload logo if a new file is selected
      if (brandingData.logo) {
        const uploadedUrl = await uploadLogo(brandingData.logo, user.id);
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        } else {
          toast({
            title: "Erreur",
            description: "Erreur lors de l'upload du logo",
            variant: "destructive"
          });
          return;
        }
      }

      // Check if settings already exist
      const { data: existingData } = await supabase
        .from('company_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const settingsData = {
        user_id: user.id,
        company_name: brandingData.companyName,
        logo_url: logoUrl,
        primary_color: brandingData.primaryColor,
        secondary_color: brandingData.secondaryColor,
        address: brandingData.address,
        siret: brandingData.siret,
        phone: brandingData.phone,
        email: brandingData.email,
        website: brandingData.website
      };

      let error;
      if (existingData) {
        // Update existing settings
        ({ error } = await supabase
          .from('company_settings')
          .update(settingsData)
          .eq('user_id', user.id));
      } else {
        // Create new settings
        ({ error } = await supabase
          .from('company_settings')
          .insert(settingsData));
      }

      if (error) {
        console.error('Error saving branding data:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la sauvegarde",
          variant: "destructive"
        });
        return;
      }

      setLogoPreview(logoUrl);
      setBrandingData(prev => ({ ...prev, logo: null }));

      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres de branding ont été sauvegardés avec succès"
      });
    } catch (error) {
      console.error('Error saving branding data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paramètres de branding</h1>
          <p className="text-muted-foreground">
            Personnalisez l'apparence de vos factures et documents
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Logo de l'entreprise</CardTitle>
              <CardDescription>
                Uploadez le logo qui apparaîtra sur vos factures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {logoPreview ? (
                    <div className="space-y-4">
                      <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="text-sm text-gray-600">Logo actuel</p>
                    </div>
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">📋</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mb-4">
                    {logoPreview ? 'Cliquez pour changer le logo' : 'Glissez votre logo ici ou cliquez pour parcourir'}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleBrowseFiles}
                    className="mb-2"
                  >
                    {logoPreview ? 'Changer le logo' : 'Parcourir les fichiers'}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <p className="text-xs text-gray-500">
                    PNG, JPG, SVG jusqu'à 5MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Couleurs du thème</CardTitle>
              <CardDescription>
                Définissez les couleurs de votre identité visuelle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primary-color">Couleur principale</Label>
                <div className="flex items-center space-x-3 mt-2">
                  <input
                    type="color"
                    value={brandingData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input 
                    id="primary-color" 
                    value={brandingData.primaryColor} 
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="flex-1" 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary-color">Couleur secondaire</Label>
                <div className="flex items-center space-x-3 mt-2">
                  <input
                    type="color"
                    value={brandingData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input 
                    id="secondary-color" 
                    value={brandingData.secondaryColor} 
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="flex-1" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>
                Ces informations apparaîtront sur vos factures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                  <Input
                    id="companyName"
                    value={brandingData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Ex: Mon Entreprise SARL"
                  />
                </div>
                <div>
                  <Label htmlFor="siret">SIRET</Label>
                  <Input
                    id="siret"
                    value={brandingData.siret}
                    onChange={(e) => handleInputChange('siret', e.target.value)}
                    placeholder="12345678901234"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adresse complète</Label>
                  <Input
                    id="address"
                    value={brandingData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Rue de la Paix, 75001 Paris"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={brandingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="01 23 45 67 89"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={brandingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@monentreprise.fr"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={brandingData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.monentreprise.fr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Aperçu du modèle de facture</CardTitle>
              <CardDescription>
                Voici comment vos factures apparaîtront avec vos paramètres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border rounded-lg p-6 bg-white"
                style={{ 
                  borderColor: brandingData.primaryColor + '20',
                  background: `linear-gradient(135deg, ${brandingData.primaryColor}08, ${brandingData.secondaryColor}08)`
                }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <img 
                        src={logoPreview} 
                        alt="Logo" 
                        className="w-16 h-16 object-contain"
                      />
                    )}
                    <div>
                      <h2 
                        className="text-xl font-bold"
                        style={{ color: brandingData.primaryColor }}
                      >
                        {brandingData.companyName || 'Votre Entreprise'}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {brandingData.address || 'Adresse de votre entreprise'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 
                      className="text-2xl font-bold"
                      style={{ color: brandingData.primaryColor }}
                    >
                      FACTURE
                    </h1>
                    <p className="text-gray-600">N° INV-001</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div>
                    <h3 
                      className="font-semibold mb-2"
                      style={{ color: brandingData.primaryColor }}
                    >
                      Facturé à:
                    </h3>
                    <p className="text-gray-600">Nom du client</p>
                    <p className="text-gray-600">Adresse du client</p>
                  </div>
                  <div>
                    <h3 
                      className="font-semibold mb-2"
                      style={{ color: brandingData.primaryColor }}
                    >
                      Détails:
                    </h3>
                    <p className="text-gray-600">Date: {new Date().toLocaleDateString('fr-FR')}</p>
                    <p className="text-gray-600">Total: 1 234,56 €</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Branding;