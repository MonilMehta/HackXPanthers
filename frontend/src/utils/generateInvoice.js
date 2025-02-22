import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateInvoice = (bookingDetails) => {
  const {
    paymentId,
    event,
    ticketCount,
    basePrice,
    subtotal,
    discount,
    total,
    customerDetails = {
      name: "Guest User",
      email: "guest@example.com",
    },
  } = bookingDetails;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Helper function for centered text
  const centerText = (text, y) => {
    const textWidth =
      (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Add Logo/Header
  doc.setFillColor(41, 37, 36); // Custom header color
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  centerText("Comedy Club", 25);
  doc.setFontSize(12);
  centerText("Event Ticket Invoice", 35);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Invoice Details Section
  doc.setFontSize(10);
  doc.text("Invoice Details", margin, 55);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, 57, pageWidth - margin, 57);

  // Two-column layout for invoice details
  doc.setFontSize(9);
  const leftColumn = [
    { label: "Invoice Date:", value: new Date().toLocaleDateString() },
    { label: "Payment ID:", value: paymentId },
    {
      label: "Order ID:",
      value: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    },
  ];

  const rightColumn = [
    { label: "Customer Name:", value: customerDetails.name },
    { label: "Email:", value: customerDetails.email },
    { label: "Booking Date:", value: new Date().toLocaleDateString() },
  ];

  // Print left column
  leftColumn.forEach((item, index) => {
    doc.text(`${item.label}`, margin, 65 + index * 7);
    doc.setFont(undefined, "bold");
    doc.text(`${item.value}`, margin + 25, 65 + index * 7);
    doc.setFont(undefined, "normal");
  });

  // Print right column
  rightColumn.forEach((item, index) => {
    doc.text(`${item.label}`, pageWidth - margin - 80, 65 + index * 7);
    doc.setFont(undefined, "bold");
    doc.text(`${item.value}`, pageWidth - margin - 45, 65 + index * 7);
    doc.setFont(undefined, "normal");
  });

  // Event Details Section
  doc.autoTable({
    startY: 90,
    head: [["Item Description", "Qty", "Price", "Amount"]],
    body: [
      [
        {
          content: `${event.title}\n${new Date(
            event.date
          ).toLocaleDateString()}, ${new Date(
            event.date
          ).toLocaleTimeString()}\nVenue: ${event.venue || event.location}`,
          styles: { cellWidth: "auto" },
        },
        ticketCount,
        `₹${basePrice}`,
        `₹${subtotal}`,
      ],
      ["Discount", "", "", `-₹${discount}`],
      ["Total Amount", "", "", `₹${total}`],
    ],
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: {
      fillColor: [41, 37, 36],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 30, halign: "right" },
    },
    foot: [
      [
        {
          content: `Total Amount Paid: ₹${total}`,
          colSpan: 4,
          styles: { halign: "right", fontSize: 10, fontStyle: "bold" },
        },
      ],
    ],
  });

  // Add QR Code placeholder
  doc.addImage(
    "path_to_qr_code",
    "PNG",
    margin,
    doc.previousAutoTable.finalY + 20,
    50,
    50
  );

  // Terms and Conditions
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  const terms = [
    "Terms and Conditions:",
    "• This is a valid ticket only when shown with a valid ID proof",
    "• Entry will be allowed only once with this ticket",
    "• No refunds or exchanges allowed",
    "• Management reserves the right of admission",
  ];

  terms.forEach((term, index) => {
    doc.text(term, margin, doc.previousAutoTable.finalY + 80 + index * 4);
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  const footer =
    "Thank you for booking with Comedy Club. For support, contact: support@comedyclub.com";
  centerText(footer, pageHeight - 10);

  // Save PDF
  doc.save(`Comedy_Club_Invoice_${paymentId}.pdf`);
};
