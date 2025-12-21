import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Users,
  Download,
  Lock,
  Zap,
  Heart,
  ArrowRight,
  Star
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-amber-50/50 to-background dark:from-orange-950/20 dark:via-amber-950/10 dark:to-background py-20 sm:py-32">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/40 to-yellow-200/40 dark:from-orange-500/10 dark:to-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-200/30 to-blue-200/30 dark:from-green-500/10 dark:to-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Mascot */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Rankmaker Fox Mascot"
                  width={180}
                  height={180}
                  className="drop-shadow-2xl animate-bounce-slow"
                  priority
                />
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 via-yellow-400/20 to-green-400/20 rounded-full blur-2xl -z-10" />
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Create Amazing
              </span>
              <br />
              <span className="text-foreground">Tier Lists</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Rank anything. Share everything. Join thousands creating and
              discovering tier lists for games, movies, food, and more.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/create">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5">
                  Start Creating
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="text-lg px-8 border-2 hover:bg-orange-50 dark:hover:bg-orange-950/20">
                  Explore Tier Lists
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-orange-500 font-medium mb-4">
              <Star className="w-4 h-4 fill-current" />
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything You Need
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 group hover:shadow-lg hover:shadow-orange-500/5 transition-all hover:-translate-y-1 border-2 hover:border-orange-200 dark:hover:border-orange-900">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/50 dark:to-amber-950/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Drag & Drop</h3>
              <p className="text-muted-foreground">
                Intuitive interface with smooth drag and drop. Create tier lists in minutes.
              </p>
            </Card>

            <Card className="p-6 group hover:shadow-lg hover:shadow-yellow-500/5 transition-all hover:-translate-y-1 border-2 hover:border-yellow-200 dark:hover:border-yellow-900">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-950/50 dark:to-amber-950/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">PNG Export</h3>
              <p className="text-muted-foreground">
                Download your tier lists as high-quality images to share anywhere.
              </p>
            </Card>

            <Card className="p-6 group hover:shadow-lg hover:shadow-green-500/5 transition-all hover:-translate-y-1 border-2 hover:border-green-200 dark:hover:border-green-900">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Social Features</h3>
              <p className="text-muted-foreground">
                Share your rankings, like others&apos; tier lists, and join the discussion.
              </p>
            </Card>

            <Card className="p-6 group hover:shadow-lg hover:shadow-blue-500/5 transition-all hover:-translate-y-1 border-2 hover:border-blue-200 dark:hover:border-blue-900">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-950/50 dark:to-sky-950/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Public or Private</h3>
              <p className="text-muted-foreground">
                Choose to share your tier lists publicly or keep them private.
              </p>
            </Card>

            <Card className="p-6 group hover:shadow-lg hover:shadow-red-500/5 transition-all hover:-translate-y-1 border-2 hover:border-red-200 dark:hover:border-red-900">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-950/50 dark:to-rose-950/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Login Required</h3>
              <p className="text-muted-foreground">
                Start creating immediately. Only sign in when you&apos;re ready to save.
              </p>
            </Card>

            <Card className="p-6 group hover:shadow-lg hover:shadow-pink-500/5 transition-all hover:-translate-y-1 border-2 hover:border-pink-200 dark:hover:border-pink-900">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-950/50 dark:to-rose-950/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Tiers</h3>
              <p className="text-muted-foreground">
                Fully customizable tiers with your own names and colors.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-orange-500 font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Three Simple Steps
            </h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                1
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-semibold mb-2">Upload Your Images</h3>
                <p className="text-muted-foreground">
                  Click &quot;Add Images&quot; to upload pictures, videos, or audio of items you want to rank.
                  Add as many as you like.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-yellow-500/25 group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-semibold mb-2">Drag and Organize</h3>
                <p className="text-muted-foreground">
                  Drag items from the bottom into tiers. Customize tier names and colors
                  to match your style.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform">
                3
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-semibold mb-2">Save and Share</h3>
                <p className="text-muted-foreground">
                  Save your tier list to your profile or export as PNG. Share with
                  friends and see what others think!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white relative overflow-hidden">
        {/* Decorative mascot */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <Image
            src="/logo.png"
            alt=""
            width={400}
            height={400}
            className="rotate-12"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Ranking?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Join our community and create your first tier list today
          </p>
          <Link href="/create">
            <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-orange-600 hover:bg-orange-50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5">
              Create Your First Tier List
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Rankmaker"
                width={32}
                height={32}
              />
              <span className="font-semibold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Rankmaker
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 Rankmaker. Create and share your rankings.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
