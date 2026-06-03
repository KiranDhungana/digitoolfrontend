export const ROUTES = {
  home: "/",
  giftCards: "/gift-cards",
  categories: "/categories",
  category: (slug: string) => `/categories/${slug}`,
  gaming: "/gaming",
  brands: "/brands",
  brand: (slug: string) => `/brands/${slug}`,
  officialStore: "/official-store",
  promotions: "/promotions",
  product: (id: string) => `/product/${id}`,
  search: "/search",
  login: "/login",
  forgotPassword: "/forgot-password",
  register: "/register",
  cart: "/cart",
  checkout: "/checkout",
  account: "/account",
  contact: "/contact",
  howItWorks: "/how-it-works",
  support: "/support",
  admin: "/admin",
  adminLogin: "/admin/login",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  adminBlogs: "/admin/blogs",
} as const;

export const NAV_LINKS = [
  { label: "All gift cards", href: ROUTES.giftCards },
  { label: "Categories", href: ROUTES.categories, hasDropdown: true },
  { label: "Gaming", href: ROUTES.gaming, hasDropdown: true },
  { label: "Brands", href: ROUTES.brands, hasDropdown: true },
] as const;

export const HERO_HEADLINE =
  "Buy gift cards & digital products in Nepal —";

export const HERO_SUBTITLE =
  "PUBG UC, Roblox, Steam, PlayStation, Xbox, Apple & Microsoft 365. Pay with Fonepay or Khalti — fast delivery after verification.";

export const HERO_FEATURES = [
  "Gaming gift cards & game credits for Nepal",
  "Software, app store & subscription codes",
  "100% refund guarantee if there is a problem with your order",
] as const;

export const HERO_CATEGORIES = [
  {
    name: "Roblox",
    href: ROUTES.brand("roblox"),
    gradient: "from-red-500 via-red-600 to-red-800",
  },
  {
    name: "PUBG",
    href: ROUTES.brand("pubg"),
    gradient: "from-amber-600 via-orange-700 to-stone-900",
  },
  {
    name: "Apple",
    href: ROUTES.brand("apple"),
    gradient: "from-sky-400 via-blue-500 to-indigo-700",
  },
  {
    name: "Xbox",
    href: ROUTES.brand("xbox"),
    gradient: "from-green-600 via-green-700 to-green-900",
  },
] as const;

export const CATEGORY_PILLS = [
  { label: "Gaming", icon: "gamepad", slug: "gaming" },
  { label: "Software", icon: "monitor", slug: "software" },
] as const;

export const POPULAR_CATEGORIES = [
  {
    name: "Gaming",
    slug: "gaming",
    count: "PUBG, Xbox, Roblox",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    name: "Software",
    slug: "software",
    count: "Apple, Google Play",
    gradient: "from-sky-500 to-indigo-700",
  },
] as const;
