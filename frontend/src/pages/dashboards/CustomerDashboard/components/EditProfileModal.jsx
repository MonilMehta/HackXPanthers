"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AWSHelper from "@/utils/awsHelper";

const EditProfileModal = ({ isOpen, onClose, userData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || "",
    email: userData?.email || "",
    phone_no: userData?.phone_no || "",
    gender: userData?.gender || "",
    address: {
      street: userData?.address?.street || "",
      city: userData?.address?.city || "",
      state: userData?.address?.state || "",
      pincode: userData?.address?.pincode || "",
    },
    profile_image: userData?.profile_image || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update formData when userData changes
  useEffect(() => {
    setFormData({
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      phone_no: userData?.phone_no || "",
      gender: userData?.gender || "",
      address: {
        street: userData?.address?.street || "",
        city: userData?.address?.city || "",
        state: userData?.address?.state || "",
        pincode: userData?.address?.pincode || "",
      },
      profile_image: userData?.profile_image || "",
    });
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const url = await AWSHelper.upload(file, userData.username);
        // Update both local form data and parent component
        setFormData(prev => ({ ...prev, profile_image: url }));
        // Don't close the modal after image upload
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Failed to upload image");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Please login to continue");
        onClose();
        return;
      }

      console.log("Sending update data:", formData);

      const response = await axios.patch(
        "http://localhost:8000/api/users/update-details",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response.data);

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        if (onUpdateSuccess) {
          await onUpdateSuccess(response.data.data);
        }
        onClose();
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoading) onClose();
      }}
    >
      <DialogContent className="max-w-md mx-auto" aria-label="Edit profile form">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image upload uses handleImageUpload */}
          <div>
            <Label htmlFor="profile_image">Profile Image</Label>
            <Input
              id="profile_image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1"
            />
          </div>
          {/* Other fields */}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone_no">Phone Number</Label>
            <Input
              id="phone_no"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                handleInputChange({ target: { name: "gender", value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              name="address.street"
              placeholder="Street"
              value={formData.address.street}
              onChange={handleInputChange}
            />
            <Input
              name="address.city"
              placeholder="City"
              value={formData.address.city}
              onChange={handleInputChange}
            />
            <Input
              name="address.state"
              placeholder="State"
              value={formData.address.state}
              onChange={handleInputChange}
            />
            <Input
              name="address.pincode"
              placeholder="Pincode"
              value={formData.address.pincode}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
