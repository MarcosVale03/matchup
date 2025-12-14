import Link from "next/link";

export default function Banner() {
  return (
    <nav className="fixed top-0 left-0 bg-[#BD2D2D] z-50">
      <div className="flex items-center justify-start px-6 py-3 max-w-7xl">
          <div>
            <Link href="/">
              <img src="/matchup-logo-2.png" alt="Matchup Logo" className="w-33 h-11 hover:cursor-pointer" />
            </Link>
          </div>
      </div>
    </nav>
  );
}