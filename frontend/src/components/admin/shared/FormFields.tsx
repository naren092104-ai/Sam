import { InputHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

export function FormField({
  label,
  error,
  required,
  helperText,
  ...props
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-900">
        {label}
        {required && <span className="ml-1 text-orange-600">*</span>}
      </label>
      <input
        {...props}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
            : "border-orange-200/30 focus:border-orange-400 focus:ring-orange-400/20"
        }`}
      />
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormSelect({
  label,
  options,
  error,
  required,
  placeholder,
  ...props
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-900">
        {label}
        {required && <span className="ml-1 text-orange-600">*</span>}
      </label>
      <select
        {...props}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 transition-all focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
            : "border-orange-200/30 focus:border-orange-400 focus:ring-orange-400/20"
        }`}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}

interface FormTextareaProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
  rows?: number;
}

export function FormTextarea({
  label,
  error,
  required,
  rows = 4,
  ...props
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-900">
        {label}
        {required && <span className="ml-1 text-orange-600">*</span>}
      </label>
      <textarea
        rows={rows}
        {...(props as any)}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
            : "border-orange-200/30 focus:border-orange-400 focus:ring-orange-400/20"
        }`}
      />
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
