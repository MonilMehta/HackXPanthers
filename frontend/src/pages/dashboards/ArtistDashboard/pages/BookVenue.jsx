import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Users,
  Star,
  CalendarIcon,
  Clock,
  Info,
} from "lucide-react";

const timeSlots = [
  { value: "18:00", label: "6:00 PM" },
  { value: "18:30", label: "6:30 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "19:30", label: "7:30 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "20:30", label: "8:30 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "21:30", label: "9:30 PM" },
];

const BookVenue = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const venueData = location.state?.venueData;
  const [date, setDate] = useState();
  const [showTime, setShowTime] = useState("");
  const [duration, setDuration] = useState("");
  const [expectedAudience, setExpectedAudience] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  if (!venueData) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">No Venue Selected</h2>
            <p className="text-muted-foreground">
              Please select a venue from the venues page.
            </p>
            <Button onClick={() => navigate("/artist/venues")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Venues
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle booking submission
    console.log({
      venue: venueData,
      bookingDetails: {
        date,
        showTime,
        duration,
        expectedAudience,
        additionalNotes,
      },
    });
  };

  return (
    <div className="p-8">
      <Card className="p-6">
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/artist/venues")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">Book Venue: {venueData.name}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Venue Details */}
            <div className="space-y-6">
              {/* Venue Image and Basic Info */}
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={venueData.image}
                  alt={venueData.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2">
                  {venueData.type}
                </Badge>
              </div>

              {/* Venue Stats and Info */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="font-medium">{venueData.capacity}</p>
                    <p className="text-xs text-muted-foreground">Capacity</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <Star className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="font-medium">{venueData.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="font-medium">{venueData.shows}+</p>
                    <p className="text-xs text-muted-foreground">Shows</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Location</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {venueData.location}
                  </p>
                </div>

                {venueData.amenities && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {venueData.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium">Price</h4>
                  <p className="text-2xl font-bold text-primary">
                    {venueData.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div>
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6">
                    {/* Date and Time Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Date & Time</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Date Picker */}
                        <div className="space-y-2">
                          <Label>Show Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-background border",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-background border"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                                className="bg-background rounded-md border"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Show Time */}
                        <div className="space-y-2">
                          <Label>Show Time</Label>
                          <Select value={showTime} onValueChange={setShowTime}>
                            <SelectTrigger className="bg-background border">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border max-h-[200px]">
                              {timeSlots.map((slot) => (
                                <SelectItem
                                  key={slot.value}
                                  value={slot.value}
                                  className="cursor-pointer hover:bg-muted"
                                >
                                  {slot.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Show Details Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Show Details</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Duration (hours)</Label>
                          <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger className="bg-background border">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent className="bg-background">
                              {["1", "1.5", "2", "2.5", "3"].map((dur) => (
                                <SelectItem key={dur} value={dur}>
                                  {dur} hours
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Expected Audience</Label>
                          <Input
                            type="number"
                            value={expectedAudience}
                            onChange={(e) =>
                              setExpectedAudience(e.target.value)
                            }
                            placeholder="Enter number of people"
                            className="bg-background border"
                            min="1"
                            max={venueData.capacity}
                          />
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Info className="h-3 w-3" /> Maximum capacity:{" "}
                            {venueData.capacity}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <Label>Additional Notes</Label>
                      <Textarea
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="Any special requirements or notes..."
                        className="min-h-[100px] bg-background border resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        !date || !showTime || !duration || !expectedAudience
                      }
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookVenue;
