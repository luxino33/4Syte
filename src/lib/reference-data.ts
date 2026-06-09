// Static reference data used across the registration wizard

export const SA_PROVINCES = [
  { code: "GP", name: "Gauteng" },
  { code: "WC", name: "Western Cape" },
  { code: "KZN", name: "KwaZulu-Natal" },
  { code: "EC", name: "Eastern Cape" },
  { code: "FS", name: "Free State" },
  { code: "LP", name: "Limpopo" },
  { code: "MP", name: "Mpumalanga" },
  { code: "NW", name: "North West" },
  { code: "NC", name: "Northern Cape" },
];

export const COUNTRIES = [
  { code: "ZA", name: "South Africa", dialCode: "+27" },
  { code: "ZW", name: "Zimbabwe", dialCode: "+263" },
  { code: "MZ", name: "Mozambique", dialCode: "+258" },
  { code: "BW", name: "Botswana", dialCode: "+267" },
  { code: "NA", name: "Namibia", dialCode: "+264" },
  { code: "LS", name: "Lesotho", dialCode: "+266" },
  { code: "SZ", name: "Eswatini", dialCode: "+268" },
  { code: "ZM", name: "Zambia", dialCode: "+260" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "DE", name: "Germany", dialCode: "+49" },
  { code: "CN", name: "China", dialCode: "+86" },
];

export const SA_BANKS = [
  "Absa Bank",
  "Standard Bank",
  "FNB (First National Bank)",
  "Nedbank",
  "Capitec Bank",
  "Investec Bank",
  "African Bank",
  "TymeBank",
  "Discovery Bank",
  "Bidvest Bank",
  "Sasfin Bank",
  "Grindrod Bank",
];

export const ACCOUNT_TYPES = [
  { value: "CURRENT", label: "Current / Cheque Account" },
  { value: "SAVINGS", label: "Savings Account" },
  { value: "TRANSMISSION", label: "Transmission Account" },
];

export const BBBEE_SECTORS = [
  { value: "GENERIC", label: "Generic (Default)" },
  { value: "ICT", label: "Information & Communication Technology (ICT)" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "TOURISM", label: "Tourism & Hospitality" },
  { value: "AGRI_BEE", label: "Agriculture (AgriBEE)" },
  { value: "CHARTERED_ACCOUNTANCY", label: "Chartered Accountancy" },
  { value: "FINANCIAL_SERVICES", label: "Financial Services" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "MARKETING", label: "Marketing, Advertising & Communications" },
  { value: "PROPERTY", label: "Property" },
  { value: "FORESTRY", label: "Forestry" },
];

export const SECTOR_TURNOVER_BANDS: Record<string, { label: string; classification: string }[]> = {
  GENERIC: [
    { label: "≤ R10 million", classification: "EME" },
    { label: "> R10m – ≤ R50 million", classification: "QSE" },
    { label: "> R50 million", classification: "GENERIC" },
  ],
  ICT: [
    { label: "≤ R10 million", classification: "EME" },
    { label: "> R10m – ≤ R50 million", classification: "QSE" },
    { label: "> R50 million", classification: "GENERIC" },
  ],
  CONSTRUCTION: [
    { label: "≤ R10 million", classification: "EME" },
    { label: "> R10m – ≤ R50 million", classification: "QSE" },
    { label: "> R50 million", classification: "GENERIC" },
  ],
  TOURISM: [
    { label: "≤ R10 million", classification: "EME" },
    { label: "> R10m – ≤ R50 million", classification: "QSE" },
    { label: "> R50 million", classification: "GENERIC" },
  ],
  AGRI_BEE: [
    { label: "≤ R10 million", classification: "EME" },
    { label: "> R10m – ≤ R100 million", classification: "QSE" },
    { label: "> R100 million", classification: "GENERIC" },
  ],
  FINANCIAL_SERVICES: [
    { label: "≤ R10 million", classification: "EME" },
    { label: "> R10m – ≤ R50 million", classification: "QSE" },
    { label: "> R50 million", classification: "GENERIC" },
  ],
};

export const SANAS_VAS = [
  "Empowerlogic",
  "Nexia SAB&T",
  "Rating Afrika",
  "SAICA",
  "Sizwe Ntsaluba Gobodo",
  "BDO South Africa",
  "Grant Thornton",
  "KPMG",
  "Deloitte",
  "PricewaterhouseCoopers (PwC)",
  "EY (Ernst & Young)",
  "Nkonki",
  "Mosela Rating Agency",
];

export const UNSPSC_CODES = [
  { code: "43230000", title: "Software" },
  { code: "43210000", title: "Hardware / Computers" },
  { code: "81110000", title: "Engineering Services" },
  { code: "72100000", title: "Construction & Maintenance" },
  { code: "80110000", title: "Management Consulting" },
  { code: "93140000", title: "Audit & Accounting" },
  { code: "78100000", title: "Freight & Transport" },
  { code: "70100000", title: "Real Estate" },
  { code: "50000000", title: "Food & Beverages" },
  { code: "53100000", title: "Cleaning Products" },
  { code: "56100000", title: "Furniture & Office Equipment" },
  { code: "92100000", title: "Security Services" },
  { code: "84100000", title: "Financial & Insurance Services" },
  { code: "86100000", title: "Healthcare Services" },
  { code: "95100000", title: "Training & Education" },
  { code: "73100000", title: "Industrial Machinery" },
];

export const SHAREHOLDER_TYPES = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "COMPANY", label: "Company" },
];
