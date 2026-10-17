import React, { createContext, useContext, useEffect, useState } from "react";

const dict = {
  en: {
    // public site
    navHome: "Home",
    navProducts: "Products",
    navAbout: "About Us",
    navContact: "Contact",
    requestQuote: "Request a Quote",
    heroPill: "BUILT FOR RELIABLE FLOW CONTROL",
    heroTitle: "Reliable valve solutions for industry",
    heroSubtitle: "Precision, safety and dependable flow control solutions.",
    heroImageAlt: "Industrial valves",
    heroFallback: "Industrial Valve Solutions",
    tagline: "VALVE MAINTENANCE & TESTING",
    exploreProducts: "Explore Products",
    catalogEyebrow: "OUR CATALOG",
    ourProducts: "Our Products",
    catalogDesc:
      "Browse the catalog and request specifications for your application.",
    viewDetails: "Request a quote",
    noProducts: "No products yet. Add products from the admin dashboard.",
    aboutEyebrow: "ABOUT VALCO",
    aboutTitle: "Engineering confidence into every connection.",
    aboutText:
      "We support industrial customers with dependable valve solutions.",
    talkEyebrow: "LET'S TALK",
    contactDesc: "Tell us about your application and our team will follow up.",
    fName: "Name *",
    fCompany: "Company",
    fEmail: "Email *",
    fPhone: "Phone",
    fProduct: "Product of interest",
    fMessage: "Message *",
    sendRequest: "Send Request",
    quoteSent: "Your quote request has been submitted.",
    rights: "All rights reserved.",
    admin: "Admin",
    // login
    backToSite: "Website",
    signInTitle: "Admin sign in",
    signInDesc: "Manage your VALCO website and catalog.",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in…",
    // admin shell
    adminPanel: "ADMIN PANEL",
    workspace: "WORKSPACE",
    overview: "Overview",
    products: "Products",
    websiteContent: "Website content",
    quoteRequests: "Quote requests",
    viewWebsite: "View website",
    signOut: "Sign out",
    websiteManagement: "Website management",
    checkingSession: "Checking session…",
    loadingDashboard: "Loading dashboard…",
    // overview
    overviewK: "OVERVIEW",
    welcome: "Welcome back",
    welcomeDesc: "Manage your website and customer enquiries.",
    totalProducts: "Total products",
    featuredProducts: "Featured products",
    recentQuotes: "Recent quote requests",
    customer: "Customer",
    product: "Product",
    date: "Date",
    status: "Status",
    message: "Message",
    noQuotes: "No quote requests yet.",
    generalEnquiry: "General enquiry",
    // products
    catalogK: "CATALOG MANAGEMENT",
    productsDesc: "Create, edit, publish and remove products.",
    addProduct: "Add product",
    editProduct: "Edit product",
    productSaved: "Product saved.",
    confirmDelete: "Delete this product?",
    searchProducts: "Search products…",
    noSku: "No SKU",
    published: "Published",
    draft: "Draft",
    featured: "Featured",
    nameEn: "Product name (English)",
    nameAr: "Product name (Arabic)",
    sku: "SKU",
    categoryEn: "Category (English)",
    categoryAr: "Category (Arabic)",
    descEn: "Description (English)",
    descAr: "Description (Arabic)",
    imageUrl: "Image URL",
    uploadImage: "Upload image",
    cancel: "Cancel",
    saveProduct: "Save product",
    // content
    settingsK: "WEBSITE SETTINGS",
    contentDesc: "Edit the public homepage copy and contact details.",
    companyName: "Company name",
    heroTitleL: "Hero title",
    heroSubtitleL: "Hero subtitle",
    taglineL: "Tagline",
    aboutTextL: "About text",
    heroImageL: "Hero image URL",
    contactEmail: "Contact email",
    contactPhone: "Contact phone",
    englishVersion: "English",
    arabicVersion: "Arabic",
    sharedSettings: "Shared",
    saveChanges: "Save changes",
    contentSaved: "Website content saved.",
    // quotes
    enquiriesK: "CUSTOMER ENQUIRIES",
    quotesDesc: "Review requests and update their status.",
    st_new: "New",
    st_contacted: "Contacted",
    st_closed: "Closed",
    // misc
    switchLang: "العربية",
    arrow: "→",
  },
  ar: {
    navHome: "الرئيسية",
    navProducts: "المنتجات",
    navAbout: "من نحن",
    navContact: "تواصل معنا",
    requestQuote: "اطلب عرض سعر",
    heroPill: "مصممة لتحكم موثوق في التدفق",
    heroTitle: "حلول محابس موثوقة للصناعة",
    heroSubtitle: "دقة وأمان وحلول تحكم في التدفق يمكن الاعتماد عليها.",
    heroImageAlt: "محابس صناعية",
    heroFallback: "حلول المحابس الصناعية",
    tagline: "صيانة واختبار المحابس",
    exploreProducts: "تصفح المنتجات",
    catalogEyebrow: "الكتالوج",
    ourProducts: "منتجاتنا",
    catalogDesc: "تصفح الكتالوج واطلب المواصفات المناسبة لاستخدامك.",
    viewDetails: "اطلب عرض سعر",
    noProducts: "لا توجد منتجات بعد. أضف المنتجات من لوحة التحكم.",
    aboutEyebrow: "عن VALCO",
    aboutTitle: "نبني الثقة في كل وصلة.",
    aboutText: "ندعم عملاءنا في القطاع الصناعي بحلول محابس يمكن الاعتماد عليها.",
    talkEyebrow: "لنتحدث",
    contactDesc: "أخبرنا عن احتياجك وسيتواصل معك فريقنا.",
    fName: "الاسم *",
    fCompany: "الشركة",
    fEmail: "البريد الإلكتروني *",
    fPhone: "رقم الهاتف",
    fProduct: "المنتج المطلوب",
    fMessage: "الرسالة *",
    sendRequest: "إرسال الطلب",
    quoteSent: "تم إرسال طلب عرض السعر بنجاح.",
    rights: "جميع الحقوق محفوظة.",
    admin: "لوحة التحكم",
    backToSite: "الموقع",
    signInTitle: "تسجيل دخول المسؤول",
    signInDesc: "إدارة موقع VALCO والكتالوج.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    signingIn: "جارٍ تسجيل الدخول…",
    adminPanel: "لوحة التحكم",
    workspace: "مساحة العمل",
    overview: "نظرة عامة",
    products: "المنتجات",
    websiteContent: "محتوى الموقع",
    quoteRequests: "طلبات عروض الأسعار",
    viewWebsite: "عرض الموقع",
    signOut: "تسجيل الخروج",
    websiteManagement: "إدارة الموقع",
    checkingSession: "جارٍ التحقق من الجلسة…",
    loadingDashboard: "جارٍ تحميل لوحة التحكم…",
    overviewK: "نظرة عامة",
    welcome: "مرحبًا بعودتك",
    welcomeDesc: "أدر موقعك واستفسارات العملاء.",
    totalProducts: "إجمالي المنتجات",
    featuredProducts: "المنتجات المميزة",
    recentQuotes: "أحدث طلبات عروض الأسعار",
    customer: "العميل",
    product: "المنتج",
    date: "التاريخ",
    status: "الحالة",
    message: "الرسالة",
    noQuotes: "لا توجد طلبات عروض أسعار بعد.",
    generalEnquiry: "استفسار عام",
    catalogK: "إدارة الكتالوج",
    productsDesc: "أضف المنتجات وعدّلها وانشرها واحذفها.",
    addProduct: "إضافة منتج",
    editProduct: "تعديل المنتج",
    productSaved: "تم حفظ المنتج.",
    confirmDelete: "هل تريد حذف هذا المنتج؟",
    searchProducts: "ابحث في المنتجات…",
    noSku: "بدون SKU",
    published: "منشور",
    draft: "مسودة",
    featured: "مميز",
    nameEn: "اسم المنتج (إنجليزي)",
    nameAr: "اسم المنتج (عربي)",
    sku: "SKU",
    categoryEn: "الفئة (إنجليزي)",
    categoryAr: "الفئة (عربي)",
    descEn: "الوصف (إنجليزي)",
    descAr: "الوصف (عربي)",
    imageUrl: "رابط الصورة",
    uploadImage: "رفع صورة",
    cancel: "إلغاء",
    saveProduct: "حفظ المنتج",
    settingsK: "إعدادات الموقع",
    contentDesc: "عدّل نصوص الصفحة الرئيسية وبيانات التواصل.",
    companyName: "اسم الشركة",
    heroTitleL: "العنوان الرئيسي",
    heroSubtitleL: "العنوان الفرعي",
    taglineL: "الشعار النصي",
    aboutTextL: "نص من نحن",
    heroImageL: "رابط الصورة الرئيسية",
    contactEmail: "بريد التواصل",
    contactPhone: "هاتف التواصل",
    englishVersion: "النسخة الإنجليزية",
    arabicVersion: "النسخة العربية",
    sharedSettings: "إعدادات مشتركة",
    saveChanges: "حفظ التغييرات",
    contentSaved: "تم حفظ محتوى الموقع.",
    enquiriesK: "استفسارات العملاء",
    quotesDesc: "راجع الطلبات وحدّث حالتها.",
    st_new: "جديد",
    st_contacted: "تم التواصل",
    st_closed: "مغلق",
    switchLang: "English",
    arrow: "←",
  },
};

const LangContext = createContext(null);
const KEY = "valco_lang";

function initialLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "ar" || saved === "en") return saved;
  } catch {}
  return navigator.language?.startsWith("ar") ? "ar" : "en";
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(KEY, lang);
    } catch {}
  }, [lang]);
  const t = (k) => dict[lang][k] ?? dict.en[k] ?? k;
  const toggle = () => setLang((l) => (l === "ar" ? "en" : "ar"));
  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

// Pick the Arabic or English version of a { en, ar } object, falling back to English.
export function pick(obj, lang) {
  if (!obj) return "";
  return (lang === "ar" && obj.ar?.trim()) || obj.en || "";
}

// Pick a flat site field: heroTitle / heroTitleAr, falling back to English, then to a default.
export function siteText(site, field, lang, fallback = "") {
  const ar = site?.[`${field}Ar`];
  if (lang === "ar" && ar?.trim()) return ar;
  if (lang === "ar") return fallback;
  return site?.[field] || fallback;
}

export function LangToggle({ className = "lang-toggle" }) {
  const { t, toggle } = useLang();
  return (
    <button type="button" className={className} onClick={toggle}>
      {t("switchLang")}
    </button>
  );
}
