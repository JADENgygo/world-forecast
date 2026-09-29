export type City = {
  id: string;
  country: string;
  capital: string;
  latitude: number;
  longitude: number;
  timezone: string;
};
export const cities: City[] = [
  {
    id: "jp",
    country: "日本",
    capital: "東京",
    latitude: 35.68,
    longitude: 139.69,
    timezone: "Asia/Tokyo",
  },
  {
    id: "in",
    country: "インド",
    capital: "ニューデリー",
    latitude: 28.61,
    longitude: 77.21,
    timezone: "Asia/Kolkata",
  },
  {
    id: "gb",
    country: "イギリス",
    capital: "ロンドン",
    latitude: 51.51,
    longitude: -0.13,
    timezone: "Europe/London",
  },
  {
    id: "fr",
    country: "フランス",
    capital: "パリ",
    latitude: 48.85,
    longitude: 2.35,
    timezone: "Europe/Paris",
  },
  {
    id: "ke",
    country: "ケニア",
    capital: "ナイロビ",
    latitude: -1.28,
    longitude: 36.82,
    timezone: "Africa/Nairobi",
  },
  {
    id: "eg",
    country: "エジプト",
    capital: "カイロ",
    latitude: 30.06,
    longitude: 31.25,
    timezone: "Africa/Cairo",
  },
  {
    id: "us",
    country: "アメリカ",
    capital: "ワシントンD.C.",
    latitude: 38.9,
    longitude: -77.04,
    timezone: "America/New_York",
  },
  {
    id: "ca",
    country: "カナダ",
    capital: "オタワ",
    latitude: 45.41,
    longitude: -75.7,
    timezone: "America/Toronto",
  },
  {
    id: "br",
    country: "ブラジル",
    capital: "ブラジリア",
    latitude: -15.78,
    longitude: -47.93,
    timezone: "America/Sao_Paulo",
  },
  {
    id: "ar",
    country: "アルゼンチン",
    capital: "ブエノスアイレス",
    latitude: -34.61,
    longitude: -58.38,
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    id: "au",
    country: "オーストラリア",
    capital: "キャンベラ",
    latitude: -35.28,
    longitude: 149.13,
    timezone: "Australia/Sydney",
  },
  {
    id: "nz",
    country: "ニュージーランド",
    capital: "ウェリントン",
    latitude: -41.29,
    longitude: 174.78,
    timezone: "Pacific/Auckland",
  },
];
