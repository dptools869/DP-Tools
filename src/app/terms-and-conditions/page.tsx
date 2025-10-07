
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail, Globe } from "lucide-react";
import Link from 'next/link';

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm border border-border">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <FileText className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-4xl font-headline text-foreground">
                Terms and Conditions
            </CardTitle>
             <p className="text-lg text-muted-foreground pt-2">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </CardHeader>
        <CardContent className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-primary">
            
            <p>Welcome to DP TOOLS PRO ("we", "our", or "us"). These Terms and Conditions ("Terms") govern your use of our website, https://dptoolspro.com/ (the "Site") and the tools, services, and features we provide (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please discontinue use immediately.</p>

            <h3>1. Eligibility</h3>
            <p>By using DP TOOLS PRO, you confirm that you are at least 13 years of age or the age of majority in your jurisdiction. If you are accessing the Services on behalf of a company or organization, you represent and warrant that you have the authority to bind that entity to these Terms.</p>

            <h3>2. Use of Services</h3>
            <p>Our tools are currently provided free of charge. We monetize through advertising and may introduce paid plans or premium features in the future. You agree to use the Services only for lawful purposes and in compliance with all applicable laws.</p>

            <h3>3. User Responsibilities</h3>
            <p>You agree not to misuse our Services, including but not limited to: attempting to access systems without authorization, disrupting functionality, reverse-engineering code, or engaging in activities that may harm other users or DP TOOLS PRO.</p>

            <h3>4. Intellectual Property</h3>
            <p>All content, branding, design, and underlying technology on DP TOOLS PRO are the property of DP TOOLS PRO and its licensors. You may not copy, distribute, modify, or create derivative works without prior written consent.</p>

            <h3>5. Advertisements & Third-Party Links</h3>
            <p>Our Services may display third-party advertisements or links. We are not responsible for the content, accuracy, or policies of third-party sites or services. Your dealings with advertisers are solely between you and the third party.</p>

            <h3>6. Future Changes</h3>
            <p>We reserve the right to introduce paid features, subscriptions, or changes to our Services at any time. Continued use of the Services after updates constitutes acceptance of the revised Terms.</p>

            <h3>7. Limitation of Liability</h3>
            <p>To the maximum extent permitted by law, DP TOOLS PRO shall not be liable for any indirect, incidental, or consequential damages arising out of or connected with your use of the Services. All tools are provided on an "as is" and "as available" basis, without warranties of any kind.</p>

            <h3>8. Termination</h3>
            <p>We reserve the right to suspend or terminate access to the Services at our discretion, without prior notice, if you violate these Terms or misuse the Services.</p>

            <h3>9. Changes to Terms</h3>
            <p>We may update or modify these Terms at any time. Updates will be posted on this page with the 'Last Updated' date. By continuing to use the Services, you agree to the revised Terms.</p>
            
            <div className="text-center border-t border-border pt-6 mt-8 not-prose">
                <h4 className="text-xl font-semibold text-foreground mb-2">10. Contact Us</h4>
                <p>If you have any questions or concerns regarding these Terms, please contact us at:</p>
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
