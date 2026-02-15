import { Metadata } from 'next';

// adds name of page your on at the tab
export const metadata: Metadata = {
    title: 'MatchUp - Create Tournament',
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
