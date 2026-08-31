# Garden State Auto Tech - ERP para Taller Automotriz (New Jersey, USA)

Sistema integral de gestión operativa y financiera para talleres de reparación de vehículos, diseñado y optimizado específicamente bajo la normativa fiscal y de protección al consumidor del estado de **New Jersey (NJ Division of Consumer Affairs y NJ Division of Taxation)**.

---

## 🚀 Módulos y Capacidades

1. **Recepción de Vehículos (Check-In) con NHTSA VIN Decoder:**
   - Decodificación automática de VIN de 17 caracteres conectada a la API oficial del gobierno de EE. UU. (NHTSA vPIC).
   - Registro de odómetro de entrada (*Odometer In*), nivel de combustible e inspección de luces de advertencia en tablero (Check Engine, TPMS, Frenos, Batería, etc.).
   - Declaración de retiro de objetos de valor y aceptación legal de ingreso.

2. **Tablero Kanban de Taller (Shop Floor Management):**
   - 8 Etapas operativas: `Recepción` ➔ `Diagnóstico` ➔ `Esperando Aprobación` ➔ `En Reparación` ➔ `Esperando Repuestos` ➔ `Control de Calidad` ➔ `Listo para Entrega` ➔ `Entregado y Facturado`.
   - Asignación de mecánicos/técnicos por orden.
   - Desglose de mano de obra (*Labor Hours*), repuestos con clasificación requerida por NJ (*OEM, Aftermarket, Rebuilt*) y cargos por insumos/hazmat.

3. **Presupuestos y Estimaciones Previas (NJ Compliance):**
   - Cumplimiento de la regla **N.J.A.C. 13:45A-26C** (presupuesto previo obligatorio, aviso de tolerancia del 10% / $25).
   - Conversión de presupuestos aprobados a órdenes de trabajo en 1 clic.

4. **Facturación Oficial de New Jersey & Cuentas por Cobrar (CxC):**
   - Factura detallada legal con desglose de repuestos nuevos/remanufacturados, lectura de odómetro de entrada y salida, y aviso de devolución de piezas viejas.
   - Cálculo automático del **New Jersey Sales Tax (6.625%)**.
   - Gestión de cobros múltiples (Efectivo, Tarjeta, Zelle, Cheque, Crédito de Flotas).
   - Control de saldo deudor y antigüedad de saldos (CxC).
   - Formato listo para impresión física o guardado en PDF (`@media print`).

5. **Suplidores y Cuentas por Pagar (CxP):**
   - Directorio de proveedores de repuestos (AutoZone, Worldpac, NAPA, etc.).
   - Registro de facturas de compra a crédito (Net 30, Net 15) y control de saldos vencidos.

6. **Inventario & Alertas de Stock Mínimo:**
   - Catálogo de repuestos por número de parte, ubicación de estantería (*Bin*), costo y precio de venta.
   - Alertas automáticas de reorden para piezas con bajo stock.

7. **Control Financiero & Asistente Fiscal ST-50:**
   - Indicadores en tiempo real: Ingresos brutos, Margen por mano de obra vs. repuestos, Ganancia neta.
   - Resumen acumulado de impuestos de venta para la declaración estatal de New Jersey (Formulario ST-50).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend & Backend:** Next.js 15 (App Router, Server Components & Actions)
- **Lenguaje:** TypeScript 5.7
- **Estilos:** Tailwind CSS 3.4
- **Iconos:** Lucide React
- **Base de Datos & ORM:** Prisma ORM con SQLite (local) / PostgreSQL (producción)
- **Contenedores:** Docker & Docker Compose
- **Despliegue:** Optimizado para DigitalOcean Droplet y App Platform

---

## 💻 Instalación y Uso Local

```bash
# 1. Instalar dependencias
npm install

# 2. Generar cliente de base de datos
npx prisma generate
npx prisma db push

# 3. Poblar datos iniciales de prueba (técnicos, suplidores, inventario, órdenes)
node prisma/seed.js

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🌐 Despliegue en DigitalOcean

Consulta la guía completa en [DIGITALOCEAN_DEPLOYMENT_GUIDE.md](file:///DIGITALOCEAN_DEPLOYMENT_GUIDE.md).
