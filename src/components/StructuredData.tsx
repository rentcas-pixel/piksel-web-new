'use client';

interface StructuredDataProps {
  type?: 'organization' | 'service' | 'localbusiness';
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressCountry?: string;
  };
  services?: string[];
}

export default function StructuredData({ 
  type = 'organization',
  name = 'PIKSEL',
  description = 'Profesionalūs LED reklamos ekranai Lietuvoje. Reklama ekranuose su aukšta kokybe.',
  url = 'https://nextjs-table-app-stable.vercel.app',
  logo = 'https://nextjs-table-app-stable.vercel.app/Piksel-logo-black-2023.png',
  address,
  services
}: StructuredDataProps) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'organization' ? 'Organization' : type === 'service' ? 'Service' : 'LocalBusiness',
    "name": name,
    "description": description,
    "url": url,
    "logo": logo,
    "sameAs": [
      "https://www.facebook.com/piksel.lt",
      "https://www.linkedin.com/company/piksel"
    ]
  };

  const structuredData = {
    ...baseStructuredData,
    ...(address && {
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address.streetAddress || "",
        "addressLocality": address.addressLocality || "Vilnius",
        "addressCountry": address.addressCountry || "LT"
      }
    }),
    ...(services && {
      "serviceType": services,
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "LED Reklamos Paslaugos",
        "itemListElement": services.map((service, index) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service
          },
          "position": index + 1
        }))
      }
    }),
    ...(type === 'service' && {
      "provider": {
        "@type": "Organization",
        "name": "PIKSEL"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Lithuania"
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
