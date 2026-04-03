export default function Footer() {
  return (
    <footer className="px-16 py-16 border-t grid lg:grid-cols-4 gap-10 text-sm">
      <div>
        <h3 className="font-semibold mb-3">BiteSpy</h3>

        <p className="text-gray-500">Professional-grade food analysis.</p>
      </div>

      <div>
        <p className="font-medium mb-2">Product</p>

        <p className="text-gray-500">Features</p>
      </div>

      <div>
        <p className="font-medium mb-2">Legal</p>

        <p className="text-gray-500">Privacy Policy</p>
      </div>

      <div>
        <p className="font-medium mb-2">Newsletter</p>

        <input
          placeholder="Your email"
          className="border p-2 rounded-lg w-full"
        />
      </div>
    </footer>
  );
}
