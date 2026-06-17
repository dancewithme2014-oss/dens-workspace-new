export type PhoneCountry = {
  code: string;
  dial: string;
  ru: string;
  en: string;
  min: number;
  max: number;
};

export const phoneCountries: PhoneCountry[] = [
  { code: "GE", dial: "+995", ru: "Грузия", en: "Georgia", min: 9, max: 9 },
  { code: "RU", dial: "+7", ru: "Россия", en: "Russia", min: 10, max: 10 },
  { code: "KZ", dial: "+7", ru: "Казахстан", en: "Kazakhstan", min: 10, max: 10 },
  { code: "GB", dial: "+44", ru: "Великобритания", en: "United Kingdom", min: 10, max: 10 },
  { code: "DE", dial: "+49", ru: "Германия", en: "Germany", min: 10, max: 11 },
  { code: "FR", dial: "+33", ru: "Франция", en: "France", min: 9, max: 9 },
  { code: "IT", dial: "+39", ru: "Италия", en: "Italy", min: 9, max: 10 },
  { code: "ES", dial: "+34", ru: "Испания", en: "Spain", min: 9, max: 9 },
  { code: "PT", dial: "+351", ru: "Португалия", en: "Portugal", min: 9, max: 9 },
  { code: "NL", dial: "+31", ru: "Нидерланды", en: "Netherlands", min: 9, max: 9 },
  { code: "BE", dial: "+32", ru: "Бельгия", en: "Belgium", min: 9, max: 9 },
  { code: "AT", dial: "+43", ru: "Австрия", en: "Austria", min: 10, max: 11 },
  { code: "CH", dial: "+41", ru: "Швейцария", en: "Switzerland", min: 9, max: 9 },
  { code: "PL", dial: "+48", ru: "Польша", en: "Poland", min: 9, max: 9 },
  { code: "CZ", dial: "+420", ru: "Чехия", en: "Czechia", min: 9, max: 9 },
  { code: "SK", dial: "+421", ru: "Словакия", en: "Slovakia", min: 9, max: 9 },
  { code: "HU", dial: "+36", ru: "Венгрия", en: "Hungary", min: 9, max: 9 },
  { code: "RO", dial: "+40", ru: "Румыния", en: "Romania", min: 9, max: 9 },
  { code: "BG", dial: "+359", ru: "Болгария", en: "Bulgaria", min: 8, max: 9 },
  { code: "GR", dial: "+30", ru: "Греция", en: "Greece", min: 10, max: 10 },
  { code: "HR", dial: "+385", ru: "Хорватия", en: "Croatia", min: 8, max: 9 },
  { code: "SI", dial: "+386", ru: "Словения", en: "Slovenia", min: 8, max: 8 },
  { code: "SE", dial: "+46", ru: "Швеция", en: "Sweden", min: 9, max: 9 },
  { code: "NO", dial: "+47", ru: "Норвегия", en: "Norway", min: 8, max: 8 },
  { code: "DK", dial: "+45", ru: "Дания", en: "Denmark", min: 8, max: 8 },
  { code: "FI", dial: "+358", ru: "Финляндия", en: "Finland", min: 9, max: 10 },
  { code: "IE", dial: "+353", ru: "Ирландия", en: "Ireland", min: 9, max: 9 },
  { code: "EE", dial: "+372", ru: "Эстония", en: "Estonia", min: 7, max: 8 },
  { code: "LV", dial: "+371", ru: "Латвия", en: "Latvia", min: 8, max: 8 },
  { code: "LT", dial: "+370", ru: "Литва", en: "Lithuania", min: 8, max: 8 },
  { code: "LU", dial: "+352", ru: "Люксембург", en: "Luxembourg", min: 9, max: 9 },
  { code: "CY", dial: "+357", ru: "Кипр", en: "Cyprus", min: 8, max: 8 },
  { code: "MT", dial: "+356", ru: "Мальта", en: "Malta", min: 8, max: 8 },
  { code: "IS", dial: "+354", ru: "Исландия", en: "Iceland", min: 7, max: 7 },
  { code: "LI", dial: "+423", ru: "Лихтенштейн", en: "Liechtenstein", min: 7, max: 7 },
  { code: "US", dial: "+1", ru: "США", en: "United States", min: 10, max: 10 },
  { code: "AE", dial: "+971", ru: "ОАЭ", en: "UAE", min: 9, max: 9 },
  { code: "TR", dial: "+90", ru: "Турция", en: "Turkey", min: 10, max: 10 },
];

export const defaultPhoneCountry = phoneCountries[0];
export const findPhoneCountry = (code?: string | null) => phoneCountries.find((country) => country.code === code?.toUpperCase());
