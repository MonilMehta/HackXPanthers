import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Heart,
  Share2,
  ArrowLeft,
  Instagram,
  Tags,
  Building2,
  User,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Razorpay from "../components/Razorpay";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BookingModal from "../components/BookingModal";

const Booking = () => {
  const location = useLocation();
  const { event } = location.state || {};

  const [ticketCount, setTicketCount] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  if (!event) return <div>No event selected.</div>;

  const query = encodeURIComponent(event.venue || event.location);
  const mapSrc = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const handleShare = (platform) => {
    const text = encodeURIComponent(
      `Check out ${event.title} at ${event.venue}!`
    );
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      instagram: "https://instagram.com",
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${window.location.href}`,
    };
    window.open(urls[platform], "_blank");
  };

  // Dummy data (replace with real data later)
  const artistDetails = {
    bio: "A versatile comedian known for witty observations and sharp social commentary. With over 10 years of stage experience, they've performed at major comedy festivals worldwide and released multiple Netflix specials.",
    achievements: [
      "Netflix Special 2022",
      "Comedy Awards Winner 2021",
      "International Comedy Festival Headliner",
    ],
    socialMedia: {
      instagram: "https://instagram.com/comedian",
      twitter: "https://twitter.com/comedian",
    },
  };

  const venueDetails = {
    name: "Aspee Auditorium",
    description:
      "A premier entertainment venue with state-of-the-art sound systems and comfortable seating for 500+ people. Known for hosting the city's best comedy shows and cultural events.",
    amenities: [
      "Parking Available",
      "Wheelchair Accessible",
      "Full Bar Service",
    ],
    address: "123 Comedy Street, Mumbai, 400001",
  };

  const generateInvoice = (paymentId) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add company logo or header
    doc.setFontSize(20);
    doc.text("Comedy Club Invoice", pageWidth / 2, 20, { align: "center" });

    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Payment ID: ${paymentId}`, 20, 50);
    doc.text(`Order ID: ${Math.random().toString(36).substr(2, 9)}`, 20, 60);

    // Add event details
    doc.autoTable({
      startY: 70,
      head: [["Item", "Details"]],
      body: [
        ["Event", event.title],
        ["Date", new Date(event.date).toLocaleDateString()],
        ["Time", new Date(event.date).toLocaleTimeString()],
        ["Venue", event.venue || event.location],
        ["Price", event.price],
      ],
    });

    // Add total and payment status
    const finalY = doc.previousAutoTable.finalY + 10;
    doc.text("Payment Status: Paid", 20, finalY);
    doc.text(`Total Amount: ${event.price}`, 20, finalY + 10);

    // Add footer
    doc.setFontSize(10);
    doc.text("Thank you for your booking!", pageWidth / 2, finalY + 30, {
      align: "center",
    });

    // Save the PDF
    doc.save(`invoice-${paymentId}.pdf`);
  };

  const handlePayment = async (total) => {
    try {
      const onPaymentSuccess = (paymentId) => {
        generateInvoice(paymentId);
        setShowBookingModal(false);
      };

      await Razorpay(total, "userId", onPaymentSuccess);
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const basePrice = parseInt(event?.price?.replace(/[^0-9]/g, "") || 0);
  const subtotal = basePrice * ticketCount;
  const discount = isPromoApplied ? subtotal * 0.05 : 0; // 5% discount
  const total = subtotal - discount;

  const handlePromoCode = () => {
    if (promoCode.trim()) {
      setIsPromoApplied(true);
      // You can add more complex promo code validation logic here
    }
  };

  const renderPriceCalculator = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Booking Details</CardTitle>
        <CardDescription>Select tickets and apply promo code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Number of Tickets</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
            >
              -
            </Button>
            <span className="w-12 text-center">{ticketCount}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTicketCount(ticketCount + 1)}
            >
              +
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Promo Code</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={isPromoApplied}
            />
            <Button
              variant="secondary"
              onClick={handlePromoCode}
              disabled={isPromoApplied || !promoCode}
            >
              Apply
            </Button>
          </div>
          {isPromoApplied && (
            <p className="text-sm text-green-500">5% discount applied!</p>
          )}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {isPromoApplied && (
            <div className="flex justify-between text-sm text-green-500">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full h-12 text-lg"
          onClick={handlePayment}
          disabled={ticketCount < 1}
        >
          <Ticket className="mr-2 h-5 w-5" />
          Pay ₹{total}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Content */}
        <div className="glass-card rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Event Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {event.title}
                </h1>
                {event.comedian && (
                  <p className="text-xl text-primary">{event.comedian}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>
                    {new Date(event.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-primary font-semibold text-xl">
                  <Ticket className="h-5 w-5 mr-2" />
                  <span>{event.price}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  About the Event
                </h3>
                <p className="text-muted-foreground">
                  {event.description ||
                    "Join us for an amazing evening of entertainment!"}
                </p>
              </div>
            </div>

            {/* Right Column - Image and Actions */}
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden shadow-lg">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-[400px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[400px] bg-card flex items-center justify-center">
                    <span className="text-muted-foreground">
                      No image available
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full h-12 text-lg"
                  onClick={() => setShowBookingModal(true)}
                >
                  <Ticket className="mr-2 h-5 w-5" />
                  Book Now
                </Button>

                <BookingModal
                  isOpen={showBookingModal}
                  onClose={() => setShowBookingModal(false)}
                  event={event}
                  onPayment={handlePayment}
                />

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-12">
                    <Heart className="mr-2 h-5 w-5" />
                    Wishlist
                  </Button>
                </div>
                {/* Share Options */}
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Share this event:
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleShare("whatsapp")}
                      className="p-2 hover:bg-accent/10 rounded-full"
                    >
                      <img
                        src="/whatsapp.svg"
                        alt="WhatsApp"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      onClick={() => handleShare("instagram")}
                      className="p-2 hover:bg-accent/10 rounded-full"
                    >
                      <Instagram className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="p-2 hover:bg-accent/10 rounded-full"
                    >
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="p-2 hover:bg-accent/10 rounded-full"
                    >
                      <Twitter className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Artist Details */}
          <div className="glass-card rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <User className="h-6 w-6" />
              About the Artist
            </h2>
            <p className="text-muted-foreground">{artistDetails.bio}</p>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Achievements</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {artistDetails.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <a
                href={artistDetails.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-accent"
              >
                <Instagram className="h-6 w-6" />
              </a>
              {/* Add more social media links as needed */}
            </div>
          </div>

          {/* Venue Details */}
          <div className="glass-card rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              About the Venue
            </h2>
            <p className="text-muted-foreground">{venueDetails.description}</p>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Amenities</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {venueDetails.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
            <div className="text-muted-foreground">
              <p className="font-semibold">Address:</p>
              <p>{venueDetails.address}</p>
            </div>
          </div>
        </div>

        {/* Genre Information */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center gap-2 text-primary">
            <Tags className="h-5 w-5" />
            <span className="font-semibold">Genre:</span>
            <span>{event.genre || "Stand-up Comedy"}</span>
          </div>
        </div>

        {/* Map Section - Moved to bottom */}
        <div className="glass-card rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Venue Location
          </h2>
          <div className="rounded-lg overflow-hidden h-[400px] shadow-lg">
            <iframe
              width="100%"
              height="100%"
              id="gmap_canvas"
              src={mapSrc}
              frameBorder="0"
              scrolling="no"
              title="Event Location Map"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
