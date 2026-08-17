// Demo content for `npm run seed` — the site's original bundled data.
//
// This used to live in src/data/*.js and ship inside the frontend bundle, which
// meant the live site rendered it whether or not the database held anything.
// It now exists only here: the seed writes it to the database, the frontend
// reads the database. Editing a package in /admin changes what visitors see;
// editing this file changes nothing until you reseed an empty table.

// Unsplash helper — builds an optimised CDN URL from a photo id. Deliberately
// duplicated from src/data/packages.js rather than imported across the
// frontend/server boundary: it is three lines, and the seed writes the
// resolved URLs into the database anyway.
const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const packages = [
  {
    slug: 'escape-to-armenia',
    name: 'Escape to Armenia',
    country: 'Armenia',
    region: 'Caucasus',
    city: 'Yerevan',
    tagline: 'Ancient monasteries, alpine lakes & warm hospitality',
    nights: 3,
    days: 4,
    occupancy: 'Quad sharing',
    price: 1250,
    currency: 'AED',
    hotelStars: 4,
    rating: 4.9,
    featured: true,
    image: img('1585687501004-615dfdfb6f37'),
    gallery: [img('1585687501004-615dfdfb6f37'), img('1600241318523-1a2a56b8a41f')],
    tags: ['Culture', 'Nature', 'Best Seller'],
    includes: ['Return flights from UAE', '4★ hotel stay', 'Daily breakfast', 'Airport transfers', 'Yerevan city tour'],
    highlights: ['Explore Yerevan', 'Lake Sevan — the Pearl of Armenia', 'Garni Temple & Geghard', 'Cascade Complex'],
    itinerary: [
      { day: 1, title: 'Arrival in Yerevan', detail: 'Warm welcome at Zvartnots Airport, private transfer to your 4★ hotel and an evening stroll along Republic Square.' },
      { day: 2, title: 'Yerevan City & Cascade', detail: 'Discover the pink-stone capital — the Cascade Complex, Opera House, museums and vibrant cafés.' },
      { day: 3, title: 'Lake Sevan & Highlands', detail: 'Day trip to the sparkling Lake Sevan, Sevanavank monastery and the alpine countryside.' },
      { day: 4, title: 'Departure', detail: 'Leisurely breakfast, last-minute souvenir shopping and transfer back to the airport.' },
    ],
  },
  {
    slug: 'discover-istanbul',
    name: 'Discover Istanbul',
    country: 'Türkiye',
    region: 'Europe & Asia',
    city: 'Istanbul',
    tagline: 'Where two continents and a thousand years meet',
    nights: 4,
    days: 5,
    occupancy: 'Twin sharing',
    price: 1690,
    currency: 'AED',
    hotelStars: 4,
    rating: 4.8,
    featured: true,
    image: img('1524231757912-21f4fe3a7200'),
    gallery: [img('1524231757912-21f4fe3a7200'), img('1541432901042-2d8bd64b4a9b')],
    tags: ['Culture', 'City Break', 'Popular'],
    includes: ['Return flights from UAE', '4★ hotel stay', 'Daily breakfast', 'Airport transfers', 'Bosphorus cruise'],
    highlights: ['Blue Mosque & Hagia Sophia', 'Grand Bazaar', 'Bosphorus dinner cruise', 'Topkapi Palace'],
    itinerary: [
      { day: 1, title: 'Arrival in Istanbul', detail: 'Private transfer to your hotel in the heart of the old city, evening at leisure.' },
      { day: 2, title: 'Old City Wonders', detail: 'Hagia Sophia, the Blue Mosque, Topkapi Palace and the Hippodrome.' },
      { day: 3, title: 'Bazaars & Bosphorus', detail: 'The Grand Bazaar, Spice Market and an unforgettable Bosphorus dinner cruise.' },
      { day: 4, title: 'Asian Side & Free Time', detail: 'Cross to the Asian shore, explore Kadıköy, then shop or relax at your own pace.' },
      { day: 5, title: 'Departure', detail: 'Breakfast and airport transfer with memories to last a lifetime.' },
    ],
  },
  {
    slug: 'russian-adventure',
    name: 'Russian Adventure',
    country: 'Russia',
    region: 'Europe',
    city: 'Moscow',
    tagline: 'Imperial grandeur, golden domes & endless boulevards',
    nights: 4,
    days: 5,
    occupancy: 'Twin sharing',
    price: 2350,
    currency: 'AED',
    hotelStars: 4,
    rating: 4.9,
    featured: true,
    image: img('1513326738677-b964603b136d'),
    gallery: [img('1513326738677-b964603b136d'), img('1547448415-e9f5b28e570d')],
    tags: ['Culture', 'City Break'],
    includes: ['Return flights from UAE', '4★ hotel stay', 'Daily breakfast', 'Airport transfers', 'Kremlin & Red Square tour'],
    highlights: ['Red Square & St Basil’s', 'The Kremlin', 'Moscow Metro tour', 'Bolshoi district'],
    itinerary: [
      { day: 1, title: 'Arrival in Moscow', detail: 'Meet & greet, transfer to your central hotel, evening walk to illuminated Red Square.' },
      { day: 2, title: 'Kremlin & Red Square', detail: 'Guided tour of the Kremlin, Cathedral Square and iconic St Basil’s Cathedral.' },
      { day: 3, title: 'Metro & Museums', detail: 'The palatial Moscow Metro, Tretyakov Gallery and Arbat Street.' },
      { day: 4, title: 'Day at Leisure', detail: 'Optional day trip or free time for shopping and cafés.' },
      { day: 5, title: 'Departure', detail: 'Breakfast and transfer to the airport.' },
    ],
  },
  {
    slug: 'maldives-getaway',
    name: 'Maldives Getaway',
    country: 'Maldives',
    region: 'Indian Ocean',
    city: 'Malé',
    tagline: 'Turquoise lagoons and your own slice of paradise',
    nights: 4,
    days: 5,
    occupancy: 'Twin sharing',
    price: 4200,
    currency: 'AED',
    hotelStars: 5,
    rating: 5.0,
    featured: true,
    image: img('1514282401047-d79a71a590e8'),
    gallery: [img('1514282401047-d79a71a590e8'), img('1573843981267-be1999ff37cd')],
    tags: ['Beach', 'Honeymoon', 'Luxury'],
    includes: ['Return flights from UAE', '5★ resort stay', 'Half board', 'Speedboat transfers', 'Sunset cruise'],
    highlights: ['Overwater villa', 'Snorkelling & reefs', 'Sunset dolphin cruise', 'Spa & wellness'],
    itinerary: [
      { day: 1, title: 'Arrival in Malé', detail: 'Speedboat transfer to your resort, welcome drinks and villa check-in.' },
      { day: 2, title: 'Reef & Lagoon', detail: 'Snorkelling over vibrant coral reefs and a lazy afternoon by the lagoon.' },
      { day: 3, title: 'Island Hopping', detail: 'Visit a local island and enjoy a sunset dolphin cruise.' },
      { day: 4, title: 'Spa & Relax', detail: 'Wellness day — spa treatments, watersports and beachfront dining.' },
      { day: 5, title: 'Departure', detail: 'Final breakfast and speedboat transfer back to Malé.' },
    ],
  },
  {
    slug: 'georgia-highlights',
    name: 'Georgia Highlights',
    country: 'Georgia',
    region: 'Caucasus',
    city: 'Tbilisi',
    tagline: 'Cobbled old towns, wine valleys and dramatic peaks',
    nights: 4,
    days: 5,
    occupancy: 'Triple sharing',
    price: 1550,
    currency: 'AED',
    hotelStars: 4,
    rating: 4.8,
    featured: false,
    image: img('1565008576549-57569a49371d'),
    gallery: [img('1565008576549-57569a49371d')],
    tags: ['Culture', 'Nature', 'Wine'],
    includes: ['Return flights from UAE', '4★ hotel stay', 'Daily breakfast', 'Airport transfers', 'Kazbegi day trip'],
    highlights: ['Old Tbilisi', 'Kazbegi & Gergeti', 'Wine tasting in Kakheti', 'Sulphur baths'],
    itinerary: [
      { day: 1, title: 'Arrival in Tbilisi', detail: 'Transfer to hotel and an evening walk through the atmospheric old town.' },
      { day: 2, title: 'Tbilisi City Tour', detail: 'Narikala Fortress, sulphur baths and the charming backstreets.' },
      { day: 3, title: 'Kazbegi Mountains', detail: 'Journey along the Military Highway to the breathtaking Gergeti Trinity Church.' },
      { day: 4, title: 'Kakheti Wine Region', detail: 'Tastings in Georgia’s legendary wine country.' },
      { day: 5, title: 'Departure', detail: 'Breakfast and airport transfer.' },
    ],
  },
  {
    slug: 'baku-azerbaijan',
    name: 'Baku Escape',
    country: 'Azerbaijan',
    region: 'Caucasus',
    city: 'Baku',
    tagline: 'Flame towers, Caspian breezes and old-world charm',
    nights: 3,
    days: 4,
    occupancy: 'Twin sharing',
    price: 1450,
    currency: 'AED',
    hotelStars: 4,
    rating: 4.7,
    featured: false,
    image: img('1601921004897-c1e6d1f9a4d4'),
    gallery: [img('1601921004897-c1e6d1f9a4d4')],
    tags: ['City Break', 'Culture'],
    includes: ['Return flights from UAE', '4★ hotel stay', 'Daily breakfast', 'Airport transfers', 'Old City tour'],
    highlights: ['Flame Towers', 'Icherisheher Old City', 'Highland Park views', 'Caspian promenade'],
    itinerary: [
      { day: 1, title: 'Arrival in Baku', detail: 'Transfer to hotel and a stroll along the Caspian boulevard.' },
      { day: 2, title: 'Old & New Baku', detail: 'Icherisheher old city, Maiden Tower and the futuristic Flame Towers.' },
      { day: 3, title: 'Absheron & Gobustan', detail: 'Ancient petroglyphs, mud volcanoes and burning mountain.' },
      { day: 4, title: 'Departure', detail: 'Breakfast and airport transfer.' },
    ],
  },
  {
    slug: 'dubai-city-experience',
    name: 'Dubai City Experience',
    country: 'United Arab Emirates',
    region: 'Middle East',
    city: 'Dubai',
    tagline: 'Sky-high glamour, golden dunes and modern marvels',
    nights: 3,
    days: 4,
    occupancy: 'Twin sharing',
    price: 1890,
    currency: 'AED',
    hotelStars: 5,
    rating: 4.9,
    featured: false,
    image: img('1512453979798-5ea266f8880c'),
    gallery: [img('1512453979798-5ea266f8880c'), img('1518684079-3c830dcef090')],
    tags: ['City Break', 'Family', 'Luxury'],
    includes: ['5★ hotel stay', 'Daily breakfast', 'Desert safari', 'Burj Khalifa tickets'],
    highlights: ['Burj Khalifa At The Top', 'Desert safari & BBQ', 'Dhow dinner cruise', 'Dubai Mall & Fountain'],
    itinerary: [
      { day: 1, title: 'Arrival in Dubai', detail: 'Transfer to your 5★ hotel and evening at the Dubai Fountain.' },
      { day: 2, title: 'Modern Dubai', detail: 'Burj Khalifa At The Top, Dubai Mall and the Marina.' },
      { day: 3, title: 'Desert Safari', detail: 'Dune bashing, camel rides and a starlit BBQ dinner with live shows.' },
      { day: 4, title: 'Departure', detail: 'Breakfast and airport transfer.' },
    ],
  },
  {
    slug: 'umrah-package',
    name: 'Umrah Journey',
    category: 'umrah',
    country: 'Saudi Arabia',
    region: 'Middle East',
    city: 'Makkah & Madinah',
    tagline: 'A spiritually enriching journey, faultlessly organised',
    nights: 7,
    days: 8,
    occupancy: 'Quad sharing',
    price: 3200,
    currency: 'AED',
    hotelStars: 4,
    rating: 5.0,
    featured: false,
    image: img('1591604129939-f1efa4d9f7fa'),
    gallery: [img('1591604129939-f1efa4d9f7fa')],
    tags: ['Spiritual', 'Umrah'],
    includes: ['Return flights from UAE', 'Umrah visa', '4★ hotels near Haram', 'Ziyarat tours', 'Inter-city transfers'],
    highlights: ['Hotels steps from the Haram', 'Guided Ziyarat in both cities', 'Group & family options', 'Complete visa handling'],
    itinerary: [
      { day: 1, title: 'Arrival in Madinah', detail: 'Transfer to your hotel near Masjid an-Nabawi.' },
      { day: 2, title: 'Madinah Ziyarat', detail: 'Guided visits to the holy sites of Madinah.' },
      { day: 3, title: 'Travel to Makkah', detail: 'Comfortable transfer and performing of Umrah.' },
      { day: 4, title: 'Worship & Reflection', detail: 'Days of worship at Masjid al-Haram at your own pace.' },
      { day: 8, title: 'Departure', detail: 'Final prayers and transfer to the airport.' },
    ],
  },
]

export const destinations = [
  {
    name: 'Armenia',
    blurb: 'Ancient monasteries & alpine lakes',
    image: img('1585687501004-615dfdfb6f37'),
    priceFrom: 1250,
    slug: 'escape-to-armenia',
  },
  {
    name: 'Türkiye',
    blurb: 'Two continents, endless wonders',
    image: img('1541432901042-2d8bd64b4a9b'),
    priceFrom: 1690,
    slug: 'discover-istanbul',
  },
  {
    name: 'Maldives',
    blurb: 'Turquoise lagoons & overwater villas',
    image: img('1514282401047-d79a71a590e8'),
    priceFrom: 4200,
    slug: 'maldives-getaway',
  },
  {
    name: 'Dubai',
    blurb: 'Golden dunes & sky-high glamour',
    image: img('1512453979798-5ea266f8880c'),
    priceFrom: 1890,
    slug: 'dubai-city-experience',
  },
  {
    name: 'Georgia',
    blurb: 'Old towns, wine valleys & peaks',
    image: img('1565008576549-57569a49371d'),
    priceFrom: 1550,
    slug: 'georgia-highlights',
  },
  {
    name: 'Russia',
    blurb: 'Imperial grandeur & golden domes',
    image: img('1513326738677-b964603b136d'),
    priceFrom: 2350,
    slug: 'russian-adventure',
  },
]

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

export const testimonials = [
  {
    name: 'Ali R.',
    trip: 'Escape to Armenia',
    rating: 5,
    quote:
      'My Armenia trip was seamless. Hotels, transfers, and sightseeing were perfectly organised. Highly recommend RadiantWay Travel!',
  },
  {
    name: 'Fatima S.',
    trip: 'Discover Istanbul',
    rating: 5,
    quote:
      'Booking the Turkey package was effortless. Everything from flights to hotel transfers was handled professionally. Istanbul sightseeing was amazing!',
  },
  {
    name: 'Omar K.',
    trip: 'Russian Adventure',
    rating: 5,
    quote:
      'The Russia package exceeded my expectations. Day trips around Moscow were well organised, and the hotel stay was very comfortable. Truly stress-free travel!',
  },
  {
    name: 'Sara M.',
    trip: 'Maldives Getaway',
    rating: 5,
    quote:
      'An absolute dream. From the speedboat transfer to the overwater villa, every detail was taken care of. We just relaxed and enjoyed our honeymoon.',
  },
  {
    name: 'Bilal A.',
    trip: 'Umrah Journey',
    rating: 5,
    quote:
      'A spiritually beautiful and perfectly organised Umrah. Hotels were minutes from the Haram and the team supported us every single step of the way.',
  },
]

export const faqs = [
  {
    q: 'Do you arrange the flights?',
    a: 'Yes, all our packages include return flights from major UAE airports, ensuring a seamless travel experience from start to finish.',
  },
  {
    q: 'Are the hotels central/close to attractions?',
    a: 'Yes, we carefully select hotels that are centrally located and close to major attractions, offering both comfort and convenience.',
  },
  {
    q: 'Do you help with visa applications?',
    a: 'Yes, we provide full support for visa applications, including USA, UK, Schengen, Canada, Australia, and New Zealand. Our team guides you through the entire process.',
  },
  {
    q: 'Can I book for solo travellers or families?',
    a: 'Yes, our packages are flexible and can be tailored for solo travelers, families, or groups, ensuring everyone enjoys a smooth and memorable journey.',
  },
  {
    q: 'Do you offer installment payment options?',
    a: 'Yes, we offer easy installment plans. You can secure your booking with a small deposit and pay the remaining amount through flexible installments before departure.',
  },
]

export const services = [
  {
    icon: 'Map',
    title: 'Tour Packages',
    description:
      'Curated multi-day itineraries with hotels, sightseeing and transfers bundled into one easy price.',
  },
  {
    icon: 'StampIcon',
    title: 'Visa Assistance',
    description:
      'End-to-end visa support for the USA, UK, Schengen, Canada, Australia and New Zealand.',
  },
  {
    icon: 'Plane',
    title: 'Flight Bookings',
    description:
      'Competitive fares on every major airline, included and optimised within your package.',
  },
  {
    icon: 'BedDouble',
    title: 'Hotel Arrangements',
    description:
      'Hand-picked 3★ to 5★ stays, from cosy city hotels to beachfront resorts.',
  },
  {
    icon: 'CarFront',
    title: 'Airport Transfers',
    description:
      'Private, comfortable pick-ups and drop-offs so your journey is seamless from door to door.',
  },
  {
    icon: 'Camera',
    title: 'Sightseeing & Tours',
    description:
      'Guided experiences and day trips that put the very best of every destination on your itinerary.',
  },
  {
    icon: 'CreditCard',
    title: 'Installment Plans',
    description:
      'Travel now, pay comfortably later with flexible, interest-friendly payment options.',
  },
  {
    icon: 'Ferris',
    title: 'Dubai Activities',
    description:
      'Desert safaris, Burj Khalifa, dhow cruises and the full spectrum of Dubai experiences.',
  },
  {
    icon: 'MoonStar',
    title: 'Umrah Packages',
    description:
      'Spiritually enriching, professionally organised Umrah journeys with complete peace of mind.',
  },
]

export const whyChooseUs = [
  {
    icon: 'Globe',
    title: 'UAE-based, global reach',
    description:
      'Headquartered in the UAE, we proudly serve travelers from around the world with trusted expertise.',
  },
  {
    icon: 'Map',
    title: 'Tailored packages',
    description:
      'We craft personalized travel packages designed to suit your preferences, budget, and schedule.',
  },
  {
    icon: 'Wallet',
    title: 'Affordable quad-sharing',
    description:
      'Save more by choosing our cost-effective quad-sharing accommodation options on group tours.',
  },
  {
    icon: 'Clock',
    title: '24/7 visa support & assistance',
    description:
      'Get round-the-clock visa guidance and travel support for top destinations like the USA, UK, and Schengen countries.',
  },
]

export const company = {
  name: 'RadiantWay Travel',
  shortName: 'RadiantWay',
  tagline: 'Effortless Journeys. Lasting Memories.',
  intro:
    'UAE-based travel experts with global reach. We craft tailored tour packages, handle your visas, and take care of every detail — so all you have to do is travel.',
  phone: '+971 54 786 1293',
  phoneHref: 'tel:+971547861293',
  // Department contact numbers shown in the navbar dropdown. Editable from
  // Admin → Settings. Defaults to the main number until you set real ones.
  holidaysPhone: '+971 54 786 1293',
  visaPhone: '+971 54 786 1293',
  whatsapp: 'https://wa.me/971547861293',
  email: 'info@radiantwaytravel.com',
  emailHref: 'mailto:info@radiantwaytravel.com',
  address:
    'Office No: 17, 28th Floor, Aspin Commercial Tower, Sheikh Zayed Road, Dubai, UAE',
  hours: 'Open 24/7 — we never stop for our travellers',
  reviewUrl: 'https://share.google/6Yg4AJOHDoq0k574Q',
  socials: [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/radiantwaytravel?igsh=MW90NXQyaGl0bWZwdg==',
      icon: 'Instagram',
    },
    { name: 'Facebook', href: 'https://www.facebook.com/share/19qorzUXsM/', icon: 'Facebook' },
    { name: 'WhatsApp', href: 'https://wa.me/971547861293', icon: 'MessageCircle' },
  ],
  // Fallback for the hero's Google badge until the server has a Places API key
  // (see server/.env.example) — kept at the real listing's figures so the badge
  // never attributes made-up numbers to Google. Editable in Admin → Settings.
  rating: 4.7,
  reviewCount: 39,
}

export const stats = [
  { value: 8, suffix: '+', label: 'Years of expertise' },
  { value: 50, suffix: 'k+', label: 'Happy travellers' },
  { value: 40, suffix: '+', label: 'Destinations worldwide' },
  {
    value: company.rating,
    suffix: '★',
    label: `Rated by ${company.reviewCount}+ reviews`,
    decimals: 1,
  },
]
