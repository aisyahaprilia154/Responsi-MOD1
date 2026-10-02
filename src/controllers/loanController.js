import { LoanModel } from "../models/loanModel.js";
import { HttpError } from "../utils/httpError.js";
import { LOAN_STATUSES, validateLoan } from "../utils/loanValidation.js";

function handleDatabaseError(error) {
  if (!error) return;

  if (error.code === "22P02") {
    throw new HttpError(400, "Format ID tidak valid.");
  }

  if (error.code === "23514" || error.code === "23502") {
    throw new HttpError(400, "Data melanggar aturan pada database.", error.message);
  }

  throw new HttpError(500, "Operasi database gagal.", error.message);
}

export const LoanController = {
  async create(req, res) {
    const payload = validateLoan({ ...req.body });
    const { data, error } = await LoanModel.create(payload);
    handleDatabaseError(error);

    res.status(201).json({
      success: true,
      message: "Data peminjaman berhasil dibuat.",
      data
    });
  },

  async getAll(req, res) {
    const status = req.query.status;
    const memberName = req.query.member_name;

    if (status && !LOAN_STATUSES.includes(status)) {
      throw new HttpError(400, "Filter status tidak valid.", {
        allowed_values: LOAN_STATUSES
      });
    }

    const { data, error } = await LoanModel.findAll({ status, memberName });
    handleDatabaseError(error);

    res.json({
      success: true,
      count: data.length,
      data
    });
  },

  async getById(req, res) {
    const { data, error } = await LoanModel.findById(req.params.id);
    handleDatabaseError(error);

    if (!data) throw new HttpError(404, "Data peminjaman tidak ditemukan.");

    res.json({ success: true, data });
  },

  async update(req, res) {
    const payload = validateLoan({ ...req.body }, { partial: true });
    const { data, error } = await LoanModel.update(req.params.id, payload);
    handleDatabaseError(error);

    if (!data) throw new HttpError(404, "Data peminjaman tidak ditemukan.");

    res.json({
      success: true,
      message: "Data peminjaman berhasil diperbarui.",
      data
    });
  },

  async remove(req, res) {
    const { data, error } = await LoanModel.remove(req.params.id);
    handleDatabaseError(error);

    if (!data) throw new HttpError(404, "Data peminjaman tidak ditemukan.");

    res.json({
      success: true,
      message: "Data peminjaman berhasil dihapus."
    });
  }
};
