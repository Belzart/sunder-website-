export default function Footer() {
  return (
    <footer className="py-8 px-8 md:px-12 border-t border-white/5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[0.3em] text-white/15 uppercase">
          &copy; Sunder {new Date().getFullYear()}
        </span>
        <span className="text-[10px] tracking-[0.2em] text-white/10">
          Materials for the future
        </span>
      </div>
    </footer>
  );
}
