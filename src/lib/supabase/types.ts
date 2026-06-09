export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      affidavit_drafts: {
        Row: { created_at: string; id: string; pdf_object_key: string | null; prefilled_data: Json; status: Database["public"]["Enums"]["affidavit_draft_status"]; supplier_id: string; template_id: string; updated_at: string }
        Insert: { created_at?: string; id?: string; pdf_object_key?: string | null; prefilled_data?: Json; status?: Database["public"]["Enums"]["affidavit_draft_status"]; supplier_id: string; template_id: string; updated_at?: string }
        Update: { created_at?: string; id?: string; pdf_object_key?: string | null; prefilled_data?: Json; status?: Database["public"]["Enums"]["affidavit_draft_status"]; supplier_id?: string; template_id?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: "affidavit_drafts_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: false; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      agreements: {
        Row: { accepted: boolean; accepted_at: string | null; created_at: string; id: string; supplier_id: string; type: Database["public"]["Enums"]["agreement_type"]; version: string }
        Insert: { accepted?: boolean; accepted_at?: string | null; created_at?: string; id?: string; supplier_id: string; type: Database["public"]["Enums"]["agreement_type"]; version: string }
        Update: { accepted?: boolean; accepted_at?: string | null; created_at?: string; id?: string; supplier_id?: string; type?: Database["public"]["Enums"]["agreement_type"]; version?: string }
        Relationships: [{ foreignKeyName: "agreements_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: false; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      audit_logs: {
        Row: { action: string; actor_id: string | null; after: Json | null; before: Json | null; created_at: string; entity: string; entity_id: string; id: string; meta: Json | null; supplier_id: string | null }
        Insert: { action: string; actor_id?: string | null; after?: Json | null; before?: Json | null; created_at?: string; entity: string; entity_id: string; id?: string; meta?: Json | null; supplier_id?: string | null }
        Update: { action?: string; actor_id?: string | null; after?: Json | null; before?: Json | null; created_at?: string; entity?: string; entity_id?: string; id?: string; meta?: Json | null; supplier_id?: string | null }
        Relationships: [{ foreignKeyName: "audit_logs_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: false; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      bank_info: {
        Row: { account_number: string; account_type: Database["public"]["Enums"]["account_type"]; bank_name: string; branch_name: string; branch_number: string; created_at: string; id: string; supplier_id: string; swift_code: string; updated_at: string }
        Insert: { account_number: string; account_type: Database["public"]["Enums"]["account_type"]; bank_name: string; branch_name: string; branch_number: string; created_at?: string; id?: string; supplier_id: string; swift_code: string; updated_at?: string }
        Update: { account_number?: string; account_type?: Database["public"]["Enums"]["account_type"]; bank_name?: string; branch_name?: string; branch_number?: string; created_at?: string; id?: string; supplier_id?: string; swift_code?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: "bank_info_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: true; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      banks: {
        Row: { active: boolean; id: string; name: string; swift_code: string | null }
        Insert: { active?: boolean; id?: string; name: string; swift_code?: string | null }
        Update: { active?: boolean; id?: string; name?: string; swift_code?: string | null }
        Relationships: []
      }
      bbbee_info: {
        Row: { annual_turnover_band: string | null; bbbee_level: number | null; bdg_disabled_pct: number | null; bdg_military_vet_pct: number | null; bdg_pct: number | null; bdg_rural_pct: number | null; bdg_unemployed_pct: number | null; bdg_youth_pct: number | null; black_ownership_pct: number | null; black_woman_ownership_pct: number | null; cert_expiry_date: string | null; classification: Database["public"]["Enums"]["bbbee_classification"] | null; created_at: string; has_bbbee_document: boolean; id: string; is_black_owned: boolean | null; is_black_woman_owned: boolean | null; latest_fin_year_end: string | null; modified_flow_through: boolean | null; sanas_accredited_va: string | null; sector: Database["public"]["Enums"]["bbbee_sector"] | null; supplier_id: string; updated_at: string }
        Insert: { annual_turnover_band?: string | null; bbbee_level?: number | null; bdg_disabled_pct?: number | null; bdg_military_vet_pct?: number | null; bdg_pct?: number | null; bdg_rural_pct?: number | null; bdg_unemployed_pct?: number | null; bdg_youth_pct?: number | null; black_ownership_pct?: number | null; black_woman_ownership_pct?: number | null; cert_expiry_date?: string | null; classification?: Database["public"]["Enums"]["bbbee_classification"] | null; created_at?: string; has_bbbee_document?: boolean; id?: string; is_black_owned?: boolean | null; is_black_woman_owned?: boolean | null; latest_fin_year_end?: string | null; modified_flow_through?: boolean | null; sanas_accredited_va?: string | null; sector?: Database["public"]["Enums"]["bbbee_sector"] | null; supplier_id: string; updated_at?: string }
        Update: { annual_turnover_band?: string | null; bbbee_level?: number | null; bdg_disabled_pct?: number | null; bdg_military_vet_pct?: number | null; bdg_pct?: number | null; bdg_rural_pct?: number | null; bdg_unemployed_pct?: number | null; bdg_youth_pct?: number | null; black_ownership_pct?: number | null; black_woman_ownership_pct?: number | null; cert_expiry_date?: string | null; classification?: Database["public"]["Enums"]["bbbee_classification"] | null; created_at?: string; has_bbbee_document?: boolean; id?: string; is_black_owned?: boolean | null; is_black_woman_owned?: boolean | null; latest_fin_year_end?: string | null; modified_flow_through?: boolean | null; sanas_accredited_va?: string | null; sector?: Database["public"]["Enums"]["bbbee_sector"] | null; supplier_id?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: "bbbee_info_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: true; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      company_info: {
        Row: { company_fax: string | null; company_phone: string; company_type: Database["public"]["Enums"]["company_type"]; company_type_other: string | null; company_website: string | null; created_at: string; cumulative_ytd_spend: number | null; facebook: string | null; general_email: string; holding_company_name: string | null; id: string; linked_in: string | null; registered_name: string; registration_number: string; submitter_full_name: string; submitter_role: string; supplier_id: string; tax_clearance_pin: string | null; tax_clearance_pin_expiry: string | null; trading_name: string | null; updated_at: string; vat_number: string | null; vat_registered: boolean; vendor_number: string | null }
        Insert: { company_fax?: string | null; company_phone: string; company_type: Database["public"]["Enums"]["company_type"]; company_type_other?: string | null; company_website?: string | null; created_at?: string; cumulative_ytd_spend?: number | null; facebook?: string | null; general_email: string; holding_company_name?: string | null; id?: string; linked_in?: string | null; registered_name: string; registration_number: string; submitter_full_name: string; submitter_role: string; supplier_id: string; tax_clearance_pin?: string | null; tax_clearance_pin_expiry?: string | null; trading_name?: string | null; updated_at?: string; vat_number?: string | null; vat_registered?: boolean; vendor_number?: string | null }
        Update: { company_fax?: string | null; company_phone?: string; company_type?: Database["public"]["Enums"]["company_type"]; company_type_other?: string | null; company_website?: string | null; created_at?: string; cumulative_ytd_spend?: number | null; facebook?: string | null; general_email?: string; holding_company_name?: string | null; id?: string; linked_in?: string | null; registered_name?: string; registration_number?: string; submitter_full_name?: string; submitter_role?: string; supplier_id?: string; tax_clearance_pin?: string | null; tax_clearance_pin_expiry?: string | null; trading_name?: string | null; updated_at?: string; vat_number?: string | null; vat_registered?: boolean; vendor_number?: string | null }
        Relationships: [{ foreignKeyName: "company_info_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: true; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      contacts: {
        Row: { created_at: string; email: string; full_name: string; id: string; phone: string; supplier_id: string; type: Database["public"]["Enums"]["contact_type"]; updated_at: string }
        Insert: { created_at?: string; email: string; full_name: string; id?: string; phone: string; supplier_id: string; type: Database["public"]["Enums"]["contact_type"]; updated_at?: string }
        Update: { created_at?: string; email?: string; full_name?: string; id?: string; phone?: string; supplier_id?: string; type?: Database["public"]["Enums"]["contact_type"]; updated_at?: string }
        Relationships: [{ foreignKeyName: "contacts_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: false; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      countries: {
        Row: { code: string; dial_code: string | null; id: string; name: string }
        Insert: { code: string; dial_code?: string | null; id?: string; name: string }
        Update: { code?: string; dial_code?: string | null; id?: string; name?: string }
        Relationships: []
      }
      documents: {
        Row: { deleted_at: string | null; file_name: string; id: string; mime_type: string; object_key: string; size_bytes: number; status: Database["public"]["Enums"]["document_status"]; supplier_id: string; type: Database["public"]["Enums"]["document_type"]; uploaded_at: string; version: number }
        Insert: { deleted_at?: string | null; file_name: string; id?: string; mime_type: string; object_key: string; size_bytes: number; status?: Database["public"]["Enums"]["document_status"]; supplier_id: string; type: Database["public"]["Enums"]["document_type"]; uploaded_at?: string; version?: number }
        Update: { deleted_at?: string | null; file_name?: string; id?: string; mime_type?: string; object_key?: string; size_bytes?: number; status?: Database["public"]["Enums"]["document_status"]; supplier_id?: string; type?: Database["public"]["Enums"]["document_type"]; uploaded_at?: string; version?: number }
        Relationships: [{ foreignKeyName: "documents_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: false; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      jobs: {
        Row: { attempts: number; completed_at: string | null; created_at: string; error: string | null; id: string; max_attempts: number; payload: Json; run_at: string; started_at: string | null; status: Database["public"]["Enums"]["job_status"]; type: string; updated_at: string }
        Insert: { attempts?: number; completed_at?: string | null; created_at?: string; error?: string | null; id?: string; max_attempts?: number; payload?: Json; run_at?: string; started_at?: string | null; status?: Database["public"]["Enums"]["job_status"]; type: string; updated_at?: string }
        Update: { attempts?: number; completed_at?: string | null; created_at?: string; error?: string | null; id?: string; max_attempts?: number; payload?: Json; run_at?: string; started_at?: string | null; status?: Database["public"]["Enums"]["job_status"]; type?: string; updated_at?: string }
        Relationships: []
      }
      onboarding_cases: {
        Row: { audit_trail: Json; created_at: string; erp_vendor_number: string | null; id: string; l1_approved_at: string | null; l1_approved_by: string | null; l2_approved_at: string | null; l2_approved_by: string | null; state: Database["public"]["Enums"]["onboarding_state"]; supplier_id: string; updated_at: string; vetting_result: Json | null }
        Insert: { audit_trail?: Json; created_at?: string; erp_vendor_number?: string | null; id?: string; l1_approved_at?: string | null; l1_approved_by?: string | null; l2_approved_at?: string | null; l2_approved_by?: string | null; state?: Database["public"]["Enums"]["onboarding_state"]; supplier_id: string; updated_at?: string; vetting_result?: Json | null }
        Update: { audit_trail?: Json; created_at?: string; erp_vendor_number?: string | null; id?: string; l1_approved_at?: string | null; l1_approved_by?: string | null; l2_approved_at?: string | null; l2_approved_by?: string | null; state?: Database["public"]["Enums"]["onboarding_state"]; supplier_id?: string; updated_at?: string; vetting_result?: Json | null }
        Relationships: [{ foreignKeyName: "onboarding_cases_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: true; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      owners: {
        Row: { created_at: string; full_name: string; id: string; id_or_reg_number: string; percentage_ownership: number; position_in_company: string; shareholder_type: Database["public"]["Enums"]["shareholder_type"]; supplier_id: string; updated_at: string }
        Insert: { created_at?: string; full_name: string; id?: string; id_or_reg_number: string; percentage_ownership: number; position_in_company: string; shareholder_type: Database["public"]["Enums"]["shareholder_type"]; supplier_id: string; updated_at?: string }
        Update: { created_at?: string; full_name?: string; id?: string; id_or_reg_number?: string; percentage_ownership?: number; position_in_company?: string; shareholder_type?: Database["public"]["Enums"]["shareholder_type"]; supplier_id?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: "owners_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: false; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      physical_addresses: {
        Row: { city: string; country: string; created_at: string; id: string; postal_code: string; province: string; street1: string; street2: string; supplier_id: string; updated_at: string }
        Insert: { city: string; country: string; created_at?: string; id?: string; postal_code: string; province: string; street1: string; street2: string; supplier_id: string; updated_at?: string }
        Update: { city?: string; country?: string; created_at?: string; id?: string; postal_code?: string; province?: string; street1?: string; street2?: string; supplier_id?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: "physical_addresses_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: true; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      postal_addresses: {
        Row: { city: string; country: string; created_at: string; id: string; postal_code: string; province: string; same_as_physical: boolean; street1: string; street2: string; supplier_id: string; updated_at: string }
        Insert: { city: string; country: string; created_at?: string; id?: string; postal_code: string; province: string; same_as_physical?: boolean; street1: string; street2: string; supplier_id: string; updated_at?: string }
        Update: { city?: string; country?: string; created_at?: string; id?: string; postal_code?: string; province?: string; same_as_physical?: boolean; street1?: string; street2?: string; supplier_id?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: "postal_addresses_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: true; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      product_offerings: {
        Row: { business_summary: string; created_at: string; id: string; notify_opportunities: boolean; supplier_id: string; unspsc_codes: string[]; updated_at: string }
        Insert: { business_summary: string; created_at?: string; id?: string; notify_opportunities?: boolean; supplier_id: string; unspsc_codes?: string[]; updated_at?: string }
        Update: { business_summary?: string; created_at?: string; id?: string; notify_opportunities?: boolean; supplier_id?: string; unspsc_codes?: string[]; updated_at?: string }
        Relationships: [{ foreignKeyName: "product_offerings_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: true; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      product_service_lines: {
        Row: { created_at: string; description: string | null; id: string; name: string; region: string; supplier_id: string; updated_at: string }
        Insert: { created_at?: string; description?: string | null; id?: string; name: string; region: string; supplier_id: string; updated_at?: string }
        Update: { created_at?: string; description?: string | null; id?: string; name?: string; region?: string; supplier_id?: string; updated_at?: string }
        Relationships: [{ foreignKeyName: "product_service_lines_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: false; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
      provinces: {
        Row: { code: string; country_id: string; id: string; name: string }
        Insert: { code: string; country_id: string; id?: string; name: string }
        Update: { code?: string; country_id?: string; id?: string; name?: string }
        Relationships: [{ foreignKeyName: "provinces_country_id_fkey"; columns: ["country_id"]; isOneToOne: false; referencedRelation: "countries"; referencedColumns: ["id"] }]
      }
      sanas_accredited_vas: {
        Row: { accreditation_no: string | null; active: boolean; created_at: string; id: string; name: string; updated_at: string; valid_until: string | null }
        Insert: { accreditation_no?: string | null; active?: boolean; created_at?: string; id?: string; name: string; updated_at?: string; valid_until?: string | null }
        Update: { accreditation_no?: string | null; active?: boolean; created_at?: string; id?: string; name?: string; updated_at?: string; valid_until?: string | null }
        Relationships: []
      }
      sector_turnover_bands: {
        Row: { classification: Database["public"]["Enums"]["bbbee_classification"]; id: string; label: string; max_turnover: number | null; min_turnover: number | null; sector: Database["public"]["Enums"]["bbbee_sector"]; sort_order: number }
        Insert: { classification: Database["public"]["Enums"]["bbbee_classification"]; id?: string; label: string; max_turnover?: number | null; min_turnover?: number | null; sector: Database["public"]["Enums"]["bbbee_sector"]; sort_order: number }
        Update: { classification?: Database["public"]["Enums"]["bbbee_classification"]; id?: string; label?: string; max_turnover?: number | null; min_turnover?: number | null; sector?: Database["public"]["Enums"]["bbbee_sector"]; sort_order?: number }
        Relationships: []
      }
      suppliers: {
        Row: { created_at: string; cumulative_ytd_spend: number | null; current_step: number; deleted_at: string | null; id: string; session_id: string; status: Database["public"]["Enums"]["supplier_status"]; submitted_at: string | null; updated_at: string; vendor_number: string | null }
        Insert: { created_at?: string; cumulative_ytd_spend?: number | null; current_step?: number; deleted_at?: string | null; id?: string; session_id: string; status?: Database["public"]["Enums"]["supplier_status"]; submitted_at?: string | null; updated_at?: string; vendor_number?: string | null }
        Update: { created_at?: string; cumulative_ytd_spend?: number | null; current_step?: number; deleted_at?: string | null; id?: string; session_id?: string; status?: Database["public"]["Enums"]["supplier_status"]; submitted_at?: string | null; updated_at?: string; vendor_number?: string | null }
        Relationships: []
      }
      unspsc_codes: {
        Row: { class_code: string; code: string; commodity: string; family: string; id: string; segment: string; title: string }
        Insert: { class_code: string; code: string; commodity: string; family: string; id?: string; segment: string; title: string }
        Update: { class_code?: string; code?: string; commodity?: string; family?: string; id?: string; segment?: string; title?: string }
        Relationships: []
      }
      validation_rules: {
        Row: { active: boolean; code: string; created_at: string; description: string; id: string; is_blocking: boolean; predicate_meta: Json; sector_scope: string[]; updated_at: string }
        Insert: { active?: boolean; code: string; created_at?: string; description: string; id?: string; is_blocking?: boolean; predicate_meta?: Json; sector_scope?: string[]; updated_at?: string }
        Update: { active?: boolean; code?: string; created_at?: string; description?: string; id?: string; is_blocking?: boolean; predicate_meta?: Json; sector_scope?: string[]; updated_at?: string }
        Relationships: []
      }
      validation_runs: {
        Row: { admin_override: boolean; admin_override_by: string | null; admin_override_reason: string | null; created_at: string; document_id: string | null; engine_version: string; extracted_fields: Json; id: string; overall_confidence: number | null; reasons: string[]; result: Database["public"]["Enums"]["validation_result"]; rules_fired: Json; supplier_id: string }
        Insert: { admin_override?: boolean; admin_override_by?: string | null; admin_override_reason?: string | null; created_at?: string; document_id?: string | null; engine_version: string; extracted_fields?: Json; id?: string; overall_confidence?: number | null; reasons?: string[]; result: Database["public"]["Enums"]["validation_result"]; rules_fired?: Json; supplier_id: string }
        Update: { admin_override?: boolean; admin_override_by?: string | null; admin_override_reason?: string | null; created_at?: string; document_id?: string | null; engine_version?: string; extracted_fields?: Json; id?: string; overall_confidence?: number | null; reasons?: string[]; result?: Database["public"]["Enums"]["validation_result"]; rules_fired?: Json; supplier_id?: string }
        Relationships: [{ foreignKeyName: "validation_runs_document_id_fkey"; columns: ["document_id"]; isOneToOne: false; referencedRelation: "documents"; referencedColumns: ["id"] }, { foreignKeyName: "validation_runs_supplier_id_fkey"; columns: ["supplier_id"]; isOneToOne: false; referencedRelation: "suppliers"; referencedColumns: ["id"] }]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      account_type: "CURRENT" | "SAVINGS" | "TRANSMISSION"
      affidavit_draft_status: "GENERATED" | "VIEWED" | "DOWNLOADED" | "COMMISSIONED" | "REUPLOADED"
      agreement_type: "TERMS_AND_CONDITIONS" | "PRIVACY_POLICY" | "SUPPLIER_CODE_OF_CONDUCT" | "DATA_PROCESSING"
      bbbee_classification: "EME" | "QSE" | "GENERIC"
      bbbee_sector: "GENERIC" | "ICT" | "CONSTRUCTION" | "TOURISM" | "AGRI_BEE" | "CHARTERED_ACCOUNTANCY" | "FINANCIAL_SERVICES" | "TRANSPORT" | "MARKETING" | "PROPERTY" | "FORESTRY"
      company_type: "PRIVATE_COMPANY" | "CLOSE_CORPORATION" | "SOLE_PROPRIETOR" | "PUBLIC_COMPANY" | "TRUST" | "PARTNERSHIP" | "NGO" | "OTHER"
      contact_type: "PRIMARY" | "SECONDARY"
      document_status: "UPLOADED" | "VALIDATING" | "VALID" | "INVALID" | "SUPERSEDED"
      document_type: "COI" | "VAT_CERT" | "TAX_CLEARANCE" | "BBBEE" | "BANK_PROOF" | "AFFIDAVIT" | "OTHER"
      job_status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED"
      onboarding_state: "INITIATED" | "L1_PENDING" | "L1_APPROVED" | "L2_PENDING" | "L2_APPROVED" | "VETTING" | "VETTING_PASSED" | "SENDING_TO_ERP" | "COMPLETE" | "REJECTED"
      shareholder_type: "INDIVIDUAL" | "COMPANY"
      supplier_status: "DRAFT" | "SUBMITTED_PENDING_BEE" | "BEE_INVALID_AWAITING_REUPLOAD" | "BEE_VALID" | "ONBOARDING" | "ONBOARDED" | "REJECTED"
      validation_result: "VALID" | "INVALID" | "INDETERMINATE"
    }
    CompositeTypes: { [_ in never]: never }
  }
}
