import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations data (You can move these to separate JSON files later if they get too big)
const resources = {
  en: {
    translation: {
      "profileHub": "Profile Hub",
      "premiumStudent": "Premium Student",
      "freePlan": "Free Plan",
      "level": "Level",
      "xpProgress": "XP Progress",
      "performance": "Performance",
      "testHistoryStats": "Test history & stats",
      "helpSupport": "Help & Support",
      "ticketsQueries": "Tickets & queries",
      "myOrders": "My Orders",
      "subscriptionsBilling": "Subscriptions & billing",
      "community": "Community",
      "joinDiscussions": "Join discussions",
      "settings": "Settings",
      "displayAndText": "Display & Text",
      "fontSize": "Font Size",
      "appLanguage": "App Language",
      "restartRequired": "*Changes will apply instantly",
      "shareApp": "Share App with Friends",
      "rateUs": "Rate Us / Feedback",
      "appVersion": "PrepIQ App",
      "madeInAssam": "Made with ❤️ in Assam"
    }
  },
  hi: {
    translation: {
      "profileHub": "प्रोफ़ाइल हब",
      "premiumStudent": "प्रीमियम छात्र",
      "freePlan": "फ्री प्लान",
      "level": "स्तर",
      "xpProgress": "XP प्रगति",
      "performance": "प्रदर्शन",
      "testHistoryStats": "टेस्ट इतिहास और आंकड़े",
      "helpSupport": "सहायता और समर्थन",
      "ticketsQueries": "टिकट और प्रश्न",
      "myOrders": "मेरे ऑर्डर",
      "subscriptionsBilling": "सदस्यता और बिलिंग",
      "community": "समुदाय",
      "joinDiscussions": "चर्चाओं में शामिल हों",
      "settings": "सेटिंग्स",
      "displayAndText": "प्रदर्शन और पाठ",
      "fontSize": "फ़ॉन्ट आकार",
      "appLanguage": "ऐप भाषा",
      "restartRequired": "*बदलाव तुरंत लागू होंगे",
      "shareApp": "दोस्तों के साथ ऐप साझा करें",
      "rateUs": "हमें रेट करें / प्रतिक्रिया दें",
      "appVersion": "PrepIQ ऐप",
      "madeInAssam": "असम में ❤️ के साथ निर्मित"
    }
  },
  as: {
    translation: {
      "profileHub": "প্ৰফাইল হাব",
      "premiumStudent": "প্ৰিমিয়াম ছাত্ৰ",
      "freePlan": " বিনামূলীয়া প্লেন",
      "level": "স্তৰ",
      "xpProgress": "XP প্ৰগতি",
      "performance": "প্ৰদৰ্শন",
      "testHistoryStats": "পৰীক্ষাৰ ইতিহাস আৰু পৰিসংখ্যা",
      "helpSupport": "সহায় আৰু সমৰ্থন",
      "ticketsQueries": "টিকট আৰু প্ৰশ্ন",
      "myOrders": "মোৰ অৰ্ডাৰ",
      "subscriptionsBilling": "চাবস্ক্ৰিপচন আৰু বিলিং",
      "community": "সম্প্ৰদায়",
      "joinDiscussions": "আলোচনাত যোগদান কৰক",
      "settings": "ছেটিংছ",
      "displayAndText": "প্ৰদৰ্শন আৰু পাঠ",
      "fontSize": "ফন্টৰ আকাৰ",
      "appLanguage": "এপৰ ভাষা",
      "restartRequired": "*সলনি লগে লগে কাৰ্যকৰী হ'ব",
      "shareApp": "বন্ধুৰ সৈতে এপ শ্বেয়াৰ কৰক",
      "rateUs": "আমাক ৰেটিং দিয়ক / মতামত",
      "appVersion": "PrepIQ এপ",
      "madeInAssam": "অসমত ❤️ ৰে নিৰ্মিত"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('app-language') || 'en', // Default language from local storage
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;