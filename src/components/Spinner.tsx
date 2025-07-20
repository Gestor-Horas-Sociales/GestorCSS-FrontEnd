import { createPortal } from "react-dom";

const Spinner = () =>
  createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[60]">
      <div className="w-7 h-7 border-[3px] border-transparent border-t-primary rounded-full animate-spin" />
    </div>,
    document.body
  );

export default Spinner;
