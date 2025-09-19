import React from 'react';

interface StructuredDataProps {
  type: 'organization' | 'website' | 'product';
  name: string;
  description: string;
  url?: string;
  logo?: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
  address?: {
    addressLocality: string;
    addressCountry: string;
  };
  services?: string[];
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, name, description, url, logo, contactPoint, address, services }) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": type === 'organization' ? "Organization" : type === 'website' ? "WebSite" : "Product",
    "name": name,
    "description": description,
  };

  if (url) schema.url = url;
  if (logo) schema.logo = logo;
  if (contactPoint) schema.contactPoint = contactPoint;
  if (address) schema.address = { "@type": "PostalAddress", ...address };
  if (services && services.length > 0) schema.makesOffer = services.map(service => ({
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": service
    }
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default StructuredData;
