const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="w-7 h-7 border-[3px] border-transparent border-t-primary rounded-full animate-spin" />
  </div>
);

export default Spinner;
