export type Outlet = {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  manager: string;
  pharmacist: string;
  staffCount: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  status: "ONLINE" | "BUSY" | "OFFLINE";
  inventorySKUs: number;
  coldChainReady: boolean;
  latitude: number;
  longitude: number;
};

export type MedicineItem = {
  id: string;
  sku: string;
  name: string;
  salt: string;
  brand: string;
  category: "Prescription Drugs" | "OTC" | "Baby Care" | "Personal Care" | "Diabetic Care" | "Health Devices" | "Ayurvedic";
  schedule: "OTC" | "SCHEDULE_H" | "SCHEDULE_H1" | "SCHEDULE_X";
  coldChain: boolean;
  batchNumber: string;
  mfgDate: string;
  expiryDate: string;
  mrp: number;
  costPrice: number;
  stockTotal: number;
  reorderLevel: number;
  stockByOutlet: Record<string, number>;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "NEAR_EXPIRY";
};

export type PrescriptionVerification = {
  id: string;
  refId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientPhone: string;
  patientAddress: string;
  doctorName: string;
  doctorRegistration: string;
  clinicName: string;
  clinicAddress: string;
  date: string;
  prescriptionImage: string;
  prescribedMeds: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    qty: number;
    price: number;
    available: boolean;
  }[];
  status: "PENDING_VERIFICATION" | "CONVERTED_TO_ORDER" | "REJECTED";
  verifiedBy?: string;
  notes?: string;
  allocatedOutlet: string;
  convertedOrderId?: string;
  createdAt: string;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  outletId: string;
  outletName: string;
  channel: "ONLINE";
  items: { name: string; qty: number; price: number; isRx?: boolean }[];
  total: number;
  paymentMethod: "UPI" | "CREDIT_CARD" | "CASH_ON_DELIVERY" | "NET_BANKING";
  paymentStatus: "PAID" | "PENDING" | "REFUNDED";
  status: "PROCESSING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  isPrescriptionOrder: boolean;
  rxRefId?: string;
  doctorName?: string;
  riderName?: string;
  riderPhone?: string;
  createdAt: string;
  deliveryType: "EXPRESS_2HR" | "STANDARD_SAME_DAY" | "STORE_PICKUP";
};

export type UserRole = "SUPER_ADMIN" | "OUTLET_ADMIN" | "DELIVERY_MAN";

export type OutletStaffAccount = {
  id: string;
  empCode: string;
  responsiblePerson: string;
  role: UserRole;
  outletId: string;
  outletName: string;
  phone: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  lastLogin: string;
  createdAt: string;
};

export type CustomerProfile = {
  id: string;
  healthId: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  address: string;
  city: string;
  totalOrders: number;
  totalSpend: number;
  walletBalance: number;
  chronicCondition?: string;
  allergies?: string;
  bloodGroup?: string;
  refillSubscriber: boolean;
  registeredSince: string;
};

export type Coupon = {
  id: string;
  code: string;
  title: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  status: "ACTIVE" | "EXPIRED" | "DISABLED";
  applicableCategory: string;
  description: string;
};

/* -------------------------------------------------------------
   INITIAL 14 SGN SUPERSTORES (Tamil Nadu Network)
------------------------------------------------------------- */
export const INITIAL_OUTLETS: Outlet[] = [
  {
    id: "out-01",
    name: "SGN Superstore - Samayapuram",
    city: "Trichy",
    district: "Tiruchirappalli",
    address: "No. 14, Main Road, Near Tollgate, Samayapuram, Trichy 621112",
    phone: "+91 431 267 0110",
    manager: "K. Venkatesh (M.Pharm)",
    pharmacist: "R. Sundar (B.Pharm)",
    staffCount: 14,
    dailyRevenue: 142500,
    monthlyRevenue: 3850000,
    status: "ONLINE",
    inventorySKUs: 8420,
    coldChainReady: true,
    latitude: 10.9255,
    longitude: 78.7423,
  },
  {
    id: "out-02",
    name: "SGN Superstore - Thillai Nagar",
    city: "Trichy",
    district: "Tiruchirappalli",
    address: "11th Cross West, Thillai Nagar, Tiruchirappalli 620018",
    phone: "+91 431 274 1890",
    manager: "M. Balaji (Pharm.D)",
    pharmacist: "S. Kavitha (B.Pharm)",
    staffCount: 18,
    dailyRevenue: 215000,
    monthlyRevenue: 5900000,
    status: "ONLINE",
    inventorySKUs: 12400,
    coldChainReady: true,
    latitude: 10.8281,
    longitude: 78.6869,
  },
  {
    id: "out-03",
    name: "SGN Superstore - Cantonment",
    city: "Trichy",
    district: "Tiruchirappalli",
    address: "Collector Office Road, Cantonment, Tiruchirappalli 620001",
    phone: "+91 431 241 5560",
    manager: "T. Arulraj (M.Pharm)",
    pharmacist: "A. Mohamed Imran (B.Pharm)",
    staffCount: 16,
    dailyRevenue: 188000,
    monthlyRevenue: 5120000,
    status: "ONLINE",
    inventorySKUs: 10800,
    coldChainReady: true,
    latitude: 10.8035,
    longitude: 78.6854,
  },
  {
    id: "out-04",
    name: "SGN Superstore - Anna Nagar",
    city: "Chennai",
    district: "Chennai",
    address: "2nd Avenue, Block AA, Anna Nagar, Chennai 600040",
    phone: "+91 44 2621 8890",
    manager: "Dr. P. Rajesh (Pharm.D)",
    pharmacist: "K. Priya (M.Pharm)",
    staffCount: 22,
    dailyRevenue: 340000,
    monthlyRevenue: 9200000,
    status: "ONLINE",
    inventorySKUs: 16500,
    coldChainReady: true,
    latitude: 13.0850,
    longitude: 80.2101,
  },
  {
    id: "out-05",
    name: "SGN Superstore - T. Nagar",
    city: "Chennai",
    district: "Chennai",
    address: "G.N. Chetty Road, T. Nagar, Chennai 600017",
    phone: "+91 44 2815 4432",
    manager: "S. Muralidharan (B.Pharm)",
    pharmacist: "V. Divya (B.Pharm)",
    staffCount: 19,
    dailyRevenue: 295000,
    monthlyRevenue: 8100000,
    status: "ONLINE",
    inventorySKUs: 14200,
    coldChainReady: true,
    latitude: 13.0418,
    longitude: 80.2341,
  },
  {
    id: "out-06",
    name: "SGN Superstore - KK Nagar",
    city: "Trichy",
    district: "Tiruchirappalli",
    address: "Rajaram Salai, KK Nagar, Tiruchirappalli 620021",
    phone: "+91 431 245 9910",
    manager: "R. Manikandan (B.Pharm)",
    pharmacist: "N. Selvi (B.Pharm)",
    staffCount: 12,
    dailyRevenue: 135000,
    monthlyRevenue: 3600000,
    status: "ONLINE",
    inventorySKUs: 7800,
    coldChainReady: true,
    latitude: 10.7850,
    longitude: 78.6920,
  },
  {
    id: "out-07",
    name: "SGN Superstore - Srirangam",
    city: "Trichy",
    district: "Tiruchirappalli",
    address: "South Uthira Street, Near Temple, Srirangam, Trichy 620006",
    phone: "+91 431 243 0088",
    manager: "G. Soundararajan (M.Pharm)",
    pharmacist: "M. Deepan (B.Pharm)",
    staffCount: 14,
    dailyRevenue: 162000,
    monthlyRevenue: 4400000,
    status: "ONLINE",
    inventorySKUs: 8900,
    coldChainReady: true,
    latitude: 10.8622,
    longitude: 78.6948,
  },
  {
    id: "out-08",
    name: "SGN Superstore - Velachery",
    city: "Chennai",
    district: "Chennai",
    address: "Velachery Bypass Road, Velachery, Chennai 600042",
    phone: "+91 44 2244 5566",
    manager: "E. Anbarasan (B.Pharm)",
    pharmacist: "R. Jayanthi (B.Pharm)",
    staffCount: 15,
    dailyRevenue: 245000,
    monthlyRevenue: 6700000,
    status: "ONLINE",
    inventorySKUs: 11900,
    coldChainReady: true,
    latitude: 12.9815,
    longitude: 80.2180,
  },
  {
    id: "out-09",
    name: "SGN Superstore - OMR Navalur",
    city: "Chennai",
    district: "Chengalpattu",
    address: "Rajiv Gandhi Salai (OMR), Navalur, Chennai 603103",
    phone: "+91 44 2743 8810",
    manager: "V. Karthikeyan (Pharm.D)",
    pharmacist: "B. Saranya (B.Pharm)",
    staffCount: 14,
    dailyRevenue: 220000,
    monthlyRevenue: 6050000,
    status: "ONLINE",
    inventorySKUs: 10500,
    coldChainReady: true,
    latitude: 12.8465,
    longitude: 80.2268,
  },
  {
    id: "out-10",
    name: "SGN Superstore - KK Nagar Madurai",
    city: "Madurai",
    district: "Madurai",
    address: "80 Feet Road, KK Nagar, Madurai 625020",
    phone: "+91 452 258 7744",
    manager: "A. Pandian (M.Pharm)",
    pharmacist: "S. Muthulakshmi (B.Pharm)",
    staffCount: 16,
    dailyRevenue: 210000,
    monthlyRevenue: 5750000,
    status: "ONLINE",
    inventorySKUs: 11200,
    coldChainReady: true,
    latitude: 9.9252,
    longitude: 78.1498,
  },
  {
    id: "out-11",
    name: "SGN Superstore - RS Puram",
    city: "Coimbatore",
    district: "Coimbatore",
    address: "Diwan Bahadur Road, RS Puram, Coimbatore 641002",
    phone: "+91 422 254 3322",
    manager: "N. Ravichandran (B.Pharm)",
    pharmacist: "P. Vignesh (Pharm.D)",
    staffCount: 18,
    dailyRevenue: 280000,
    monthlyRevenue: 7800000,
    status: "ONLINE",
    inventorySKUs: 13800,
    coldChainReady: true,
    latitude: 11.0088,
    longitude: 76.9500,
  },
  {
    id: "out-12",
    name: "SGN Superstore - Medical College Road",
    city: "Thanjavur",
    district: "Thanjavur",
    address: "Medical College Road, Thanjavur 613004",
    phone: "+91 4362 278 900",
    manager: "C. Dharmaraj (B.Pharm)",
    pharmacist: "K. Anandhi (B.Pharm)",
    staffCount: 12,
    dailyRevenue: 125000,
    monthlyRevenue: 3400000,
    status: "ONLINE",
    inventorySKUs: 7200,
    coldChainReady: true,
    latitude: 10.7628,
    longitude: 79.1170,
  },
  {
    id: "out-13",
    name: "SGN Superstore - Perambalur Old Bus Stand",
    city: "Perambalur",
    district: "Perambalur",
    address: "Near Old Bus Stand, Trichy Main Road, Perambalur 621212",
    phone: "+91 4328 224 110",
    manager: "S. Jayakumar (B.Pharm)",
    pharmacist: "T. Sasikala (B.Pharm)",
    staffCount: 10,
    dailyRevenue: 98000,
    monthlyRevenue: 2650000,
    status: "ONLINE",
    inventorySKUs: 6400,
    coldChainReady: true,
    latitude: 11.2342,
    longitude: 78.8812,
  },
  {
    id: "out-14",
    name: "SGN Superstore - Karur Bus Stand",
    city: "Karur",
    district: "Karur",
    address: "Covai Road, Near Central Bus Stand, Karur 639002",
    phone: "+91 4324 260 550",
    manager: "D. Elangovan (M.Pharm)",
    pharmacist: "V. Balamurugan (B.Pharm)",
    staffCount: 11,
    dailyRevenue: 112000,
    monthlyRevenue: 3050000,
    status: "ONLINE",
    inventorySKUs: 6900,
    coldChainReady: true,
    latitude: 10.9574,
    longitude: 78.0841,
  },
];

/* -------------------------------------------------------------
   INITIAL MASTER DRUG CATALOG
------------------------------------------------------------- */
export const INITIAL_MEDICINES: MedicineItem[] = [
  {
    id: "med-01",
    sku: "SGN-MED-001",
    name: "Paracetamol 500mg IP (500 Tablets Bulk)",
    salt: "Paracetamol IP 500mg",
    brand: "Cipla Ltd",
    category: "OTC",
    schedule: "OTC",
    coldChain: false,
    batchNumber: "CP-PCM-904",
    mfgDate: "2026-01-15",
    expiryDate: "2028-12-31",
    mrp: 53,
    costPrice: 32,
    stockTotal: 4800,
    reorderLevel: 500,
    stockByOutlet: { "out-01": 350, "out-02": 520, "out-03": 410, "out-04": 820, "out-05": 650 },
    status: "IN_STOCK",
  },
  {
    id: "med-02",
    sku: "SGN-MED-002",
    name: "Augmentin 625 Duo (Amoxycillin + Potassium Clavulanate)",
    salt: "Amoxycillin 500mg + Clavulanic Acid 125mg",
    brand: "GSK Pharmaceuticals",
    category: "Prescription Drugs",
    schedule: "SCHEDULE_H",
    coldChain: false,
    batchNumber: "GSK-AUG-221",
    mfgDate: "2026-02-10",
    expiryDate: "2027-08-31",
    mrp: 215,
    costPrice: 155,
    stockTotal: 1850,
    reorderLevel: 300,
    stockByOutlet: { "out-01": 120, "out-02": 240, "out-03": 190, "out-04": 420, "out-05": 310 },
    status: "IN_STOCK",
  },
  {
    id: "med-03",
    sku: "SGN-MED-003",
    name: "Glycomet 500mg (Metformin HCl)",
    salt: "Metformin Hydrochloride IP 500mg",
    brand: "USV Private Ltd",
    category: "Diabetic Care",
    schedule: "SCHEDULE_H",
    coldChain: false,
    batchNumber: "USV-GLY-410",
    mfgDate: "2025-11-20",
    expiryDate: "2027-10-31",
    mrp: 85,
    costPrice: 54,
    stockTotal: 240,
    reorderLevel: 400,
    stockByOutlet: { "out-01": 25, "out-02": 40, "out-03": 30, "out-04": 65, "out-05": 45 },
    status: "LOW_STOCK",
  },
  {
    id: "med-04",
    sku: "SGN-MED-004",
    name: "Human Mixtard 30/70 100IU/ml Cartridge",
    salt: "Biphasic Isophane Insulin",
    brand: "Novo Nordisk",
    category: "Diabetic Care",
    schedule: "SCHEDULE_H",
    coldChain: true,
    batchNumber: "NN-INS-701",
    mfgDate: "2026-03-01",
    expiryDate: "2027-02-28",
    mrp: 520,
    costPrice: 410,
    stockTotal: 1200,
    reorderLevel: 250,
    stockByOutlet: { "out-01": 90, "out-02": 150, "out-03": 110, "out-04": 260, "out-05": 200 },
    status: "IN_STOCK",
  },
  {
    id: "med-05",
    sku: "SGN-MED-005",
    name: "Pantocid 40mg (Pantoprazole)",
    salt: "Pantoprazole Sodium 40mg",
    brand: "Sun Pharma",
    category: "Prescription Drugs",
    schedule: "SCHEDULE_H",
    coldChain: false,
    batchNumber: "SP-PAN-889",
    mfgDate: "2025-12-05",
    expiryDate: "2027-11-30",
    mrp: 165,
    costPrice: 110,
    stockTotal: 3400,
    reorderLevel: 350,
    stockByOutlet: { "out-01": 240, "out-02": 450, "out-03": 380, "out-04": 700, "out-05": 550 },
    status: "IN_STOCK",
  },
  {
    id: "med-06",
    sku: "SGN-MED-006",
    name: "Accu-Chek Active Test Strips (50s)",
    salt: "Blood Glucose Test Reagent",
    brand: "Roche Diagnostics",
    category: "Health Devices",
    schedule: "OTC",
    coldChain: false,
    batchNumber: "RC-STR-302",
    mfgDate: "2026-01-10",
    expiryDate: "2027-06-30",
    mrp: 975,
    costPrice: 720,
    stockTotal: 650,
    reorderLevel: 150,
    stockByOutlet: { "out-01": 45, "out-02": 85, "out-03": 60, "out-04": 150, "out-05": 110 },
    status: "IN_STOCK",
  },
];

/* -------------------------------------------------------------
   INITIAL PRESCRIPTIONS VERIFICATION QUEUE (WITH PHOTOS)
------------------------------------------------------------- */
export const INITIAL_PRESCRIPTIONS: PrescriptionVerification[] = [
  {
    id: "rx-101",
    refId: "SGN-RX-840219",
    patientId: "cust-01",
    patientName: "Anand Kumar",
    patientAge: 42,
    patientGender: "Male",
    patientPhone: "+91 98401 23456",
    patientAddress: "Flat 4B, SRM Road, Kattankulathur, Chennai 603203",
    doctorName: "Dr. K. Swaminathan (MD, General Medicine)",
    doctorRegistration: "TN-MC-68421",
    clinicName: "Apollo Clinics — Anna Nagar",
    clinicAddress: "No. 12, 2nd Avenue, Anna Nagar, Chennai 600040",
    date: "2026-08-18",
    prescriptionImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
    prescribedMeds: [
      { name: "Augmentin 625 Duo (Amoxicillin + Clavulanate)", dosage: "1 Tablet", frequency: "BD (Twice a day)", duration: "5 Days", qty: 2, price: 215, available: true },
      { name: "Pantocid 40mg (Pantoprazole)", dosage: "1 Tablet", frequency: "OD (Before Food)", duration: "5 Days", qty: 1, price: 165, available: true },
    ],
    status: "PENDING_VERIFICATION",
    allocatedOutlet: "out-04",
    createdAt: "10 mins ago",
  },
  {
    id: "rx-102",
    refId: "SGN-RX-912044",
    patientId: "cust-02",
    patientName: "Meenakshi Sundaram",
    patientAge: 64,
    patientGender: "Female",
    patientPhone: "+91 94431 88902",
    patientAddress: "11th Cross West, Thillai Nagar, Trichy 620018",
    doctorName: "Dr. S. Rangarajan (DM, Cardiologist)",
    doctorRegistration: "TN-MC-41290",
    clinicName: "KMC Heart Care Institute",
    clinicAddress: "Collector Office Road, Cantonment, Trichy 620001",
    date: "2026-08-18",
    prescriptionImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    prescribedMeds: [
      { name: "Glycomet 500mg (Metformin)", dosage: "1 Tablet", frequency: "BD (After food)", duration: "30 Days", qty: 4, price: 85, available: true },
      { name: "Human Mixtard 30/70 100IU/ml Cartridge", dosage: "15 Units SubQ", frequency: "OD (Morning)", duration: "30 Days", qty: 2, price: 520, available: true },
    ],
    status: "PENDING_VERIFICATION",
    allocatedOutlet: "out-02",
    createdAt: "24 mins ago",
  },
  {
    id: "rx-103",
    refId: "SGN-RX-772109",
    patientId: "cust-03",
    patientName: "Nandita Pillai",
    patientAge: 29,
    patientGender: "Female",
    patientPhone: "+91 98841 77210",
    patientAddress: "No. 88, Anna Salai, Chennai 600002",
    doctorName: "Dr. Deepa Natarajan (MD, Pediatrics)",
    doctorRegistration: "TN-MC-88120",
    clinicName: "Rainbow Children's Clinic",
    clinicAddress: "G.N. Chetty Road, T. Nagar, Chennai 600017",
    date: "2026-08-17",
    prescriptionImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
    prescribedMeds: [
      { name: "Pantocid 40mg (15 tabs)", dosage: "1 Tablet", frequency: "OD", duration: "15 Days", qty: 2, price: 165, available: true },
    ],
    status: "CONVERTED_TO_ORDER",
    verifiedBy: "Dr. A. Balasubramanian (Super Admin)",
    allocatedOutlet: "out-05",
    convertedOrderId: "ord-904",
    createdAt: "Yesterday",
  },
];

/* -------------------------------------------------------------
   INITIAL LIVE ONLINE ORDERS (ONLY VERIFIED & OTC ORDERS)
------------------------------------------------------------- */
export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-902",
    orderNumber: "SGN-894121",
    customerId: "cust-02",
    customerName: "Meenakshi Sundaram",
    customerPhone: "+91 94431 88902",
    customerAddress: "11th Cross West, Thillai Nagar, Trichy 620018",
    outletId: "out-02",
    outletName: "SGN Superstore - Thillai Nagar",
    channel: "ONLINE",
    items: [
      { name: "Human Mixtard 30/70 Cartridge", qty: 2, price: 520, isRx: true },
      { name: "Accu-Chek Active Test Strips (50s)", qty: 1, price: 975, isRx: false },
    ],
    total: 2015,
    paymentMethod: "UPI",
    paymentStatus: "PAID",
    status: "OUT_FOR_DELIVERY",
    isPrescriptionOrder: true,
    rxRefId: "SGN-RX-912044",
    doctorName: "Dr. S. Rangarajan",
    riderName: "K. Manikandan (+91 99401 22334)",
    riderPhone: "+91 99401 22334",
    createdAt: "10:15 AM",
    deliveryType: "EXPRESS_2HR",
  },
  {
    id: "ord-903",
    orderNumber: "SGN-894122",
    customerId: "cust-01",
    customerName: "Anand Kumar",
    customerPhone: "+91 98401 23456",
    customerAddress: "Flat 4B, SRM Road, Kattankulathur, Chennai 603203",
    outletId: "out-04",
    outletName: "SGN Superstore - Anna Nagar",
    channel: "ONLINE",
    items: [
      { name: "Paracetamol 500mg IP (500 Tabs)", qty: 1, price: 53, isRx: false },
    ],
    total: 53,
    paymentMethod: "UPI",
    paymentStatus: "PAID",
    status: "DELIVERED",
    isPrescriptionOrder: false,
    createdAt: "Yesterday",
    deliveryType: "STANDARD_SAME_DAY",
  },
  {
    id: "ord-904",
    orderNumber: "SGN-894123",
    customerId: "cust-03",
    customerName: "Nandita Pillai",
    customerPhone: "+91 98841 77210",
    customerAddress: "No. 88, Anna Salai, Chennai 600002",
    outletId: "out-05",
    outletName: "SGN Superstore - T. Nagar",
    channel: "ONLINE",
    items: [
      { name: "Pantocid 40mg (15 tabs)", qty: 2, price: 165, isRx: true },
      { name: "Accu-Chek Active Strips", qty: 1, price: 975, isRx: false },
    ],
    total: 1305,
    paymentMethod: "CREDIT_CARD",
    paymentStatus: "PAID",
    status: "PROCESSING",
    isPrescriptionOrder: true,
    rxRefId: "SGN-RX-772109",
    doctorName: "Dr. Deepa Natarajan",
    createdAt: "11:00 AM",
    deliveryType: "EXPRESS_2HR",
  },
  {
    id: "ord-906",
    orderNumber: "SGN-894125",
    customerId: "cust-03",
    customerName: "Nandita Pillai",
    customerPhone: "+91 98841 77210",
    customerAddress: "No. 88, Anna Salai, Chennai 600002",
    outletId: "out-11",
    outletName: "SGN Superstore - RS Puram",
    channel: "ONLINE",
    items: [
      { name: "Paracetamol 500mg IP (500 Tabs)", qty: 2, price: 53, isRx: false },
    ],
    total: 106,
    paymentMethod: "UPI",
    paymentStatus: "PAID",
    status: "OUT_FOR_DELIVERY",
    isPrescriptionOrder: false,
    riderName: "P. Vignesh (+91 98401 55667)",
    createdAt: "12:15 PM",
    deliveryType: "EXPRESS_2HR",
  },
];

/* -------------------------------------------------------------
   INITIAL OUTLET FACULTY & STAFF ACCOUNTS (NO SALARY)
   Roles: SUPER_ADMIN, OUTLET_ADMIN, DELIVERY_MAN
------------------------------------------------------------- */
export const INITIAL_STAFF_ACCOUNTS: OutletStaffAccount[] = [
  {
    id: "acc-01",
    empCode: "SGN-ADM-001",
    responsiblePerson: "Dr. A. Balasubramanian",
    role: "SUPER_ADMIN",
    outletId: "out-01",
    outletName: "All 14 Superstores (TN Network)",
    phone: "+91 98401 00000",
    email: "admin@sgnpharmacy.com",
    status: "ACTIVE",
    lastLogin: "Today, 14:30 IST",
    createdAt: "2020-01-15",
  },
  {
    id: "acc-02",
    empCode: "SGN-OUT-002",
    responsiblePerson: "K. Venkatesh (M.Pharm)",
    role: "OUTLET_ADMIN",
    outletId: "out-01",
    outletName: "SGN Superstore - Samayapuram",
    phone: "+91 98424 00002",
    email: "samayapuram.admin@sgnpharmacy.com",
    status: "ACTIVE",
    lastLogin: "Today, 08:30 IST",
    createdAt: "2020-03-01",
  },
  {
    id: "acc-03",
    empCode: "SGN-OUT-003",
    responsiblePerson: "Dr. P. Rajesh (Pharm.D)",
    role: "OUTLET_ADMIN",
    outletId: "out-04",
    outletName: "SGN Superstore - Anna Nagar",
    phone: "+91 98401 11223",
    email: "annanagar.admin@sgnpharmacy.com",
    status: "ACTIVE",
    lastLogin: "Today, 09:15 IST",
    createdAt: "2021-06-10",
  },
  {
    id: "acc-04",
    empCode: "SGN-DEL-004",
    responsiblePerson: "R. Saravanan",
    role: "DELIVERY_MAN",
    outletId: "out-04",
    outletName: "SGN Superstore - Anna Nagar",
    phone: "+91 99401 88120",
    email: "saravanan.rider@sgnpharmacy.com",
    status: "ACTIVE",
    lastLogin: "Today, 09:45 IST",
    createdAt: "2023-01-10",
  },
  {
    id: "acc-05",
    empCode: "SGN-OUT-005",
    responsiblePerson: "M. Balaji (Pharm.D)",
    role: "OUTLET_ADMIN",
    outletId: "out-02",
    outletName: "SGN Superstore - Thillai Nagar",
    phone: "+91 431 274 1890",
    email: "thillainagar.admin@sgnpharmacy.com",
    status: "ACTIVE",
    lastLogin: "Today, 08:45 IST",
    createdAt: "2021-02-14",
  },
  {
    id: "acc-06",
    empCode: "SGN-DEL-006",
    responsiblePerson: "K. Manikandan",
    role: "DELIVERY_MAN",
    outletId: "out-02",
    outletName: "SGN Superstore - Thillai Nagar",
    phone: "+91 99401 22334",
    email: "manikandan.rider@sgnpharmacy.com",
    status: "ACTIVE",
    lastLogin: "Today, 10:00 IST",
    createdAt: "2023-04-12",
  },
  {
    id: "acc-07",
    empCode: "SGN-OUT-007",
    responsiblePerson: "S. Muralidharan (B.Pharm)",
    role: "OUTLET_ADMIN",
    outletId: "out-05",
    outletName: "SGN Superstore - T. Nagar",
    phone: "+91 44 2815 4432",
    email: "tnagar.admin@sgnpharmacy.com",
    status: "ACTIVE",
    lastLogin: "Today, 09:00 IST",
    createdAt: "2022-01-20",
  },
];

/* -------------------------------------------------------------
   INITIAL CUSTOMERS / PATIENTS MASTER
------------------------------------------------------------- */
export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: "cust-01",
    healthId: "SGN-HID-88412",
    name: "Anand Kumar",
    phone: "+91 98401 23456",
    email: "anand.kumar@gmail.com",
    age: 42,
    gender: "Male",
    address: "Flat 4B, SRM Road, Kattankulathur, Chennai 603203",
    city: "Chennai / Trichy",
    totalOrders: 18,
    totalSpend: 14250,
    walletBalance: 350,
    chronicCondition: "Mild Hypertension",
    allergies: "Penicillin (Mild rash)",
    bloodGroup: "O+",
    refillSubscriber: true,
    registeredSince: "2024-02-14",
  },
  {
    id: "cust-02",
    healthId: "SGN-HID-44120",
    name: "Meenakshi Sundaram",
    phone: "+91 94431 88902",
    email: "meenakshi.s@gmail.com",
    age: 64,
    gender: "Female",
    address: "11th Cross West, Thillai Nagar, Trichy 620018",
    city: "Samayapuram, Trichy",
    totalOrders: 32,
    totalSpend: 28900,
    walletBalance: 520,
    chronicCondition: "Type 2 Diabetes & Cardiac",
    allergies: "None",
    bloodGroup: "B+",
    refillSubscriber: true,
    registeredSince: "2023-08-10",
  },
  {
    id: "cust-03",
    healthId: "SGN-HID-99014",
    name: "Nandita Pillai",
    phone: "+91 98841 77210",
    email: "nandita.p@outlook.com",
    age: 29,
    gender: "Female",
    address: "No. 88, Anna Salai, Chennai 600002",
    city: "Chennai",
    totalOrders: 9,
    totalSpend: 6800,
    walletBalance: 150,
    chronicCondition: "None",
    allergies: "Dust / Pollen",
    bloodGroup: "A+",
    refillSubscriber: false,
    registeredSince: "2025-01-05",
  },
];

/* -------------------------------------------------------------
   INITIAL PROMO COUPONS & DISCOUNTS
------------------------------------------------------------- */
export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "coup-01",
    code: "SGNWELCOME50",
    title: "Welcome First Order Discount",
    discountType: "FLAT",
    discountValue: 50,
    minOrderValue: 299,
    expiryDate: "2026-12-31",
    usageLimit: 5000,
    usedCount: 1420,
    status: "ACTIVE",
    applicableCategory: "All Categories",
    description: "Flat ₹50 off on first online order above ₹299 across Tamil Nadu.",
  },
  {
    id: "coup-02",
    code: "CHRONIC20",
    title: "Monthly Chronic Care Refill 20% Off",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrderValue: 999,
    maxDiscount: 350,
    expiryDate: "2026-10-31",
    usageLimit: 2000,
    usedCount: 880,
    status: "ACTIVE",
    applicableCategory: "Diabetic & Cardiac Care",
    description: "20% discount up to ₹350 on monthly chronic care medication orders.",
  },
  {
    id: "coup-03",
    code: "FREEDEL2HR",
    title: "Free 2-Hour Express Delivery",
    discountType: "FLAT",
    discountValue: 40,
    minOrderValue: 499,
    expiryDate: "2026-09-30",
    usageLimit: 10000,
    usedCount: 4210,
    status: "ACTIVE",
    applicableCategory: "All Categories",
    description: "Free express delivery fee waiver on orders above ₹499.",
  },
  {
    id: "coup-04",
    code: "DIABETES15",
    title: "Diabetes Care & Test Strips Savings",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minOrderValue: 799,
    maxDiscount: 200,
    expiryDate: "2026-08-31",
    usageLimit: 1500,
    usedCount: 1490,
    status: "ACTIVE",
    applicableCategory: "Diabetic Care & Health Devices",
    description: "15% off on Accu-Chek, OneTouch test strips and Glucometers.",
  },
];
