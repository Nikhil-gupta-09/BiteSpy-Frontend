export default function Footer() {
  return (
    <footer className="
      px-6 md:px-12 py-16 
      border-t border-white/10
      text-sm text-slate-300
    ">
      <div className="max-w-[1300px] mx-auto grid lg:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h3 className="font-semibold text-white mb-3">BiteSpy</h3>
          <p className="text-slate-400">
            Helping you understand what’s really inside your food.
          </p>
        </div>

        {/* PRODUCT */}
        <div>
          <p className="font-medium text-white mb-3">Product</p>
          <p className="text-slate-400 hover:text-white cursor-pointer transition">
            Features
          </p>
        </div>

        {/* LEGAL */}
        <div>
          <p className="font-medium text-white mb-3">Legal</p>
          <p className="text-slate-400 hover:text-white cursor-pointer transition">
            Privacy Policy
          </p>
        </div>

        {/* NEWSLETTER */}
        <div>
          <p className="font-medium text-white mb-3">Stay updated</p>

          <div className="flex items-center gap-2">
            <input
              placeholder="Your email"
              className="
                w-full px-3 py-2 rounded-lg
                bg-white/5 border border-white/10
                text-white placeholder-slate-500
                focus:outline-none focus:border-white/20
              "
            />

            <button className="
              px-4 py-2 rounded-lg
              bg-[#0f172a] text-white
              border border-white/10
              hover:bg-[#1e293b]
              transition
            ">
              Join
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM LINE */}
      <div className="max-w-[1300px] mx-auto mt-12 pt-6 border-t border-white/5 text-slate-500 text-xs flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} BiteSpy</p>
        <p>Made for better food decisions</p>
      </div>
    </footer>
  );
}