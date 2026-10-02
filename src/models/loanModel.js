import { supabase } from "../config/supabaseClient.js";

const columns =
  "id, member_name, member_email, book_title, book_isbn, loan_date, due_date, return_date, status, created_at, updated_at";

export const LoanModel = {
  async create(payload) {
    return supabase.from("loans").insert(payload).select(columns).single();
  },

  async findAll({ status, memberName }) {
    let query = supabase
      .from("loans")
      .select(columns)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (memberName) query = query.ilike("member_name", `%${memberName}%`);

    return query;
  },

  async findById(id) {
    return supabase.from("loans").select(columns).eq("id", id).maybeSingle();
  },

  async update(id, payload) {
    return supabase
      .from("loans")
      .update(payload)
      .eq("id", id)
      .select(columns)
      .maybeSingle();
  },

  async remove(id) {
    return supabase.from("loans").delete().eq("id", id).select("id").maybeSingle();
  }
};
