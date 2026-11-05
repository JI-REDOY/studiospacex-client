"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Aperture, LogOut, Menu, User, PlusSquare, CalendarDays, LayoutDashboard, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { data: session, isPending } = authClient.useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<"home" | "how-it-works">("home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.location.hash === "#how-it-works") {
                setActiveSection("how-it-works");
                setTimeout(() => {
                    const el = document.getElementById("how-it-works");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 1500);
            } else if (pathname === "/") {
                setActiveSection("home");
            }
        }
        setIsMobileMenuOpen(false); 
    }, [pathname]);

    // ✅ মোবাইল মেনু ওপেন থাকলে স্ক্রল বন্ধ রাখা
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isMobileMenuOpen]);

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            toast.success("Logged out successfully!");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    const handleHowItWorksClick = (e: React.MouseEvent) => {
        e.preventDefault(); 
        setActiveSection("how-it-works");
        setIsMobileMenuOpen(false);

        if (pathname === "/") {
            const el = document.getElementById("how-it-works");
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                window.history.pushState(null, "", "#how-it-works"); 
            }
        } else {
            router.push("/#how-it-works");
        }
    };

    const handleHomeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setActiveSection("home");
        setIsMobileMenuOpen(false);
        if (pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.pushState(null, "", "/");
        } else {
            router.push("/");
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Studios", href: "/studios" },
        { name: "How It Works", href: "/#how-it-works" },
        { name: "About", href: "/about" },
    ];

    return (
        <header className="fixed top-0 z-50 w-full bg-black/20 dark:bg-black/40 backdrop-blur-md border-b border-white/10 transition-all duration-300">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
                
                {/* Left Side: Logo */}
                <div className="flex items-center shrink-0 w-auto lg:w-[280px]">
                    <div onClick={handleHomeClick} className="flex items-center gap-2 group cursor-pointer">
                        <div className="relative bg-primary/10 p-2 rounded-xl group-hover:bg-yellow-500/10 transition-all duration-300 flex items-center justify-center">
                            <Aperture className="h-6 w-6 text-primary animate-spin-slow" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-ping absolute" />
                                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 z-10" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white font-[family-name:var(--font-playfair)]">
                            Studio<span className="text-primary group-hover:text-yellow-500 transition-colors duration-300">Space</span>
                        </span>
                    </div>
                </div>

                {/* Center: Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1 bg-white/10 dark:bg-black/40 backdrop-blur-xl px-2 py-1.5 rounded-full border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] mx-auto">
                    {navLinks.map((link) => {
                        let isActive = false;
                        if (link.name === "Home") isActive = pathname === "/" && activeSection === "home";
                        else if (link.name === "How It Works") isActive = pathname === "/" && activeSection === "how-it-works";
                        else isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={(e) => {
                                    if (link.name === "Home") handleHomeClick(e);
                                    if (link.name === "How It Works") handleHowItWorksClick(e);
                                }}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    isActive ? "bg-white/20 text-white font-bold shadow-sm" : "text-white/70 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side: Auth & Mobile Toggle */}
                <div className="flex items-center justify-end gap-2 md:gap-4 shrink-0 w-auto lg:w-[320px]">
                    <ThemeToggle />
                    
                    {isPending ? (
                        <div className="h-10 w-10 rounded-full bg-white/20 animate-pulse" />
                    ) : session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-3 outline-none group">
                                <div className="hidden md:flex flex-col items-end mr-1">
                                    <span className="text-sm font-bold leading-tight text-primary whitespace-nowrap max-w-[200px]">{session.user.name}</span>
                                    <span className="text-xs text-white/70 whitespace-nowrap max-w-[200px]">{session.user.email}</span>
                                </div>
                                <Avatar className="h-10 w-10 border-2 border-white/20 group-hover:border-primary transition-all duration-300">
                                    <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                                    <AvatarFallback className="bg-primary/20 text-primary">{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 rounded-2xl shadow-2xl border border-white/20 bg-black/80 backdrop-blur-2xl p-2 mt-2" align="end" sideOffset={12}>
                                <div className="px-3 py-3 mb-1 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-sm font-bold text-white">My Account</p>
                                    <p className="text-xs text-white/60 truncate mt-0.5">{session.user.email}</p>
                                </div>
                                <div className="h-px bg-white/10 my-2" />
                                <div className="p-1 space-y-1">
                                    <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer py-2.5 px-3 rounded-xl hover:bg-primary/20 flex items-center">
                                        <LayoutDashboard className="h-4 w-4 mr-3 text-primary" /> Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/add-studio")} className="cursor-pointer py-2.5 px-3 rounded-xl hover:bg-primary/20 flex items-center">
                                        <PlusSquare className="h-4 w-4 mr-3 text-primary" /> Add New Studio
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/my-listings")} className="cursor-pointer py-2.5 px-3 rounded-xl hover:bg-primary/20 flex items-center">
                                        <User className="h-4 w-4 mr-3 text-primary" /> My Listings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/my-bookings")} className="cursor-pointer py-2.5 px-3 rounded-xl hover:bg-primary/20 flex items-center">
                                        <CalendarDays className="h-4 w-4 mr-3 text-primary" /> My Bookings
                                    </DropdownMenuItem>
                                </div>
                                <div className="h-px bg-white/10 my-2" />
                                <div className="p-1">
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2.5 px-3 rounded-xl hover:bg-red-500/20 flex items-center">
                                        <LogOut className="h-4 w-4 mr-3 text-red-500" /> <span className="text-red-400">Logout</span>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login"><Button variant="ghost" className="font-semibold text-white hover:bg-white/10 rounded-full">Login</Button></Link>
                            <Link href="/register"><Button className="rounded-full font-semibold bg-white text-black hover:bg-white/90">Get Started</Button></Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="lg:hidden rounded-full text-white hover:bg-white/10"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* ✅ Mobile Dropdown Menu (ফিক্সড ওভারলে) */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-black/95 backdrop-blur-3xl border-t border-white/10 px-6 py-8 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-4 overflow-y-auto z-[100]">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={(e) => {
                                if (link.name === "Home") handleHomeClick(e);
                                if (link.name === "How It Works") handleHowItWorksClick(e);
                                else setIsMobileMenuOpen(false);
                            }}
                            className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-white/90 hover:text-primary transition-colors py-3 border-b border-white/10"
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    {/* মোবাইল মেনুতে ইউজার ইনফো */}
                    {session?.user && (
                        <div className="flex items-center gap-4 mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <Avatar className="h-12 w-12 border-2 border-primary/50">
                                <AvatarImage src={session.user.image || ""} />
                                <AvatarFallback className="bg-primary/20 text-primary">{session.user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-white text-lg">{session.user.name}</p>
                                <p className="text-sm text-white/60">{session.user.email}</p>
                            </div>
                        </div>
                    )}

                    {!session && (
                        <div className="flex flex-col gap-4 mt-8">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full rounded-full border-white/20 text-white h-12 text-lg">Login</Button>
                            </Link>
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full rounded-full bg-primary text-white h-12 text-lg">Get Started</Button>
                            </Link>
                        </div>
                    )}

                    {session && (
                        <Button 
                            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                            variant="destructive" 
                            className="w-full rounded-full mt-4 h-12 text-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                            <LogOut className="mr-2 h-5 w-5" /> Logout
                        </Button>
                    )}
                </div>
            )}
        </header>
    );
}