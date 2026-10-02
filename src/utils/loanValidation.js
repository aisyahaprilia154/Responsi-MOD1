import { HttpError } from "./httpError.js";

export const LOAN_STATUSES = ["Dipinjam", "Dikembalikan", "Terlambat"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const allowedFields = [
  "member_name",
  "member_email",
  "book_title",
  "book_isbn",
  "loan_date",
  "due_date",
  "return_date",
  "status"
];

function isValidDate(value) {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export function validateLoan(payload, { partial = false } = {}) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new HttpError(400, "Body request harus berupa objek JSON.");
  }

  const unknownFields = Object.keys(payload).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length) {
    throw new HttpError(400, "Terdapat field yang tidak dikenali.", {
      fields: unknownFields
    });
  }

  const requiredFields = [
    "member_name",
    "member_email",
    "book_title",
    "due_date"
  ];

  if (!partial) {
    const missingFields = requiredFields.filter(
      (field) => payload[field] === undefined || payload[field] === null || payload[field] === ""
    );

    if (missingFields.length) {
      throw new HttpError(400, "Field wajib belum lengkap.", {
        fields: missingFields
      });
    }
  } else if (Object.keys(payload).length === 0) {
    throw new HttpError(400, "Minimal satu field harus dikirim untuk diperbarui.");
  }

  for (const field of ["member_name", "member_email", "book_title"]) {
    if (payload[field] !== undefined) {
      if (typeof payload[field] !== "string" || !payload[field].trim()) {
        throw new HttpError(400, `${field} harus berupa teks dan tidak boleh kosong.`);
      }
      payload[field] = payload[field].trim();
    }
  }

  if (
    payload.member_email !== undefined &&
    !EMAIL_PATTERN.test(payload.member_email)
  ) {
    throw new HttpError(400, "Format member_email tidak valid.");
  }

  if (payload.book_isbn !== undefined && payload.book_isbn !== null) {
    if (typeof payload.book_isbn !== "string") {
      throw new HttpError(400, "book_isbn harus berupa teks atau null.");
    }
    payload.book_isbn = payload.book_isbn.trim() || null;
  }

  for (const field of ["loan_date", "due_date", "return_date"]) {
    if (
      payload[field] !== undefined &&
      payload[field] !== null &&
      !isValidDate(payload[field])
    ) {
      throw new HttpError(400, `${field} harus menggunakan format YYYY-MM-DD.`);
    }
  }

  if (payload.status !== undefined && !LOAN_STATUSES.includes(payload.status)) {
    throw new HttpError(400, "Status tidak valid.", {
      allowed_values: LOAN_STATUSES
    });
  }

  if (
    payload.loan_date &&
    payload.due_date &&
    payload.due_date < payload.loan_date
  ) {
    throw new HttpError(400, "due_date tidak boleh lebih awal dari loan_date.");
  }

  if (
    payload.loan_date &&
    payload.return_date &&
    payload.return_date < payload.loan_date
  ) {
    throw new HttpError(400, "return_date tidak boleh lebih awal dari loan_date.");
  }

  return payload;
}
