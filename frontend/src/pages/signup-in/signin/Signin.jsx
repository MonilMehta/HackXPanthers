import React, { useState } from "react";
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
  const [userType, setUserType] = useState("");
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    adminKey: "",
    venueId: "",
    artistId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (userType) {
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
                <Select onValueChange={setUserType} required>
                  <SelectTrigger className="bg-background/50 backdrop-blur-sm border-primary/20">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                    <SelectItem value="VENUE">Venue Manager</SelectItem>
                    <SelectItem value="ARTIST">Artist/Comedian</SelectItem>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-background/50 backdrop-blur-sm border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
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
