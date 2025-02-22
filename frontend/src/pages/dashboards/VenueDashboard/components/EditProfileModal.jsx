import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, Upload } from "lucide-react";
import AWSHelper from '@/utils/awsHelper';

const EditProfileModal = ({ isOpen, onClose, managerData, onUpdate, imagePreview, onImageUpload }) => {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await AWSHelper.upload(file, managerData.name.replace(/\s+/g, '-').toLowerCase());
        onUpdate({ ...managerData, profileImage: url });
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 cursor-pointer relative group">
              <AvatarImage src={managerData.profileImage} />
              <AvatarFallback>{managerData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              <input
                type="file"
                className="hidden"
                id="avatar-upload"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </Avatar>
            <label htmlFor="avatar-upload" className="text-sm text-muted-foreground cursor-pointer hover:text-primary">
              Click to upload profile picture
            </label>
          </div>
          <Input
            placeholder="Name"
            value={managerData.name}
            onChange={(e) => onUpdate({ ...managerData, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={managerData.email}
            onChange={(e) => onUpdate({ ...managerData, email: e.target.value })}
          />
          <Button onClick={() => {
            onUpdate(managerData);
            onClose();
          }} className="w-full">
            <Check className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
