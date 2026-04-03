export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-16 py-6">
      <h1 className="font-semibold text-lg">BiteSpy</h1>

      <div className="flex gap-10 text-sm">
        <a className="hover:text-emerald-700">Platform</a>

        <a className="hover:text-emerald-700">Solutions</a>

        <a className="hover:text-emerald-700">Case Studies</a>

        <a className="hover:text-emerald-700">Pricing</a>
      </div>

      <button className="bg-emerald-900 text-white px-5 py-2 rounded-lg text-sm">
        Get Started
      </button>
    </nav>
  );
}
