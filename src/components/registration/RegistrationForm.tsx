"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import { registrationIdOf } from "@/lib/format";
import type { RaceCategory, RegistrationPayload, ShirtSize } from "@/lib/types";
import {
  hasErrors,
  validateRegistrationForm,
  type RegistrationFormErrors,
} from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/Field";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Message } from "@/components/ui/Message";

const raceCategories: RaceCategory[] = ["3K", "5K", "10K"];
const shirtSizes: ShirtSize[] = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const initialValues: RegistrationPayload = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  address: "",
  city: "",
  province: "",
  cellphone_number: "",
  email: "",
  birthday: "",
  sex: "",
  emergency_contact_name: "",
  emergency_contact_number: "",
  race_category: "",
  shirt_size: "",
  medical_conditions: "",
  notes: "",
  waiver_accepted: false,
  privacy_consent_accepted: false,
};

export function RegistrationForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateValue<K extends keyof RegistrationPayload>(
    key: K,
    value: RegistrationPayload[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const nextErrors = validateRegistrationForm(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setMessage("Please review the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const registration = await api.createRegistration(values);
      const id = registrationIdOf(registration);

      if (!id) {
        throw new Error("Registration was created but no registration id was returned.");
      }

      router.push(`/payment/${id}`);
    } catch (error) {
      const errorMessage =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to submit registration. Please try again.";
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="form-card">
      <form onSubmit={onSubmit} noValidate>
        <div className="form-header">
          <div>
            <p className="eyebrow">Runner registration</p>
            <h1>Join the OneBSJ Fun Run</h1>
          </div>
          <p>
            Complete the required details below. Your slot is marked pending
            until payment is confirmed.
          </p>
        </div>

        {message ? (
          <Message tone="error" title="Registration not submitted">
            {message}
          </Message>
        ) : null}

        <div className="form-section">
          <div className="section-heading">
            <h2>Runner details</h2>
            <p>Use the same name and contact details you want on event records.</p>
          </div>
          <div className="field-grid three">
            <TextField
              label="First name"
              name="first_name"
              value={values.first_name}
              error={errors.first_name}
              required
              onChange={(event) => updateValue("first_name", event.target.value)}
            />
            <TextField
              label="Middle name"
              name="middle_name"
              value={values.middle_name}
              error={errors.middle_name}
              required
              onChange={(event) => updateValue("middle_name", event.target.value)}
            />
            <TextField
              label="Last name"
              name="last_name"
              value={values.last_name}
              error={errors.last_name}
              required
              onChange={(event) => updateValue("last_name", event.target.value)}
            />
            <TextField
              label="Suffix"
              name="suffix"
              value={values.suffix}
              onChange={(event) => updateValue("suffix", event.target.value)}
            />
            <TextField
              label="Birthday"
              type="date"
              name="birthday"
              value={values.birthday}
              error={errors.birthday}
              required
              onChange={(event) => updateValue("birthday", event.target.value)}
            />
            <SelectField
              label="Sex"
              name="sex"
              value={values.sex}
              error={errors.sex}
              required
              onChange={(event) => updateValue("sex", event.target.value)}
            >
              <option value="">Select sex</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </SelectField>
          </div>
        </div>

        <div className="form-section">
          <div className="section-heading">
            <h2>Contact information</h2>
            <p>We will use this for payment and event updates.</p>
          </div>
          <div className="field-grid two">
            <TextField
              label="Cellphone number"
              name="cellphone_number"
              inputMode="tel"
              placeholder="0917 123 4567"
              value={values.cellphone_number}
              error={errors.cellphone_number}
              required
              onChange={(event) => updateValue("cellphone_number", event.target.value)}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="runner@example.com"
              value={values.email}
              error={errors.email}
              required
              onChange={(event) => updateValue("email", event.target.value)}
            />
            <TextAreaField
              label="Address"
              name="address"
              value={values.address}
              error={errors.address}
              required
              onChange={(event) => updateValue("address", event.target.value)}
            />
            <div className="field-grid two compact">
              <TextField
                label="City"
                name="city"
                value={values.city}
                onChange={(event) => updateValue("city", event.target.value)}
              />
              <TextField
                label="Province"
                name="province"
                value={values.province}
                onChange={(event) => updateValue("province", event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-heading">
            <h2>Race selection</h2>
            <p>Select the distance and shirt size for this registration.</p>
          </div>
          <div className="field-grid two">
            <SelectField
              label="Race category"
              name="race_category"
              value={values.race_category}
              error={errors.race_category}
              required
              onChange={(event) =>
                updateValue("race_category", event.target.value as RaceCategory)
              }
            >
              <option value="">Select category</option>
              {raceCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Shirt size"
              name="shirt_size"
              value={values.shirt_size}
              error={errors.shirt_size}
              required
              onChange={(event) =>
                updateValue("shirt_size", event.target.value as ShirtSize)
              }
            >
              <option value="">Select shirt size</option>
              {shirtSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </SelectField>
          </div>
        </div>

        <div className="form-section">
          <div className="section-heading">
            <h2>Emergency and notes</h2>
            <p>Help organizers respond quickly if assistance is needed.</p>
          </div>
          <div className="field-grid two">
            <TextField
              label="Emergency contact name"
              name="emergency_contact_name"
              value={values.emergency_contact_name}
              error={errors.emergency_contact_name}
              required
              onChange={(event) =>
                updateValue("emergency_contact_name", event.target.value)
              }
            />
            <TextField
              label="Emergency contact number"
              name="emergency_contact_number"
              inputMode="tel"
              value={values.emergency_contact_number}
              error={errors.emergency_contact_number}
              required
              onChange={(event) =>
                updateValue("emergency_contact_number", event.target.value)
              }
            />
            <TextAreaField
              label="Medical conditions"
              name="medical_conditions"
              value={values.medical_conditions}
              onChange={(event) =>
                updateValue("medical_conditions", event.target.value)
              }
            />
            <TextAreaField
              label="Notes"
              name="notes"
              value={values.notes}
              onChange={(event) => updateValue("notes", event.target.value)}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-heading">
            <h2>Agreements</h2>
            <p>These confirmations are required before submission.</p>
          </div>
          <div className="agreement-stack">
            <CheckboxField
              label="Waiver accepted"
              checked={values.waiver_accepted}
              error={errors.waiver_accepted}
              onChange={(event) =>
                updateValue("waiver_accepted", event.target.checked)
              }
            >
              <span>
                I confirm that I am fit to participate and accept the event
                waiver and organizer rules.
              </span>
            </CheckboxField>
            <CheckboxField
              label="Privacy consent accepted"
              checked={values.privacy_consent_accepted}
              error={errors.privacy_consent_accepted}
              onChange={(event) =>
                updateValue("privacy_consent_accepted", event.target.checked)
              }
            >
              <span>
                I consent to the processing of my registration data for event
                operations, payment confirmation, and runner updates.
              </span>
            </CheckboxField>
          </div>
        </div>

        <div className="form-actions">
          <p>
            Required fields are marked with <span className="required">*</span>.
          </p>
          <Button
            type="submit"
            isLoading={isSubmitting}
            icon={<ArrowRightIcon />}
          >
            Submit registration
          </Button>
        </div>
      </form>
    </Card>
  );
}
