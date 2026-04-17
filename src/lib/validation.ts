import type { RegistrationPayload } from "@/lib/types";

export type RegistrationFormErrors = Partial<
  Record<keyof RegistrationPayload, string>
>;

const requiredFields: Array<keyof RegistrationPayload> = [
  "first_name",
  "middle_name",
  "last_name",
  "address",
  "cellphone_number",
  "email",
  "birthday",
  "sex",
  "emergency_contact_name",
  "emergency_contact_number",
  "race_category",
  "shirt_size",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()0-9\-\s]{7,20}$/;

function countDigits(value: string) {
  return value.replace(/\D/g, "").length;
}

export function validateRegistrationForm(values: RegistrationPayload) {
  const errors: RegistrationFormErrors = {};

  requiredFields.forEach((field) => {
    if (!String(values[field] ?? "").trim()) {
      errors[field] = "This field is required.";
    }
  });

  if (values.email && !emailPattern.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (
    values.cellphone_number &&
    (!phonePattern.test(values.cellphone_number) ||
      countDigits(values.cellphone_number) < 10)
  ) {
    errors.cellphone_number = "Enter a valid cellphone number.";
  }

  if (
    values.emergency_contact_number &&
    (!phonePattern.test(values.emergency_contact_number) ||
      countDigits(values.emergency_contact_number) < 10)
  ) {
    errors.emergency_contact_number = "Enter a valid emergency contact number.";
  }

  if (values.birthday) {
    const birthday = new Date(values.birthday);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(birthday.getTime()) || birthday >= today) {
      errors.birthday = "Enter a valid birthday in the past.";
    }
  }

  if (!values.waiver_accepted) {
    errors.waiver_accepted = "You must accept the event waiver.";
  }

  if (!values.privacy_consent_accepted) {
    errors.privacy_consent_accepted = "You must consent to data processing.";
  }

  return errors;
}

export function hasErrors(errors: RegistrationFormErrors) {
  return Object.values(errors).some(Boolean);
}
