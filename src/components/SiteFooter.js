const footerLinks = ["About", "Privacy", "Contact"];

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-10 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-white font-bold text-lg">
              Igra<span className="text-sky-400">Zone</span>
            </span>
            <p className="text-slate-500 text-sm mt-1">
              Klondike Solitaire — fast, clean, no clutter.
            </p>
          </div>
          <nav className="flex items-center gap-5 text-sm text-slate-500" aria-label="Footer">
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-slate-300 transition-colors duration-150"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
