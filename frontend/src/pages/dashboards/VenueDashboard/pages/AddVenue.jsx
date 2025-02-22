import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

const AddVenue = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Venue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Venue Name" required />
              <Input type="number" placeholder="Capacity" required />
            </div>
            
            <Textarea placeholder="Address" required className="min-h-[100px]" />
            <Textarea placeholder="Amenities" className="min-h-[100px]" />
            <Textarea placeholder="Description" className="min-h-[100px]" />
            
            <div className="space-y-4">
              <Button variant="secondary" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </Button>
              
              <Button className="w-full">Add Venue</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVenue;
