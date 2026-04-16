'use client'
import Link from "next/link";
import { useNotifications } from "@/features/notifications/get-notifications";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/app/client-layout";
import { signOut } from "@/lib/auth";
import { CircleUser, LogOut, MessageCircleMore, Menu, Plus, Trophy, X, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import NotificationsList from "@/features/notifications/notifications-list";

export default function NavigationBar() {
	const pathname = usePathname();
	const router = useRouter();
	const { user } = useProfile();
	const [menuOpen, setMenuOpen] = useState(false);

	const isAuthPage = pathname === "/signup" || pathname === "/login";

	const handleSignOut = async () => {
		const { success } = await signOut();
		if (success) {
			router.push("/");
			router.refresh();
		}
	}

	const { notifications, unreadCount, markAllRead } = useNotifications();
	const [showNotifications, setShowNotifications] = useState(false);

	const toggleNotifications = () => {
		setShowNotifications((prev) => {
			const next = !prev;
			if (next) {
				document.body.style.overflow = "hidden";
			} else {
				document.body.style.overflow = "";
			}
			return next;
		});
		markAllRead();
	};

	// This removes the lock if the user navigates away while the popup is still open.
	useEffect(() => {
		return () => {
			document.body.style.overflow = "";
		};
	}, []);

	const iconClassName = "size-4"

	// for screens that show the buttons on the nav bar
	const generalButtonClass = `flex flex-row items-center justify-center rounded-2xl 
                                hover:bg-white hover:text-primary transition duration-200 p-1 px-2 gap-2`;

	// for screens that show the button on the side panel when expanded
	const sidebarButtonClass = `flex flex-row items-center gap-3 w-full px-4 py-3 rounded-md 
                                hover:bg-white hover:text-primary transition duration-200`;

	const closeMenu = () => setMenuOpen(false);

	return (
		<>
			<nav className="bg-primary p-2 px-4 sticky w-full top-0 z-10 font-jersey text-base lg:text-xl">
				<ul className="flex justify-between items-center list-none">

					{/* Left: Logo */}
					{/*<Link href='/tournaments' className="shrink-0">*/}
					{/*    <Image*/}
					{/*        src="/matchup-logo-2.png"*/}
					{/*        alt="Matchup Logo"*/}
					{/*        width={168}*/}
					{/*        height={52}*/}
					{/*        className="w-30 lg:w-36"*/}
					{/*        style={{ height: 'auto' }}*/}
					{/*        priority*/}
					{/*    />*/}
					{/*</Link>*/}

					<Link href='/'><h1 className="text-3xl lg:text-4xl text-white">
						Matchup
					</h1></Link>

					{/* Desktop: Navigation Buttons (hidden on small screens) */}
					{!isAuthPage && (
						<div className="hidden md:flex flex-row gap-1 md:gap-2 shrink-0">

							{/* Forums */}
							<Link
								href="/forums"
								className={`${pathname === "/forums" ? "bg-white text-primary" : "text-white"} ${generalButtonClass}`}
							>
								<MessageCircleMore className={iconClassName} />
								<p>Forums</p>
							</Link>

							{/* Tournaments */}
							<Link
								href="/tournaments"
								className={`${pathname === "/tournaments" ? "bg-white text-primary" : "text-white"} ${generalButtonClass}`}
							>
								<Trophy className={iconClassName} />
								<p>Tournaments</p>
							</Link>

							{/* Login */}
							{!user && (
								<Link href="/login" className={`text-white ${generalButtonClass}`}>
									<CircleUser className={iconClassName} />
									<p>Log in</p>
								</Link>
							)}

							{user && (
								<>
									{/* Sign out */}
									<button
										onClick={handleSignOut}
										className={`text-white ${generalButtonClass}`}
									>
										<LogOut className={iconClassName} />
										<p>Sign Out</p>
									</button>

									{/* Create tournament button */}
									<Link
										href="/tournaments/create"
										className={`${pathname === "/tournaments/create" ? "bg-white text-primary" : "text-white"} ${generalButtonClass}`}
									>
										<Plus className={iconClassName} />
										<p>Create</p>
									</Link>

									{/* User Profile */}
									<Link
										href="/profile"
										className={`${pathname === "/profile" ? "bg-white text-primary" : "text-white"} ${generalButtonClass}`}
									>
										<CircleUser className={iconClassName} />
										<p>{user.user_metadata?.display_name || user.email}</p>
									</Link>

									{/* Notifications */}
									<div className="relative place-self-center">
										<button
											onClick={toggleNotifications}
											className={`${showNotifications ? "bg-white text-primary" : "text-white"} ${generalButtonClass}`}
										>
											<Bell className={iconClassName} />
											{unreadCount > 0 && (
												<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
													{unreadCount}
												</span>
											)}
										</button>

										<div className={`absolute top-12 right-1 ${showNotifications ? "block" : "hidden"} bg-white rounded-lg shadow-lg overflow-hidden max-h-[70vh] flex flex-col`}>
											<div className="flex items-center justify-between p-3 border-b border-gray-200">
												<p className="text-lg font-semibold text-gray-800 font-poppins">Notifications</p>
												<button
													onClick={toggleNotifications}
													className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
												>
													<X className="size-4" />
												</button>
											</div>
											<div className="overflow-y-auto flex-1">
												<NotificationsList notifications={notifications} />
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					)}

					{/* Mobile: Hamburger button (visible only on small screens) */}
					{!isAuthPage && (
						<button
							className="md:hidden text-white p-2"
							onClick={() => setMenuOpen(true)}
							aria-label="Open menu"
						>
							<Menu className={iconClassName} />
						</button>
					)}
				</ul>
			</nav>

			{/* Backdrop */}
			{menuOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-20 md:hidden"
					onClick={closeMenu}
				/>
			)}

			{/* Side Panel */}
			<div className={`fixed top-0 right-0 h-full w-64 bg-primary z-30 md:hidden shadow-2xl
                            transform transition-transform duration-300 ease-in-out font-jersey text-lg
                            ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
			>
				{/* Panel Header */}
				<div className="flex justify-between items-center p-4 border-b border-secondary">
					<p className="text-2xl text-white">Menu</p>
					<button onClick={closeMenu} className="p-1 pr-4 hover:bg-white/10 rounded-md">
						<X className={iconClassName} />
					</button>
				</div>

				{/* Panel Links */}
				<div className="flex flex-col gap-1 p-3">

					{/* Forum button */}
					<Link href="/forums" onClick={closeMenu}
						className={`${pathname === "/forums" ? "bg-white text-primary" : ""} ${sidebarButtonClass}`}>
						<MessageCircleMore className={iconClassName} />
						Forums
					</Link>

					{/* Tournaments button */}
					<Link href="/tournaments" onClick={closeMenu}
						className={`${pathname === "/tournaments" ? "bg-white text-primary" : ""} ${sidebarButtonClass}`}>
						<Trophy className={iconClassName} />
						Tournaments
					</Link>

					{/* Login button, only available if not logged in */}
					{!user && (
						<Link href="/login" onClick={closeMenu} className={sidebarButtonClass}>
							<CircleUser className={iconClassName} />
							Log In
						</Link>
					)}

					{user && (
						<>
							{/* Profile button */}
							<Link href="/profile" onClick={closeMenu}
								className={`${pathname === "/profile" ? "bg-white text-primary" : ""} ${sidebarButtonClass}`}>
								<CircleUser className={iconClassName} />
								<p className="truncate">
									{user.user_metadata?.display_name || user.email}
								</p>
							</Link>

							{/* Create tournament */}
							<Link
								href="/tournaments/create"
								onClick={closeMenu}
								className={`${pathname === "/tournaments/create" ? "bg-white text-primary" : ""} ${sidebarButtonClass}`}
							>
								<Plus className={iconClassName} />
								Create Tournament
							</Link>

							{/* Notifications */}
							<div className="w-full">
								<button
									onClick={toggleNotifications}
									className={`${showNotifications ? "bg-white text-primary" : ""} ${sidebarButtonClass}`}
								>
									<Bell className={iconClassName} />
									<span>Notifications</span>
									{unreadCount > 0 && (
										<span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
											{unreadCount}
										</span>
									)}
								</button>
							</div>


							{/* Sign out */}
							<button onClick={() => { handleSignOut(); closeMenu(); }} className={sidebarButtonClass}>
								<LogOut className={iconClassName} />
								Sign Out
							</button>
						</>
					)}
				</div>
			</div>

			{/* Expandable notifications list inside the panel */}
			{showNotifications && (
				<div 
					className="fixed inset-0 z-50 bg-black/50 md:hidden flex items-center justify-center p-4" 
					onClick={toggleNotifications}
				>
					<div
						className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="flex items-center justify-between p-3 border-b border-gray-200">
							<p className="text-lg font-semibold text-gray-800 font-poppins">Notifications</p>
							<button
								onClick={toggleNotifications}
								className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
							>
								<X className={iconClassName} />
							</button>
						</div>
						<div className="overflow-y-auto flex-1">
							<NotificationsList notifications={notifications} />
						</div>
					</div>
				</div>
			)}
		</>
	);
}