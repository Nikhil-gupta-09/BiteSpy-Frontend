export default function Footer() {
  return (
    <footer className="
      bg-gradient-to-br from-[#0a1945] via-[#02081f] to-[#0a1945]
      px-6 py-4 
      border-t border-blue-900/40
      text-sm text-blue-200/80
    ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        
        {/* LEFT: Branding & Copyright */}
        <div className="flex flex-col gap-2 md:w-1/3">
          <span className="font-semibold text-white tracking-wide text-lg">BiteSpy</span>
          <span className="text-blue-200/60 text-xs">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        {/* MIDDLE: Features */}
        <div className="flex flex-col gap-2 md:w-1/3 text-sm">
          <span className="font-medium text-white mb-1">Features</span>
          <span className="hover:text-white cursor-pointer transition text-blue-200/60">News</span>
          <span className="hover:text-white cursor-pointer transition text-blue-200/60">Searched product</span>
          <span className="hover:text-white cursor-pointer transition text-blue-200/60">Community</span>
        </div>

        {/* RIGHT: Support Us */}
        <div className="flex flex-col gap-2 md:w-1/3 text-sm md:items-end">
          <span className="font-medium text-white mb-1">Support Us</span>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              placeholder="Your email"
              className="
                w-full md:w-48 px-3 py-2 rounded-lg
                bg-white/5 border border-white/10
                text-white placeholder-blue-200/40
                focus:outline-none focus:border-white/20
              "
            />
            <button className="
              px-4 py-2 rounded-lg font-medium
              bg-blue-600 text-white
              border border-blue-500/30
              hover:bg-blue-500
              transition
            ">
              Join
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}