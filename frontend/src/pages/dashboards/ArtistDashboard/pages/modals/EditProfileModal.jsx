import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Camera,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Edit,
} from "lucide-react";

const EditProfileModal = ({ user, onSave }) => {
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.avatar);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      stageName: formData.get("stageName"),
      bio: formData.get("bio"),
      avatar: previewImage,
      socials: {
        instagram: formData.get("socials.instagram"),
        twitter: formData.get("socials.twitter"),
        youtube: formData.get("socials.youtube"),
        facebook: formData.get("socials.facebook"),
      },
    };
    onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Edit className="h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto pr-4 -mr-4"
        >
          <div className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  name="avatar"
                  className="hidden"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </label>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Profile Photo</h4>
                <p className="text-sm text-muted-foreground">
                  Upload a new profile picture
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={user?.name}
                    className="bg-background"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stageName">Stage Name</Label>
                  <Input
                    id="stageName"
                    name="stageName"
                    defaultValue={user?.stageName}
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  defaultValue={user?.bio}
                  className="bg-background min-h-[100px]"
                  rows={4}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <Label>Social Media Links</Label>
              {[
                {
                  icon: Instagram,
                  id: "instagram",
                  placeholder: "Instagram username",
                },
                { icon: Twitter, id: "twitter", placeholder: "Twitter handle" },
                {
                  icon: Youtube,
                  id: "youtube",
                  placeholder: "YouTube channel",
                },
                {
                  icon: Facebook,
                  id: "facebook",
                  placeholder: "Facebook profile",
                },
              ].map((social) => (
                <div
                  key={social.id}
                  className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50 focus-within:ring-1 focus-within:ring-primary"
                >
                  <social.icon className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id={social.id}
                    name={`socials.${social.id}`}
                    className="border-0 bg-transparent focus-visible:ring-0 px-0"
                    placeholder={social.placeholder}
                    defaultValue={user?.socials?.[social.id]}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons - Fixed at bottom */}
          <div className="sticky bottom-0 pt-6 pb-2 bg-background flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
