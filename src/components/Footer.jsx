export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-12">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <div className="font-bold text-white">Christmas Wishes</div>
          <div className="text-sm opacity-80">Made with ❤️ — spread joy</div>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="text-sm hover:underline">
            Privacy
          </a>
          <a href="#" className="text-sm hover:underline">
            Terms
          </a>
          <a href="#" className="text-sm hover:underline">
            Contact
          </a>
        </div>

        <div className="text-sm opacity-80">© {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}
