export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  productLabel: string;
  date: string;
}

export const REVIEW_SUMMARY = {
  average: 4.9,
  total: 2847,
  fiveStarPercent: 94,
};

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "1",
    name: "Suman K.",
    location: "Kathmandu",
    rating: 5,
    title: "PUBG UC arrived in minutes",
    body: "Ordered PUBG Mobile UC late at night and got the code almost instantly. Payment via Fonepay was straightforward. Will buy again.",
    productLabel: "PUBG Mobile UC",
    date: "2 weeks ago",
  },
  {
    id: "2",
    name: "Priya M.",
    location: "Pokhara",
    rating: 5,
    title: "Smooth Apple gift card purchase",
    body: "Needed an App Store card for a family subscription. Clear prices in NPR, no hidden fees, and support answered my question on chat quickly.",
    productLabel: "Apple Gift Card",
    date: "3 weeks ago",
  },
  {
    id: "3",
    name: "Rajan T.",
    location: "Lalitpur",
    rating: 5,
    title: "Best place for Xbox cards",
    body: "Compared a few sites — Digitoolera had the best deal on Xbox gift cards. Checkout was simple after I logged in. Highly recommend for gamers.",
    productLabel: "Xbox Gift Card",
    date: "1 month ago",
  },
  {
    id: "4",
    name: "Anisha B.",
    location: "Biratnagar",
    rating: 5,
    title: "Google Play worked perfectly",
    body: "Bought Google Play credit for my brother. Code was valid, instructions were clear, and the whole process took less than five minutes.",
    productLabel: "Google Play",
    date: "1 month ago",
  },
  {
    id: "5",
    name: "Niraj S.",
    location: "Chitwan",
    rating: 4,
    title: "Reliable Roblox gift cards",
    body: "Third order from here for Roblox. Always delivers. One time verification took a bit longer but support kept me updated — still happy overall.",
    productLabel: "Roblox Gift Card",
    date: "6 weeks ago",
  },
  {
    id: "6",
    name: "Kriti P.",
    location: "Butwal",
    rating: 5,
    title: "Trustworthy digital store",
    body: "I was hesitant to buy gift cards online, but the site looks professional and my order was confirmed right away. Great experience for Nepal.",
    productLabel: "Gaming & software",
    date: "2 months ago",
  },
];
