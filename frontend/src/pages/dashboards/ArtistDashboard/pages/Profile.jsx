import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Instagram, Twitter, Youtube, Facebook } from "lucide-react";

const Profile = () => {
  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold">My Profile</h2>
          <p className="text-muted-foreground">Manage your artist profile</p>
        </div>

        <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2"
              >
                Change
              </Button>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Artist Name</h3>
              <p className="text-muted-foreground">Stand-up Comedian</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input defaultValue="John Doe" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stage Name</label>
                <Input defaultValue="Johnny D" className="bg-background/50" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                defaultValue="Stand-up comedian with 5 years of experience..."
                className="bg-background/50"
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Social Media Links</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-primary" />
                  <Input
                    placeholder="Instagram handle"
                    className="bg-background/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-5 w-5 text-primary" />
                  <Input
                    placeholder="Twitter handle"
                    className="bg-background/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-primary" />
                  <Input
                    placeholder="YouTube channel"
                    className="bg-background/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-primary" />
                  <Input
                    placeholder="Facebook page"
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Profile;
