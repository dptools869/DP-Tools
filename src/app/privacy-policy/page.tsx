
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Mail } from "lucide-react";
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm border border-border">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-4xl font-headline text-foreground">
                Privacy Policy
            </CardTitle>
             <p className="text-lg text-muted-foreground pt-2">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </CardHeader>
        <CardContent className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-primary">
            
            <p>At DP TOOLS PRO ("we", "our", or "us"), accessible from https://dptoolspro.com/, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information. By using our website and services, you agree to the practices described in this policy.</p>

            <h3>1. Information We Collect</h3>
            <p><strong>a) Personal Information:</strong> If you contact us directly, we may receive your name, email address, phone number, and the contents of your message.</p>
            <p><strong>b) Non-Personal Information:</strong> We may collect non-identifying data such as browser type, device type, operating system, and usage statistics.</p>
            <p><strong>c) Cookies:</strong> Our website uses cookies and similar technologies to enhance user experience and deliver personalized ads.</p>

            <h3>2. How We Use Your Information</h3>
            <p>We use the collected information to:</p>
            <ul>
                <li>Provide and improve our tools and services</li>
                <li>Communicate with you when necessary</li>
                <li>Monitor usage patterns and website performance</li>
                <li>Display relevant advertisements through third-party networks (e.g., Google AdSense)</li>
                <li>Comply with legal obligations</li>
            </ul>

            <h3>3. Advertisements & Third-Party Services</h3>
            <p>We use third-party ad networks such as Google AdSense to display advertisements. These networks may use cookies and tracking technologies to deliver tailored ads based on your browsing activity. Please review Google’s Privacy Policy for more details on how your information is handled.</p>

            <h3>4. Data Sharing</h3>
            <p>We do not sell, trade, or rent users' personal information. We may share information with trusted third-party service providers who assist us in operating our website, conducting business, or serving users, so long as those parties agree to keep this information confidential.</p>

            <h3>5. Data Security</h3>
            <p>We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>

            <h3>6. Children's Privacy</h3>
            <p>Our services are not directed toward individuals under the age of 13. We do not knowingly collect personal information from children. If we discover that a child under 13 has provided us with information, we will delete it immediately.</p>

            <h3>7. Your Rights</h3>
            <p>You may have the right to access, update, or delete your personal information. If you wish to exercise these rights, please contact us at hello@digitalpiyush.in.</p>

            <h3>8. Changes to This Privacy Policy</h3>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated 'Last Updated' date. Continued use of our services after updates indicates acceptance of the revised policy.</p>

            <div className="text-center border-t border-border pt-6 mt-8 not-prose">
                <h4 className="text-xl font-semibold text-foreground mb-2">9. Contact Us</h4>
                <p>If you have any questions or concerns regarding this Privacy Policy, please contact us at:</p>
                <div className="space-y-2">
                    <p className="flex items-center justify-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        <Link href="mailto:hello@digitalpiyush.in" className="font-mono text-primary hover:underline">
                            hello@digitalpiyush.in
                        </Link>
                    </p>
                     <p className="flex items-center justify-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        <Link href="https://dptoolspro.com/" className="font-mono text-primary hover:underline">
                            https://dptoolspro.com/
                        </Link>
                    </p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
