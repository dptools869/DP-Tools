import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl font-headline">
            <Info className="h-8 w-8 text-primary" />
            About DP Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-muted-foreground">
          <p>
            Welcome to DP Tools, your ultimate destination for a wide range of online tools designed to simplify your digital life. Our mission is to provide fast, reliable, and user-friendly utilities that are accessible to everyone, everywhere.
          </p>
          <p>
            Whether you're a student, a professional, or just someone looking to get things done efficiently, DP Tools offers a comprehensive suite of tools for handling PDFs, editing images, and performing various calculations.
          </p>
          <p>
            We are constantly working to expand our collection of tools and improve existing ones. Our platform is built with modern technology to ensure a seamless and secure experience for all our users.
          </p>
          <p>
            Thank you for choosing DP Tools!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
