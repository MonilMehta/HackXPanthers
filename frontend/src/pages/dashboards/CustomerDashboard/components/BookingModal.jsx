import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Ticket, Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateInvoice } from "@/utils/generateInvoice";

const BookingModal = ({ isOpen, onClose, event, onPayment }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const basePrice = parseInt(event?.price?.replace(/[^0-9]/g, "") || 0);
  const subtotal = basePrice * ticketCount;
  const discount = isPromoApplied ? subtotal * 0.05 : 0;
  const total = subtotal - discount;

  const handlePayment = () => {
    onPayment(total).then((paymentId) => {
      // Generate invoice with all details
      generateInvoice({
        paymentId,
        event,
        ticketCount,
        basePrice,
        subtotal,
        discount,
        total,
        customerDetails: {
          name: "John Doe", // Replace with actual user details
          email: "john@example.com",
        },
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy Tickets</DialogTitle>
          <DialogDescription>
            {event.title} - {event.location}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Ticket Counter */}
          <div className="space-y-2">
            <Label>Number of Tickets</Label>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center text-lg font-medium">
                {ticketCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTicketCount(ticketCount + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Promo Code */}
          <div className="space-y-2">
            <Label>Promo Code (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={isPromoApplied}
              />
              <Button
                variant="secondary"
                disabled={!promoCode || isPromoApplied}
                onClick={() => setIsPromoApplied(true)}
              >
                Apply
              </Button>
            </div>
          </div>

          {isPromoApplied && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                5% discount applied successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Price Summary */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price per ticket</span>
              <span>₹{basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal ({ticketCount} tickets)
              </span>
              <span>₹{subtotal}</span>
            </div>
            {isPromoApplied && (
              <div className="flex justify-between text-green-500">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handlePayment}>
            Proceed to Pay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
