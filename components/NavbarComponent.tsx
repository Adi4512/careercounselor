"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function NavbarComponent() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    console.log('Google sign in clicked');
    setIsSigningIn(true);
    try {
      const result = await signIn('google', { 
        callbackUrl: '/chat',
        redirect: false 
      });
      
      console.log('Sign in result:', result);
      
      if (result?.ok) {
        console.log('Sign in successful, redirecting to chat');
        // Redirect to chat page after successful sign in
        window.location.href = '/chat';
      } else {
        console.error('Sign in failed:', result?.error);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    console.log('Sign out clicked');
    await signOut({ callbackUrl: '/' });
  };

  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Pricing",
      link: "/pricing",
    },
    {
      name: "About",
      link: "/about",
    },  
    {
      name: "Testimonials",
      link: "/testimonials",
    }
  ];

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {session ? (
              <NavbarButton 
                as="button" 
                variant="secondary" 
                onClick={handleSignOut}
              >
                Sign Out
              </NavbarButton>
            ) : (
              <NavbarButton 
                as="button" 
                variant="primary" 
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                data-signin-button
              >
                {isSigningIn ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Sign In"
                )}
              </NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-white hover:text-gray-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              {session ? (
                <NavbarButton 
                  as="button" 
                  variant="secondary" 
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Sign Out
                </NavbarButton>
              ) : (
                <NavbarButton 
                  as="button" 
                  variant="primary" 
                  onClick={() => {
                    handleGoogleSignIn();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isSigningIn}
                  className="w-full"
                >
                  {isSigningIn ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Sign In"
                  )}
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
     

      {/* Navbar */}
    </div>
  );
}

