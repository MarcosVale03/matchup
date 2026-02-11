import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Matchup - Signup',
    description : 'Signup page for Matchup'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    children
  );
}
