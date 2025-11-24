import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Tier Lists",
  description:
    "Discover and explore tier lists created by the community. Find rankings for games, movies, food, and more.",
  openGraph: {
    title: "Explore Tier Lists | Rankmaker",
    description:
      "Discover and explore tier lists created by the community. Find rankings for games, movies, food, and more.",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
