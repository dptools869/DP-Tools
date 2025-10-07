
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Mail } from "lucide-react";
import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm border border-border">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <ShieldAlert className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-4xl font-headline text-foreground">
                Disclaimer Policy
            </CardTitle>
             <p className="text-lg text-muted-foreground pt-2">
                The information provided on DP TOOLS PRO (https://dptoolspro.com/), including all tools, resources, blog articles, and related services, is intended solely for educational, informational, and general use purposes. By accessing and using this website, you acknowledge and agree to the terms of this Disclaimer Policy.
            </p>
        </CardHeader>
        <CardContent className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-primary">
            
            <h3>1. General Information Disclaimer</h3>
            <p>All the information, tools, and resources available on this website are provided in good faith and for informational purposes only. While we strive to keep the content accurate, up-to-date, and reliable, DP TOOLS PRO makes no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>

            <h3>2. Use of Tools</h3>
            <p>Our tools are free to use unless stated otherwise. In the future, we may introduce premium features or paid plans. While our tools are designed to be accurate and effective, we do not guarantee 100% accuracy, and users should verify results independently before relying on them for business, personal, financial, or legal decisions.</p>

            <h3>3. No Professional Advice</h3>
            <p>The information and tools provided on this website do not constitute professional advice of any kind, including but not limited to financial, business, legal, medical, or technical advice. Always seek the advice of qualified professionals before making decisions based on information obtained from this site.</p>

            <h3>4. Limitation of Liability</h3>
            <p>Under no circumstances shall DP TOOLS PRO, its owners, team, or affiliates be held liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with the use of our website, tools, or services. By using our site, you agree that you do so entirely at your own risk.</p>

            <h3>5. External Links Disclaimer</h3>
            <p>Our website may contain links to external websites or third-party content. While we make efforts to provide quality and safe links, we have no control over the content, accuracy, privacy policies, or practices of such third-party sites. Clicking on external links is at your own risk, and DP TOOLS PRO is not responsible for any damages or losses arising from third-party websites.</p>

            <h3>6. Advertisement & Affiliate Disclaimer</h3>
            <p>This website may display advertisements (including Google AdSense) and/or contain affiliate links. We may earn a commission if you click or purchase through such links, at no extra cost to you. These advertisements and affiliate partnerships help us maintain and grow the website. However, our reviews, tutorials, and recommendations remain unbiased and based on personal research and experience.</p>

            <h3>7. Earnings & Results Disclaimer</h3>
            <p>Any references to income, earnings, or results from tools, platforms, or methods mentioned on this site are not guaranteed. Results vary depending on effort, skills, resources, and external factors beyond our control. We do not promise or guarantee financial success from the use of our tools or content.</p>

            <h3>8. Changes to Policy</h3>
            <p>We reserve the right to update, modify, or change this Disclaimer Policy at any time without prior notice. Any updates will be reflected on this page, and it is your responsibility to review this Disclaimer regularly.</p>
            
            <p>By using our website, tools, or services, you hereby consent to this Disclaimer Policy and agree to its terms.</p>
            
            <div className="text-center border-t border-border pt-6 mt-8 not-prose">
                <h4 className="text-xl font-semibold text-foreground mb-2">Contact Us</h4>
                <p>For any questions, concerns, or clarifications regarding this Disclaimer Policy, please contact us at:</p>
                <p className="flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <Link href="mailto:hello@digitalpiyush.in" className="font-mono text-primary hover:underline">
                        hello@digitalpiyush.in
                    </Link>
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
