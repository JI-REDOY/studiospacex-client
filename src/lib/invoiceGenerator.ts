import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (booking: any) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(15, 23, 42); 
  doc.rect(0, 0, 210, 45, "F");
  
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  
  doc.setTextColor(255, 255, 255);
  doc.text("Studio", 14, 27);
  
  doc.setTextColor(16, 185, 129); 
  doc.text("Space", 14 + doc.getTextWidth("Studio"), 27);
  
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("PREMIUM CREATIVE STUDIOS", 14, 34);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 196, 28, { align: "right" });

  // Details
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE DETAILS", 14, 60);

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Invoice No:`, 14, 68);
  doc.text(`#${booking._id.slice(-8).toUpperCase()}`, 40, 68);
  
  doc.text(`Issue Date:`, 14, 75);
  doc.text(`${booking.date}`, 40, 75);
  
  doc.text(`Time Slot:`, 14, 82);
  doc.text(`${booking.startTime} - ${booking.endTime}`, 40, 82);

  // Bill To
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(125, 55, 71, 34, 3, 3, "F");
  
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.line(125, 55, 125, 89); 
  
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("BILLED TO", 130, 63);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${booking.userName}`, 130, 72);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`${booking.userEmail}`, 130, 78);

  // Studio Details
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("STUDIO DETAILS", 14, 100);
  
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Studio:`, 14, 108);
  doc.setFont("helvetica", "bold");
  doc.text(`${booking.studioTitle}`, 35, 108);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Location:`, 14, 115);
  doc.text(`${booking.studioLocation || "N/A"}`, 35, 115);
  
  doc.text(`Type:`, 14, 122);
  doc.text(`${booking.studioCategory || "Creative Studio"}`, 35, 122);

  if (booking.isFlagship) {
    doc.setFillColor(234, 179, 8);
    doc.roundedRect(14, 127, 45, 8, 2, 2, "F");
    doc.setTextColor("#000000");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("FLAGSHIP STUDIO", 16, 132);
  }

  // Table
  autoTable(doc, {
    startY: 145,
    head: [["DESCRIPTION", "DATE", "TIME", "TOTAL"]],
    body: [
      [
        `${booking.studioTitle} - Rental`, 
        `${booking.date}`, 
        `${booking.startTime} - ${booking.endTime}`, 
        `$${Number(booking.totalPrice).toFixed(2)}`
      ]
    ],
    theme: "plain",
    headStyles: { 
      fillColor: [15, 23, 42],
      textColor: "#ffffff", 
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
      cellPadding: 5
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 41, 59],
      cellPadding: 6,
      lineColor: [226, 232, 240],
      lineWidth: { bottom: 0.5 },
      halign: "center"
    },
    columnStyles: {
      0: { halign: "left", fontStyle: "bold" },
      3: { fontStyle: "bold", textColor: [16, 185, 129] }
    },
    margin: { left: 14, right: 14 },
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 170;
  
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(110, finalY + 10, 196, finalY + 10);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL AMOUNT:", 120, finalY + 20);

  doc.setTextColor(16, 185, 129);
  doc.setFontSize(18);
  doc.text(`$${Number(booking.totalPrice).toFixed(2)}`, 196, finalY + 20, { align: "right" });

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 260, 196, 260);

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Authorized Signature", 196, 275, { align: "right" });
  doc.setDrawColor(148, 163, 184);
  doc.line(150, 278, 196, 278);

  doc.setTextColor(100, 116, 139);
  doc.text("www.studiospace.com", 14, 270);
  doc.text("support@studiospace.com", 14, 275);

  doc.setTextColor(148, 163, 184);
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.text("Thank you for creating with StudioSpace.", 105, 290, { align: "center" });

  doc.save(`StudioSpace-Invoice-${booking._id.slice(-6).toUpperCase()}.pdf`);
};