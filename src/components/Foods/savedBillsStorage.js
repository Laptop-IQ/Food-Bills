const STORAGE_KEY = "food_bills_v1";

/**
 * Safely read saved bills.
 */
export function getSavedBills() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read saved bills:", error);
    return [];
  }
}

/**
 * Save complete bill.
 */
export function saveBill(bill, items) {
  const savedBills = getSavedBills();

  const now = new Date();

  const savedBill = {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,

    bill: {
      ...bill,
    },

    items: items.map((item) => ({
      ...item,
    })),

    createdAt: now.toISOString(),

    updatedAt: now.toISOString(),
  };

  const updatedBills = [savedBill, ...savedBills];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBills));

  return savedBill;
}

/**
 * Update an existing saved bill.
 */
export function updateSavedBill(id, bill, items) {
  const savedBills = getSavedBills();

  const updatedBills = savedBills.map((saved) =>
    saved.id === id
      ? {
          ...saved,
          bill: {
            ...bill,
          },
          items: items.map((item) => ({
            ...item,
          })),
          updatedAt: new Date().toISOString(),
        }
      : saved,
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBills));

  return updatedBills;
}

/**
 * Delete one saved bill.
 */
export function deleteSavedBill(id) {
  const savedBills = getSavedBills();

  const updatedBills = savedBills.filter((saved) => saved.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBills));

  return updatedBills;
}

/**
 * Delete all saved bills.
 */
export function clearSavedBills() {
  localStorage.removeItem(STORAGE_KEY);
}
