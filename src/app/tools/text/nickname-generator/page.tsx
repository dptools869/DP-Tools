
import type { Metadata } from 'next';
import { NicknameGeneratorClient } from './client';

export const metadata: Metadata = {
    title: 'Free Nickname Generator Online | Create Unique & Cool Nicknames',
    description: 'Generate unique, cool, and creative nicknames instantly with our free nickname generator. Perfect for games, social media, and online profiles. Try it now!',
    keywords: [
        "Username Generator",
        "Character Name Generator",
        "Funny Nicknames",
        "Cute Nicknames",
        "Pen Name Generator",
        "Female Nicknames",
        "Gamer Tag Generator",
        "Male Nicknames",
        "Unisex Nicknames",
        "Cool Nickname Generator",
        "Creative Name Generator",
        "Gaming Nickname Generator",
        "AI Nickname Generator",
        "Cool Name Ideas",
        "Unique Name Ideas",
        "Cool Online Names",
        "Free Nickname Generator",
        "Random Nicknames",
        "Fun Nicknames",
        "Name Generator Online",
        "Creative Nicknames",
        "Stylish Nicknames",
        "Best Nickname Generator",
        "Online Nickname Generator",
        "Online Alias Generator",
        "Nickname Creator for Games",
        "Social Media Nicknames"
    ]
};

export default function NicknameGeneratorPage() {
    return <NicknameGeneratorClient />;
}
