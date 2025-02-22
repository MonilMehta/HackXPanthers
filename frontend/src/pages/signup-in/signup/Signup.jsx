import React, { useState } from "react";
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
import { Link } from "react-router-dom";
import AuthLayout from "../AuthLayout";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import PageTransition from "@/components/PageTransition";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle signup success
    }, 1500);
  };

  return (
    <AuthLayout>
      <PageTransition>
        <Card className="auth-card">
          <CardHeader className="space-y-1">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-2xl text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Join the comedy community as a fan
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
              {step === 1 ? (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-foreground/70">Full Name</Label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      required
                      className="auth-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground/70">Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="auth-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground/70">Password</Label>
                    <Input
                      type="password"
                      placeholder="Create a strong password"
                      required
                      className="auth-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground/70">
                      Confirm Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      required
                      className="auth-input"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-foreground/70">Phone Number</Label>
                    <Input
                      type="tel"
                      placeholder="Your phone number"
                      required
                      className="auth-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground/70">Date of Birth</Label>
                    <Input type="date" required className="auth-input" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the Terms of Service and Privacy Policy
                    </Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Creating account...
                      </motion.div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-muted-foreground text-center"
            >
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </PageTransition>
    </AuthLayout>
  );
};

export default Signup;
