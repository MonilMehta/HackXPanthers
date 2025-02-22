import React from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Link as Lk } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="font-bold text-2xl">ComedyConnect</div>

          {/* Navigation Links */}
          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex space-x-6">
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="hover:text-primary transition-colors"
                  href="/"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Lk to="/signup">
              <Button variant="outline">Sign Up</Button>
            </Lk>
            <Lk to="signin">
              <Button variant="default">Sign In</Button>
            </Lk>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
