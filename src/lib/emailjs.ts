import emailjs from '@emailjs/browser';

// EmailJS configuration
export const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_piksel',
  TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_inquiry',
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'DkAfn8ZGLG16vklhz'
};

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
};

// Send inquiry email
export const sendInquiryEmail = async (data: {
  selectedScreens: string[];
  screenCities: { [screenName: string]: string };
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  message?: string;
  dateRange: string;
}) => {
  // Format screens list for email
  const screensList = data.selectedScreens.map(screen => 
    `${screen} (${data.screenCities[screen]})`
  ).join(', ');

  const templateParams = {
    to_email: 'info@piksel.lt', // Your email
    from_name: data.contactPerson,
    from_email: data.email,
    company_name: data.companyName,
    phone: data.phone || 'Nepateikta',
    message: data.message || 'Nėra papildomos informacijos',
    selected_screens: screensList,
    date_range: data.dateRange,
    inquiry_date: new Date().toLocaleDateString('lt-LT'),
    reply_to: data.email
  };

  try {
    console.log('EmailJS Config:', EMAILJS_CONFIG);
    console.log('Template Params:', templateParams);
    
    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );
    
    console.log('Email sent successfully:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Email send failed:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return { success: false, error };
  }
};
