const footerLinks = ["About", "Games", "Privacy", "Contact"];

const languages = [
  { code: "EN", label: "English" },
  { code: "RU", label: "Русский" },
  { code: "UA", label: "Українська" },
];

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
              Classic browser games for everyday play.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <nav className="flex items-center gap-5 text-sm text-slate-500">
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
            <div className="flex items-center gap-3 pt-1 sm:pt-0 border-t border-slate-800 sm:border-t-0 sm:border-l sm:border-slate-800 sm:pl-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-150 first:text-slate-400"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
