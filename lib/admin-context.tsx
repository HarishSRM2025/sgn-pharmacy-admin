"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Outlet,
  MedicineItem,
  PrescriptionVerification,
  AdminOrder,
  OutletStaffAccount,
  CustomerProfile,
  Coupon,
  INITIAL_OUTLETS,
  INITIAL_MEDICINES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_ORDERS,
  INITIAL_STAFF_ACCOUNTS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
} from "./admin-data";

type AdminContextType = {
  selectedOutlet: string;
  setSelectedOutlet: (id: string) => void;
  outlets: Outlet[];
  medicines: MedicineItem[];
  prescriptions: PrescriptionVerification[];
  orders: AdminOrder[];
  staffAccounts: OutletStaffAccount[];
  customers: CustomerProfile[];
  coupons: Coupon[];

  // Actions
  convertPrescriptionToOrder: (
    rxId: string,
    deliveryType?: AdminOrder["deliveryType"],
    notes?: string
  ) => AdminOrder | null;
  rejectPrescription: (rxId: string, reason: string) => void;
  updateOrderStatus: (orderId: string, status: AdminOrder["status"]) => void;
  adjustStock: (medicineId: string, outletId: string, delta: number) => void;
  addMedicine: (medicine: MedicineItem) => void;
  addOutlet: (outlet: Outlet) => void;
  addStaffAccount: (account: OutletStaffAccount) => void;
  updateStaffAccountStatus: (accId: string, status: OutletStaffAccount["status"]) => void;
  addCustomer: (customer: CustomerProfile) => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (couponId: string) => void;
  deleteCoupon: (couponId: string) => void;

  // Counts & metrics
  pendingRxCount: number;
  activeOrdersCount: number;
  lowStockCount: number;
  totalDailyRevenue: number;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [selectedOutlet, setSelectedOutlet] = useState<string>("ALL_TN");
  const [outlets, setOutlets] = useState<Outlet[]>(INITIAL_OUTLETS);
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [prescriptions, setPrescriptions] = useState<PrescriptionVerification[]>(INITIAL_PRESCRIPTIONS);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [staffAccounts, setStaffAccounts] = useState<OutletStaffAccount[]>(INITIAL_STAFF_ACCOUNTS);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // Load persistent updates from localStorage
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("sgn_admin_orders_v4");
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      const savedRx = localStorage.getItem("sgn_admin_rx_v4");
      if (savedRx) setPrescriptions(JSON.parse(savedRx));
      const savedOutlets = localStorage.getItem("sgn_admin_outlets_v4");
      if (savedOutlets) setOutlets(JSON.parse(savedOutlets));
      const savedStaff = localStorage.getItem("sgn_admin_staff_v4");
      if (savedStaff) setStaffAccounts(JSON.parse(savedStaff));
      const savedMeds = localStorage.getItem("sgn_admin_meds_v4");
      if (savedMeds) setMedicines(JSON.parse(savedMeds));
      const savedCoupons = localStorage.getItem("sgn_admin_coupons_v4");
      if (savedCoupons) setCoupons(JSON.parse(savedCoupons));
    } catch {
      // no-op
    }
  }, []);

  const addOutlet = (outlet: Outlet) => {
    setOutlets((prev) => {
      const updated = [outlet, ...prev];
      try {
        localStorage.setItem("sgn_admin_outlets_v4", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const convertPrescriptionToOrder = (
    rxId: string,
    deliveryType: AdminOrder["deliveryType"] = "EXPRESS_2HR",
    notes?: string
  ): AdminOrder | null => {
    const rx = prescriptions.find((p) => p.id === rxId);
    if (!rx) return null;

    const assignedOutlet = outlets.find((o) => o.id === rx.allocatedOutlet) || outlets[0];
    const orderItems = rx.prescribedMeds.map((m) => ({
      name: m.name,
      qty: m.qty || 1,
      price: m.price || 150,
      isRx: true,
    }));
    const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

    const newOrderNumber = `SGN-${Math.floor(890000 + Math.random() * 100000)}`;
    const newOrderId = `ord-${Date.now()}`;

    const newOrder: AdminOrder = {
      id: newOrderId,
      orderNumber: newOrderNumber,
      customerId: rx.patientId,
      customerName: rx.patientName,
      customerPhone: rx.patientPhone,
      customerAddress: rx.patientAddress,
      outletId: rx.allocatedOutlet,
      outletName: assignedOutlet.name,
      channel: "ONLINE",
      items: orderItems,
      total,
      paymentMethod: "UPI",
      paymentStatus: "PAID",
      status: "PROCESSING",
      isPrescriptionOrder: true,
      rxRefId: rx.refId,
      doctorName: rx.doctorName,
      createdAt: "Just now (Online Verified)",
      deliveryType,
    };

    const updatedRx = prescriptions.map((p) =>
      p.id === rxId
        ? {
            ...p,
            status: "CONVERTED_TO_ORDER" as const,
            convertedOrderId: newOrderId,
            verifiedBy: "Dr. A. Balasubramanian (Super Admin)",
            notes: notes || p.notes,
          }
        : p
    );

    const updatedOrders = [newOrder, ...orders];

    setPrescriptions(updatedRx);
    setOrders(updatedOrders);

    try {
      localStorage.setItem("sgn_admin_rx_v4", JSON.stringify(updatedRx));
      localStorage.setItem("sgn_admin_orders_v4", JSON.stringify(updatedOrders));
    } catch {}

    return newOrder;
  };

  const rejectPrescription = (rxId: string, reason: string) => {
    setPrescriptions((prev) => {
      const updated = prev.map((p) =>
        p.id === rxId
          ? {
              ...p,
              status: "REJECTED" as const,
              notes: reason,
              verifiedBy: "Dr. A. Balasubramanian (Super Admin)",
            }
          : p
      );
      try {
        localStorage.setItem("sgn_admin_rx_v4", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateOrderStatus = (orderId: string, status: AdminOrder["status"]) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
      try {
        localStorage.setItem("sgn_admin_orders_v4", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const adjustStock = (medicineId: string, outletId: string, delta: number) => {
    setMedicines((prev) => {
      const updated = prev.map((m) => {
        if (m.id === medicineId) {
          const newTotal = Math.max(0, m.stockTotal + delta);
          return {
            ...m,
            stockTotal: newTotal,
            status: newTotal <= m.reorderLevel ? ("LOW_STOCK" as const) : ("IN_STOCK" as const),
          };
        }
        return m;
      });
      try {
        localStorage.setItem("sgn_admin_meds_v4", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addMedicine = (medicine: MedicineItem) => {
    setMedicines((prev) => {
      const updated = [medicine, ...prev];
      try {
        localStorage.setItem("sgn_admin_meds_v4", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addStaffAccount = (account: OutletStaffAccount) => {
    setStaffAccounts((prev) => {
      const updated = [account, ...prev];
      try {
        localStorage.setItem("sgn_admin_staff_v4", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateStaffAccountStatus = (accId: string, status: OutletStaffAccount["status"]) => {
    setStaffAccounts((prev) => {
      const updated = prev.map((a) => (a.id === accId ? { ...a, status } : a));
      try {
        localStorage.setItem("sgn_admin_staff_v4", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addCustomer = (customer: CustomerProfile) => {
    setCustomers((prev) => [customer, ...prev]);
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const updated = [coupon, ...prev];
      try {
        localStorage.setItem("sgn_admin_coupons_v4", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleCouponStatus = (couponId: string) => {
    setCoupons((prev) => {
      const updated = prev.map((c) =>
        c.id === couponId
          ? {
              ...c,
              status: (c.status === "ACTIVE" ? "DISABLED" : "ACTIVE") as Coupon["status"],
            }
          : c
      );
      try {
        localStorage.setItem("sgn_admin_coupons_v4", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons((prev) => {
      const updated = prev.filter((c) => c.id !== couponId);
      try {
        localStorage.setItem("sgn_admin_coupons_v4", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const pendingRxCount = prescriptions.filter((p) => p.status === "PENDING_VERIFICATION").length;
  const activeOrdersCount = orders.filter((o) => o.status === "OUT_FOR_DELIVERY" || o.status === "PROCESSING").length;
  const lowStockCount = medicines.filter((m) => m.stockTotal <= m.reorderLevel).length;
  const totalDailyRevenue = outlets.reduce((sum, o) => sum + o.dailyRevenue, 0);

  return (
    <AdminContext.Provider
      value={{
        selectedOutlet,
        setSelectedOutlet,
        outlets,
        medicines,
        prescriptions,
        orders,
        staffAccounts,
        customers,
        coupons,
        addOutlet,
        convertPrescriptionToOrder,
        rejectPrescription,
        updateOrderStatus,
        adjustStock,
        addMedicine,
        addStaffAccount,
        updateStaffAccountStatus,
        addCustomer,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        pendingRxCount,
        activeOrdersCount,
        lowStockCount,
        totalDailyRevenue,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
