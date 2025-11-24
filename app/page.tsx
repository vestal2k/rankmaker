import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Users,
  Download,
  Lock,
  Zap,
  Heart,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Amazing Tier Lists
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8">
              Rank anything. Share everything. Join thousands creating and
              discovering tier lists for games, movies, food, and more.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/create">
                <Button size="lg" className="text-lg px-8">
                  Start Creating
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Explore Tier Lists
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Drag & Drop</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Intuitive interface with smooth drag and drop. Create tier lists in minutes.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">PNG Export</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Download your tier lists as high-quality images to share anywhere.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Social Features</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your rankings, like others&apos; tier lists, and join the discussion.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Public or Private</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose to share your tier lists publicly or keep them private.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Login Required</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start creating immediately. Only sign in when you&apos;re ready to save.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Tiers</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fully customizable tiers with your own names and colors.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Images</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Click &quot;Add Images&quot; to upload pictures of items you want to rank.
                  Add as many as you like.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Drag and Organize</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Drag items from the bottom into tiers. Customize tier names and colors
                  to match your style.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Save and Share</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Save your tier list to your profile or export as PNG. Share with
                  friends and see what others think!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Ranking?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our community and create your first tier list today
          </p>
          <Link href="/create">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Your First Tier List
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-950">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Rankmaker. Create and share your rankings.</p>
        </div>
      </footer>
    </div>
  );
}
