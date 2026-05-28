import { CategoryBar } from "@/components/home/CategoryBar";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PopularBrands } from "@/components/home/PopularBrands";
import { PopularCategories } from "@/components/home/PopularCategories";

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <Hero />
      <CategoryBar />
      <PopularCategories />
      <PopularBrands />
      <FeaturedProducts />
      <CustomerReviews />
    </main>
  );
}
