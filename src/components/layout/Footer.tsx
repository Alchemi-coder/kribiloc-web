'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#111315] text-gray-300 border-t border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image src="/logo-kribiloc.png" alt="KribiLoc" width={48} height={48} className="rounded-lg" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              La référence location à Kribi.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e4002b]" />
                100% Vérifié sur le terrain
              </span>
            </div>
          </div>

          {/* Column 2: PLATEFORME */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              PLATEFORME
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/locations"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Rechercher</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/inscription"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Publier une annonce</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#certification"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Certification</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#comment-ca-marche"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Comment ça marche</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: LÉGAL */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              LÉGAL
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/a-propos"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/conditions-utilisation"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-de-confidentialite"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/securite"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sécurité
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: CONTACT */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              CONTACT
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:nguiambamb06@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2.5"
                >
                  <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>nguiambamb06@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+237656169681"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2.5"
                >
                  <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>+237 656 169 681</span>
                </a>
              </li>
              <li className="text-gray-400 inline-flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                <span>Kribi, Cameroun</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 KribiLoc. Tous droits réservés.</p>

          <Link
            href="https://lvn-development.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white hover:opacity-80 transition-all duration-200"
          >
            <span>Développé par</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lvn-logo.png"
              alt="LVN Development"
              className="h-5 w-auto inline object-contain"
            />
            <span className="font-semibold text-gray-300 hover:text-white transition-colors">
              LVN Development SARL
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
