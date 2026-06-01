import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "lg",
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full ${sizeMap[size]} max-h-[90vh] overflow-y-auto rounded-3xl border border-orange-200/30 bg-gradient-to-br from-slate-50 to-orange-50 shadow-2xl`}
            >
              <div className="sticky top-0 border-b border-orange-200/30 bg-white/95 backdrop-blur-sm p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                    {subtitle && (
                      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-all hover:bg-slate-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
