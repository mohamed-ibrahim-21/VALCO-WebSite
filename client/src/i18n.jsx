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
    // product page & options
    viewDetails: "View details & options",
    backToProducts: "Back to products",
    productNotFound: "This product is no longer available.",
    loading: "Loading…",
    optional: "optional",
    quantity: "Quantity",
    yourDetails: "Your details",
    extraNotes: "Extra notes (optional)",
    pleaseChoose: "Please choose:",
    sending: "Sending…",
    requestSentTitle: "Request received",
    requestSentBody: "Thanks! Our team will review your selections and send you a quotation shortly.",
    specifications: "Specifications",
    uploadMainImage: "Upload main image",
    galleryTitle: "More images",
    galleryHelp: "Extra photos shown under the main image on the product page.",
    addImage: "Add image",
    optionsTitle: "Customer choices",
    optionsHelp: "What the customer picks before requesting a quote, like size, pressure rating or material.",
    addOption: "Add choice",
    optionNameEn: "Choice name (English)",
    optionNameAr: "Choice name (Arabic)",
    optionValues: "Options, one per line: English | Arabic",
    requiredChoice: "Customer must choose",
    specsTitle: "Specifications",
    specsHelp: "Fixed technical details shown as a table on the product page.",
    addSpec: "Add spec",
    specLabelEn: "Label (EN)",
    specValueEn: "Value (EN)",
    specLabelAr: "Label (AR)",
    specValueAr: "Value (AR)",
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
    viewDetails: "التفاصيل والاختيارات",
    backToProducts: "الرجوع للمنتجات",
    productNotFound: "هذا المنتج غير متاح حاليًا.",
    loading: "جارٍ التحميل…",
    optional: "اختياري",
    quantity: "الكمية",
    yourDetails: "بياناتك",
    extraNotes: "ملاحظات إضافية (اختياري)",
    pleaseChoose: "من فضلك اختر:",
    sending: "جارٍ الإرسال…",
    requestSentTitle: "تم استلام طلبك",
    requestSentBody: "شكرًا لك! سيراجع فريقنا اختياراتك ويرسل لك عرض السعر قريبًا.",
    specifications: "المواصفات",
    uploadMainImage: "رفع الصورة الرئيسية",
    galleryTitle: "صور إضافية",
    galleryHelp: "صور إضافية تظهر تحت الصورة الرئيسية في صفحة المنتج.",
    addImage: "إضافة صورة",
    optionsTitle: "اختيارات العميل",
    optionsHelp: "ما يحدده العميل قبل طلب عرض السعر، مثل المقاس أو ضغط التشغيل أو الخامة.",
    addOption: "إضافة اختيار",
    optionNameEn: "اسم الاختيار (إنجليزي)",
    optionNameAr: "اسم الاختيار (عربي)",
    optionValues: "الخيارات، كل خيار في سطر: إنجليزي | عربي",
    requiredChoice: "إجباري على العميل",
    specsTitle: "المواصفات الفنية",
    specsHelp: "تفاصيل ثابتة تظهر في جدول بصفحة المنتج.",
    addSpec: "إضافة مواصفة",
    specLabelEn: "البند (EN)",
    specValueEn: "القيمة (EN)",
    specLabelAr: "البند (AR)",
    specValueAr: "القيمة (AR)",
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
