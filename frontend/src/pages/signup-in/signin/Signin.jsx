import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthLayout from "../AuthLayout";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const Signin = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(() => {
    // Initialize userType from localStorage if exists
    return localStorage.getItem("userRole") || "";
  });
  const [formState, setFormState] = useState(() => {
    // Initialize form state from localStorage if exists
    const savedFormState = localStorage.getItem("formState");
    return savedFormState
      ? JSON.parse(savedFormState)
      : {
          email: "",
          password: "",
          adminKey: "",
          venueId: "",
          artistId: "",
          userType: "",
        };
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUserTypeChange = (value) => {
    setUserType(value);
    // Save to localStorage
    localStorage.setItem("userRole", value);
    // Update form state
    const newFormState = {
      ...formState,
      userType: value,
    };
    setFormState(newFormState);
    localStorage.setItem("formState", JSON.stringify(newFormState));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormState = {
      ...formState,
      [name]: value,
    };
    setFormState(newFormState);
    localStorage.setItem("formState", JSON.stringify(newFormState));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (userType) {
        // Clear storage after successful login if needed
        // localStorage.removeItem("userRole");
        // localStorage.removeItem("formState");
        navigate(`/${userType.toLowerCase()}`);
      }
    }, 1500);
  };

  return (
    <AuthLayout>
      <PageTransition>
        <Card className="border-none shadow-none card-glass">
          <CardHeader className="space-y-1">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-2xl text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Sign in to your comedy platform account
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-2">
                <Label>User Type</Label>
                <Select
                  onValueChange={handleUserTypeChange}
                  value={userType}
                  required
                >
                  <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-background/60 transition-colors">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-primary/20">
                    <SelectItem value="ADMIN" className="hover:bg-primary/10">
                      Administrator
                    </SelectItem>
                    <SelectItem value="VENUE" className="hover:bg-primary/10">
                      Venue Manager
                    </SelectItem>
                    <SelectItem value="ARTIST" className="hover:bg-primary/10">
                      Artist/Comedian
                    </SelectItem>
                    <SelectItem
                      value="CUSTOMER"
                      className="hover:bg-primary/10"
                    >
                      Customer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                  className="bg-background/50 backdrop-blur-sm border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={formState.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="bg-background/50 backdrop-blur-sm border-primary/20"
                />
              </div>

              {userType && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {userType === "ADMIN" && (
                    <div className="space-y-2">
                      <Label>Admin Key</Label>
                      <Input
                        type="text"
                        name="adminKey"
                        value={formState.adminKey}
                        onChange={handleInputChange}
                        placeholder="Enter admin key"
                        className="bg-background/50 backdrop-blur-sm border-primary/20"
                      />
                    </div>
                  )}
                  {userType === "VENUE" && (
                    <div className="space-y-2">
                      <Label>Venue ID</Label>
                      <Input
                        type="text"
                        name="venueId"
                        value={formState.venueId}
                        onChange={handleInputChange}
                        placeholder="Enter venue ID"
                        className="bg-background/50 backdrop-blur-sm border-primary/20"
                      />
                    </div>
                  )}
                  {userType === "ARTIST" && (
                    <div className="space-y-2">
                      <Label>Artist ID</Label>
                      <Input
                        type="text"
                        name="artistId"
                        value={formState.artistId}
                        onChange={handleInputChange}
                        placeholder="Enter artist ID"
                        className="bg-background/50 backdrop-blur-sm border-primary/20"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Signing in...
                  </motion.div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-muted-foreground text-center"
            >
              New to ComedyConnect?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </PageTransition>
    </AuthLayout>
  );
};

export default Signin;
