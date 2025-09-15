import AdBanner from "@/components/ad-banner";
import { RecommendedVideo } from "@/components/recommended-video";
import { ToolCard } from "@/components/tool-card";
import { toolsData } from "@/lib/tools-data";
import { AlertCircle } from "lucide-react";

export default function ImageToolsPage() {
  const category = toolsData['image-tools'];

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold">Category not found</h1>
        <p className="mt-2 text-muted-foreground">The requested tool category does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content */}
        <main className="lg:col-span-3">
          <header className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold font-headline text-primary">{category.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">{category.description}</p>
          </header>

          <AdBanner type="top-banner" className="mb-12" />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {category.tools.map((tool) => (
              <ToolCard
                key={tool.title}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                href={tool.href}
              />
            ))}
          </div>

          <section className="mt-16">
            <h2 className="text-3xl font-bold font-headline mb-6 text-center lg:text-left">Recommended Tutorial</h2>
            <RecommendedVideo toolName={category.title} />
          </section>

          <AdBanner type="bottom-banner" className="mt-12" />
        </main>
        
        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky top-24 self-start">
          <AdBanner type="sidebar" />
          <AdBanner type="sidebar" />
        </aside>
      </div>
    </div>
  );
}
