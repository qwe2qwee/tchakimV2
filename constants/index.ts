import icons from "./icons";

export { icons };

// Language-specific error messages

export const errorMessagesAPI = {
  ar: {
    userNotFound: "المستخدم غير موجود",
    phoneInUse: "يبدو أن الرقم مستخدم بالفعل",
    emailInUse: "يبدو أن البريد الإلكتروني مستخدم بالفعل",
    chatNotFound: "لم يتم العثور على محادثات للمستخدم",
    failedToCreateUser: "فشل في إنشاء المستخدم",
    failedToRetrieveUser: "فشل في استرجاع تفاصيل المستخدم",
    failedToSendOTP: "فشل في إرسال رمز التحقق",
    failedToResetPassword: "فشل في إعادة تعيين كلمة المرور",
    uniqueUsernameFailed: "فشل في توليد اسم مستخدم فريد",
    failedToCreateChat: "فشل في إنشاء المحادثة",
    failedToCheckEmail: "فشل في التحقق من البريد الإلكتروني",
    failedToUpdatePhone: "فشل في تحديث رقم الهاتف",
    failedToSignIn: "فشل في تسجيل الدخول",
    failedToGetCurrentUser: "فشل في استرجاع المستخدم الحالي",
    failedToSendOtpToPhone: "فشل في إرسال رمز التحقق إلى الهاتف",
    failedToUpdateUserDetails: "فشل في تحديث تفاصيل المستخدم",
  },
  en: {
    userNotFound: "User not found",
    phoneInUse: "The phone number is already in use",
    emailInUse: "The email is already in use",
    chatNotFound: "No chats found for this user",
    failedToCreateUser: "Failed to create user",
    failedToRetrieveUser: "Failed to retrieve user details",
    failedToSendOTP: "Failed to send OTP",
    failedToResetPassword: "Failed to reset password",
    uniqueUsernameFailed: "Failed to generate a unique username",
    failedToCreateChat: "Failed to create chat",
    failedToCheckEmail: "Failed to check email",
    failedToUpdatePhone: "Failed to update phone number",
    failedToSignIn: "Failed to sign in",
    failedToGetCurrentUser: "Failed to retrieve current user",
    failedToSendOtpToPhone: "Failed to send OTP to phone",
    failedToUpdateUserDetails: "Failed to update user details",
  },
  fr: {
    userNotFound: "Utilisateur non trouvé",
    phoneInUse: "Le numéro de téléphone est déjà utilisé",
    emailInUse: "L'email est déjà utilisé",
    chatNotFound: "Aucune discussion trouvée pour cet utilisateur",
    failedToCreateUser: "Échec de la création de l'utilisateur",
    failedToRetrieveUser:
      "Échec de la récupération des détails de l'utilisateur",
    failedToSendOTP: "Échec de l'envoi du code OTP",
    failedToResetPassword: "Échec de la réinitialisation du mot de passe",
    uniqueUsernameFailed:
      "Échec de la génération d'un nom d'utilisateur unique",
    failedToCreateChat: "Échec de la création du chat",
    failedToCheckEmail: "Échec de la vérification de l'email",
    failedToUpdatePhone: "Échec de la mise à jour du numéro de téléphone",
    failedToSignIn: "Échec de la connexion",
    failedToGetCurrentUser: "Échec de la récupération de l'utilisateur actuel",
    failedToSendOtpToPhone: "Échec de l'envoi du code OTP au téléphone",
    failedToUpdateUserDetails:
      "Échec de la mise à jour des détails de l'utilisateur",
  },
} as any;

// Options for the category dropdowns
export const categoryOptions = {
  category1: [
    { label: "الأجهزة", value: "devices" },
    { label: "العقارات", value: "real_estate" },
    { label: "السيارات", value: "cars" },
    { label: "أدوات منزلية", value: "home_appliance" },
    { label: "اعمال", value: "jobs" },
    { label: "مستلزمات شخصية", value: "personal_items" },
  ],
  category2: {
    devices: [
      { label: "iPhone", value: "iphone" },
      { label: "Android", value: "android" },
      { label: "Laptop", value: "laptop" },
      { label: "Tablet", value: "tablet" },
      { label: "Smartwatch", value: "smartwatch" },
    ],
    real_estate: [
      { label: "شقة", value: "apartment" },
      { label: "فيلا", value: "villa" },
      { label: "مكتب", value: "office" },
      { label: "أرض", value: "land" },
      { label: "محل", value: "shop" },
    ],
    cars: [
      { label: "سيارة صغيرة", value: "small_car" },
      { label: "سيارة كبيرة", value: "big_car" },
      { label: "شاحنة", value: "truck" },
      { label: "دراجة نارية", value: "motorcycle" },
      { label: "SUV", value: "suv" },
    ],
    home_appliance: [
      { label: "ثلاجة", value: "fridge" },
      { label: "غسالة", value: "washing_machine" },
      { label: "مكيف", value: "air_conditioner" },
      { label: "فرن", value: "oven" },
      { label: "مايكروويف", value: "microwave" },
    ],
    jobs: [
      { label: "مهندس", value: "engineer" },
      { label: "محاسب", value: "accountant" },
      { label: "مطور برامج", value: "software_developer" },
      { label: "مدير", value: "manager" },
      { label: "معلم", value: "teacher" },
    ],
    personal_items: [
      { label: "ملابس", value: "clothes" },
      { label: "أحذية", value: "shoes" },
      { label: "إكسسوارات", value: "accessories" },
      { label: "حقائب", value: "bags" },
      { label: "مستحضرات تجميل", value: "cosmetics" },
    ],
  },
  category3: {
    iphone: [
      { label: "iPhone X", value: "iphone_x" },
      { label: "iPhone 11", value: "iphone_11" },
      { label: "iPhone 12", value: "iphone_12" },
      { label: "iPhone 13", value: "iphone_13" },
    ],
    android: [
      { label: "Samsung Galaxy", value: "galaxy" },
      { label: "Google Pixel", value: "pixel" },
      { label: "OnePlus", value: "oneplus" },
      { label: "Xiaomi", value: "xiaomi" },
    ],
    laptop: [
      { label: "MacBook", value: "macbook" },
      { label: "Dell XPS", value: "xps" },
      { label: "HP Spectre", value: "spectre" },
      { label: "Lenovo ThinkPad", value: "thinkpad" },
    ],
    tablet: [
      { label: "iPad", value: "ipad" },
      { label: "Samsung Tab", value: "samsung_tab" },
      { label: "Microsoft Surface", value: "surface" },
      { label: "Lenovo Tab", value: "lenovo_tab" },
    ],
    smartwatch: [
      { label: "Apple Watch", value: "apple_watch" },
      { label: "Samsung Galaxy Watch", value: "galaxy_watch" },
      { label: "Fitbit", value: "fitbit" },
      { label: "Garmin", value: "garmin" },
    ],
    apartment: [
      { label: "2 غرف نوم", value: "2_bedroom" },
      { label: "3 غرف نوم", value: "3_bedroom" },
      { label: "1 غرفة نوم", value: "1_bedroom" },
    ],
    villa: [
      { label: "فيلا صغيرة", value: "small_villa" },
      { label: "فيلا كبيرة", value: "big_villa" },
      { label: "فيلا فاخرة", value: "luxury_villa" },
    ],
    office: [
      { label: "مكتب صغير", value: "small_office" },
      { label: "مكتب كبير", value: "big_office" },
      { label: "مكتب مشترك", value: "shared_office" },
    ],
    small_car: [
      { label: "Toyota Yaris", value: "yaris" },
      { label: "Honda Fit", value: "fit" },
      { label: "Hyundai i10", value: "i10" },
    ],
    big_car: [
      { label: "Toyota Land Cruiser", value: "land_cruiser" },
      { label: "Chevrolet Tahoe", value: "tahoe" },
      { label: "Nissan Armada", value: "armada" },
    ],
    truck: [
      { label: "Ford F-150", value: "f150" },
      { label: "Ram 1500", value: "ram_1500" },
      { label: "Chevrolet Silverado", value: "silverado" },
    ],
    engineer: [
      { label: "مهندس كهرباء", value: "electrical_engineer" },
      { label: "مهندس مدني", value: "civil_engineer" },
      { label: "مهندس ميكانيكي", value: "mechanical_engineer" },
      { label: "مهندس معماري", value: "architect" },
    ],
    accountant: [
      { label: "محاسب تكاليف", value: "cost_accountant" },
      { label: "محاسب إداري", value: "management_accountant" },
      { label: "محاسب مالي", value: "financial_accountant" },
    ],
    software_developer: [
      { label: "مطور تطبيقات", value: "app_developer" },
      { label: "مطور ويب", value: "web_developer" },
      { label: "مطور واجهات", value: "frontend_developer" },
      { label: "مطور خلفيات", value: "backend_developer" },
    ],
    manager: [
      { label: "مدير مشروع", value: "project_manager" },
      { label: "مدير مبيعات", value: "sales_manager" },
      { label: "مدير تسويق", value: "marketing_manager" },
      { label: "مدير موارد بشرية", value: "hr_manager" },
    ],
    teacher: [
      { label: "مدرس رياضيات", value: "math_teacher" },
      { label: "مدرس علوم", value: "science_teacher" },
      { label: "مدرس لغة عربية", value: "arabic_teacher" },
      { label: "مدرس إنجليزي", value: "english_teacher" },
    ],
    clothes: [
      { label: "تيشيرت", value: "tshirt" },
      { label: "بنطلون", value: "trousers" },
      { label: "قميص", value: "shirt" },
      { label: "فستان", value: "dress" },
    ],
    shoes: [
      { label: "حذاء رياضي", value: "sports_shoes" },
      { label: "حذاء رسمي", value: "formal_shoes" },
      { label: "حذاء صيفي", value: "sandals" },
      { label: "حذاء شتوي", value: "winter_shoes" },
    ],
    accessories: [
      { label: "ساعة يد", value: "watch" },
      { label: "نظارة شمسية", value: "sunglasses" },
      { label: "سوار", value: "bracelet" },
      { label: "خاتم", value: "ring" },
    ],
    bags: [
      { label: "حقيبة يد", value: "handbag" },
      { label: "حقيبة ظهر", value: "backpack" },
      { label: "حقيبة سفر", value: "travel_bag" },
      { label: "حقيبة رياضية", value: "gym_bag" },
    ],
    cosmetics: [
      { label: "كريم أساس", value: "foundation" },
      { label: "أحمر شفاه", value: "lipstick" },
      { label: "ماسكارا", value: "mascara" },
      { label: "بودرة وجه", value: "face_powder" },
    ],
    land: [
      { label: "أرض سكنية", value: "residential_land" },
      { label: "أرض تجارية", value: "commercial_land" },
      { label: "أرض زراعية", value: "agricultural_land" },
      { label: "أرض صناعية", value: "industrial_land" },
    ],
    shop: [
      { label: "محل تجاري", value: "commercial_shop" },
      { label: "محل صغير", value: "small_shop" },
      { label: "محل كبير", value: "large_shop" },
      { label: "محل متعدد الأقسام", value: "department_store" },
    ],
    fridge: [
      { label: "ثلاجة سامسونج", value: "samsung_fridge" },
      { label: "ثلاجة LG", value: "lg_fridge" },
      { label: "ثلاجة هيتاشي", value: "hitachi_fridge" },
      { label: "ثلاجة باناسونيك", value: "panasonic_fridge" },
    ],
    washing_machine: [
      { label: "غسالة سامسونج", value: "samsung_washing_machine" },
      { label: "غسالة LG", value: "lg_washing_machine" },
      { label: "غسالة هيتاشي", value: "hitachi_washing_machine" },
      { label: "غسالة باناسونيك", value: "panasonic_washing_machine" },
    ],
    air_conditioner: [
      { label: "مكيف سامسونج", value: "samsung_ac" },
      { label: "مكيف LG", value: "lg_ac" },
      { label: "مكيف هيتاشي", value: "hitachi_ac" },
      { label: "مكيف باناسونيك", value: "panasonic_ac" },
    ],
    oven: [
      { label: "فرن سامسونج", value: "samsung_oven" },
      { label: "فرن LG", value: "lg_oven" },
      { label: "فرن هيتاشي", value: "hitachi_oven" },
      { label: "فرن باناسونيك", value: "panasonic_oven" },
    ],
    microwave: [
      { label: "مايكروويف سامسونج", value: "samsung_microwave" },
      { label: "مايكروويف LG", value: "lg_microwave" },
      { label: "مايكروويف هيتاشي", value: "hitachi_microwave" },
      { label: "مايكروويف باناسونيك", value: "panasonic_microwave" },
    ],
  },
};

export const chadCities = [
  { label: "انجمينا", value: "n_djamena" },
  { label: "موندو", value: "moundou" },
  { label: "أبشي", value: "abéché" },
  { label: "سار", value: "sarh" },
  { label: "أم التيمان", value: "am_timane" },
  { label: "بونغور", value: "bongor" },
  { label: "كوكسري", value: "koumra" },
  { label: "بيرا", value: "pala" },
  { label: "دوما", value: "doba" },
  { label: "فايا لارجو", value: "faya_largeau" },
  { label: "أم جرس", value: "oum_hadjer" },
  { label: "بيليتن", value: "bilia" },
  { label: "أدو", value: "adoo" },
  { label: "دغالا", value: "dogla" },
  { label: "جويل", value: "guel" },
  { label: "موسورو", value: "moussoro" },
  { label: "بطلحا", value: "batangafo" },
  { label: "موزوغوي", value: "mozogo" },
  { label: "بيبي", value: "bebe" },
  { label: "ماو", value: "mao" },
  { label: "بباوا", value: "baboua" },
];
// Define the supported languages
type Language = "en" | "ar" | "fr";

// Translation structure
interface Translations {
  seconds: string;
  minute: string;
  minutes: string;
  hour: string;
  hours: string;
  day: string;
  days: string;
  week: string;
  weeks: string;
  month: string;
  months: string;
  year: string;
  years: string;
}

// Function to format time difference as localized text
export const formatTimeAgoLocalized = (
  timestamp: string | number | Date,
  lang: Language = "en"
): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const translations: Record<Language, Translations> = {
    en: {
      seconds: "seconds ago",
      minute: "minute ago",
      minutes: "minutes ago",
      hour: "hour ago",
      hours: "hours ago",
      day: "day ago",
      days: "days ago",
      week: "week ago",
      weeks: "weeks ago",
      month: "month ago",
      months: "months ago",
      year: "year ago",
      years: "years ago",
    },
    ar: {
      seconds: "ثانية مضت",
      minute: "دقيقة مضت",
      minutes: "دقائق مضت",
      hour: "ساعة مضت",
      hours: "ساعات مضت",
      day: "يوم مضى",
      days: "أيام مضت",
      week: "أسبوع مضى",
      weeks: "أسابيع مضت",
      month: "شهر مضى",
      months: "أشهر مضت",
      year: "سنة مضت",
      years: "سنوات مضت",
    },
    fr: {
      seconds: "il y a secondes",
      minute: "il y a une minute",
      minutes: "il y a minutes",
      hour: "il y a une heure",
      hours: "il y a heures",
      day: "il y a un jour",
      days: "il y a jours",
      week: "il y a une semaine",
      weeks: "il y a semaines",
      month: "il y a un mois",
      months: "il y a mois",
      year: "il y a un an",
      years: "il y a ans",
    },
  };

  const t = translations[lang] || translations.en; // Fallback to English

  if (diffInSeconds < 60) {
    return `${diffInSeconds} ${t.seconds}`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes > 1 ? t.minutes : t.minute}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours > 1 ? t.hours : t.hour}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days > 1 ? t.days : t.day}`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks > 1 ? t.weeks : t.week}`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months > 1 ? t.months : t.month}`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} ${years > 1 ? t.years : t.year}`;
  }
};

// Function to format view counts with suffixes
export const formatViews = (views: number, lang: Language = "en"): string => {
  if (views < 0) return "0";

  const thresholds = [
    { value: 1_000_000, suffix: { en: "M", ar: "م", fr: "M" } }, // Million
    { value: 1_000, suffix: { en: "k", ar: "ألف", fr: "k" } }, // Thousand
  ];

  for (const threshold of thresholds) {
    if (views >= threshold.value) {
      const formatted = (views / threshold.value)
        .toFixed(1)
        .replace(/\.0$/, ""); // Remove trailing ".0"
      const suffix = threshold.suffix[lang] || threshold.suffix["en"]; // Default to English
      return `${formatted}${suffix}`;
    }
  }

  return views.toString(); // Return raw number if below 1k
};
