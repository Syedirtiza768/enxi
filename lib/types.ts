// User related types
export interface User {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: string
  name: string
  module: string
  action: "create" | "read" | "update" | "delete"
  createdAt: string
  updatedAt: string
}

// Customer related types
export interface Customer {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  taxId: string
  notes: string
  createdAt: string
  updatedAt: string
}

// Accounting related types
export interface Account {
  id: string
  code: string
  name: string
  type: "asset" | "liability" | "equity" | "revenue" | "expense"
  parentId: string | null
  balance: number
  currency: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface JournalEntry {
  id: string
  date: string
  reference: string
  description: string
  debitTotal: number
  creditTotal: number
  status: "draft" | "posted"
  lines: JournalLine[]
  createdAt: string
  updatedAt: string
}

export interface JournalLine {
  id: string
  journalEntryId: string
  accountId: string
  account: Account
  description: string
  debit: number
  credit: number
  projectId?: string
  customerId?: string
}

// Inventory related types
export interface InventoryItem {
  id: string
  sku: string
  name: string
  description: string
  category: string
  unitOfMeasure: string
  costPrice: number
  sellingPrice: number
  quantity: number
  reorderLevel: number
  location: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface InventoryMovement {
  id: string
  date: string
  type: "purchase" | "sale" | "adjustment" | "transfer"
  reference: string
  inventoryItemId: string
  inventoryItem: InventoryItem
  quantity: number
  unitCost: number
  totalCost: number
  notes: string
  createdAt: string
  updatedAt: string
}

// Quotation related types
export interface Quotation {
  id: string
  number: string
  date: string
  validUntil: string
  customerId: string
  customer: Customer
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  notes: string
  terms: string
  items: QuotationItem[]
  createdAt: string
  updatedAt: string
}

export interface QuotationItem {
  id: string
  quotationId: string
  inventoryItemId: string
  inventoryItem: InventoryItem
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  discountRate: number
  total: number
}

// Project related types
export interface Project {
  id: string
  name: string
  code: string
  description: string
  customerId: string
  customer: Customer
  startDate: string
  endDate: string
  status: "planned" | "in-progress" | "on-hold" | "completed" | "cancelled"
  budget: number
  actualCost: number
  progress: number
  managerId: string
  manager: User
  createdAt: string
  updatedAt: string
}

// Delivery and Invoicing related types
export interface DeliveryNote {
  id: string
  number: string
  date: string
  projectId: string
  project: Project
  customerId: string
  customer: Customer
  status: "draft" | "delivered" | "cancelled"
  notes: string
  items: DeliveryItem[]
  createdAt: string
  updatedAt: string
}

export interface DeliveryItem {
  id: string
  deliveryNoteId: string
  inventoryItemId: string
  inventoryItem: InventoryItem
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  projectId: string
  project: Project
  customerId: string
  customer: Customer
  status: "draft" | "sent" | "paid" | "partially-paid" | "overdue" | "cancelled"
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  amountPaid: number
  amountDue: number
  notes: string
  terms: string
  items: InvoiceItem[]
  payments: Payment[]
  createdAt: string
  updatedAt: string
}

export interface InvoiceItem {
  id: string
  invoiceId: string
  deliveryItemId?: string
  inventoryItemId?: string
  inventoryItem?: InventoryItem
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  discountRate: number
  total: number
}

export interface Payment {
  id: string
  date: string
  invoiceId: string
  invoice: Invoice
  amount: number
  method: "cash" | "bank-transfer" | "credit-card" | "check" | "other"
  reference: string
  notes: string
  createdAt: string
  updatedAt: string
}
