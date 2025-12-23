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
} from "lucide-react";

const CATEGORIES = [
  { name: "Games", icon: Gamepad2, iconColor: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-950/30", description: "Video games, board games, card games" },
  { name: "Movies", icon: Film, iconColor: "text-red-500", bgColor: "bg-red-100 dark:bg-red-950/30", description: "Films, documentaries, animations" },
  { name: "TV Shows", icon: Tv, iconColor: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-950/30", description: "Series, anime, reality TV" },
  { name: "Music", icon: Music, iconColor: "text-green-500", bgColor: "bg-green-100 dark:bg-green-950/30", description: "Artists, albums, songs, genres" },
  { name: "Food", icon: Utensils, iconColor: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-950/30", description: "Cuisine, restaurants, recipes" },
  { name: "Sports", icon: Trophy, iconColor: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-950/30", description: "Teams, players, sports" },
  { name: "Anime", icon: Palette, iconColor: "text-pink-500", bgColor: "bg-pink-100 dark:bg-pink-950/30", description: "Anime series, manga, characters" },
  { name: "Books", icon: BookOpen, iconColor: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-950/30", description: "Novels, authors, literary genres" },
  { name: "Cars", icon: Car, iconColor: "text-slate-500", bgColor: "bg-slate-100 dark:bg-slate-950/30", description: "Vehicles, brands, motorsports" },
  { name: "Travel", icon: Globe, iconColor: "text-cyan-500", bgColor: "bg-cyan-100 dark:bg-cyan-950/30", description: "Countries, cities, destinations" },
  { name: "Lifestyle", icon: Heart, iconColor: "text-rose-500", bgColor: "bg-rose-100 dark:bg-rose-950/30", description: "Fashion, hobbies, wellness" },
  { name: "Other", icon: LayoutGrid, iconColor: "text-gray-500", bgColor: "bg-gray-100 dark:bg-gray-950/30", description: "Everything else" },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Categories</h1>
      </div>

      <p className="text-muted-foreground mb-8 max-w-2xl">
        Browse tier lists by category. Find rankings for your favorite topics or discover new ones.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.name}
              href={`/explore?category=${category.name.toLowerCase().replace(" ", "-")}`}
              className="group"
            >
              <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-orange-200 dark:hover:border-orange-900 cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${category.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
