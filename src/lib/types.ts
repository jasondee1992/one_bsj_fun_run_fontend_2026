export type RaceCategory = "3K" | "5K" | "10K";

export type ShirtSize =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "2XL"
  | "3XL"
  | "4XL";

export type PaymentStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled"
  | "unknown";

export type SmsStatus =
  | "not_sent"
  | "queued"
  | "sent"
  | "failed"
  | "delivered"
  | "unknown";

export interface RegistrationPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix?: string;
  address: string;
  city?: string;
  province?: string;
  cellphone_number: string;
  email: string;
  birthday: string;
  sex: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  race_category: RaceCategory | "";
  shirt_size: ShirtSize | "";
  medical_conditions?: string;
  notes?: string;
  waiver_accepted: boolean;
  privacy_consent_accepted: boolean;
}

export interface PaymentDetails {
  id?: string | number;
  reference_number?: string;
  payment_reference?: string;
  provider?: string;
  provider_name?: string;
  provider_transaction_id?: string | null;
  amount?: number;
  currency?: string;
  status?: PaymentStatus | string;
  paid_at?: string;
  expires_at?: string;
  qr_code_url?: string | null;
  qr_code_payload?: string | null;
  payment_url?: string | null;
  provider_response_raw?: string | null;
  webhook_last_event?: string | null;
  webhook_last_event_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentSession {
  registration_id: string;
  participant_name: string;
  race_category: string;
  shirt_size: string;
  payment_reference: string;
  provider: string;
  payment_method: string;
  payment_status: PaymentStatus | string;
  amount: number;
  currency: string;
  qr_code_url?: string | null;
  qr_code_payload?: string | null;
  payment_url?: string | null;
  expires_at?: string | null;
  paid_at?: string | null;
  raw_response?: Record<string, unknown> | null;
  sms_status: string;
  webhook_last_event?: string | null;
  webhook_last_event_at?: string | null;
  bib_number?: string | null;
  is_confirmed: boolean;
}

export interface Registration extends RegistrationPayload {
  id?: string | number;
  registration_id?: string | number;
  registration_number?: string;
  reference_number?: string;
  payment_reference?: string;
  provider_transaction_id?: string | null;
  full_name?: string;
  payment_status?: PaymentStatus | string;
  status?: PaymentStatus | string;
  bib_number?: string | number | null;
  sms_confirmation_status?: SmsStatus | string | null;
  sms_sent?: boolean;
  sms_sent_at?: string | null;
  payment?: PaymentDetails | null;
  payment_details?: PaymentDetails | null;
  payments?: PaymentDetails[];
  created_at?: string;
  updated_at?: string;
  paid_at?: string | null;
}

export interface AdminSummary {
  total_registrations: number;
  total?: number;
  paid: number;
  pending: number;
  failed?: number;
  cancelled?: number;
}

export interface AdminLoginResponse {
  access_token?: string;
  token?: string;
  token_type?: string;
  admin?: {
    id?: string | number;
    username?: string;
    name?: string;
  };
}

export interface PaginatedRegistrations {
  items: Registration[];
  total: number;
  page: number;
  page_size: number;
}

export interface RegistrationFilters {
  search?: string;
  payment_status?: string;
  race_category?: string;
  page?: number;
  page_size?: number;
}

export interface ApiEnvelope<T> {
  data?: T;
  registration?: T;
  registrations?: T;
  item?: T;
  items?: T;
  message?: string;
}
