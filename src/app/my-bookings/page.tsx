"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays, Clock, XCircle, Trash2, Search, Star, MapPin,
  Check, Users, Download, CreditCard, Printer
} from "lucide-react";
import Image from "next/image";
import { generateInvoice } from "@/lib/invoiceGenerator";
import { printHtmlReceipt } from "@/lib/posReceiptGenerator";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyBookingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);

  const paymentMethod = "cash";
  const [amountReceived, setAmountReceived] = useState(0);

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyBookings();
    } else if (!isPending) {
      setIsLoading(false);
    }
  }, [session, isPending]);

  const fetchMyBookings = async () => {
    try {
      const token = await getTokenFromClient();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-bookings/${session?.user?.email}`, {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMyBookings(data);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const token = await getTokenFromClient();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-bookings/${id}`, { 
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Booking cancelled");
        setMyBookings(myBookings.map(b => b._id === id ? { ...b, status: "Cancelled" } : b));
      }
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  const handlePosPayment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Opening receipt for printing...");
    printHtmlReceipt(selectedBooking, paymentMethod, amountReceived);
    setIsPosModalOpen(false);
    setSelectedBooking(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending": return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Pending</span>;
      case "Confirmed": return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">Approved by Host</span>;
      case "Completed": return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">Completed</span>;
      case "Cancelled": return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">Cancelled</span>;
      default: return null;
    }
  };

  const filteredMyBookings = myBookings.filter(b => b.studioTitle.toLowerCase().includes(searchQuery.toLowerCase()));

  const dummyDetails = {
    sqft: "1,200 sq ft",
    features: [
      { icon: Check, text: "Same-day booking" },
      { icon: Users, text: "Up to 15 crew" },
      { icon: Clock, text: "24/7 access" },
    ],
    pricingNote: "Half-day · Full-day · Project",
  };

  if (isPending || isLoading) return <div className="min-h-screen text-center pt-32">Loading...</div>;
  if (!session) return <div className="text-center py-20 font-bold">Please login to view your bookings.</div>;

  return (
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-7xl relative z-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-2 text-foreground">My Bookings</h1>
          <p className="text-muted-foreground text-lg">Manage your reservations.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <Input placeholder="Search bookings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 rounded-full bg-white/5 dark:bg-black/20 backdrop-blur-md border-white/10 dark:border-white/5 focus-visible:ring-2 focus-visible:ring-primary shadow-inner text-foreground placeholder:text-muted-foreground" />
        </div>
      </div>

      {filteredMyBookings.length === 0 ? (
        <div className="text-center py-32 bg-white/5 dark:bg-black/10 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2rem]">
          <h3 className="text-2xl font-bold mb-2 text-foreground">No bookings found</h3>
          <p className="text-muted-foreground">You haven't booked any studios yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredMyBookings.map((booking: any) => (
            <div key={booking._id} className={`group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-auto md:h-[260px] ${booking.isFlagship ? "border border-yellow-500/40 hover:border-yellow-500/70 shadow-[0_0_20px_rgba(234,179,8,0.1)]" : "border border-border/50 hover:border-primary/50"}`}>
              <div className="relative w-full md:w-[300px] h-[220px] md:h-full shrink-0 overflow-hidden bg-black">
                <Image src={booking.studioImage} alt={booking.studioTitle} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground shadow-sm">{booking.studioCategory || "Studio"}</div>
                {booking.isFlagship && (
                  <div className="absolute bottom-4 left-4 z-20 bg-yellow-500 text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Star className="h-3 w-3 fill-black" /> Flagship
                  </div>
                )}
              </div>

              <div className="relative z-20 flex-grow p-6 flex flex-col bg-white/5 dark:bg-black/10 backdrop-blur-[2px] border-t md:border-t-0 md:border-l border-white/20 dark:border-white/10">
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-2xl font-bold line-clamp-1 drop-shadow-sm ${booking.isFlagship ? "text-yellow-500" : "text-foreground"}`}>{booking.studioTitle}</h3>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin className={`h-4 w-4 mr-1.5 shrink-0 ${booking.isFlagship ? "text-yellow-500" : "text-primary"}`} />
                    <span className="truncate">{booking.studioLocation || "Location not available"}</span> • 
                    <span className="ml-1 whitespace-nowrap">{dummyDetails.sqft}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                    {dummyDetails.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-muted-foreground font-medium">
                        <feature.icon className={`h-4 w-4 mr-2 shrink-0 ${booking.isFlagship ? "text-yellow-500" : "text-primary"}`} />
                        {feature.text}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <CalendarDays className={`h-4 w-4 mr-2 shrink-0 ${booking.isFlagship ? "text-yellow-500" : "text-primary"}`} />
                      {booking.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className={`h-4 w-4 mr-2 shrink-0 ${booking.isFlagship ? "text-yellow-500" : "text-primary"}`} />
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                </div>

                {/* ✅ মোবাইলে ফুটার সুন্দরভাবে সাজানো */}
                <div className="mt-auto pt-4 border-t border-zinc-300 dark:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium mb-0.5">Total</span>
                    <span className={`text-2xl font-bold ${booking.isFlagship ? "text-yellow-500" : "text-primary"}`}>${Number(booking.totalPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    {booking.status === "Confirmed" && (
                      <>
                        <Button onClick={() => { setSelectedBooking(booking); setAmountReceived(booking.totalPrice); setIsPosModalOpen(true); }} className={`h-10 px-5 rounded-full text-sm font-medium border transition-colors ${booking.isFlagship ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500 hover:text-black" : "bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white"}`}>
                          <CreditCard className="h-4 w-4 mr-2" /> Receipt
                        </Button>
                        <Button onClick={() => generateInvoice(booking)} className={`h-10 px-5 rounded-full text-sm font-medium border transition-colors ${booking.isFlagship ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500 hover:text-black" : "bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white"}`}>
                          <Download className="h-4 w-4 mr-2" /> Invoice
                        </Button>
                      </>
                    )}
                    {booking.status === "Pending" && (
                      <AlertDialog>
                        <AlertDialogTrigger className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors h-10 px-5 border ${booking.isFlagship ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black border-yellow-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20"}`}>
                          <XCircle className="h-4 w-4 mr-2" /> Cancel
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-background/80 backdrop-blur-2xl border-white/10 dark:border-white/5">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>This will cancel your booking.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-full">Keep Booking</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleCancel(booking._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full">Yes, Cancel</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POS Modal */}
      {isPosModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white/10 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 w-full max-w-4xl shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Print Receipt
              </h3>
              <button onClick={() => setIsPosModalOpen(false)} className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-2xl p-5 shadow-inner">
                  <p className="text-sm text-white/80 mb-1 font-medium">Total Paid</p>
                  <p className="text-4xl font-bold text-primary drop-shadow-sm">${Number(selectedBooking.totalPrice).toFixed(2)}</p>
                </div>
                <form onSubmit={handlePosPayment}>
                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-white">Payment Method</label>
                      <select value={paymentMethod} disabled className="w-full h-12 rounded-xl bg-white/5 dark:bg-black/20 border border-white/10 px-4 text-white/50 cursor-not-allowed backdrop-blur-md transition-all">
                        <option value="cash" className="text-black">Cash</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-white">Amount Received</label>
                      <Input type="number" value={amountReceived} readOnly className="h-12 rounded-xl bg-white/5 dark:bg-black/20 border border-white/10 text-white/50 cursor-not-allowed backdrop-blur-md" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full rounded-full h-12 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-transform">
                    <Printer className="h-5 w-5 mr-2" /> Print Receipt
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