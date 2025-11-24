import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Tier List",
  description:
    "Create your own tier list with our easy-to-use drag and drop interface. Upload images, customize tiers, and share with the community.",
  openGraph: {
    title: "Create Tier List | Rankmaker",
    description:
      "Create your own tier list with our easy-to-use drag and drop interface. Upload images, customize tiers, and share with the community.",
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
