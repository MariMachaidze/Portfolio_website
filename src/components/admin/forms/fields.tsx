import { useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

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

interface DelimitedListFieldProps extends FieldWrapperProps {
  /** The parsed list — e.g. tech tags, bullet points. */
  value: string[];
  onChange: (items: string[]) => void;
  /** "," for a single-line comma-separated field, "\n" for one-per-line. */
  delimiter: "," | "\n";
  rows?: number;
}

function parseDelimited(text: string, delimiter: string): string[] {
  return text
    .split(delimiter)
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * A comma- or newline-separated list field that doesn't fight you while typing.
 *
 * A naive version of this (display = value.join(delimiter), parse on every
 * keystroke) breaks mid-type: typing a space or comma to start the next item
 * gets immediately stripped on the next render, because the just-typed
 * trailing delimiter/space has nothing after it yet, so parsing+rejoining
 * silently trims it away before you can type the next character. This keeps
 * its own draft text and only re-syncs from `value` when it changes for a
 * reason other than this field's own last edit (e.g. Discard changes).
 */
export function DelimitedListField({
  label,
  htmlFor,
  hint,
  wrapperClassName,
  value,
  onChange,
  delimiter,
  rows,
}: DelimitedListFieldProps) {
  const joined = delimiter === "\n" ? "\n" : ", ";
  const [text, setText] = useState(() => value.join(joined));
  const [lastEmitted, setLastEmitted] = useState(value);

  if (value !== lastEmitted) {
    setLastEmitted(value);
    setText(value.join(joined));
  }

  function handleChange(nextText: string) {
    setText(nextText);
    const parsed = parseDelimited(nextText, delimiter);
    setLastEmitted(parsed);
    onChange(parsed);
  }

  if (delimiter === "\n") {
    return (
      <TextAreaField
        label={label}
        htmlFor={htmlFor}
        hint={hint}
        wrapperClassName={wrapperClassName}
        rows={rows}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
      />
    );
  }

  return (
    <TextField
      label={label}
      htmlFor={htmlFor}
      hint={hint}
      wrapperClassName={wrapperClassName}
      value={text}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}
