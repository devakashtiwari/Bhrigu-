import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Bhrigu Devotion-Tech database...");

  const devoteeHash = await bcrypt.hash("devotee123", 10);
  const adminHash = await bcrypt.hash("admin123", 10);

  const devotee = await prisma.user.upsert({
    where: { email: "aarav@devotee.in" },
    update: {},
    create: {
      name: "Aarav Sharma",
      email: "aarav@devotee.in",
      passwordHash: devoteeHash,
      phone: "+91 98765 43210",
      gotra: "Bharadwaja",
      nakshatra: "Rohini",
      rashi: "Vrishabha",
      role: "DEVOTEE",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "manager@bhrigu.in" },
    update: {},
    create: {
      name: "Pt. Vishwanath Shastri",
      email: "manager@bhrigu.in",
      passwordHash: adminHash,
      phone: "+91 98111 22334",
      gotra: "Vashishta",
      role: "ADMIN",
    },
  });

  const templesData = [
    {
      slug: "kashi-vishwanath-dham",
      name: "Sri Kashi Vishwanath Dham",
      location: "Varanasi, Uttar Pradesh",
      state: "Uttar Pradesh",
      deity: "Lord Shiva",
      tradition: "Kashi Shaiva",
      description:
        "One of the twelve sacred Jyotirlingas on the western bank of the holy Ganga. Renowned for Rudrabhishek, Mangala Aarti, and Vedic Sankalpam rituals performed by hereditary Kashi Pandits.",
      imageUrl: "/images/temple-kashi.jpg",
      timings: "3:00 AM – 11:00 PM",
      rating: 4.95,
      reviewCount: 1420,
      featured: true,
      managerId: admin.id,
      priests: [
        {
          name: "Acharya Raghavendra Pandey",
          title: "Pradhan Archak",
          experienceYrs: 24,
          languages: "Sanskrit, Hindi",
        },
        {
          name: "Pt. Somnath Tripathi",
          title: "Vedic Shastri",
          experienceYrs: 16,
          languages: "Sanskrit, Hindi, English",
        },
      ],
      poojas: [
        {
          name: "Shodashopachara Rudrabhishek",
          category: "Abhishekam",
          description:
            "Sacred Vedic chanting of Sri Rudram with Panchamrit, Ganga Jal, Bilva leaves, and Bhasma offering in the sanctum.",
          benefits: "Inner peace, health, spiritual upliftment, and removal of planetary doshas.",
          durationMins: 60,
          priceInr: 2100,
          mode: "BOTH",
          maxPerSlot: 6,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "Laghu Mrityunjaya Jap & Sankalpam",
          category: "Homam / Havan",
          description:
            "Personalized Maha Mrityunjaya mantra japa (11,000 chants) with sankalpam in your family's Gotra and Nakshatra.",
          benefits: "Protection, longevity, and recovery from chronic ailments.",
          durationMins: 90,
          priceInr: 5100,
          mode: "LIVE_STREAM",
          maxPerSlot: 3,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "Sandhya Ganga Aarti & Deepdaan",
          category: "Archana",
          description:
            "Evening aarti offering with 108 brass diyas floated on the sacred Ganga in your family's name.",
          benefits: "Harmony, ancestral blessings, and gratitude.",
          durationMins: 45,
          priceInr: 1100,
          mode: "BOTH",
          maxPerSlot: 12,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "रोग निवारण (Rog Nivaran Puja)",
          category: "Japa / Anushthan",
          description:
            "Vedic healing sankalpam with Dhanvantari and Shiva mantra anushthan for relief from chronic illness and restoration of vitality.",
          benefits: "Physical recovery, immunity, mental strength, and overall well-being.",
          durationMins: 75,
          priceInr: 2500,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-rog-nivaran.jpg",
        },
        {
          name: "मृत संजीवनी (Mrit Sanjeevani Puja)",
          category: "Japa / Anushthan",
          description:
            "Intensive Vedic Mrit Sanjeevani mantra japa and Rudra homam performed by Kashi acharyas for protection during severe health crises.",
          benefits: "Longevity, protection from life-threatening ailments, and spiritual grace.",
          durationMins: 120,
          priceInr: 5100,
          mode: "BOTH",
          maxPerSlot: 3,
          imageUrl: "/images/pooja-shiva-havan.jpg",
        },
        {
          name: "महामृत्युजय जाप (Mahamrityunjaya Jaap)",
          category: "Japa / Anushthan",
          description:
            "Sacred chanting of the Mahamrityunjaya Mantra with Samputa and Dashansh Havan in your family's Gotra and Nakshatra.",
          benefits: "Removes fear of untimely obstacles, grants health, peace, and longevity.",
          durationMins: 120,
          priceInr: 5100,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-shiva-havan.jpg",
        },
        {
          name: "रुद्राभिषेक (Rudrabhishek)",
          category: "Abhishekam",
          description:
            "Traditional Rudrabhishek of Lord Shiva with Panchamrit, milk, honey, sugarcane juice, and Bilva leaves amidst Sri Rudram chanting.",
          benefits: "Fulfillment of wishes, prosperity, and removal of negative energies.",
          durationMins: 60,
          priceInr: 2100,
          mode: "BOTH",
          maxPerSlot: 6,
          imageUrl: "/images/pooja-shiva-havan.jpg",
        },
        {
          name: "काल सर्प दोष (Kaal Sarp Dosh Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Specialized Rahu-Ketu and Nag Devta shanti vidhi with Rudrabhishek to pacify Kaal Sarp Yog in the birth chart.",
          benefits: "Removes career delays, mental unrest, and recurring obstacles.",
          durationMins: 120,
          priceInr: 4500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "महाकाल पूजा (Mahakal Puja)",
          category: "Abhishekam",
          description:
            "Sacred Bhasma-inspired Mahakal Shiva archana and abhishekam invoking Lord Shiva as the conqueror of time.",
          benefits: "Fearlessness, spiritual strength, and protection from adversities.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "भैरव पूजा (Bhairav Puja)",
          category: "Archana",
          description:
            "Devotional Kalabhairav archana and deepdaan ritual in Kashi for divine protection and removal of negativity.",
          benefits: "Protection from evil eye, courage, and success in legal or competitive matters.",
          durationMins: 60,
          priceInr: 2100,
          mode: "BOTH",
          maxPerSlot: 6,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "मार्कंडेय पूजा (Markandeya Puja)",
          category: "Japa / Anushthan",
          description:
            "Vedic Markandeya Ayushya Homam and Shiva stuti performed for long life, child well-being, and overcoming planetary afflictions.",
          benefits: "Longevity, protection during critical dasha periods, and peace.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "पितृ दोष पूजा (Pitra Dosh Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Sacred Kashi Pitra Shanti, Tripindi Shraddha sankalpam, and Tarpan vidhi to appease ancestors and seek their blessings.",
          benefits: "Family harmony, lineage blessings, and relief from ancestral obstacles.",
          durationMins: 120,
          priceInr: 4500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "पितृ गायत्री (Pitra Gayatri Puja)",
          category: "Japa / Anushthan",
          description:
            "Chanting of Pitra Gayatri Mantra with Til-Tarpan and Vishnu-Shiva sankalpam for peace of departed souls.",
          benefits: "Ancestral peace, domestic prosperity, and removal of Pitra dosha.",
          durationMins: 90,
          priceInr: 2500,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "राहु केतु शांति अनुष्ठान (Rahu Ketu Shanti Anushthan)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Dedicated Graha Shanti japa and havan for Rahu and Ketu using Durva, Kusha, and Navagraha samidha.",
          benefits: "Clarity of mind, relief from sudden setbacks, and planetary balance.",
          durationMins: 120,
          priceInr: 4100,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "तमनुष्यन जाप (Tamnushyan Jaap)",
          category: "Japa / Anushthan",
          description:
            "Authentic Vedic mantra anushthan and sankalpam performed by senior Kashi Pandits for spiritual purification and wish fulfillment.",
          benefits: "Inner calm, obstacle removal, and divine grace.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "रुद्राभिषेक पूजा (Rudrabhishek Puja)",
          category: "Abhishekam",
          description:
            "Sacred Vedic Rudrabhishek of Lord Vishwanath with Panchamrit, Ganga Jal, milk, and Bilva leaves amidst Sri Rudram chanting.",
          benefits: "Inner peace, health, wish fulfillment, and removal of planetary obstacles.",
          durationMins: 60,
          priceInr: 2100,
          mode: "BOTH",
          maxPerSlot: 6,
          imageUrl: "/images/pooja-shiva-havan.jpg",
        },
        {
          name: "महामृत्युंजय जाप अनुष्ठान (Mahamrityunjaya Jaap Anushthan)",
          category: "Japa / Anushthan",
          description:
            "Full Samputit Mahamrityunjaya mantra anushthan with Dashansh Havan performed by Kashi Vedic Pandits in your Gotra.",
          benefits: "Protection from severe health crises, longevity, and fearlessness.",
          durationMins: 120,
          priceInr: 5100,
          mode: "BOTH",
          maxPerSlot: 3,
          imageUrl: "/images/pooja-shiva-havan.jpg",
        },
        {
          name: "महाभैरव आपदा हरण यज्ञ (Mahabhairav Aapda Haran Yagya)",
          category: "Homam / Havan",
          description:
            "Powerful Mahabhairav yagya invoking Kalabhairav to avert sudden calamities, legal troubles, and negative energies.",
          benefits: "Protection from emergencies, courage, and removal of unforeseen obstacles.",
          durationMins: 90,
          priceInr: 4100,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "पितृ पक्ष विशेष तिल तर्पण और पिंडदान (Pitru Paksha Vishesh Til Tarpan & Pind Daan)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Traditional Kashi Ganga-ghat Til Tarpan and Pind Daan vidhi performed with Vedic sankalpam for ancestral peace.",
          benefits: "Appeases ancestors, removes Pitra Dosh, and brings family harmony.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "विष योग शांति पूजा (Vish Yog Shanti Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Specialized Shani-Chandra Vish Yog nivaran ritual with Rudrabhishek and Chandra-Shani mantra japa.",
          benefits: "Relieves mental anxiety, emotional distress, and career stagnation.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "गंडमूल नक्षत्र शांति पूजा (Gandmool Nakshatra Shanti Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Authentic Vedic Gandmool Nakshatra Shanti homam with 27-well sacred water kalash and navagraha offerings.",
          benefits: "Harmonizes birth star energies and protects child and family well-being.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "ग्रहण दोष निवारण पूजा (Grahan Dosh Nivaran Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Vedic Surya/Chandra Grahan Dosh nivaran sankalpam with Rahu-Ketu shanti havan and Rudra abhishekam.",
          benefits: "Removes eclipse-related chart afflictions, self-doubt, and delays.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "धन्वंतरि नवग्रह शांति यज्ञ (Dhanvantari Navagraha Shanti Yagya)",
          category: "Homam / Havan",
          description:
            "Combined Lord Dhanvantari healing yagya and Navagraha Shanti homam with medicinal herbs and Vedic mantras.",
          benefits: "Holistic health recovery, vitality, and planetary balance.",
          durationMins: 120,
          priceInr: 4500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-rog-nivaran.jpg",
        },
        {
          name: "मारकेश ग्रह शांति अनुष्ठान (Markesh Grah Shanti Anushthan)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Intensive Markesh Dasha shanti anushthan with Mrityunjaya japa and Graha Shanti havan for life protection.",
          benefits: "Protects during Markesh planetary periods and promotes longevity.",
          durationMins: 120,
          priceInr: 5100,
          mode: "BOTH",
          maxPerSlot: 3,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "कालभैरव अष्टमी विशेष राहु शांति (Kalabhairav Ashtami Vishesh Rahu Shanti)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Special Kalabhairav archana and Rahu Shanti vidhi performed to pacify sudden Rahu dasha disruptions.",
          benefits: "Clarity, protection from illusions, and relief from Rahu afflictions.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "केतु दोष हरण महायज्ञ (Ketu Dosh Haran Mahayagya)",
          category: "Homam / Havan",
          description:
            "Dedicated Ketu Graha Shanti mahayagya with Ganesh-Shiva sankalpam and Kusha samidha offerings.",
          benefits: "Removes confusion, unexpected losses, and spiritual restlessness.",
          durationMins: 120,
          priceInr: 4100,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "नक्षत्र महाशांति अनुष्ठान (Nakshatra Mahashanti Anushthan)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Comprehensive Janma Nakshatra and Tara Bala shanti anushthan with Nakshatra Suktam and havan.",
          benefits: "Aligns birth star strength, luck, and smooth life progression.",
          durationMins: 120,
          priceInr: 4500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "नारायण बलि (Narayan Bali)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Sacred Vedic Narayan Bali vidhi performed in Kashi for liberation of unsatisfied ancestral souls and severe Pitra dosha.",
          benefits: "Deep ancestral peace, lineage blessings, and removal of chronic family hurdles.",
          durationMins: 150,
          priceInr: 6100,
          mode: "BOTH",
          maxPerSlot: 3,
          imageUrl: "/images/temple-kashi.jpg",
        },
        {
          name: "त्रिपिंडी (Tripindi Shraddha)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Traditional Kashi Tripindi Shraddha offering to Brahma, Vishnu, and Mahesh for pacifying three generations of ancestors.",
          benefits: "Removes Pitra badha, brings peace to ancestors, and restores household harmony.",
          durationMins: 120,
          priceInr: 5100,
          mode: "BOTH",
          maxPerSlot: 3,
          imageUrl: "/images/temple-kashi.jpg",
        },
      ],
    },
    {
      slug: "tirumala-venkateswara-temple",
      name: "Sri Venkateswara Swamy Temple",
      location: "Tirupati, Andhra Pradesh",
      state: "Andhra Pradesh",
      deity: "Lord Venkateswara",
      tradition: "Vaishnava",
      description:
        "Sacred seven-hills abode of Sri Maha Vishnu. Experience traditional Suprabhata Seva, Sahasranama Archana, and Kalyanotsavam with authentic Tirupati Laddu prasad delivery.",
      imageUrl: "/images/temple-tirupati.jpg",
      timings: "4:00 AM – 10:30 PM",
      rating: 4.98,
      reviewCount: 2380,
      featured: true,
      managerId: admin.id,
      priests: [
        {
          name: "Sri Venkata Narasimha Dikshitar",
          title: "Agama Vidwan",
          experienceYrs: 28,
          languages: "Sanskrit, Telugu, Tamil, English",
        },
        {
          name: "Sri Srinivasa Bhattar",
          title: "Senior Archaka",
          experienceYrs: 18,
          languages: "Sanskrit, Telugu, Kannada",
        },
      ],
      poojas: [
        {
          name: "Sri Venkateswara Suprabhata Seva",
          category: "Archana",
          description:
            "Auspicious dawn awakening hymns followed by Tulasi Archana and Darshan sankalpam.",
          benefits: "Prosperity, clarity, and auspicious beginnings.",
          durationMins: 45,
          priceInr: 1500,
          mode: "BOTH",
          maxPerSlot: 8,
          imageUrl: "/images/temple-tirupati.jpg",
        },
        {
          name: "Nitya Kalyanotsavam",
          category: "Kalyanotsavam",
          description:
            "Celestial wedding ceremony of Lord Venkateswara with Sri Devi and Bhu Devi accompanied by Vedic mangala vadyam.",
          benefits: "Marital harmony, family well-being, and abundance.",
          durationMins: 75,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "Sahasranama Archana & Prasad",
          category: "Archana",
          description:
            "Chanting of 1,008 sacred names with fresh jasmine & lotus offerings, plus energized prasad dispatch.",
          benefits: "Success in endeavors and peace of mind.",
          durationMins: 40,
          priceInr: 901,
          mode: "LIVE_STREAM",
          maxPerSlot: 10,
          imageUrl: "/images/temple-tirupati.jpg",
        },
        {
          name: "संतान प्राप्ति (Santan Prapti Puja)",
          category: "Homam / Havan",
          description:
            "Sacred Santana Gopala mantra japa and Putra Kameshti homam seeking the blessings of Lord Vishnu for healthy progeny.",
          benefits: "Blessings for progeny, family joy, and maternal well-being.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-santan-prapti.jpg",
        },
        {
          name: "सत्यनारामण कथा (Satyanarayan Katha)",
          category: "Katha / Path",
          description:
            "Traditional Sri Satyanarayan Vrat Katha recitation with Panchamrit, Sheera prasad offering, and family sankalpam.",
          benefits: "Prosperity, gratitude, family unity, and auspiciousness.",
          durationMins: 90,
          priceInr: 2100,
          mode: "BOTH",
          maxPerSlot: 6,
          imageUrl: "/images/temple-tirupati.jpg",
        },
        {
          name: "लक्ष्मी पूजा (Lakshmi Puja)",
          category: "Archana",
          description:
            "Vedic Sri Suktam recitation and Maha Lakshmi lotus archana for abundance, wealth, and household harmony.",
          benefits: "Financial stability, business growth, and auspicious fortune.",
          durationMins: 60,
          priceInr: 2100,
          mode: "BOTH",
          maxPerSlot: 8,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "कुबेर पूजा (Kuber Puja)",
          category: "Homam / Havan",
          description:
            "Lakshmi-Kuber mantra japa and homam invoking the celestial treasurer for sustained wealth and debt relief.",
          benefits: "Wealth accumulation, career advancement, and financial security.",
          durationMins: 75,
          priceInr: 2500,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/temple-tirupati.jpg",
        },
        {
          name: "शुक्र पूजा (Shukra Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Venus (Shukra) Graha Shanti archana and mantra japa with white flowers and rice offerings to strengthen Shukra in the horoscope.",
          benefits: "Marital harmony, artistic success, luxury, and relationship balance.",
          durationMins: 60,
          priceInr: 2100,
          mode: "BOTH",
          maxPerSlot: 6,
          imageUrl: "/images/temple-tirupati.jpg",
        },
        {
          name: "श्री सूक्त पाठ और लक्ष्मी हवन (Sri Sukta Path & Lakshmi Havan)",
          category: "Homam / Havan",
          description:
            "16-verse Rigvedic Sri Sukta recitation paired with Maha Lakshmi Kamal-Gatta havan for abundance and grace.",
          benefits: "Attracts wealth, prosperity, and auspiciousness to home and business.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "धनधिपति कुबेर राजयोग प्राप्ति पूजा (Dhanadhipati Kuber Rajyog Prapti Puja)",
          category: "Japa / Anushthan",
          description:
            "Vedic Kuber-Lakshmi mantra anushthan and sankalpam designed to activate wealth and Rajyog combinations.",
          benefits: "Financial growth, career elevation, and sustained prosperity.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/temple-tirupati.jpg",
        },
        {
          name: "पुत्र रत्न प्राप्ति महापूजा (Putra Ratna Prapti Mahapuja)",
          category: "Homam / Havan",
          description:
            "Sacred Santana Gopala sahasranama and Putra Kameshti mahapuja seeking Lord Vishnu's blessings for virtuous progeny.",
          benefits: "Blessings for healthy progeny and family lineage fulfillment.",
          durationMins: 120,
          priceInr: 4500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-santan-prapti.jpg",
        },
        {
          name: "आदित्य हृदय स्तोत्र संपुटित पाठ (Aditya Hridaya Stotra Samputit Path)",
          category: "Katha / Path",
          description:
            "Samputit recitation of Sage Agastya's Aditya Hridaya Stotra with Surya arghya and sankalpam.",
          benefits: "Confidence, vitality, leadership success, and victory over challenges.",
          durationMins: 60,
          priceInr: 2100,
          mode: "BOTH",
          maxPerSlot: 6,
          imageUrl: "/images/temple-tirupati.jpg",
        },
        {
          name: "बुध होमा / महावेध शांति (Budh Homa / Mahavedh Shanti)",
          category: "Homam / Havan",
          description:
            "Vedic Mercury (Budh) homam and Mahavedh shanti vidhi with Apamarga samidha and green moong offerings.",
          benefits: "Sharp intellect, business acumen, communication clarity, and academic success.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "नवग्रह मंडल कनकधारा अनुष्ठान (Navagraha Mandal Kanakdhara Anushthan)",
          category: "Japa / Anushthan",
          description:
            "Adi Shankaracharya's Kanakdhara Stotra anushthan integrated with Navagraha Mandal puja for financial turnaround.",
          benefits: "Removes poverty, clears financial blockages, and harmonizes all nine planets.",
          durationMins: 120,
          priceInr: 4500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/temple-tirupati.jpg",
        },
        {
          name: "नीच भंग राजयोग जागृत पूजा (Neech Bhang Rajyog Jagrit Puja)",
          category: "Japa / Anushthan",
          description:
            "Targeted planetary awakening anushthan to strengthen debilitated planets and activate Neech Bhang Rajyog in the kundali.",
          benefits: "Transforms obstacles into breakthroughs and unlocks hidden chart potential.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
      ],
    },
    {
      slug: "meenakshi-amman-madurai",
      name: "Arulmigu Meenakshi Sundareswarar Temple",
      location: "Madurai, Tamil Nadu",
      state: "Tamil Nadu",
      deity: "Goddess Meenakshi & Shiva",
      tradition: "Shakta & Shaiva",
      description:
        "Historic Dravidian architectural marvel on the Vaigai River, dedicated to Goddess Meenakshi and Lord Sundareswarar. Known for Lalita Sahasranama Archana and Kumkum Abhishekam.",
      imageUrl: "/images/hero-temple.jpg",
      timings: "5:00 AM – 12:30 PM, 4:00 PM – 9:30 PM",
      rating: 4.92,
      reviewCount: 980,
      featured: true,
      managerId: admin.id,
      priests: [
        {
          name: "Sivachariyar Sundaramurthy",
          title: "Sthapathi & Archakar",
          experienceYrs: 22,
          languages: "Sanskrit, Tamil, English",
        },
      ],
      poojas: [
        {
          name: "Sri Lalita Sahasranama Kumkum Archana",
          category: "Archana",
          description:
            "Chanting of the 1,000 sacred names of Devi with pure kumkum and red lotus offerings.",
          benefits: "Wisdom, courage, and domestic harmony.",
          durationMins: 50,
          priceInr: 1250,
          mode: "BOTH",
          maxPerSlot: 8,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "Navagraha Shanti Homam",
          category: "Homam / Havan",
          description:
            "Vedic fire ritual invoking the nine planetary deities with samidha, ghee, and navadhanya offerings.",
          benefits: "Mitigates planetary obstacles and brings career stability.",
          durationMins: 90,
          priceInr: 4100,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/hero-temple.jpg",
        },
        {
          name: "माँ मातंगी (Maa Matangi Puja)",
          category: "Archana",
          description:
            "Sacred Shakta archana and mantra japa dedicated to Maa Matangi, the Tantric Saraswati and ninth Mahavidya.",
          benefits: "Eloquence, mastery in arts and music, wisdom, and charisma.",
          durationMins: 60,
          priceInr: 2100,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-maa-matangi.jpg",
        },
        {
          name: "कामाख्या पूजा (Kamakhya Puja)",
          category: "Special Darshan",
          description:
            "Devotional Devi Kamakhya sankalpam, kumkum archana, and Shakti stuti for overcoming deep-rooted obstacles.",
          benefits: "Fulfillment of desires, marital bliss, and spiritual empowerment.",
          durationMins: 90,
          priceInr: 4100,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/hero-temple.jpg",
        },
        {
          name: "सरस्वती पूजा (Saraswati Puja)",
          category: "Archana",
          description:
            "Vedic Saraswati Vandana, Vidya Suktam, and white lotus archana for students, scholars, and seekers of knowledge.",
          benefits: "Academic excellence, memory, clarity of speech, and creative insight.",
          durationMins: 60,
          priceInr: 1500,
          mode: "BOTH",
          maxPerSlot: 8,
          imageUrl: "/images/pooja-maa-matangi.jpg",
        },
        {
          name: "नवग्रह शांति (Navagraha Shanti Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Complete nine-planet Vedic shanti archana and havan to harmonize planetary periods (Mahadasha and Antardasha).",
          benefits: "Balanced planetary influence, peace, and steady progress.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/hero-temple.jpg",
        },
        {
          name: "महाकाली पूजा (Mahakali Puja)",
          category: "Homam / Havan",
          description:
            "Powerful Maa Mahakali mantra japa and havan with hibiscus offerings for fierce protection and transformation.",
          benefits: "Destruction of negativity, fearlessness, and spiritual resilience.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "बंगलामुखी पूजा (Baglamukhi Puja)",
          category: "Homam / Havan",
          description:
            "Traditional Maa Baglamukhi Pitambara havan and mantra anushthan with turmeric and yellow offerings.",
          benefits: "Victory in disputes, protection from enemies, and mental mastery.",
          durationMins: 120,
          priceInr: 5100,
          mode: "BOTH",
          maxPerSlot: 3,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "प्रत्यङ्गिरा पूजा (Pratyangira Puja)",
          category: "Homam / Havan",
          description:
            "Sacred Atharvana Bhadrakali Pratyangira Devi havan performed by learned Shakta acharyas for supreme spiritual shielding.",
          benefits: "Neutralizes negative influences, black magic fears, and severe obstacles.",
          durationMins: 120,
          priceInr: 5500,
          mode: "BOTH",
          maxPerSlot: 3,
          imageUrl: "/images/hero-temple.jpg",
        },
        {
          name: "छिन्नमाता पूजा (Chhinnamasta Puja)",
          category: "Japa / Anushthan",
          description:
            "Authentic Shakta anushthan dedicated to Maa Chhinnamasta, the sixth Mahavidya symbolizing self-mastery and renewal.",
          benefits: "Inner awakening, courage, and breakthrough in stagnant situations.",
          durationMins: 90,
          priceInr: 4100,
          mode: "BOTH",
          maxPerSlot: 3,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "दस महाविद्या (Das Mahavidya Puja)",
          category: "Special Darshan",
          description:
            "Comprehensive worship of all ten Mahavidya forms of Adi Parashakti with Vedic and Tantric stotras and havan.",
          benefits: "Holistic spiritual protection, wisdom, prosperity, and liberation.",
          durationMins: 150,
          priceInr: 7500,
          mode: "BOTH",
          maxPerSlot: 2,
          imageUrl: "/images/hero-temple.jpg",
        },
        {
          name: "वशीकरण निवारण (Vashikaran Nivaran Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Protective Devi kavacham, Sudarshana, and Shakti shanti ritual to cleanse aura and restore free will and mental peace.",
          benefits: "Aura cleansing, emotional clarity, and protection from negative intent.",
          durationMins: 90,
          priceInr: 4100,
          mode: "BOTH",
          maxPerSlot: 3,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "भद्रकाली पूजा (Bhadrakali Puja)",
          category: "Homam / Havan",
          description:
            "Auspicious Maa Bhadrakali archana and homam invoking the benevolent protector form of the Divine Mother.",
          benefits: "Family protection, courage, and removal of fear and obstacles.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/hero-temple.jpg",
        },
        {
          name: "अन्नपूर्णा पूजा एवं यज्ञ (Annapurna Puja & Yagya)",
          category: "Homam / Havan",
          description:
            "Devotional Maa Annapurna archana and yagya for perpetual abundance, nourishment, and prosperity in the household.",
          benefits: "Ensures food, wealth, and contentment in the family.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "नवग्रह शांति पूजा (Navagraha Shanti Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Complete nine-planet Vedic shanti puja with Navadhanya, planetary mantras, and Devi sankalpam.",
          benefits: "Mitigates malefic planetary transits and brings peace and stability.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/hero-temple.jpg",
        },
        {
          name: "नवदिवसीय चंडी पाठ एवं महायज्ञ (Navdivasiya Chandi Path & Mahayagya)",
          category: "Katha / Path",
          description:
            "Nine-day Durga Saptashati (Chandi Path) sankalpam culminating in a grand Chandi Mahayagya.",
          benefits: "Supreme Devi protection, obstacle removal, and spiritual triumph.",
          durationMins: 180,
          priceInr: 11000,
          mode: "BOTH",
          maxPerSlot: 2,
          imageUrl: "/images/hero-temple.jpg",
        },
        {
          name: "मोहिनी पूजा (कार्य सिद्धि) (Mohini Puja - Karya Siddhi)",
          category: "Japa / Anushthan",
          description:
            "Sacred Karya Siddhi Mohini anushthan for positive influence, harmony in relationships, and success in stalled endeavors.",
          benefits: "Smooth completion of important tasks, charisma, and interpersonal harmony.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "शुक्र मंत्र जाप एवं मंगला गौरी महापूजा (Shukra Mantra Jaap & Mangala Gauri Mahapuja)",
          category: "Japa / Anushthan",
          description:
            "Combined Venus mantra japa and Maa Mangala Gauri mahapuja for marital bliss, love, and auspiciousness.",
          benefits: "Harmonious marriage, removal of delays, and domestic happiness.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "गुरु चांडाल दोष शांति अनुष्ठान (Guru Chandal Dosh Shanti Anushthan)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Vedic Brihaspati-Rahu Guru Chandal Dosh shanti anushthan with Peeli Sarson, turmeric, and Guru mantra japa.",
          benefits: "Restores wisdom, right judgment, and career/education stability.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/hero-temple.jpg",
        },
        {
          name: "केमद्रुम दोष शांति पूजा (Kemdrum Dosh Shanti Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Chandra Kemdrum Yog nivaran puja with Devi Lalita archana and Moon mantra japa for emotional and financial stability.",
          benefits: "Relieves loneliness, mental restlessness, and financial fluctuations.",
          durationMins: 75,
          priceInr: 2500,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "बाधा निवारण भद्रकाली अनुष्ठान (Badha Nivaran Bhadrakali Anushthan)",
          category: "Homam / Havan",
          description:
            "Sacred Maa Bhadrakali anushthan and havan to clear persistent life blockages and protect the devotee.",
          benefits: "Removes stubborn hurdles, grants courage, and shields from negativity.",
          durationMins: 90,
          priceInr: 4100,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/hero-temple.jpg",
        },
      ],
    },
    {
      slug: "siddhivinayak-mandir-mumbai",
      name: "Shree Siddhivinayak Ganapati Mandir",
      location: "Mumbai, Maharashtra",
      state: "Maharashtra",
      deity: "Lord Ganesha",
      tradition: "Ganapatya",
      description:
        "Revered shrine of Vighnaharta Ganesha in Prabhadevi. Book Sankashti Chaturthi Abhishek, Atharvashirsha Pathan, or Modak Naivedya with live darshan and prasad.",
      imageUrl: "/images/pooja-ritual.jpg",
      timings: "5:30 AM – 10:00 PM",
      rating: 4.94,
      reviewCount: 1850,
      featured: false,
      managerId: admin.id,
      priests: [
        {
          name: "Pt. Gajanan Joshi",
          title: "Vedic Purohit",
          experienceYrs: 19,
          languages: "Sanskrit, Marathi, Hindi, English",
        },
      ],
      poojas: [
        {
          name: "Ganapati Atharvashirsha Sahasravartan",
          category: "Abhishekam",
          description:
            "21x Atharvashirsha recitation with Panchamrit Abhishekam, Durva grass, and 21 Modak offering.",
          benefits: "Removes obstacles before new ventures, exams, or home purchases.",
          durationMins: 60,
          priceInr: 1800,
          mode: "BOTH",
          maxPerSlot: 6,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "Vighnaharta Sankalpam & Modak Prasad",
          category: "Special Darshan",
          description:
            "Dedicated sankalpam at the sanctum with energized sindoor and modak prasad shipped to your home.",
          benefits: "Auspiciousness, clarity, and protection.",
          durationMins: 30,
          priceInr: 751,
          mode: "LIVE_STREAM",
          maxPerSlot: 15,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "भूमि पूजन (Bhumi Pujan)",
          category: "Homam / Havan",
          description:
            "Traditional Vastu Purusha and Bhumi Devi worship with Ganesha sthapana before starting new construction or land purchase.",
          benefits: "Vastu harmony, safe construction, and lasting prosperity on the land.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-bhumi-pujan.jpg",
        },
        {
          name: "गृह प्रवेश (Griha Pravesh Puja)",
          category: "Homam / Havan",
          description:
            "Auspicious new-home entry ritual with Ganapati Havan, Vastu Shanti, Navagraha Puja, and Kalash Sthapana.",
          benefits: "Positive energy, peace, health, and abundance in the new home.",
          durationMins: 120,
          priceInr: 5500,
          mode: "BOTH",
          maxPerSlot: 3,
          imageUrl: "/images/pooja-bhumi-pujan.jpg",
        },
        {
          name: "वाहन पूजा (Vahan Puja)",
          category: "Archana",
          description:
            "Sacred Ganesha and Vishwakarma blessing ritual for new or existing vehicles with coconut, garland, and swastika tilak.",
          benefits: "Safe journeys, accident protection, and auspicious travels.",
          durationMins: 45,
          priceInr: 1100,
          mode: "BOTH",
          maxPerSlot: 10,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "मंगल शांति (Mangal Shanti Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Vedic Manglik Dosh Nivaran and Angaraka (Mars) shanti havan with red sandalwood and masoor offerings.",
          benefits: "Removes marriage delays, tempers aggression, and brings domestic peace.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "ग्रह दोष शांति (Grah Dosh Shanti Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Comprehensive Graha Dosh Nivaran sankalpam and Vedic havan to pacify malefic planetary influences in the natal chart.",
          benefits: "Stability in career, health, and relationships.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "शनि शांति अनुष्ठान (Shani Shanti Anushthan)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Dedicated Shani Dev tailabhishekam, Dasharatha Shani Stotra, and til-havan to ease Sade Sati and Shani Dhaiya.",
          benefits: "Relief from hardships, patience, discipline, and career stability.",
          durationMins: 90,
          priceInr: 3100,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "हनुमान पूजा (Hanuman Puja)",
          category: "Archana",
          description:
            "Devotional Sundarkand path, Hanuman Chalisa chanting, and sindoor-chola offering for strength and protection.",
          benefits: "Courage, protection from negativity, and victory over obstacles.",
          durationMins: 60,
          priceInr: 1500,
          mode: "BOTH",
          maxPerSlot: 8,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "ऋण मुक्ति पूजा (Rin Mukti Puja)",
          category: "Homam / Havan",
          description:
            "Vedic Rinaharta Ganesha and Mangal Rin Mukti stotra havan for relief from financial debts and liabilities.",
          benefits: "Debt relief, improved cash flow, and financial peace of mind.",
          durationMins: 75,
          priceInr: 2500,
          mode: "BOTH",
          maxPerSlot: 5,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "राहु-केतु ग्रहशांति संतुलन चढ़ावा (Rahu-Ketu Grahashanti Santulan Chadhava)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Sacred Rahu-Ketu balance chadhava with black sesame, urad, and Ganesha sankalpam to stabilize shadow planets.",
          benefits: "Balances Rahu-Ketu transits and reduces sudden stress or confusion.",
          durationMins: 60,
          priceInr: 2100,
          mode: "BOTH",
          maxPerSlot: 6,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "शनि दोष निवारण तेल चढ़ावा (Shani Dosh Nivaran Tel Chadhava)",
          category: "Abhishekam",
          description:
            "Traditional Saturday sesame-oil abhishekam and Shani stotra sankalpam to ease Sade Sati and Dhaiya.",
          benefits: "Eases Shani-related struggles, delays, and brings steady discipline.",
          durationMins: 45,
          priceInr: 1500,
          mode: "BOTH",
          maxPerSlot: 8,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "श्रापित दोष निवारण पूजा (Shrapit Dosh Nivaran Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Specialized Shani-Rahu Shrapit Dosh shanti puja with Rudra-Ganesha sankalpam and Navagraha havan.",
          benefits: "Clears karmic blocks, delays in marriage/career, and restores progress.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "बाधकेश ग्रह परिहार शांति पूजा (Badhkesh Grah Parihar Shanti Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Targeted Vedic parihar ritual to pacify the Badhkesh planet causing unexplained obstacles in the horoscope.",
          benefits: "Unlocks stalled projects, improves luck, and removes hidden hurdles.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
        {
          name: "अंगारक दोष निवारण पूजा (Angarak Dosh Nivaran Puja)",
          category: "Shanti / Dosha Nivaran",
          description:
            "Vedic Mangal-Rahu Angarak Yog nivaran puja with Ganesha-Hanuman sankalpam and shanti havan.",
          benefits: "Calms temper, prevents conflicts/accidents, and brings domestic harmony.",
          durationMins: 90,
          priceInr: 3500,
          mode: "BOTH",
          maxPerSlot: 4,
          imageUrl: "/images/pooja-ritual.jpg",
        },
      ],
    },
  ];

  const imagesDir = path.join(process.cwd(), "public", "images");
  const customImageOverrides: Record<string, string> = {
    "Shodashopachara Rudrabhishek": "/images/Shodashopachara Rudrabhishek pujan.png",
    "Laghu Mrityunjaya Jap & Sankalpam": "/images/Laghu Mrityunjaya Jap & Sankalpam imge genrate.png",
    "Ganapati Atharvashirsha Sahasravartan": "/images/Ganapati_Atharvashirsha_Sahasrav.png",
    "मृत संजीवनी (Mrit Sanjeevani Puja)": "/images/Genrate a image मृत संजीवनी (Mrit Sanjeevani Puja).png",
    "कुबेर पूजा (Kuber Puja)": "/images/कुबेर पूजा (Kuber Puja) Pujan.png",
    "कामाख्या पूजा (Kamakhya Puja)": "/images/कामाख्या पूजा (Kamakhya Puja.png",
    "बुध होमा / महावेध शांति (Budh Homa / Mahavedh Shanti)":
      "/images/बुध होमा  महावेध शांति (Budh Homa  Mahavedh Shanti).png",
  };

  const resolvePoojaImage = (name: string, fallback: string): string => {
    const override = customImageOverrides[name];
    if (override) {
      const overridePath = path.join(process.cwd(), "public", override.replace(/^\//, ""));
      if (fs.existsSync(overridePath)) return override;
    }

    for (const ext of [".png", ".jpg", ".jpeg", ".webp"]) {
      const candidate = `${name}${ext}`;
      if (fs.existsSync(path.join(imagesDir, candidate))) {
        return `/images/${candidate}`;
      }
    }

    return fallback;
  };

  const createdTemples = [];
  for (const t of templesData) {
    const poojasWithImages = t.poojas.map((p) => ({
      ...p,
      imageUrl: resolvePoojaImage(p.name, p.imageUrl ?? "/images/pooja-ritual.jpg"),
    }));

    const existing = await prisma.temple.findUnique({
      where: { slug: t.slug },
      include: { poojas: { select: { id: true, name: true, imageUrl: true } } },
    });
    if (existing) {
      const existingByName = new Map(existing.poojas.map((p) => [p.name, p]));
      const missingPoojas = poojasWithImages.filter((p) => !existingByName.has(p.name));
      if (missingPoojas.length > 0) {
        await prisma.poojaService.createMany({
          data: missingPoojas.map((p) => ({
            ...p,
            templeId: existing.id,
          })),
        });
        console.log(`Added ${missingPoojas.length} poojas to ${t.name}`);
      }
      let updatedImages = 0;
      for (const p of poojasWithImages) {
        const match = existingByName.get(p.name);
        if (match && match.imageUrl !== p.imageUrl) {
          await prisma.poojaService.update({
            where: { id: match.id },
            data: { imageUrl: p.imageUrl },
          });
          updatedImages++;
        }
      }
      if (updatedImages > 0) {
        console.log(`Updated ${updatedImages} pooja images for ${t.name}`);
      }
      createdTemples.push(existing);
      continue;
    }
    const temple = await prisma.temple.create({
      data: {
        slug: t.slug,
        name: t.name,
        location: t.location,
        state: t.state,
        deity: t.deity,
        tradition: t.tradition,
        description: t.description,
        imageUrl: t.imageUrl,
        timings: t.timings,
        rating: t.rating,
        reviewCount: t.reviewCount,
        featured: t.featured,
        managerId: t.managerId,
        priests: { create: t.priests },
        poojas: { create: poojasWithImages },
      },
      include: { priests: true, poojas: true },
    });
    createdTemples.push(temple);
  }

  // Seed sample bookings if none exist
  const bookingCount = await prisma.booking.count();
  if (bookingCount === 0 && createdTemples.length >= 2) {
    const kashi = await prisma.temple.findUnique({
      where: { slug: "kashi-vishwanath-dham" },
      include: { priests: true, poojas: true },
    });
    const tirupati = await prisma.temple.findUnique({
      where: { slug: "tirumala-venkateswara-temple" },
      include: { priests: true, poojas: true },
    });

    if (kashi && kashi.poojas[0] && kashi.priests[0]) {
      await prisma.booking.create({
        data: {
          bookingCode: "BHR-2026-1001",
          userId: devotee.id,
          templeId: kashi.id,
          poojaId: kashi.poojas[0].id,
          priestId: kashi.priests[0].id,
          slotDate: "2026-11-28",
          slotTime: "07:00 AM",
          mode: "LIVE_STREAM",
          devoteeName: "Aarav Sharma",
          devoteePhone: "+91 98765 43210",
          gotra: "Bharadwaja",
          nakshatra: "Rohini",
          sankalpamNotes: "Family health and peace",
          prasadAddress: "42 Indiranagar, Bengaluru 560038",
          amountInr: kashi.poojas[0].priceInr,
          status: "CONFIRMED",
          paymentStatus: "PAID",
          paymentMethod: "UPI",
          transactionId: "TXN-UPI-98421055",
          paidAt: new Date(),
        },
      });
    }

    if (tirupati && tirupati.poojas[1] && tirupati.priests[0]) {
      await prisma.booking.create({
        data: {
          bookingCode: "BHR-2026-1002",
          userId: devotee.id,
          templeId: tirupati.id,
          poojaId: tirupati.poojas[1].id,
          priestId: tirupati.priests[0].id,
          slotDate: "2026-12-02",
          slotTime: "09:00 AM",
          mode: "IN_PERSON",
          devoteeName: "Aarav Sharma",
          devoteePhone: "+91 98765 43210",
          gotra: "Bharadwaja",
          nakshatra: "Rohini",
          sankalpamNotes: "Anniversary blessings",
          amountInr: tirupati.poojas[1].priceInr,
          status: "COMPLETED",
          paymentStatus: "PAID",
          paymentMethod: "CARD",
          transactionId: "TXN-CRD-77123094",
          paidAt: new Date(Date.now() - 86400000 * 3),
        },
      });
    }
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
