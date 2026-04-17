import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type BaseFieldProps = {
  label: string;
  error?: string;
  helper?: string;
  required?: boolean;
};

export function TextField({
  label,
  error,
  helper,
  required,
  id,
  ...props
}: BaseFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const fieldId = id ?? String(props.name);

  return (
    <label className="field" htmlFor={fieldId}>
      <span className="field-label">
        {label}
        {required ? <span className="required">*</span> : null}
      </span>
      <input id={fieldId} className={error ? "field-input has-error" : "field-input"} {...props} />
      {helper ? <span className="field-helper">{helper}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  error,
  helper,
  required,
  id,
  children,
  ...props
}: BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const fieldId = id ?? String(props.name);

  return (
    <label className="field" htmlFor={fieldId}>
      <span className="field-label">
        {label}
        {required ? <span className="required">*</span> : null}
      </span>
      <select
        id={fieldId}
        className={error ? "field-input has-error" : "field-input"}
        {...props}
      >
        {children}
      </select>
      {helper ? <span className="field-helper">{helper}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function TextAreaField({
  label,
  error,
  helper,
  required,
  id,
  ...props
}: BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const fieldId = id ?? String(props.name);

  return (
    <label className="field" htmlFor={fieldId}>
      <span className="field-label">
        {label}
        {required ? <span className="required">*</span> : null}
      </span>
      <textarea
        id={fieldId}
        className={error ? "field-input field-textarea has-error" : "field-input field-textarea"}
        {...props}
      />
      {helper ? <span className="field-helper">{helper}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function CheckboxField({
  label,
  error,
  children,
  ...props
}: {
  label: string;
  error?: string;
  children?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={error ? "checkbox-field has-error" : "checkbox-field"}>
      <input type="checkbox" {...props} />
      <span>
        <strong>{label}</strong>
        {children ? <span>{children}</span> : null}
        {error ? <em>{error}</em> : null}
      </span>
    </label>
  );
}
