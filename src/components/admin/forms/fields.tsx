import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const inputClasses =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text outline-none transition-colors duration-200 focus:border-primary";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  hint?: string;
  /** Applied to the outer wrapping div — use for layout (e.g. flex-1), not input styling. */
  wrapperClassName?: string;
}

function FieldLabel({ label, htmlFor, hint }: FieldWrapperProps) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-text">
      {label}
      {hint && <span className="ml-1.5 font-normal text-muted">{hint}</span>}
    </label>
  );
}

type TextFieldProps = FieldWrapperProps & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, htmlFor, hint, wrapperClassName = "", className = "", ...rest }: TextFieldProps) {
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      <FieldLabel label={label} htmlFor={htmlFor} hint={hint} />
      <input id={htmlFor} className={`${inputClasses} ${className}`} {...rest} />
    </div>
  );
}

type TextAreaFieldProps = FieldWrapperProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({
  label,
  htmlFor,
  hint,
  wrapperClassName = "",
  className = "",
  ...rest
}: TextAreaFieldProps) {
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      <FieldLabel label={label} htmlFor={htmlFor} hint={hint} />
      <textarea id={htmlFor} className={`${inputClasses} ${className}`} {...rest} />
    </div>
  );
}
