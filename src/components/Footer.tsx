import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTicketAlt,
  FaTwitter,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

const footerLinks = {
  Explore: ["Events", "Concerts", "Standup", "Workshops"],
  Company: ["About us", "Careers", "Partner with us", "Contact"],
  Support: ["Help center", "Terms", "Privacy", "Refund policy"],
};

function Footer() {
  return (
    <footer className="border-t border-seat-gray1 bg-white font-inter text-text">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.35fr_repeat(3,1fr)] lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-[0_14px_30px_rgba(124,58,237,0.22)]">
              <FaTicketAlt />
            </span>
            <span className="font-space-grotesk text-xl font-bold tracking-normal">
              SortMyScene
            </span>
          </Link>

          <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-text/60">
            Discover live shows, community events, workshops, and weekend plans
            from one simple place.
          </p>

          <div className="mt-5 flex gap-3">
            {[FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn].map(
              (SocialIcon, index) => (
                <a
                  aria-label={`Social media link ${index + 1}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-seat-gray1 text-text/65 transition hover:border-primary hover:bg-primary hover:text-white"
                  href="#"
                  key={index}
                >
                  <SocialIcon />
                </a>
              ),
            )}
          </div>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h3 className="font-space-grotesk text-lg font-bold tracking-normal">
              {title}
            </h3>
            <div className="mt-4 grid gap-3">
              {links.map((link) => (
                <a
                  className="text-sm font-semibold text-text/58 transition hover:text-primary"
                  href="#"
                  key={link}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-seat-gray1">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm font-semibold text-text/58 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="grid gap-3 sm:grid-cols-3 lg:flex lg:items-center lg:gap-6">
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" />
              Pune, Maharashtra
            </span>
            <span className="flex items-center gap-2">
              <FaPhoneAlt className="text-primary" />
              +91 98765 43210
            </span>
            <span className="flex items-center gap-2">
              <FiMail className="text-primary" />
              hello@sortmyscene.com
            </span>
          </div>
          <p>2026 SortMyScene. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
