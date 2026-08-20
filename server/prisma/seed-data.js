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
  // The six that already existed keep their slug, image, itinerary and
  // inclusions; only the price, duration and description are refreshed.
  {
    slug: 'escape-to-armenia',
    name: 'Armenia Tour',
    country: 'Armenia',
    region: 'Caucasus',
    city: 'Yerevan',
    tagline:
      "Experience Armenia's winter charm. Escape to the breathtaking landscapes of Armenia this winter with our 3 Nights / 4 Days tour package. From snow-covered mountains and cozy villages to vibrant city life in Yerevan, this journey offers the perfect mix of adventure, culture and relaxation.",
    nights: 3,
    days: 4,
    occupancy: 'Quad sharing',
    price: 1999,
    currency: 'AED',
    hotelStars: 4,
    rating: 4.9,
    featured: true,
    image: img('1585687501004-615dfdfb6f37'),
    gallery: [img('1585687501004-615dfdfb6f37'), img('1600241318523-1a2a56b8a41f')],
    tags: ['Culture', 'Nature', 'Winter', 'Best Seller'],
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
    slug: 'georgia-highlights',
    name: 'Georgia Tour',
    country: 'Georgia',
    region: 'Caucasus',
    city: 'Tbilisi',
    tagline:
      'Discover the beauty of Georgia with this 2-night, 3-day tour. Includes a 4★ hotel stay, transfers, daily breakfast, and day trips to Tbilisi, Narikala Fortress and the Bridge of Peace.',
    nights: 2,
    days: 3,
    occupancy: 'Triple sharing',
    price: 1499,
    currency: 'AED',
    hotelStars: 4,
    rating: 4.8,
    featured: false,
    image: img('1565008576549-57569a49371d'),
    gallery: [img('1565008576549-57569a49371d')],
    tags: ['Culture', 'Nature', 'City Break'],
    includes: ['4★ hotel stay', 'Airport transfers', 'Daily breakfast', 'Day trips & sightseeing'],
    highlights: ['Tbilisi city tour', 'Narikala Fortress', 'Bridge of Peace'],
    itinerary: [
      { day: 1, title: 'Arrival in Tbilisi', detail: 'Transfer to hotel and an evening walk through the atmospheric old town.' },
      { day: 2, title: 'Tbilisi City Tour', detail: 'Narikala Fortress, the Bridge of Peace, sulphur baths and the charming backstreets.' },
      { day: 3, title: 'Departure', detail: 'Breakfast and airport transfer.' },
    ],
  },
  {
    slug: 'baku-azerbaijan',
    name: 'Azerbaijan, Baku Tour',
    country: 'Azerbaijan',
    region: 'Caucasus',
    city: 'Baku',
    tagline:
      'Enjoy a 3-night, 4-day Baku tour featuring a 4★ hotel stay, included transfers, daily breakfast, and day trips to Nizami Street and the Flame Towers.',
    nights: 3,
    days: 4,
    occupancy: 'Twin sharing',
    price: 1999,
    currency: 'AED',
    hotelStars: 4,
    rating: 4.7,
    featured: false,
    image: img('1601921004897-c1e6d1f9a4d4'),
    gallery: [img('1601921004897-c1e6d1f9a4d4')],
    tags: ['City Break', 'Culture'],
    includes: ['4★ hotel stay', 'Airport transfers', 'Daily breakfast', 'Day trips & sightseeing'],
    highlights: ['Nizami Street', 'Flame Towers', 'Icherisheher Old City', 'Caspian promenade'],
    itinerary: [
      { day: 1, title: 'Arrival in Baku', detail: 'Transfer to hotel and a stroll along the Caspian boulevard.' },
      { day: 2, title: 'Old & New Baku', detail: 'Icherisheher old city, Maiden Tower and the futuristic Flame Towers.' },
      { day: 3, title: 'Nizami Street & Beyond', detail: 'Day trip along Nizami Street, Fountain Square and Highland Park views.' },
      { day: 4, title: 'Departure', detail: 'Breakfast and airport transfer.' },
    ],
  },
  {
    slug: 'discover-istanbul',
    name: 'Turkey, Istanbul Tour',
    country: 'Türkiye',
    region: 'Europe & Asia',
    city: 'Istanbul',
    tagline:
      'Embark on a journey to Turkey, a land where history, culture and natural beauty come together in perfect harmony.',
    nights: 3,
    days: 4,
    occupancy: 'Twin sharing',
    price: 2199,
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
      { day: 4, title: 'Departure', detail: 'Breakfast and airport transfer with memories to last a lifetime.' },
    ],
  },
  {
    slug: 'russian-adventure',
    name: 'Russia, Moscow Tour',
    country: 'Russia',
    region: 'Europe',
    city: 'Moscow',
    tagline:
      "Explore the iconic landmarks of Moscow, from the Kremlin and Red Square to the colourful domes of St Basil's Cathedral. Discover the elegance of St Petersburg, with its royal palaces, canals and world-class museums like the Hermitage. Whether it's walking through centuries of history, enjoying the vibrant cultural scene or admiring breathtaking architecture, Russia offers a journey unlike any other.",
    nights: 3,
    days: 4,
    occupancy: 'Twin sharing',
    price: 3555,
    currency: 'AED',
    hotelStars: 4,
    rating: 4.9,
    featured: true,
    image: img('1513326738677-b964603b136d'),
    gallery: [img('1513326738677-b964603b136d'), img('1547448415-e9f5b28e570d')],
    tags: ['Culture', 'City Break'],
    includes: ['Return flights from UAE', '4★ hotel stay', 'Daily breakfast', 'Airport transfers', 'Kremlin & Red Square tour'],
    highlights: ['Red Square & St Basil’s', 'The Kremlin', 'Moscow Metro tour', 'St Petersburg & the Hermitage'],
    itinerary: [
      { day: 1, title: 'Arrival in Moscow', detail: 'Meet & greet, transfer to your central hotel, evening walk to illuminated Red Square.' },
      { day: 2, title: 'Kremlin & Red Square', detail: 'Guided tour of the Kremlin, Cathedral Square and iconic St Basil’s Cathedral.' },
      { day: 3, title: 'Metro & Museums', detail: 'The palatial Moscow Metro, Tretyakov Gallery and Arbat Street.' },
      { day: 4, title: 'Departure', detail: 'Breakfast and transfer to the airport.' },
    ],
  },
  {
    slug: 'maldives-getaway',
    name: 'Maldives Tour',
    country: 'Maldives',
    region: 'Indian Ocean',
    city: 'Malé',
    tagline:
      'Relax in paradise with a 4★ hotel stay, transfers, breakfast, and day trips to Vaadhoo Island, Alimatha Island, Addu Atoll, Banana Reef and Mirihi Island.',
    nights: 4,
    days: 5,
    occupancy: 'Twin sharing',
    price: 1550,
    currency: 'AED',
    hotelStars: 4,
    rating: 5.0,
    featured: true,
    image: img('1514282401047-d79a71a590e8'),
    gallery: [img('1514282401047-d79a71a590e8'), img('1573843981267-be1999ff37cd')],
    tags: ['Beach', 'Honeymoon', 'Islands'],
    includes: ['4★ hotel stay', 'Airport transfers', 'Daily breakfast', 'Island day trips'],
    highlights: ['Vaadhoo Island', 'Alimatha Island', 'Addu Atoll', 'Banana Reef', 'Mirihi Island'],
    itinerary: [
      { day: 1, title: 'Arrival in Malé', detail: 'Transfer to your hotel, welcome drinks and check-in.' },
      { day: 2, title: 'Reef & Lagoon', detail: 'Snorkelling over Banana Reef and a lazy afternoon by the lagoon.' },
      { day: 3, title: 'Island Hopping', detail: 'Day trips to Vaadhoo and Alimatha islands.' },
      { day: 4, title: 'Atolls & Relaxation', detail: 'Addu Atoll and Mirihi Island, then beachfront dining.' },
      { day: 5, title: 'Departure', detail: 'Final breakfast and transfer back to Malé.' },
    ],
  },

  // Dubai stays as it was — it is not in the refreshed list, so nothing here
  // claims to update it.
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

  // ── The rest of the range ──────────────────────────────────────────────────
  // Name, duration, price and description are the live site's own copy.
  // `highlights` lists only the places that copy actually names; `includes`,
  // `itinerary`, `occupancy` and `image` are left empty rather than invented —
  // inclusions are a commercial promise, so they belong to whoever sets the
  // price. Fill them in Admin → Packages; the detail page hides an empty
  // section and SmartImage falls back to a gradient until a photo is uploaded.
  {
    slug: 'egypt-cairo-tour',
    name: 'Egypt, Cairo Tour',
    country: 'Egypt',
    region: 'Africa',
    city: 'Cairo',
    tagline:
      'Uncover the wonders of Egypt with our exclusive tour package, where every moment takes you closer to the cradle of civilisation. Marvel at the majestic Pyramids of Giza and the Great Sphinx, cruise along the legendary Nile River, and explore ancient temples that whisper stories of powerful pharaohs.',
    nights: 3,
    days: 4,
    price: 2050,
    tags: ['Culture', 'History'],
    highlights: ['Pyramids of Giza', 'The Great Sphinx', 'Nile River cruise', 'Ancient temples'],
  },
  {
    slug: 'singapore-tour',
    name: 'Singapore Tour',
    country: 'Singapore',
    region: 'Southeast Asia',
    city: 'Singapore',
    tagline:
      'Discover the perfect blend of modern marvels and natural beauty with our Singapore tour package. From the dazzling Marina Bay Sands and Gardens by the Bay to the thrilling Sentosa Island and vibrant cultural streets, Singapore is a destination that has it all.',
    nights: 2,
    days: 3,
    price: 2550,
    tags: ['City Break', 'Family'],
    highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Cultural streets'],
  },
  {
    slug: 'nairobi-kenya-tour',
    name: 'Nairobi, Kenya Tour',
    country: 'Kenya',
    region: 'Africa',
    city: 'Nairobi',
    tagline:
      'Embark on an unforgettable journey to Nairobi, Kenya, the vibrant capital that blends urban charm with thrilling wildlife adventures. Known as the “Safari Capital of the World”, Nairobi offers a rare experience where modern city life meets breathtaking nature. Visit the famous Nairobi National Park, where lions, giraffes and rhinos roam against a backdrop of the city skyline, and explore attractions like the Giraffe Centre and the David Sheldrick Elephant Orphanage.',
    nights: 4,
    days: 5,
    price: 5500,
    tags: ['Safari', 'Wildlife', 'Adventure'],
    highlights: ['Nairobi National Park', 'Giraffe Centre', 'David Sheldrick Elephant Orphanage', 'Local markets & cuisine'],
  },
  {
    slug: 'sri-lanka-tour',
    name: 'Sri Lanka Tour',
    country: 'Sri Lanka',
    region: 'South Asia',
    city: 'Colombo',
    tagline:
      "Discover the tropical paradise of Sri Lanka, an island that offers a perfect blend of golden beaches, lush green landscapes and rich cultural heritage. From the ancient cities of Sigiriya and Kandy to the scenic tea plantations of Nuwara Eliya and the wildlife safaris in Yala National Park, every corner of Sri Lanka tells a unique story.",
    nights: 3,
    days: 4,
    price: 2155,
    tags: ['Beach', 'Culture', 'Nature'],
    highlights: ['Sigiriya', 'Kandy', 'Nuwara Eliya tea plantations', 'Yala National Park safari'],
  },
  {
    slug: 'northern-lights-russia-tour',
    name: 'Northern Lights Russia Tour',
    country: 'Russia',
    region: 'Europe',
    city: 'Murmansk',
    tagline:
      'Witness the magic of the Northern Lights in Russia with our unforgettable tour package designed for adventure and wonder. Journey to the breathtaking Kola Peninsula and beyond, where the Arctic skies light up in a dazzling dance of colours. Along the way, explore charming snow-covered landscapes, experience authentic Russian winter traditions, and enjoy activities like husky sledding and reindeer rides.',
    nights: 4,
    days: 5,
    price: 7999,
    tags: ['Winter', 'Adventure', 'Aurora'],
    highlights: ['Kola Peninsula aurora viewing', 'Husky sledding', 'Reindeer rides', 'Russian winter traditions'],
  },
  {
    slug: 'athens-greece-tour',
    name: 'Athens, Greece Tour',
    country: 'Greece',
    region: 'Europe',
    city: 'Athens',
    tagline:
      'Discover the timeless beauty of Greece, a destination where history, culture and natural wonders come together. Walk through the ancient ruins of Athens, stand in awe at the Acropolis, and dive into the mythology that shaped Western civilisation. Then unwind on the stunning islands of Santorini, Mykonos or Crete, where whitewashed houses, turquoise waters and breathtaking sunsets await.',
    nights: 3,
    days: 4,
    price: 3999,
    tags: ['Culture', 'History', 'Beach'],
    highlights: ['The Acropolis', 'Ancient Athens ruins', 'Santorini, Mykonos & Crete', 'Mediterranean cuisine'],
  },
  {
    slug: 'bali-indonesia-tour',
    name: 'Bali, Indonesia Tour',
    country: 'Indonesia',
    region: 'Southeast Asia',
    city: 'Bali',
    tagline:
      "Escape to the tropical paradise of Bali, Indonesia, where serene beaches, lush rice terraces and vibrant culture create the ultimate holiday experience. Explore the island's spiritual side with visits to ancient temples like Tanah Lot and Uluwatu, or indulge in adventure with surfing, snorkelling and hiking up Mount Batur for a breathtaking sunrise view.",
    nights: 4,
    days: 5,
    price: 4455,
    featured: true,
    tags: ['Beach', 'Culture', 'Honeymoon'],
    highlights: ['Tanah Lot & Uluwatu temples', 'Mount Batur sunrise hike', 'Lush rice terraces', 'Surfing & snorkelling'],
  },
  {
    slug: 'phuket-thailand-tour',
    name: 'Phuket, Thailand Tour',
    country: 'Thailand',
    region: 'Southeast Asia',
    city: 'Phuket',
    tagline:
      'Discover the tropical charm of Phuket, Thailand, a world-famous destination known for its stunning beaches, vibrant nightlife and cultural treasures. Relax on golden shores like Patong, Kata and Karon, or take a boat trip to the breathtaking Phi Phi Islands and Phang Nga Bay. Explore the rich culture of Old Phuket Town, visit sacred temples, and enjoy authentic Thai cuisine.',
    nights: 2,
    days: 3,
    price: 3440,
    featured: true,
    tags: ['Beach', 'Islands', 'Nightlife'],
    highlights: ['Patong, Kata & Karon beaches', 'Phi Phi Islands', 'Phang Nga Bay', 'Old Phuket Town'],
  },
  {
    slug: 'madrid-spain-tour',
    name: 'Madrid, Spain Tour',
    country: 'Spain',
    region: 'Europe',
    city: 'Madrid',
    tagline:
      'Uncover the vibrant spirit of Madrid, Spain, a city that perfectly combines history, culture and modern charm. Stroll through grand boulevards and elegant plazas like Puerta del Sol and Plaza Mayor, explore world-class museums such as the Prado and Reina Sofía, and marvel at the royal beauty of the Palacio Real. Savour authentic Spanish flavours with tapas and paella, and experience the passion of flamenco.',
    nights: 6,
    days: 7,
    price: 6999,
    tags: ['Culture', 'City Break', 'Europe'],
    highlights: ['Puerta del Sol & Plaza Mayor', 'Prado & Reina Sofía museums', 'Palacio Real', 'Tapas & flamenco'],
  },
  {
    slug: 'milan-italy-tour',
    name: 'Milan, Italy Tour',
    country: 'Italy',
    region: 'Europe',
    city: 'Milan',
    tagline:
      "Experience the elegance of Milan, Italy, a city where fashion, art and history come together in perfect harmony. Explore iconic landmarks like the magnificent Milan Cathedral (Duomo), the historic Galleria Vittorio Emanuele II, and Leonardo da Vinci's masterpiece, The Last Supper. Stroll through stylish streets lined with world-renowned boutiques, savour authentic Italian cuisine, and enjoy the city's vibrant nightlife.",
    nights: 4,
    days: 5,
    price: 5999,
    tags: ['Culture', 'City Break', 'Europe'],
    highlights: ['Milan Cathedral (Duomo)', 'Galleria Vittorio Emanuele II', 'The Last Supper', 'Fashion district'],
  },
  {
    slug: 'venice-italy-tour',
    name: 'Venice, Italy Tour',
    country: 'Italy',
    region: 'Europe',
    city: 'Venice',
    tagline:
      "Step into the enchanting world of Venice, Italy, a city unlike any other, built on shimmering canals and rich with history and romance. Glide through the waterways on a gondola ride, admire the grandeur of St Mark's Basilica and the Doge's Palace, and wander the charming narrow streets that open up to hidden squares and lively piazzas. Explore the colourful islands of Murano and Burano, famous for glassmaking and lace.",
    nights: 5,
    days: 6,
    price: 6499,
    tags: ['Culture', 'Honeymoon', 'Europe'],
    highlights: ['Gondola ride on the canals', 'St Mark’s Basilica', 'Doge’s Palace', 'Murano & Burano islands'],
  },
  {
    slug: 'peru-ancient-city-of-incas-tour',
    name: 'Peru — The Ancient City of Incas Tour',
    country: 'Peru',
    region: 'South America',
    city: 'Cusco',
    tagline:
      "Discover the wonders of Peru, the Ancient City of the Incas, where breathtaking landscapes meet one of the world's greatest civilisations. Journey to the iconic Machu Picchu, a UNESCO World Heritage Site and one of the New Seven Wonders of the World, perched high in the Andes. Explore the Sacred Valley, Cusco's cobblestone streets, and vibrant local markets filled with rich traditions and colourful crafts.",
    nights: 6,
    days: 7,
    price: 9999,
    tags: ['Adventure', 'History', 'Nature'],
    highlights: ['Machu Picchu', 'The Sacred Valley', 'Cusco’s cobblestone streets', 'Lake Titicaca'],
  },
  {
    slug: 'jerusalem-jordan-tour',
    name: 'Jerusalem, Jordan Tour',
    country: 'Jordan',
    region: 'Middle East',
    city: 'Jerusalem & Petra',
    tagline:
      "Explore the spiritual heart of the Middle East with our Jerusalem and Jordan tour package, where history, faith and culture come alive. In Jerusalem, walk through the Old City's ancient streets and visit sacred sites like the Western Wall, the Church of the Holy Sepulchre and the Dome of the Rock. Continue into Jordan, home to the world-famous city of Petra, along with the mesmerising desert landscapes of Wadi Rum and the healing waters of the Dead Sea.",
    nights: 4,
    days: 5,
    price: 5999,
    tags: ['Spiritual', 'Culture', 'History'],
    highlights: ['The Old City & Western Wall', 'Church of the Holy Sepulchre', 'Dome of the Rock', 'Petra & Wadi Rum', 'The Dead Sea'],
  },
  {
    slug: 'kathmandu-nepal-tour',
    name: 'Kathmandu, Nepal Tour',
    country: 'Nepal',
    region: 'South Asia',
    city: 'Kathmandu',
    tagline:
      'Discover the mystical charm of Kathmandu, Nepal, a city where ancient traditions and vibrant culture meet against the backdrop of the majestic Himalayas. Wander through bustling streets filled with colourful markets, explore UNESCO World Heritage Sites like Swayambhunath (Monkey Temple), Pashupatinath Temple and Durbar Square, and admire centuries-old architecture and spiritual artistry.',
    nights: 4,
    days: 5,
    price: 1999,
    tags: ['Culture', 'Spiritual', 'Nature'],
    highlights: ['Swayambhunath (Monkey Temple)', 'Pashupatinath Temple', 'Durbar Square', 'Gateway to the Himalayas'],
  },
  {
    slug: 'seychelles-tour',
    name: 'Seychelles Tour',
    country: 'Seychelles',
    region: 'Indian Ocean',
    city: 'Victoria',
    tagline:
      'Escape to the tropical paradise of Seychelles, a dream destination of pristine white-sand beaches, crystal-clear waters and lush green landscapes. This island haven offers the perfect blend of relaxation and adventure, from snorkelling and diving among vibrant coral reefs to hiking through exotic nature reserves. Explore the charm of Mahé, Praslin and La Digue islands, and indulge in fresh seafood and Creole flavours by the ocean.',
    nights: 2,
    days: 3,
    price: 4445,
    tags: ['Beach', 'Islands', 'Luxury'],
    highlights: ['Mahé, Praslin & La Digue', 'Snorkelling & diving', 'Exotic nature reserves', 'Creole seafood'],
  },
  {
    slug: 'dominica-tour',
    name: 'Dominica, North America Tour',
    country: 'Dominica',
    region: 'Caribbean',
    city: 'Roseau',
    tagline:
      'Discover the untouched beauty of Dominica, known as the “Nature Island of the Caribbean”, where lush rainforests, volcanic peaks and pristine waterfalls create a paradise for adventure seekers and nature lovers. Hike through Morne Trois Pitons National Park, a UNESCO World Heritage Site, soak in natural hot springs, and marvel at the famous Boiling Lake. Explore hidden beaches and vibrant coral reefs perfect for diving and snorkelling.',
    nights: 5,
    days: 6,
    price: 9999,
    tags: ['Nature', 'Adventure', 'Beach'],
    highlights: ['Morne Trois Pitons National Park', 'The Boiling Lake', 'Natural hot springs', 'Coral reef diving'],
  },
  {
    slug: 'winter-holiday-austria',
    name: 'Winter Holiday in Austria',
    country: 'Austria',
    region: 'Europe',
    city: 'Vienna',
    tagline:
      "Experience the magic of Austria this winter with our specially designed holiday package. From the snow-covered Alps to the charming streets of Vienna and Salzburg, Austria offers the perfect blend of natural beauty, culture and festive spirit. Enjoy skiing on world-famous slopes, wander through traditional Christmas markets, and admire breathtaking alpine scenery, warmed by authentic Austrian cuisine and cosy mountain lodges.",
    nights: 5,
    days: 6,
    price: 4999,
    tags: ['Winter', 'Ski', 'Europe'],
    highlights: ['Skiing the Austrian Alps', 'Vienna & Salzburg', 'Traditional Christmas markets', 'Cosy mountain lodges'],
  },
  {
    slug: 'uzbekistan-tashkent-tour',
    name: 'Uzbekistan, Tashkent Tour',
    country: 'Uzbekistan',
    region: 'Central Asia',
    city: 'Tashkent',
    tagline:
      "Discover the timeless beauty of Uzbekistan with our specially designed tour package through the heart of Central Asia's rich history and culture. Explore the majestic cities of Samarkand, Bukhara and Khiva, where ancient Silk Road routes once thrived, and marvel at stunning Islamic architecture, vibrant bazaars and centuries-old monuments — from turquoise-domed madrasahs and grand mosques to bustling markets filled with local crafts and spices.",
    nights: 3,
    days: 4,
    price: 2650,
    tags: ['Culture', 'History', 'Silk Road'],
    highlights: ['Samarkand', 'Bukhara', 'Khiva', 'Silk Road bazaars'],
  },
  {
    slug: 'kyrgyzstan-bishkek-tour',
    name: 'Kyrgyzstan, Bishkek',
    country: 'Kyrgyzstan',
    region: 'Central Asia',
    city: 'Bishkek',
    tagline:
      'Experience the charm of Bishkek, Kyrgyzstan, with our exclusive tour package that blends natural beauty, cultural heritage and modern city life. Nestled at the foot of the majestic Tien Shan mountains, Bishkek welcomes you with wide boulevards, green parks and vibrant bazaars. Explore Ala-Too Square, the National Museum and Osh Bazaar for a taste of local life, or take a short escape to breathtaking landscapes like Ala Archa National Park.',
    nights: 3,
    days: 4,
    price: 2499,
    tags: ['Nature', 'Culture', 'Adventure'],
    highlights: ['Ala-Too Square', 'The National Museum', 'Osh Bazaar', 'Ala Archa National Park'],
  },

  // ── Umrah ──────────────────────────────────────────────────────────────────
  {
    slug: 'summer-holidays-umrah',
    name: 'Summer Holidays Umrah Package',
    category: 'umrah',
    country: 'Saudi Arabia',
    region: 'Middle East',
    city: 'Makkah & Madinah',
    tagline:
      'Answer the call of your heart this Ramadan 🤍 Perform Umrah in the most blessed days with comfort, care and complete arrangements.',
    nights: 6,
    days: 7,
    price: 3999,
    tags: ['Spiritual', 'Umrah'],
    highlights: [],
  },
  {
    slug: 'umrah-package',
    name: 'Umrah Package — 8 Days / 7 Nights',
    category: 'umrah',
    country: 'Saudi Arabia',
    region: 'Middle East',
    city: 'Makkah & Madinah',
    tagline:
      'Fulfil your spiritual duty with our Umrah package, designed to provide comfort, ease and peace of mind throughout your sacred journey. From seamless visa processing and comfortable accommodation near the holy mosques to guided assistance at every step, we ensure your pilgrimage remains focused on worship and devotion.',
    nights: 7,
    days: 8,
    occupancy: 'Quad sharing',
    price: 4999,
    currency: 'AED',
    hotelStars: 4,
    rating: 5.0,
    image: img('1591604129939-f1efa4d9f7fa'),
    gallery: [img('1591604129939-f1efa4d9f7fa')],
    tags: ['Spiritual', 'Umrah'],
    includes: ['Umrah visa', '4★ hotels near the Haram', 'Ziyarat tours', 'Inter-city transfers'],
    highlights: ['Hotels steps from the Haram', 'Guided Ziyarat in both cities', 'Group & family options', 'Complete visa handling'],
    itinerary: [
      { day: 1, title: 'Arrival in Madinah', detail: 'Transfer to your hotel near Masjid an-Nabawi.' },
      { day: 2, title: 'Madinah Ziyarat', detail: 'Guided visits to the holy sites of Madinah.' },
      { day: 3, title: 'Travel to Makkah', detail: 'Comfortable transfer and performing of Umrah.' },
      { day: 4, title: 'Worship & Reflection', detail: 'Days of worship at Masjid al-Haram at your own pace.' },
      { day: 8, title: 'Departure', detail: 'Final prayers and transfer to the airport.' },
    ],
  },
  {
    slug: 'umrah-package-12-days',
    name: 'Umrah Package — 12 Days / 11 Nights',
    category: 'umrah',
    country: 'Saudi Arabia',
    region: 'Middle East',
    city: 'Makkah & Madinah',
    tagline:
      'Embark on a blessed 12-day spiritual journey with our Umrah package, thoughtfully designed to give you ample time for worship, reflection and peace in the holy cities of Makkah and Madinah. Enjoy comfortable accommodation close to the Haram, seamless visa assistance and guided support throughout your stay. With extended days you have the opportunity to perform your rituals with ease, visit sacred sites, and experience the true serenity of this once-in-a-lifetime pilgrimage.',
    nights: 11,
    days: 12,
    price: 6499,
    tags: ['Spiritual', 'Umrah'],
    includes: ['Umrah visa', 'Hotels near the Haram', 'Ziyarat tours', 'Inter-city transfers'],
    highlights: ['Extended time for worship', 'Hotels close to the Haram', 'Guided support throughout', 'Complete visa handling'],
  },
]

export const destinations = [
  {
    name: 'Armenia',
    blurb: 'Ancient monasteries & alpine lakes',
    image: img('1585687501004-615dfdfb6f37'),
    priceFrom: 1999,
    slug: 'escape-to-armenia',
  },
  {
    name: 'Türkiye',
    blurb: 'Two continents, endless wonders',
    image: img('1541432901042-2d8bd64b4a9b'),
    priceFrom: 2199,
    slug: 'discover-istanbul',
  },
  {
    name: 'Maldives',
    blurb: 'Turquoise lagoons & overwater villas',
    image: img('1514282401047-d79a71a590e8'),
    priceFrom: 1550,
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
    priceFrom: 1499,
    slug: 'georgia-highlights',
  },
  {
    name: 'Russia',
    blurb: 'Imperial grandeur & golden domes',
    image: img('1513326738677-b964603b136d'),
    priceFrom: 3555,
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

// The lighter checklist: no NOC, no bank statement.
const resDocs = baseDocs.slice(0, 4)

// Repeated verbatim across the consulates that ask for them.
const tradeLicence = 'Trade Licence Copy (if owner/partner is travelling)'
const inviteLetter = 'Invitation Letter from Inviting Company (business visa)'

// Every package starts here; each visa appends what it adds and ends on 24/7
// Support so the list reads right in the modal.
const core = [
  'Professional Assistance',
  'Cover Letter',
  'Application Form Filling',
  'Flight & Hotel Reservations',
  'Travel Itinerary',
]
const fullService = [...core, 'Embassy Fee', '24/7 Support']

export const visas = [
  {
    country: 'United States',
    flag: '🇺🇸',
    type: 'B1/B2 Tourist & Business',
    processing: '3–6 weeks',
    note: 'Early appointment support & DS-160 prep',
    price: 'AED 1,500',
    about:
      "Get your journey started hassle-free with our USA Visit Visa assistance and early appointment support. Whether you're travelling for tourism, family visits or business, our experienced team guides you through the entire process — filling out your DS-160, organising documents and preparing you for the interview. We also help secure early appointment slots, saving you time and avoiding long delays. Reduce errors, speed up the process and boost your chances of approval while you focus on planning your American adventure.",
    documentsRequired: [...resDocs, inviteLetter, tradeLicence],
    documentsProvided: [...core, 'Interview Preparation', '24/7 Support'],
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    type: 'Standard Visitor',
    processing: '3–4 weeks',
    note: 'Document checklist & interview prep',
    price: 'AED 2,000',
    about:
      "We're here to make your journey smooth and hassle-free with our UK Visit Visa assistance. Whether you're visiting for tourism, to meet family and friends, or to explore business opportunities, our expert team guides you through every step of the process — from filling out the application form accurately to organising your documents and preparing you for the visa interview. Save time, avoid mistakes and increase your chances of approval while you focus on planning your trip to the UK.",
    documentsRequired: [
      ...resDocs,
      '6 Months Bank Statement',
      'Company NOC Letter',
      'Salary Certificate',
      'Previous Travel History (optional)',
      tradeLicence,
    ],
    documentsProvided: [...core, 'Travel Insurance', '24/7 Support'],
  },
  {
    country: 'Schengen',
    flag: '🇪🇺',
    type: 'Short-stay (Type C)',
    processing: '2–3 weeks',
    note: 'Covers 27 European countries',
    price: 'AED 1,000',
    about:
      "Dreaming of exploring Europe? Our Schengen Visit Visa assistance makes the process simple, quick and stress-free. Whether you want to experience the romance of Paris, the history of Rome or the beauty of Switzerland, our expert team guides you through the entire visa process — filling out your application forms, preparing the required documents, booking appointments and offering guidance to boost your chances of approval. One visa, twenty-seven Schengen countries. Let us handle the paperwork so you can focus on your European adventure.",
    documentsRequired: [
      ...resDocs,
      '6 Months Bank Statement',
      'Company NOC Letter',
      'Previous Travel History (optional)',
      tradeLicence,
    ],
    documentsProvided: [...core, 'Biometric Appointment', 'Travel Insurance', '24/7 Support'],
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    type: 'Visitor Visa (TRV)',
    processing: '4–8 weeks',
    note: 'Biometrics appointment included',
    price: 'AED 1,500',
    about:
      "Planning to visit Canada? Our Canada Visit Visa assistance makes the process simple, accurate and stress-free. Whether you're travelling for tourism, meeting family and friends, or exploring business opportunities, our expert team guides you through every step — filling out the application forms correctly, organising the required documents, booking appointments and providing personalised guidance to increase your chances of approval. Avoid delays and mistakes while you prepare to experience the beauty and charm of Canada.",
    documentsRequired: [
      ...resDocs,
      '6 Months Bank Statement',
      'Company NOC Letter',
      'Previous Travel History (optional)',
      inviteLetter,
      tradeLicence,
    ],
    documentsProvided: [...core, 'Biometric Appointment', '24/7 Support'],
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    type: 'Visitor (Subclass 600)',
    processing: '2–4 weeks',
    note: 'Online lodgement handled for you',
    price: 'AED 1,500',
    about:
      "Our Australia Visit Visa assistance makes the process simple, smooth and stress-free. Whether you're visiting for tourism, family or business, our expert team guides you step by step — filling out your application accurately, preparing the required documents and ensuring everything is submitted correctly. Avoid costly mistakes, save time and increase your chances of approval while you get ready to experience the beauty of Australia, from the Sydney Opera House and the Great Barrier Reef to breathtaking beaches and unique wildlife.",
    documentsRequired: [
      ...resDocs,
      '3–6 Months Bank Statement',
      'Company NOC Letter',
      'Salary Certificate',
      'Previous Travel History (optional)',
      inviteLetter,
      tradeLicence,
    ],
    documentsProvided: [...core, 'Biometric Appointment', '24/7 Support'],
  },
  {
    country: 'New Zealand',
    flag: '🇳🇿',
    type: 'Visitor Visa',
    processing: '3–5 weeks',
    note: 'End-to-end application support',
    price: 'AED 2,000',
    about:
      "Our New Zealand Visit Visa assistance makes your journey easy, smooth and stress-free. Whether you're travelling for tourism, family visits or business, our expert team assists with every step — filling out the visa application, organising the required documents and guiding you through the entire process. Avoid delays, reduce errors and improve your chances of approval while you prepare to experience New Zealand's stunning landscapes, vibrant culture and warm Kiwi hospitality.",
    documentsRequired: [
      ...resDocs,
      '3–6 Months Bank Statement',
      'Company NOC Letter',
      'Salary Certificate',
      'Previous Travel History (optional)',
      inviteLetter,
      tradeLicence,
    ],
    documentsProvided: [...core, 'Travel Insurance (if needed)', '24/7 Support'],
  },

  // ── UAE-resident visit visas ───────────────────────────────────────────────
  // `processing` on these twelve is an estimate, not a quoted consular SLA —
  // adjust in Admin → Visas if the consulate's real turnaround differs.
  {
    country: 'Türkiye',
    flag: '🇹🇷',
    type: 'Visit Visa',
    processing: '2–3 weeks',
    note: 'Appointment booking & full document prep',
    price: 'AED 1,499',
    about:
      "Discover the charm of Türkiye — where East meets West. Apply for your Türkiye Visit Visa from Dubai effortlessly with our professional visa assistance. Whether you're planning to stroll through the historic streets of Istanbul, relax in Cappadocia's hot air balloons, or unwind on Antalya's beaches, we make your visa process fast, simple and stress-free. Our experienced team takes care of everything — from filling out your application form and arranging documents to booking appointments and ensuring smooth submission.",
    documentsRequired: [
      'Original Passport (valid 6+ months)',
      'Valid UAE Residence Visa (6+ months validity)',
      'Recent Passport-size Photo (white background)',
      'Company NOC Letter or Trade Licence (if self-employed)',
      '3 Months Bank Statement',
    ],
    documentsProvided: fullService,
  },
  {
    country: 'China',
    flag: '🇨🇳',
    type: 'Visit Visa',
    processing: '2–3 weeks',
    note: 'Transparent fees — no hidden charges',
    price: 'AED 999',
    about:
      "Planning to explore the wonders of China? Apply for your China Visit Visa from Dubai with our expert assistance. Whether you're visiting family and friends or exploring landmarks like the Great Wall, the Forbidden City or Shanghai's skyline, we make your visa process smooth and stress-free. Our team guides you through every step — from document preparation to form filling, appointment booking and submission.",
    documentsRequired: [
      'Original Passport (valid 6+ months)',
      'Passport-size Photo (white background)',
      'Company NOC Letter or Trade Licence (if self-employed)',
      '3 Months Bank Statement',
      'Invitation Letter (if applicable)',
    ],
    documentsProvided: [...core, 'Embassy Fee', 'Transparent Fees — No Hidden Charges', '24/7 Support'],
  },
  {
    country: 'Senegal',
    flag: '🇸🇳',
    type: 'Visit Visa',
    processing: '2–3 weeks',
    note: 'Tourism, family visits & business',
    price: 'AED 1,000',
    about:
      "Our Senegal Visit Visa assistance makes the process simple, accurate and stress-free. Whether you're travelling for tourism, family visits or business, our expert team guides you through every step — filling out your application properly, preparing the required documents and ensuring a smooth submission. Save time, avoid errors and improve your chances of approval while you get ready to explore Senegal's vibrant markets, historic landmarks, golden beaches and warm West African hospitality.",
    documentsRequired: resDocs,
    documentsProvided: fullService,
  },
  {
    country: 'Venezuela',
    flag: '🇻🇪',
    type: 'Visit Visa',
    processing: '3–4 weeks',
    note: 'Full document handling end-to-end',
    price: 'AED 2,000',
    about:
      "Our Venezuela Visit Visa assistance is designed to make your visa process easy, quick and stress-free. Whether you're travelling for tourism, family visits or business, our expert team helps you accurately complete your application, prepare and organise the required documents, and guides you through each step of submission — so you can get ready to explore Venezuela's breathtaking Angel Falls, stunning beaches, lively culture and warm hospitality with peace of mind.",
    documentsRequired: baseDocs,
    documentsProvided: fullService,
  },
  {
    country: 'Russia',
    flag: '🇷🇺',
    type: 'Visit Visa',
    processing: '2–3 weeks',
    note: 'Timely submission, fewer delays',
    price: 'AED 2,000',
    about:
      "Our Russia Visit Visa assistance keeps the process smooth, accurate and stress-free. Whether you're travelling for tourism, family visits or business, our expert team guides you through every step — completing your application correctly, organising the required documents and ensuring timely submission. Reduce errors, avoid delays and improve your chances of approval while you prepare to experience Russia's iconic landmarks, from Red Square and the Kremlin to breathtaking palaces and cathedrals.",
    documentsRequired: resDocs,
    documentsProvided: fullService,
  },
  {
    country: 'Philippines',
    flag: '🇵🇭',
    type: 'Visit Visa',
    processing: '2–3 weeks',
    note: 'Simple, fast & fully assisted',
    price: 'AED 1,099',
    about:
      "Our Philippines Visit Visa assistance makes your visa process simple, fast and stress-free. Whether you're travelling for tourism, family visits or business, our expert team assists with every step — accurately filling out your application, preparing the required documents and ensuring smooth submission. Avoid mistakes, save time and increase your chances of approval while you get ready to enjoy the Philippines' pristine beaches, vibrant cities, rich culture and warm hospitality.",
    documentsRequired: resDocs,
    documentsProvided: fullService,
  },
  {
    country: 'Malaysia',
    flag: '🇲🇾',
    type: 'Visit Visa',
    processing: '1–2 weeks',
    note: 'Quick turnaround, minimal paperwork',
    price: 'AED 999',
    about:
      "Our Malaysia Visit Visa assistance ensures your visa process is smooth, quick and stress-free. Whether you're travelling for tourism, family visits or business, our expert team guides you step by step — filling out your application accurately, preparing the required documents and submitting everything correctly. Avoid delays, reduce errors and improve your chances of approval while you prepare to experience Malaysia's stunning skyscrapers, tropical islands, diverse culture and world-famous hospitality.",
    documentsRequired: resDocs,
    documentsProvided: fullService,
  },
  {
    country: 'Tajikistan',
    flag: '🇹🇯',
    type: 'Visit Visa',
    processing: '2–3 weeks',
    note: 'Documents organised & submitted for you',
    price: 'AED 1,200',
    about:
      "Our Tajikistan Visit Visa assistance makes the process simple and stress-free. Whether you're travelling for tourism, family visits or business, our expert team guides you through each step — accurately filling out your application, preparing and organising the required documents and ensuring a smooth submission. Avoid errors, save time and increase your chances of approval while you get ready to explore Tajikistan's breathtaking mountains, rich culture and warm hospitality.",
    documentsRequired: resDocs,
    documentsProvided: fullService,
  },
  {
    country: 'Indonesia',
    flag: '🇮🇩',
    type: 'Visit Visa',
    processing: '1–2 weeks',
    note: 'Tourism, family & business travel',
    price: 'AED 1,200',
    about:
      "Our Indonesia Visit Visa assistance makes the process easy, fast and stress-free. Whether you're visiting for tourism, family or business, our expert team guides you through every step — accurately filling out your application, preparing the required documents and ensuring smooth submission. Avoid delays, minimise errors and improve your chances of approval while you prepare to explore Indonesia's stunning beaches, lush jungles, vibrant culture and world-famous destinations like Bali and Jakarta.",
    documentsRequired: resDocs,
    documentsProvided: fullService,
  },
  {
    country: 'Morocco',
    flag: '🇲🇦',
    type: 'Visit Visa',
    processing: '2–3 weeks',
    note: 'Documents organised & submitted for you',
    price: 'AED 1,000',
    about:
      "Our Morocco Visit Visa assistance is designed to make the entire process smooth and stress-free. Whether you're travelling for tourism, family visits or business, our expert team helps you fill out your application accurately, prepare and organise the required documents, and guides you through every step of submission. Avoid errors, save valuable time and increase your chances of approval while you get ready to experience Morocco's vibrant souks, stunning deserts and breathtaking historic cities.",
    documentsRequired: resDocs,
    documentsProvided: fullService,
  },
  {
    country: 'Thailand',
    flag: '🇹🇭',
    type: 'Visit Visa',
    processing: '1–2 weeks',
    note: 'Quick, smooth & hassle-free',
    price: 'AED 1,500',
    about:
      "Our Thailand Visit Visa assistance makes the process quick, smooth and hassle-free. Whether you're planning a holiday to enjoy Thailand's golden beaches, vibrant nightlife and cultural temples, or visiting family and friends, our expert team guides you through every step. We assist with filling out your application forms, preparing the necessary documents and ensuring everything is submitted correctly to avoid delays. Save time, reduce errors and boost your chances of approval while you get ready to enjoy the Land of Smiles.",
    documentsRequired: resDocs,
    documentsProvided: fullService,
  },
  {
    country: 'Japan',
    flag: '🇯🇵',
    type: 'Visit Visa',
    processing: '2–3 weeks',
    note: 'Full document prep & submission',
    price: 'AED 1,500',
    about:
      "Our Japan Visit Visa assistance makes the process simple and stress-free. Whether you're travelling for tourism, family visits or business, our expert team guides you through every step — filling out your visa application accurately, preparing and organising the required documents and ensuring a smooth submission. Avoid mistakes, save time and increase your chances of approval while you get ready to explore Japan's unique blend of tradition and modernity, from ancient temples and cherry blossoms to futuristic cities and world-class cuisine.",
    documentsRequired: [...resDocs, '3 Months Bank Statement (if available)'],
    documentsProvided: fullService,
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
    a: 'Yes — we handle 18 destinations, including the USA, UK, Schengen, Canada, Australia, New Zealand, Türkiye, China, Japan, Thailand, Malaysia, Indonesia, the Philippines, Russia, Morocco, Senegal, Venezuela and Tajikistan. Our team guides you through the entire process.',
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
      'End-to-end visa support for 18 destinations — from the USA, UK and Schengen to Japan, Thailand, Türkiye and beyond.',
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
