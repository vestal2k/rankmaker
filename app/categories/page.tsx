"use client";

import Link from "next/link";
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
    color: "btn-purple",
    description: "Video games, board games, card games",
  },
  {
    name: "Movies",
    icon: Film,
    color: "btn-coral",
    description: "Films, documentaries, animations",
  },
  {
    name: "TV Shows",
    icon: Tv,
    color: "btn-blue",
    description: "Series, anime, reality TV",
  },
  {
    name: "Music",
    icon: Music,
    color: "btn-green",
    description: "Artists, albums, songs, genres",
  },
  {
    name: "Food",
    icon: Utensils,
    color: "btn-yellow",
    description: "Cuisine, restaurants, recipes",
  },
  {
    name: "Sports",
    icon: Trophy,
    color: "btn-coral",
    description: "Teams, players, sports",
  },
  {
    name: "Anime",
    icon: Palette,
    color: "btn-purple",
    description: "Anime series, manga, characters",
  },
  {
    name: "Books",
    icon: BookOpen,
    color: "btn-yellow",
    description: "Novels, authors, literary genres",
  },
  {
    name: "Cars",
    icon: Car,
    color: "btn-blue",
    description: "Vehicles, brands, motorsports",
  },
  {
    name: "Travel",
    icon: Globe,
    color: "btn-green",
    description: "Countries, cities, destinations",
  },
  {
    name: "Lifestyle",
    icon: Heart,
    color: "btn-coral",
    description: "Fashion, hobbies, wellness",
  },
  {
    name: "Other",
    icon: LayoutGrid,
    color: "btn-white",
    description: "Everything else",
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="card-cartoon p-8 inline-block mb-6">
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="w-14 h-14 bg-[#FFD43B] rounded-2xl flex items-center justify-center border-3 border-zinc-900">
                <LayoutGrid className="w-7 h-7 text-zinc-900" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 mb-4">
              Browse Categories
            </h1>
            <p className="text-lg text-zinc-600 max-w-xl mx-auto font-medium">
              Find tier lists for your favorite topics or discover new ones!
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={`/explore?category=${category.name.toLowerCase().replace(" ", "-")}`}
              >
                <div className="card-cartoon p-6 h-full">
                  <div className="flex items-start gap-4">
                    <button className={`btn-cartoon ${category.color} !p-3 flex-shrink-0`}>
                      <Icon className="w-7 h-7" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1 text-zinc-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-zinc-700">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Fun CTA */}
        <div className="text-center mt-16">
          <div className="card-cartoon-sm inline-flex items-center gap-2 px-5 py-3">
            <Sparkles className="w-5 h-5 text-[#FFD43B]" />
            <span className="font-bold text-zinc-900">
              Can&apos;t find your category? Create a tier list in &quot;Other&quot;!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
