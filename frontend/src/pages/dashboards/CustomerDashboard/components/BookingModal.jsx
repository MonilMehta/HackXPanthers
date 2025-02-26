import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BookingModal = ({
  isOpen,
  onClose,
  event,
  onSeatSelect,
  selectedSeats,
  onConfirm,
  price
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const handlePromoCode = () => {
    // For now, any non-empty code gives 5% discount
    if (promoCode.trim()) {
      setIsPromoApplied(true);
    }
  };

  const calculateDiscount = () => {
    return isPromoApplied ? price * selectedSeats.length * 0.05 : 0;
  };

  const calculateTotal = () => {
    return (price * selectedSeats.length) - calculateDiscount();
  };

  const renderSeatLayout = () => {
    const rows = ['A', 'B', 'C', 'D'];
    const seatsPerRow = 8;

    return (
      <div className="grid gap-4 mt-4">
        {rows.map((row) => (
          <div key={row} className="flex gap-2 justify-center">
            <span className="w-6 text-center">{row}</span>
            {Array.from({ length: seatsPerRow }, (_, i) => {
              const seatNumber = `${row}${i + 1}`;
              const isSelected = selectedSeats.includes(seatNumber);

              return (
                <button
                  key={seatNumber}
                  className={`w-8 h-8 rounded ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-secondary hover:bg-primary/50'
                  }`}
                  onClick={() => {
                    const newSelection = isSelected
                      ? selectedSeats.filter((seat) => seat !== seatNumber)
                      : [...selectedSeats, seatNumber];
                    onSeatSelect(newSelection);
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Seats</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Seat Layout */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-1/2 h-2 bg-gray-300 mx-auto mb-8">
                <p className="text-sm text-gray-500 pt-4">SCREEN</p>
              </div>
            </div>
            {renderSeatLayout()}
          </div>

          {/* Promo Code */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="promoCode">Promo Code</Label>
              <Input
                id="promoCode"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter Coupon Code"
                disabled={isPromoApplied}
              />
            </div>
            <Button
              className="mt-auto"
              variant="outline"
              onClick={handlePromoCode}
              disabled={isPromoApplied || !promoCode.trim()}
            >
              Apply
            </Button>
          </div>

          {/* Price Summary */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal ({selectedSeats.length} tickets)</span>
              <span>₹{price * selectedSeats.length}</span>
            </div>
            {isPromoApplied && (
              <div className="flex justify-between text-green-500">
                <span>Discount (5%)</span>
                <span>-₹{calculateDiscount()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Total Amount</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Selected Seats: {selectedSeats.join(", ")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(calculateTotal())}
              disabled={selectedSeats.length === 0}
            >
              Pay ₹{calculateTotal()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
