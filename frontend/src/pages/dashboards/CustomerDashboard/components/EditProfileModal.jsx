import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'sonner';
import { updateDetails } from "@/api/user.api";
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

const EditProfileModal = ({ isOpen, onClose, userData, onUpdate = () => {} }) => {
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || "",
    phone_no: userData?.phone_no || "",
    age: userData?.age || "",
    gender: userData?.gender || "",
    address: {
      street: userData?.address?.street || "",
      city: userData?.address?.city || "",
      state: userData?.address?.state || "",
      pincode: userData?.address?.pincode || "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Please login to continue");
        onClose();
        return;
      }

      const response = await axios.patch(
        updateDetails,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.success) {
        onUpdate(response.data.data);
        toast.success("Profile updated successfully");
        onClose();
      } else {
        throw new Error(response.data?.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.message || "Error updating profile");
      if (error.response?.status === 401) {
        onClose();
        window.location.href = "/signin";
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile information here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Input
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              name="address.street"
              placeholder="Street"
              value={formData.address.street}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="address.city"
                placeholder="City"
                value={formData.address.city}
                onChange={handleChange}
              />
              <Input
                name="address.state"
                placeholder="State"
                value={formData.address.state}
                onChange={handleChange}
              />
            </div>
            <Input
              name="address.pincode"
              placeholder="Pincode"
              value={formData.address.pincode}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
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
