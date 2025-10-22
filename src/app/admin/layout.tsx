import { FirebaseProvider } from '@/firebase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
