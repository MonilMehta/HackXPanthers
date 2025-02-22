import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import AuthLayout from "../AuthLayout";
import PageTransition from "@/components/PageTransition";

function StaffSignin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userType || !formData.email || !formData.password) return;

    setIsLoading(true);

    // Store role in localStorage with userRole key
    const roleMap = {
      venue: "VENUE",
      artist: "ARTIST",
      administrator: "ADMIN",
    };

    localStorage.setItem("userRole", roleMap[formData.userType]); // Using userRole consistently

    // Navigate based on role
    const routeMap = {
      venue: "/venue",
      artist: "/artist",
      administrator: "/admin",
    };

    setTimeout(() => {
      setIsLoading(false);
      navigate(routeMap[formData.userType]);
    }, 1500);
  };

  return (
    <AuthLayout>
      <PageTransition>
        <Card className="auth-card max-w-md w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Staff Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your staff account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Staff Type</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, userType: value }))
                  }
                >
                  <SelectTrigger className="bg-background border">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="venue">Venue Manager</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                    <SelectItem value="administrator">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="bg-background border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="bg-background border"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Need a staff account?{" "}
              <Link to="/staffsignup" className="text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </PageTransition>
    </AuthLayout>
  );
}

export default StaffSignin;
