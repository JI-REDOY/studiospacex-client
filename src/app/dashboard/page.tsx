"use client";

import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays, PlusSquare, User, Activity,
  TrendingUp, Wallet, ArrowRight, LayoutDashboard, Star,
  CheckCircle2, XCircle, Clock, Search, Edit2, Sparkles, Heart, Download, CreditCard, Printer
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { generateInvoice } from "@/lib/invoiceGenerator";
import { printHtmlReceipt } from "@/lib/posReceiptGenerator";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const Typewriter = ({ text, delay = 100 }: { text: string; delay?: number }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}<span className="animate-pulse text-primary">|</span></span>;
};

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [earnings, setEarnings] = useState<number>(0);
  const [hostBookings, setHostBookings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountReceived, setAmountReceived] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (session?.user?.email) {
        try {
          const token = await getTokenFromClient();
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/earnings/${session.user.email}`, {
            headers: { authorization: `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success) setEarnings(result.totalEarnings);
        } catch (error) {
          console.error("Failed to fetch earnings", error);
        }
      }
    };

    const fetchHostBookings = async () => {
      if (session?.user?.email) {
        try {
          const token = await getTokenFromClient();
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/host/${session.user.email}`, {
            headers: { authorization: `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success) setHostBookings(result.data);
        } catch (error) {
          console.error("Failed to fetch host bookings", error);
        }
      }
    };

    fetchEarnings();
    fetchHostBookings();
  }, [session]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = await getTokenFromClient();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/status/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(`Booking ${newStatus}`);
        setHostBookings(hostBookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handlePosPayment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Payment received! Opening print dialog...");
    printHtmlReceipt(selectedBooking, paymentMethod, amountReceived);
    setIsPosModalOpen(false);
    setSelectedBooking(null);
  };

  const rawName = session?.user?.name || "";
  const fullName = rawName.replace(/User/gi, "").trim() || "";

  const filteredHostBookings = hostBookings.filter((booking: any) =>
    (booking.studioTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (booking.userName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={sectionRef} className="container mx-auto px-4 md:px-8 pt-28 pb-16 relative z-10 min-h-screen overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className={`relative bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 mb-8 shadow-2xl flex flex-col md:flex-row items-center gap-8 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-[0_0_30px_rgba(16,185,129,0.2)] shrink-0">
          <AvatarImage src={session?.user?.image || ""} />
          <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
            {isPending ? <div className="h-full w-full bg-primary/10 animate-pulse rounded-full" /> : fullName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="text-center md:text-left flex-grow w-full">
          <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-3 text-foreground min-h-[48px] md:min-h-[60px]">
            {isPending ? (
              <span className="inline-block h-10 w-64 bg-white/10 dark:bg-white/5 animate-pulse rounded-lg align-middle"></span>
            ) : (
              <>Hello, <span className="text-primary"><Typewriter text={fullName} delay={80} /></span>!</>
            )}
          </h1>

          {isPending ? (
            <div className="h-6 w-48 bg-white/10 dark:bg-white/5 animate-pulse rounded-md mb-6"></div>
          ) : (
            <p className="text-muted-foreground text-lg mb-6">{session?.user?.email}</p>
          )}

          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 w-full lg:w-auto">
              <div className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold shadow-sm">
                <Activity className="h-4 w-4 mr-2" /> Account Verified
              </div>

              <Link href="/edit-profile">
                <Button className="h-10 px-5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500 hover:text-black transition-all duration-300 text-sm font-semibold flex items-center shadow-sm">
                  <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              </Link>

              <Link href="/wishlist">
                <Button className="h-10 px-5 rounded-full bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-semibold flex items-center shadow-sm">
                  <Heart className="h-4 w-4 mr-2" /> My Wishlist
                </Button>
              </Link>
            </div>

            <Link href="/add-studio" className="w-full lg:w-auto">
              <Button className="w-full lg:w-auto rounded-full h-12 px-8 text-base font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform">
                <PlusSquare className="mr-2 h-5 w-5" /> List a New Space
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-1000 ease-out delay-150 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <Link href="/my-listings" className="flex">
          <div className="group w-full flex flex-col justify-between bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/10 p-6 rounded-[2rem] hover:border-primary/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-500 h-[180px] hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <User className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-rotate-45 transition-all duration-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">My Listings</h3>
              <p className="text-sm text-muted-foreground">Manage your studios.</p>
            </div>
          </div>
        </Link>

        <Link href="/my-bookings" className="flex">
          <div className="group w-full flex flex-col justify-between bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/10 p-6 rounded-[2rem] hover:border-primary/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-500 h-[180px] hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <CalendarDays className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-rotate-45 transition-all duration-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">My Bookings</h3>
              <p className="text-sm text-muted-foreground">Track your reservations.</p>
            </div>
          </div>
        </Link>

        <div className="group w-full flex flex-col justify-between bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/10 p-6 rounded-[2rem] hover:border-yellow-500/40 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all duration-500 h-[180px] hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div className="bg-yellow-500/10 p-3 rounded-2xl text-yellow-500 group-hover:scale-110 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-300">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-yellow-500 text-sm font-bold flex items-center bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
              <TrendingUp className="h-4 w-4 mr-1" /> +12%
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Total Earnings</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">${earnings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className={`bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/10 rounded-[2.5rem] p-8 transition-all duration-1000 ease-out delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Host Requests</h2>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search requests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-11 rounded-full bg-white/10 dark:bg-black/30 border-white/20 dark:border-white/10 focus-visible:ring-primary" />
          </div>
        </div>

        {filteredHostBookings.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-black/5 dark:bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30 text-primary" />
            <p className="text-lg">No booking requests found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredHostBookings.map((booking: any) => (
              <div key={booking._id} className={`group relative rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col lg:flex-row bg-white/5 dark:bg-[#0a0a0a] border ${booking.isFlagship ? "border-yellow-500/30 hover:border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.1)]" : "border-white/10 hover:border-primary/50"}`}>
                <div className="relative w-full lg:w-[350px] h-[240px] lg:h-auto shrink-0 overflow-hidden bg-black">
                  <Image src={booking.studioImage} alt={booking.studioTitle} fill sizes="(max-width: 1024px) 100vw, 350px" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${booking.status === "Pending" ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" : booking.status === "Confirmed" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>{booking.status}</span>
                  </div>
                  {booking.isFlagship && (
                    <div className="absolute bottom-4 left-4 z-20 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <Star className="h-3 w-3 fill-black" /> Flagship
                    </div>
                  )}
                </div>

                <div className="flex-grow p-6 flex flex-col justify-between">
                  <div>
                    <h3 className={`text-2xl font-bold mb-3 line-clamp-1 ${booking.isFlagship ? "text-yellow-500" : "text-foreground"}`}>{booking.studioTitle}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span>By: <strong className="text-foreground">{booking.userName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground/50 hidden sm:block">|</span>
                        <span className="truncate">{booking.userEmail}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm mb-6">
                      <div className="flex items-center bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <CalendarDays className={`h-4 w-4 mr-2 ${booking.isFlagship ? "text-yellow-500" : "text-primary"}`} />
                        <span className="font-medium text-foreground">{booking.date}</span>
                      </div>
                      <div className="flex items-center bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <Clock className={`h-4 w-4 mr-2 ${booking.isFlagship ? "text-yellow-500" : "text-primary"}`} />
                        <span className="font-medium text-foreground">{booking.startTime} - {booking.endTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-300 dark:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-medium mb-0.5">Total Amount</span>
                      <span className={`text-2xl font-bold ${booking.isFlagship ? "text-yellow-500" : "text-primary"}`}>${Number(booking.totalPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 w-full sm:w-auto items-center">
                      {booking.status === "Pending" ? (
                        <>
                          <Button onClick={() => handleUpdateStatus(booking._id, "Confirmed")} className="flex-1 sm:flex-none rounded-full h-10 px-6 border border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                          </Button>
                          <Button onClick={() => handleUpdateStatus(booking._id, "Cancelled")} className="flex-1 sm:flex-none rounded-full h-10 px-6 border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                            <XCircle className="h-4 w-4 mr-2" /> Reject
                          </Button>
                        </>
                      ) : booking.status === "Confirmed" ? (
                        <>
                          <Button onClick={() => { setSelectedBooking(booking); setAmountReceived(booking.totalPrice); setIsPosModalOpen(true); }} className={`rounded-full h-10 px-6 border transition-all shadow-sm ${booking.isFlagship ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black" : "border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-white"}`}>
                            <CreditCard className="h-4 w-4 mr-2" /> POS
                          </Button>
                          <Button onClick={() => generateInvoice(booking)} className={`rounded-full h-10 px-6 border transition-all shadow-sm ${booking.isFlagship ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black" : "border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-white"}`}>
                            <Download className="h-4 w-4 mr-2" /> Invoice
                          </Button>
                        </>
                      ) : (
                        <div className="w-full sm:w-auto flex justify-end">
                          <span className="text-sm text-muted-foreground italic">No action required</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isPosModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white/10 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 w-full max-w-4xl shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> POS Payment & Receipt
              </h3>
              <button onClick={() => setIsPosModalOpen(false)} className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-2xl p-5 shadow-inner">
                  <p className="text-sm text-white/80 mb-1 font-medium">Total Payable</p>
                  <p className="text-4xl font-bold text-primary drop-shadow-sm">${Number(selectedBooking.totalPrice).toFixed(2)}</p>
                </div>
                <form onSubmit={handlePosPayment}>
                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-white">Payment Method</label>
                      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full h-12 rounded-xl bg-white/5 dark:bg-black/20 border border-white/10 px-4 focus:ring-2 focus:ring-primary outline-none text-white backdrop-blur-md transition-all">
                        <option value="cash" className="text-black">Cash</option>
                        <option value="card" className="text-black">Credit/Debit Card</option>
                        <option value="bkash" className="text-black">bKash / Nagad</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-white">Amount Received</label>
                      <Input type="number" placeholder="Enter amount" required value={amountReceived} onChange={(e) => setAmountReceived(Number(e.target.value))} className="h-12 rounded-xl bg-white/5 dark:bg-black/20 border border-white/10 text-white placeholder:text-white/50 focus-visible:ring-primary backdrop-blur-md" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full rounded-full h-12 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-transform">
                    <Printer className="h-5 w-5 mr-2" /> Confirm & Print Receipt
                  </Button>
                </form>
              </div>
              <div className="bg-white/5 dark:bg-white/5 backdrop-blur-xl p-5 rounded-2xl flex flex-col items-center justify-center border border-white/10 overflow-y-auto max-h-[500px] shadow-inner">
                <p className="text-sm font-semibold mb-4 text-white tracking-wider uppercase">Receipt Preview</p>
                <div className="bg-white text-black p-4 w-[200px] shadow-2xl text-[9px] font-mono leading-tight mx-auto rounded-sm">
                  <div className="text-center mb-3">
                    <h2 className="text-[15px] font-bold tracking-widest mb-1">STUDIO SPACE</h2>
                    <p className="text-[8px] tracking-widest uppercase font-bold mb-2">Premium Studio</p>
                    <div className="border-b border-dashed border-gray-400 my-1.5" />
                  </div>
                  <div className="space-y-1 mb-1.5">
                    <div className="flex justify-between"><span>Receipt:</span><span>#{selectedBooking._id.slice(-6).toUpperCase()}</span></div>
                    <div className="flex justify-between"><span>Date:</span><span>{selectedBooking.date}</span></div>
                    <div className="text-center my-2">
                      <div className="text-[8px] text-gray-500 mb-0.5">Customer</div>
                      <div className="font-bold break-words">{selectedBooking.userName}</div>
                    </div>
                    <div className="flex justify-between"><span>Studio:</span><span className="truncate max-w-[100px]">{selectedBooking.studioTitle}</span></div>
                    {selectedBooking.isFlagship && (
                      <div className="text-center text-[9px] font-bold uppercase tracking-widest mt-1 mb-1">✨ Flagship</div>
                    )}
                  </div>
                  <div className="border-b border-dashed border-gray-400 my-1.5" />
                  <div className="flex justify-between font-bold mb-1"><span>Description</span><span>Amount</span></div>
                  <div className="flex justify-between mb-1.5"><span>Studio Rental</span><span>${Number(selectedBooking.totalPrice).toFixed(2)}</span></div>
                  <div className="border-b border-dashed border-gray-400 my-1.5" />
                  <div className="flex justify-between font-bold text-[10px] mb-1"><span>TOTAL:</span><span>${Number(selectedBooking.totalPrice).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Paid Via:</span><span className="uppercase">{paymentMethod}</span></div>
                  <div className="flex justify-between"><span>Amount Recv:</span><span>${Number(amountReceived).toFixed(2)}</span></div>
                  <div className="border-b border-dashed border-gray-400 my-1.5" />
                  <div className="text-center mt-3"><p className="italic mb-1">Thank you for choosing us!</p><p>www.studiospace.com</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}