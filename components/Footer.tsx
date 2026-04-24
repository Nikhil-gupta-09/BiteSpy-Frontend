export default function Footer() {
  return (
    <footer
      className="px-6 py-10 text-sm text-blue-100/75"
      style={{
        background: "linear-gradient(135deg, #081427 0%, #0a1c3d 50%, #081427 100%)",
        borderTop: "1px solid rgba(59, 130, 246, 0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">

        {/* LEFT: Branding & Copyright */}
        <div className="flex flex-col gap-2 md:w-1/3">
          <span className="font-bold text-white tracking-wide text-lg
            bg-gradient-to-r from-blue-300 to-sky-300 bg-clip-text text-transparent">
            BiteSpy
          </span>
          <span className="text-blue-200/50 text-xs">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        {/* MIDDLE: Features */}
        <div className="flex flex-col gap-2 md:w-1/3 text-sm">
          <span className="font-semibold text-white mb-1">Features</span>
          <span className="hover:text-sky-300 cursor-pointer transition text-blue-100/55">News</span>
          <span className="hover:text-sky-300 cursor-pointer transition text-blue-100/55">Searched product</span>
          <span className="hover:text-sky-300 cursor-pointer transition text-blue-100/55">Community</span>
        </div>

        {/* RIGHT: Support Us */}
        <div className="flex flex-col gap-2 md:w-1/3 text-sm md:items-end">
          <span className="font-semibold text-white mb-1">Support Us</span>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              placeholder="Your email"
              className="
                w-full md:w-48 px-3 py-2 rounded-lg
                bg-white/6 border border-white/12
                text-white placeholder-blue-200/40
                focus:outline-none focus:border-blue-400/40
                transition-colors duration-200
              "
            />
            <button className="
              px-4 py-2 rounded-lg font-semibold
              bg-gradient-to-r from-blue-600 to-blue-500 text-white
              border border-blue-500/30
              hover:from-blue-500 hover:to-sky-500
              transition shadow-md shadow-blue-900/30
            ">
              Join
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}