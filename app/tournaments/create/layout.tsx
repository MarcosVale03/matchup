import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Matchup - Create Tournament',
    description : 'Sign Up page for Matchup'
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
