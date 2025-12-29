"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Gamepad2,
  Film,
  Tv,
  Music,
  Utensils,
  Trophy,
  Car,
  Palette,
  BookOpen,
  Globe,
  Heart,
  LayoutGrid,
  Sparkles,
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Games",
    icon: Gamepad2,
    gradient: "from-purple-500 to-indigo-600",
    shadow: "shadow-purple",
    description: "Video games, board games, card games",
  },
  {
    name: "Movies",
    icon: Film,
    gradient: "from-red-500 to-pink-600",
    shadow: "shadow-pink",
    description: "Films, documentaries, animations",
  },
  {
    name: "TV Shows",
    icon: Tv,
    gradient: "from-blue-500 to-cyan-600",
    shadow: "shadow-blue",
    description: "Series, anime, reality TV",
  },
  {
    name: "Music",
    icon: Music,
    gradient: "from-green-500 to-emerald-600",
    shadow: "shadow-green",
    description: "Artists, albums, songs, genres",
  },
  {
    name: "Food",
    icon: Utensils,
    gradient: "from-orange-500 to-amber-600",
    shadow: "shadow-playful",
    description: "Cuisine, restaurants, recipes",
  },
  {
    name: "Sports",
    icon: Trophy,
    gradient: "from-yellow-500 to-orange-600",
    shadow: "shadow-playful",
    description: "Teams, players, sports",
  },
  {
    name: "Anime",
    icon: Palette,
    gradient: "from-pink-500 to-rose-600",
    shadow: "shadow-pink",
    description: "Anime series, manga, characters",
  },
  {
    name: "Books",
    icon: BookOpen,
    gradient: "from-amber-500 to-yellow-600",
    shadow: "shadow-playful",
    description: "Novels, authors, literary genres",
  },
  {
    name: "Cars",
    icon: Car,
    gradient: "from-slate-500 to-gray-600",
    shadow: "shadow-soft",
    description: "Vehicles, brands, motorsports",
  },
  {
    name: "Travel",
    icon: Globe,
    gradient: "from-cyan-500 to-teal-600",
    shadow: "shadow-blue",
    description: "Countries, cities, destinations",
  },
  {
    name: "Lifestyle",
    icon: Heart,
    gradient: "from-rose-500 to-pink-600",
    shadow: "shadow-pink",
    description: "Fashion, hobbies, wellness",
  },
  {
    name: "Other",
    icon: LayoutGrid,
    gradient: "from-gray-500 to-slate-600",
    shadow: "shadow-soft",
    description: "Everything else",
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-blob animate-delay-300" />
        <div className="absolute inset-0 dots-pattern opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-playful-lg animate-bounce-playful">
              <LayoutGrid className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Browse Categories
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-medium">
            Find tier lists for your favorite topics or discover new ones!
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={`/explore?category=${category.name.toLowerCase().replace(" ", "-")}`}
                className="group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className={`p-6 card-bouncy border-0 ${category.shadow} cursor-pointer bg-card/90 backdrop-blur-sm h-full`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-orange-500 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Fun CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-950/40 dark:to-pink-950/40 text-orange-600 dark:text-orange-400 font-semibold">
            <Sparkles className="w-5 h-5" />
            <span>Can&apos;t find your category? Create a tier list in &quot;Other&quot;!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
