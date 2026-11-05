"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { X, Calendar, Clock3 } from "lucide-react";

export default function BookingModal({ isOpen, setIsOpen, studio }: any) {
  const { data: session } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const timeOptions = [];
  for (let i = 8; i <= 22; i++) {
    timeOptions.push(`${i.toString().padStart(2, "0")}:00`);
  }

  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (diffInHours > 0) setTotalPrice(diffInHours * studio.hourlyRate);
      else setTotalPrice(0);
    } else setTotalPrice(0);
  }, [startTime, endTime, studio.hourlyRate]);

  if (!isOpen) return null;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) return toast.error("Please fill all fields");
    if (totalPrice <= 0) return toast.error("End time must be after start time");

    setIsLoading(true);
    const bookingData = {
      studioId: studio._id,
      studioTitle: studio.title,
      studioImage: studio.image,
      hostEmail: studio.ownerEmail,
      userEmail: session?.user?.email,
      userName: session?.user?.name,
      date,
      startTime,
      endTime,
      totalPrice,
      status: "Pending",
      isFlagship: studio.isFlagship || false,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = await getTokenFromClient();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/booking`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        toast.success("Booking requested successfully!");
        setIsOpen(false);
      } else {
        const result = await res.json();
        toast.error(result.msg || "Failed to book");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-background w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative border border-border/50 animate-in zoom-in-95 duration-200">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 bg-secondary/50 hover:bg-secondary rounded-full transition-colors">
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-1">Book this Studio</h2>
        <p className="text-sm text-muted-foreground mb-6">Select your preferred date and time.</p>

        <form onSubmit={handleBooking} className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-2 block">Select Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="pl-11 h-12 rounded-xl" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Start Time</label>
              <div className="relative">
                <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full h-12 pl-11 pr-4 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer" required>
                  <option value="" disabled>Start Time</option>
                  {timeOptions.map(time => <option key={`start-${time}`} value={time}>{time}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">End Time</label>
              <div className="relative">
                <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full h-12 pl-11 pr-4 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer" required>
                  <option value="" disabled>End Time</option>
                  {timeOptions.map(time => <option key={`end-${time}`} value={time} disabled={startTime ? time <= startTime : false}>{time}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border mt-6 transition-colors ${totalPrice > 0 ? "bg-primary/5 border-primary/20" : "bg-secondary/30 border-border"}`}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Hourly Rate</span>
              <span className="font-medium">${studio.hourlyRate} / hr</span>
            </div>
            <div className="h-px w-full bg-border my-3" />
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full rounded-xl h-12 text-lg font-bold mt-4" disabled={isLoading || totalPrice <= 0}>
            {isLoading ? "Booking..." : "Confirm Booking"}
          </Button>
        </form>
      </div>
    </div>
  );
}