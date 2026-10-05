'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Shield, Info, PlusCircle, User, ChevronDown, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDemenagerOpen, setIsMobileDemenagerOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  // The header is sticky/fixed ONLY on the landing page ('/')
  // Everywhere else, it scrolls away naturally with the page
  const isLandingPage = pathname === '/';

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileDemenagerOpen(false);
    setIsMobileUserMenuOpen(false);
  };

  return (
    <header
      className={
        isLandingPage
          ? `fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
              isScrolled
                ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-3'
                : 'bg-transparent py-4 md:py-5'
            }`
          : 'relative z-50 w-full bg-white border-b border-gray-200 shadow-xs py-3 md:py-3.5'
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 md:h-14">
          
          {/* Logo — contained cleanly within header bar with no overflow */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo-kribiloc.png"
                alt="KribiLoc"
                width={44}
                height={44}
                className="w-10 h-10 md:w-11 md:h-11 object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            
            {/* Déménager Dropdown */}
            <div className="relative group">
              <button className="text-sm font-semibold text-gray-700 group-hover:text-[#e4002b] transition-colors flex items-center gap-1.5 py-2">
                Déménager
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              
              {/* Invisible hover bridge to prevent losing hover state */}
              <div className="absolute top-full left-0 w-full h-3 opacity-0"></div>

              <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-64 bg-white shadow-xl rounded-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100 z-50 overflow-hidden">
                <div className="p-3 flex flex-col">
                  <span className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Déménagement
                  </span>
                  <Link
                    href="/demenagement/organiser"
                    className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl transition-colors"
                  >
                    Organisez votre déménagement
                  </Link>
                  <Link
                    href="/demenagement/planifier"
                    className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl transition-colors"
                  >
                    Planifiez votre déménagement
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/locations"
              className="text-sm font-semibold text-gray-700 hover:text-[#e4002b] transition-colors"
            >
              Rechercher
            </Link>
            <Link
              href="/#comment-ca-marche"
              className="text-sm font-semibold text-gray-700 hover:text-[#e4002b] transition-colors"
            >
              Comment ça marche
            </Link>
            <Link
              href="/certification"
              className="text-sm font-semibold text-gray-700 hover:text-[#e4002b] transition-colors"
            >
              Certification
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/connexion"
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors px-4 py-2"
                >
                  Se connecter
                </Link>
                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center bg-[#e4002b] hover:bg-[#c20024] text-white text-sm font-medium rounded-full px-6 py-2.5 shadow-sm hover:shadow transition-all duration-200 active:scale-95"
                >
                  Publier gratuitement
                </Link>
              </>
            ) : (
                <>
                  <Link
                    href="/dashboard/owner/annonces/nouvelle"
                    className="hidden md:inline-flex items-center justify-center bg-[#e4002b] hover:bg-[#c5001f] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow hover:shadow-md"
                  >
                    Publier une annonce
                  </Link>
                  
                  {/* User Dropdown */}
                  <div className="relative group">
                    <button
                      className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full p-2.5 shadow-sm hover:shadow transition-all duration-200 active:scale-95"
                      title="Mon compte"
                    >
                      <User className="w-5 h-5" />
                    </button>
                    
                    <div className="absolute top-full right-0 w-full h-3 opacity-0"></div>
                    
                    <div className="absolute top-[calc(100%+0.5rem)] right-0 w-48 bg-white shadow-xl rounded-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50 overflow-hidden">
                      <div className="p-2 flex flex-col">
                        <Link href="/dashboard" className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl transition-colors">
                          Dashboard
                        </Link>
                        <Link href="/mon-espace" className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl transition-colors">
                          Mon Espace
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
              aria-hidden="true"
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white z-50 shadow-2xl flex flex-col md:hidden"
            >
              {/* Mobile Drawer Header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
                <Link
                  href="/"
                  className="flex items-center"
                  onClick={closeMobileMenu}
                >
                  <Image
                    src="/logo-kribiloc.png"
                    alt="KribiLoc"
                    width={40}
                    height={40}
                    className="w-9 h-9 object-contain rounded-lg"
                  />
                </Link>
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Drawer Links */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                <div className="flex flex-col space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-3">
                    Navigation
                  </span>
                  
                  {/* Menu Déménager (Mobile Accordion) */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setIsMobileDemenagerOpen(!isMobileDemenagerOpen)}
                      className="flex items-center justify-between px-3 py-3 rounded-xl text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-[#e4002b] transition-colors w-full"
                    >
                      <div className="flex items-center">
                        <Truck className="w-5 h-5 mr-3 text-gray-400" />
                        Déménager
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isMobileDemenagerOpen ? 'rotate-180 text-[#e4002b]' : 'text-gray-400'}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isMobileDemenagerOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden flex flex-col pl-11 pr-3 mt-1"
                        >
                          <div className="py-2 flex flex-col border-l-2 border-gray-100 pl-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2">
                              Déménagement
                            </span>
                            <Link
                              href="/demenagement/organiser"
                              onClick={closeMobileMenu}
                              className="py-2.5 text-sm font-medium text-gray-600 hover:text-[#e4002b]"
                            >
                              Organisez votre déménagement
                            </Link>
                            <Link
                              href="/demenagement/planifier"
                              onClick={closeMobileMenu}
                              className="py-2.5 text-sm font-medium text-gray-600 hover:text-[#e4002b]"
                            >
                              Planifiez votre déménagement
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    href="/locations"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-3 rounded-xl text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-[#e4002b] transition-colors"
                  >
                    <Search className="w-5 h-5 mr-3 text-gray-400" />
                    Rechercher
                  </Link>
                  <Link
                    href="/#comment-ca-marche"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-3 rounded-xl text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-[#e4002b] transition-colors"
                  >
                    <Info className="w-5 h-5 mr-3 text-gray-400" />
                    Comment ça marche
                  </Link>
                  <Link
                    href="/certification"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-3 rounded-xl text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-[#e4002b] transition-colors"
                  >
                    <Shield className="w-5 h-5 mr-3 text-gray-400" />
                    Certification
                  </Link>
                </div>

                <hr className="border-gray-100" />

                {/* Actions de pied de menu */}
                <div className="flex flex-col space-y-4 pt-2">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        href="/connexion"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-center w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-xl text-base font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Se connecter
                      </Link>
                      <Link
                        href="/inscription"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-center w-full px-4 py-3.5 bg-[#e4002b] text-white rounded-xl text-base font-semibold shadow-sm active:scale-95 transition-all"
                      >
                        Publier une annonce
                      </Link>
                    </>
                  ) : (
                      <>
                        <Link
                          href="/dashboard/owner/annonces/nouvelle"
                          onClick={closeMobileMenu}
                          className="flex items-center justify-center w-full px-4 py-3 bg-[#e4002b] text-white rounded-xl text-base font-semibold shadow-md hover:bg-[#c5001f] hover:shadow-lg transition-all"
                        >
                          <PlusCircle className="w-5 h-5 mr-2" />
                          Publier une annonce
                        </Link>
                        
                        {/* User Menu Mobile Accordion */}
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
                            className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-xl text-base font-semibold hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <User className="w-5 h-5 mr-2 text-gray-400" />
                              Mon Compte
                            </div>
                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isMobileUserMenuOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isMobileUserMenuOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden flex flex-col pl-4 pr-3 mt-1 space-y-1"
                              >
                                <Link
                                  href="/dashboard"
                                  onClick={closeMobileMenu}
                                  className="py-2.5 px-3 rounded-lg text-sm font-medium text-gray-600 hover:text-[#e4002b] hover:bg-gray-100"
                                >
                                  Dashboard
                                </Link>
                                <Link
                                  href="/mon-espace"
                                  onClick={closeMobileMenu}
                                  className="py-2.5 px-3 rounded-lg text-sm font-medium text-gray-600 hover:text-[#e4002b] hover:bg-gray-100"
                                >
                                  Mon Espace
                                </Link>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
