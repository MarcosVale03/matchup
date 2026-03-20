import { Metadata } from 'next';

// adds name of page your on at the tab
export const metadata: Metadata = {
    title: 'MatchUp - Profile Settings',
    description : 'Profile settings for user signed in'
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
