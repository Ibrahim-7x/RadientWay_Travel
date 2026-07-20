// Visa services offered. `flag` is an emoji for quick, dependency-free rendering.
// `about`, `price`, `documentsRequired` and `documentsProvided` feed the
// per-country "Details" modal (see VisaDetailModal).

// Most UAE-resident applications share the same core paperwork, so we keep a
// shared base and spread it into each visa, overriding only what differs.
const baseDocs = [
  'Passport Copy (valid 6+ months)',
  'UAE Visa / Residence Copy',
  'Emirates ID Copy',
  'Recent Photo (white background)',
  'Company NOC Letter',
  '3 Months Bank Statement',
]

const baseProvided = [
  'Professional Assistance',
  'Cover Letter',
  'Application Form Filling',
  'Flight & Hotel Reservations',
  'Travel Insurance',
]

export const visas = [
  {
    country: 'United States',
    flag: '🇺🇸',
    type: 'B1/B2 Tourist & Business',
    processing: '3–6 weeks',
    note: 'Full appointment scheduling & DS-160 support',
    price: 'AED 1,200',
    about:
      "Our USA B1/B2 Visit Visa assistance makes a notoriously complex process simple. We prepare and review your DS-160, help you schedule your consular interview, and coach you on what to expect — so you walk in confident. Whether it's tourism, family visits or business, our team maximises your chances of approval.",
    documentsRequired: [...baseDocs, 'DS-160 Confirmation Details'],
    documentsProvided: [...baseProvided, 'DS-160 Form Preparation', 'Interview Coaching'],
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    type: 'Standard Visitor',
    processing: '3–4 weeks',
    note: 'Document checklist & application review',
    price: 'AED 950',
    about:
      "The UK Standard Visitor Visa lets you explore Britain for tourism, family visits or business. We build a tailored document checklist, review every file for consistency, and complete your online application end-to-end — helping you present a strong, credible case to UKVI.",
    documentsRequired: [...baseDocs, 'Proof of Accommodation'],
    documentsProvided: [...baseProvided, 'Online Application Submission', 'Appointment Booking'],
  },
  {
    country: 'Schengen',
    flag: '🇪🇺',
    type: 'Short-stay (Type C)',
    processing: '2–3 weeks',
    note: 'Covers 27 European countries',
    price: 'AED 850',
    about:
      "One Schengen visa, twenty-seven European countries. Our Type C short-stay assistance covers everything from choosing the correct consulate to preparing your travel itinerary and insurance. We make sure your application is complete and compliant so you can focus on planning the trip of a lifetime.",
    documentsRequired: [...baseDocs, 'Confirmed Travel Itinerary'],
    documentsProvided: [...baseProvided, 'Consulate Appointment Booking', 'Itinerary Preparation'],
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    type: 'Visitor Visa (TRV)',
    processing: '4–8 weeks',
    note: 'Biometrics guidance included',
    price: 'AED 1,100',
    about:
      "Canada's Temporary Resident Visa (TRV) opens the door to breathtaking landscapes and vibrant cities. We guide you through the online IRCC application, prepare a persuasive cover letter, and walk you through the biometrics step — giving your visitor visa the best possible chance.",
    documentsRequired: [...baseDocs, 'Proof of Funds', 'Purpose of Travel Letter'],
    documentsProvided: [...baseProvided, 'IRCC Online Submission', 'Biometrics Guidance'],
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    type: 'Visitor (Subclass 600)',
    processing: '2–4 weeks',
    note: 'Online lodgement handled for you',
    price: 'AED 1,050',
    about:
      "The Australian Visitor Visa (Subclass 600) is your gateway to reefs, rainforests and iconic cities. We handle the full ImmiAccount lodgement, assemble your supporting documents, and manage any additional requests from the department — a genuinely hands-off experience for you.",
    documentsRequired: [...baseDocs, 'Proof of Funds'],
    documentsProvided: [...baseProvided, 'ImmiAccount Lodgement', 'Document Compilation'],
  },
  {
    country: 'New Zealand',
    flag: '🇳🇿',
    type: 'Visitor Visa',
    processing: '3–5 weeks',
    note: 'End-to-end application support',
    price: 'AED 1,000',
    about:
      "Discover New Zealand's stunning fjords, mountains and Māori culture with a Visitor Visa. From your very first consultation to final decision, we prepare your application, verify each document, and keep you updated at every stage — end-to-end support with zero guesswork.",
    documentsRequired: [...baseDocs, 'Proof of Onward Travel'],
    documentsProvided: [...baseProvided, 'Online Application Submission', 'Status Tracking'],
  },
]

export const visaSteps = [
  { step: '01', title: 'Free Consultation', detail: 'We assess your profile and recommend the right visa route.' },
  { step: '02', title: 'Document Prep', detail: 'A tailored checklist and full review of every document.' },
  { step: '03', title: 'Application & Appointment', detail: 'We complete forms and secure your appointment slot.' },
  { step: '04', title: 'Track & Collect', detail: 'We keep you updated until your passport is back in hand.' },
]
