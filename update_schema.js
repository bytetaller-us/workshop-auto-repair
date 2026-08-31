const fs = require('fs');

const schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           String      @id @default(cuid())
  username     String      @unique
  email        String?
  passwordHash String
  fullName     String
  role         String      @default("MANAGER") // ADMIN, MANAGER, TECHNICIAN, CASHIER
  isActive     Boolean     @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  auditLogs    AuditLog[]
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  username    String
  userRole    String
  action      String   // LOGIN, LOGOUT, CREATE, UPDATE, DELETE, PAYMENT, INVOICE, STATUS_CHANGE, SETTINGS_CHANGE
  module      String   // AUTH, WORK_ORDERS, ESTIMATES, INVOICES, INVENTORY, SUPPLIERS, SETTINGS, USERS
  description String
  details     String?  // JSON string of specifics
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
}

model Customer {
  id          String       @id @default(cuid())
  firstName   String
  lastName    String
  email       String?
  phone       String
  address     String?
  city        String?
  state       String?      @default("NJ")
  zip         String?
  isTaxExempt Boolean      @default(false)
  taxExemptId String?
  notes       String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  vehicles    Vehicle[]
  workOrders  WorkOrder[]
  estimates   Estimate[]
  invoices    Invoice[]
  payments    Payment[]
}

model Vehicle {
  id           String        @id @default(cuid())
  customerId   String
  customer     Customer      @relation(fields: [customerId], references: [id], onDelete: Cascade)
  vin          String        @unique
  licensePlate String
  state        String        @default("NJ")
  year         Int
  make         String
  model        String
  trim         String?
  engine       String?
  color        String?
  transmission String?
  currentOdo   Int           @default(0)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  inspections  Inspection[]
  workOrders   WorkOrder[]
  estimates    Estimate[]
}

model Inspection {
  id                String       @id @default(cuid())
  vehicleId         String
  vehicle           Vehicle      @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  odometerIn        Int
  fuelLevel         String       @default("HALF")
  warningLights     String?
  damagePoints      String?
  customerConcerns  String
  valuablesRemoved  Boolean      @default(true)
  customerSignature String?
  status            String       @default("COMPLETED")
  createdAt         DateTime     @default(now())
  workOrder         WorkOrder?
}

model Estimate {
  id                String            @id @default(cuid())
  estimateNumber    String            @unique
  vehicleId         String
  vehicle           Vehicle           @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  customerId        String
  customer          Customer          @relation(fields: [customerId], references: [id], onDelete: Cascade)
  status            String            @default("DRAFT")
  laborSubtotal     Float             @default(0.0)
  partsSubtotal     Float             @default(0.0)
  shopSuppliesFee   Float             @default(0.0)
  hazardousWasteFee Float             @default(0.0)
  salesTaxRate      Float             @default(0.06625)
  salesTaxAmount    Float             @default(0.0)
  totalAmount       Float             @default(0.0)
  authorizedBy      String?
  authorizedAt      DateTime?
  customerSignature String?
  notes             String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  items             WorkOrderItem[]
  workOrder         WorkOrder?
}

model WorkOrder {
  id                String            @id @default(cuid())
  orderNumber       String            @unique
  vehicleId         String
  vehicle           Vehicle           @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  customerId        String
  customer          Customer          @relation(fields: [customerId], references: [id], onDelete: Cascade)
  inspectionId      String?           @unique
  inspection        Inspection?       @relation(fields: [inspectionId], references: [id])
  estimateId        String?           @unique
  estimate          Estimate?         @relation(fields: [estimateId], references: [id])
  technicianId      String?
  technician        Technician?       @relation(fields: [technicianId], references: [id])
  status            String            @default("INTAKE")
  priority          String            @default("NORMAL")
  odometerIn        Int
  odometerOut       Int?
  notes             String?
  diagnosticsReport String?
  qualityCheckNotes String?
  qualityCheckedBy  String?
  startedAt         DateTime?
  completedAt       DateTime?
  deliveredAt       DateTime?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  items             WorkOrderItem[]
  timeLogs          TimeLog[]
  invoice           Invoice?
}

model WorkOrderItem {
  id          String      @id @default(cuid())
  workOrderId String?
  workOrder   WorkOrder?  @relation(fields: [workOrderId], references: [id], onDelete: Cascade)
  estimateId  String?
  estimate    Estimate?   @relation(fields: [estimateId], references: [id], onDelete: Cascade)
  type        String
  description String
  partNumber  String?
  partType    String?     @default("NEW_AFTERMARKET")
  quantity    Float       @default(1.0)
  unitCost    Float       @default(0.0)
  unitPrice   Float       @default(0.0)
  totalPrice  Float       @default(0.0)
  isTaxable   Boolean     @default(true)
  isApproved  Boolean     @default(true)
  createdAt   DateTime    @default(now())
}

model Technician {
  id             String       @id @default(cuid())
  name           String
  email          String?
  phone          String?
  specialty      String?
  hourlyLaborRate Float       @default(120.0)
  commissionRate Float        @default(0.0)
  isActive       Boolean      @default(true)
  createdAt      DateTime     @default(now())
  workOrders     WorkOrder[]
  timeLogs       TimeLog[]
}

model TimeLog {
  id           String      @id @default(cuid())
  workOrderId  String
  workOrder    WorkOrder   @relation(fields: [workOrderId], references: [id], onDelete: Cascade)
  technicianId String
  technician   Technician  @relation(fields: [technicianId], references: [id], onDelete: Cascade)
  startTime    DateTime    @default(now())
  endTime      DateTime?
  durationMin  Int         @default(0)
  taskNote     String?
  createdAt    DateTime    @default(now())
}

model Invoice {
  id                   String        @id @default(cuid())
  invoiceNumber        String        @unique
  workOrderId          String        @unique
  workOrder            WorkOrder     @relation(fields: [workOrderId], references: [id])
  customerId           String
  customer             Customer      @relation(fields: [customerId], references: [id])
  status               String        @default("UNPAID")
  issueDate            DateTime      @default(now())
  dueDate              DateTime
  laborSubtotal        Float         @default(0.0)
  partsSubtotal        Float         @default(0.0)
  shopSuppliesFee      Float         @default(0.0)
  hazardousWasteFee    Float         @default(0.0)
  salesTaxRate         Float         @default(0.06625)
  salesTaxAmount       Float         @default(0.0)
  totalAmount          Float         @default(0.0)
  paidAmount           Float         @default(0.0)
  balanceDue           Float         @default(0.0)
  replacedPartsReturned Boolean      @default(false)
  warrantyTerms        String?       @default("12 Months / 12,000 Miles Parts & Labor Warranty")
  notes                String?
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt
  payments             Payment[]
}

model Payment {
  id            String    @id @default(cuid())
  invoiceId     String
  invoice       Invoice   @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  customerId    String
  customer      Customer  @relation(fields: [customerId], references: [id])
  amount        Float
  paymentMethod String
  referenceNumber String?
  notes         String?
  paidAt        DateTime  @default(now())
  createdAt     DateTime  @default(now())
}

model Supplier {
  id           String         @id @default(cuid())
  name         String
  contactName  String?
  phone        String
  email        String?
  address      String?
  city         String?
  state        String?        @default("NJ")
  zip          String?
  accountNumber String?
  paymentTerms String         @default("Net 30")
  notes        String?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  bills        SupplierBill[]
  inventory    InventoryItem[]
}

model SupplierBill {
  id           String    @id @default(cuid())
  billNumber   String
  supplierId   String
  supplier     Supplier  @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  issueDate    DateTime  @default(now())
  dueDate      DateTime
  totalAmount  Float
  paidAmount   Float     @default(0.0)
  balanceDue   Float
  status       String    @default("UNPAID")
  notes        String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model InventoryItem {
  id              String    @id @default(cuid())
  partNumber      String    @unique
  name            String
  category        String
  brand           String?
  description     String?
  unitCost        Float     @default(0.0)
  sellingPrice    Float     @default(0.0)
  quantityInStock Int       @default(0)
  minStockAlert   Int       @default(2)
  binLocation     String?
  supplierId      String?
  supplier        Supplier? @relation(fields: [supplierId], references: [id])
  isTaxable       Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ShopSetting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
}
`;

fs.writeFileSync('prisma/schema.prisma', schema, 'utf8');
console.log('schema.prisma updated with User and AuditLog models');
