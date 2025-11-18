
import Link from 'next/link';
import { Facebook, Instagram, Send, Twitter, Youtube, Globe } from 'lucide-react';
import Logo from './logo';
import { Input } from './ui/input';
import { Button } from './ui/button';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms and Conditions', href: '/terms-and-conditions' },
  { label: 'Sitemap', href: '/sitemap.xml' },
  { label: 'Robots.txt', href: '/robots.txt' },
  { label: 'PDF Tools', href: '/pdf-tools' },
];

const socialLinks = [
  { icon: <Youtube />, href: 'https://www.youtube.com/channel/UCRGvkegBkoawledHKKH4Zag', name: 'YouTube' },
  { icon: <Send />, href: 'https://telegram.me/joinchat/HTXGrS_MP4n0g4lC', name: 'Telegram' },
  { icon: <Twitter />, href: '#', name: 'Twitter' },
  { icon: <Facebook />, href: 'https://web.facebook.com/digitalpiyush.yt', name: 'Facebook' },
  { icon: <Instagram />, href: 'https://www.instagram.com/digitalpiyush.yt', name: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo and Description */}
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Your one-stop platform for fast, reliable, and smart utilities for daily tasks.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.href} aria-label={social.name} className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                    {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Subscribe to our Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get updates on new tools and features.
            </p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="bg-background" />
              <Button type="submit" variant="default">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DP Tools. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
