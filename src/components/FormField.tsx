/**
 * Shared form field component used by both the homepage contact section
 * (NewPortfolioExperience) and the dedicated contact page (ContactForm).
 *
 * Supports both controlled (`value`/`onChange`) and uncontrolled (`defaultValue`)
 * modes. When uncontrolled, uses a `key` derived from `defaultValue` to allow
 * external prefill changes to take effect (React re-creates the input).
 */

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  /** Prefix for the HTML `id` attribute to avoid collisions across pages. */
  idPrefix?: string;
  /** Rows for textarea mode (defaults to 5). */
  rows?: number;
  /** HTML autocomplete attribute for form fields. */
  autoComplete?: string;
  /** Optional placeholder text. */
  placeholder?: string;
  /** Per-field validation error message rendered with aria-invalid/aria-describedby. */
  error?: string;
} & (
  | { defaultValue?: string; value?: never; onChange?: never }
  | { defaultValue?: never; value?: string; onChange?: (val: string) => void }
);

export function FormField({
  label,
  name,
  type = "text",
  required,
  textarea,
  idPrefix = "contact",
  rows = 5,
  defaultValue,
  value,
  onChange,
  autoComplete,
  placeholder,
  error,
}: FormFieldProps) {
  const id = `${idPrefix}-${name}`;
  const errorId = `${id}-error`;
  const className = `w-full rounded-lg border bg-background/60 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:bg-background ${
    error ? "border-destructive" : "border-border"
  }`;

  // In uncontrolled mode, re-key the element so React re-creates it when
  // `defaultValue` changes (e.g. intent prefill on the homepage).
  const inputKey =
    value === undefined ? `default-${defaultValue ?? ""}` : undefined;

  const ariaProps = error
    ? { "aria-invalid": true, "aria-describedby": errorId }
    : {};

  return (
    <div className="block text-left">
      <label htmlFor={id}>
        <span className="mb-1.5 block text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {label}
          {required ? " *" : ""}
        </span>
        {textarea ? (
          <textarea
            key={inputKey}
            id={id}
            name={name}
            required={required}
            rows={rows}
            maxLength={5000}
            className={className}
            placeholder={placeholder}
            {...ariaProps}
            {...(value !== undefined ? { value } : { defaultValue })}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          />
        ) : (
          <input
            key={inputKey}
            id={id}
            name={name}
            type={type}
            required={required}
            maxLength={name === "subject" ? 300 : 200}
            className={className}
            autoComplete={autoComplete}
            placeholder={placeholder}
            {...ariaProps}
            {...(value !== undefined ? { value } : { defaultValue })}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          />
        )}
      </label>
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
