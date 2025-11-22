
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Sidebar, navGroups } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { JournalEntriesListPage } from './components/financial-accounting/JournalEntriesListPage';
import { NewJournalEntryPage } from './components/financial-accounting/NewJournalEntryPage';
import { ConvertDocumentsPage } from './components/financial-accounting/ConvertDocumentsPage';
import { RecurringEntriesPage } from './components/financial-accounting/gl/RecurringEntriesPage';
import { YearEndClosingPage } from './components/financial-accounting/gl/YearEndClosingPage';
import { JournalEntryTemplatesPage } from './components/financial-accounting/gl/JournalEntryTemplatesPage';
import { NewReceiptPage } from './components/treasury/NewReceiptPage';
import { NewPaymentPage } from './components/treasury/NewPaymentPage';
import { BankOperationsPage } from './components/treasury/BankOperationsPage';
import { NewCheckPage } from './components/treasury/NewCheckPage';
import { TreasuryListPage as TreasuryDashboardPage } from './components/treasury/TreasuryListPage';
import { CashFlowForecastPage } from './components/treasury/CashFlowForecastPage';
import { BankReconciliationPage } from './components/treasury/BankReconciliationPage';
import { NewInvoicePage } from './components/sales/NewInvoicePage';
import { ToastContainer } from './components/common/Toast';
import { SupplierInvoicesListPage } from './components/financial-accounting/ap/SupplierInvoicesListPage';
import { SupplierPaymentsPage } from './components/financial-accounting/ap/SupplierPaymentsPage';
import { AgingReportPage as APRAgingReportPage } from './components/financial-accounting/ap/AgingReportPage';
import { CustomerInvoicesListPage } from './components/financial-accounting/ar/CustomerInvoicesListPage';
import { CustomerReceiptsPage } from './components/financial-accounting/ar/CustomerReceiptsPage';
import { DunningReportPage } from './components/financial-accounting/ar/DunningReportPage';
import { CostAllocationPage } from './components/financial-accounting/cost/CostAllocationPage';
import { CostCenterReportPage } from './components/financial-accounting/cost/CostCenterReportPage';
import { StandardCostingPage } from './components/financial-accounting/cost/StandardCostingPage';
import { ActivityBasedCostingPage } from './components/financial-accounting/cost/ActivityBasedCostingPage';
import { InternalOrdersPage } from './components/financial-accounting/cost/InternalOrdersPage';
import { DefineBudgetPage } from './components/financial-accounting/budget/DefineBudgetPage';
import { BudgetActualsReportPage } from './components/financial-accounting/budget/BudgetActualsReportPage';
import { StandardReportsPage } from './components/financial-accounting/reports/StandardReportsPage';
import { FinancialStatementsPage } from './components/financial-accounting/reports/FinancialStatementsPage';
import { AssetMasterPage } from './components/asset-management/AssetMasterPage';
import { DepreciationRunPage } from './components/asset-management/DepreciationRunPage';
import { AssetTransactionsPage } from './components/asset-management/AssetTransactionsPage';
import { MaintenanceObjectsPage } from './components/asset-management/pm/MaintenanceObjectsPage';
import { MaintenanceOrdersPage } from './components/asset-management/pm/MaintenanceOrdersPage';
import { PreventiveMaintenancePage } from './components/asset-management/pm/PreventiveMaintenancePage';
import { ConsolidationPage } from './components/financial-accounting/reports/ConsolidationPage';
import { ReportBuilderPage } from './components/financial-accounting/reports/ReportBuilderPage';
import { TaxSettingsPage } from './components/financial-accounting/setup/TaxSettingsPage';
import { CurrencySettingsPage } from './components/financial-accounting/setup/CurrencySettingsPage';
import { NewQuotePage } from './components/sales/NewQuotePage';
import { NewOrderPage } from './components/sales/NewOrderPage';
import { NewDeliveryPage } from './components/sales/NewDeliveryPage';
import { SalesContractsPage } from './components/sales/SalesContractsPage';
import { OpportunitiesPage } from './components/sales/crm/OpportunitiesPage';
import { SupportTicketsPage } from './components/sales/crm/SupportTicketsPage';
import { ServiceContractsListPage } from './components/sales/crm/ServiceContractsListPage';
import { FieldServicePage } from './components/sales/crm/FieldServicePage';
import { POSTerminalsPage } from './components/sales/pos/POSTerminalsPage';
import { POSClosingPage } from './components/sales/pos/POSClosingPage';
import { PriceListsPage } from './components/sales/pricing/PriceListsPage';
import { DiscountsPage } from './components/sales/pricing/DiscountsPage';
import { PricingProcedurePage } from './components/sales/pricing/PricingProcedurePage';
import { PriceAnalysisPage } from './components/sales/pricing/PriceAnalysisPage';
import { InventoryMovementsPage } from './components/inventory/InventoryMovementsPage';
import { SalesAnalyticsDashboardPage } from './components/sales/analytics/SalesAnalyticsDashboardPage';
import { ProcurementAnalyticsDashboardPage } from './components/procurement/analytics/ProcurementAnalyticsDashboardPage';
import { PurchaseRequestPage } from './components/procurement/PurchaseRequestPage';
import { PurchaseOrderPage } from './components/procurement/PurchaseOrderPage';
import { GoodsReceiptPage } from './components/procurement/GoodsReceiptPage';
import { InventoryStocktakingPage } from './components/inventory/InventoryStocktakingPage';
import { RFQPage } from './components/procurement/RFQPage';
import { InvoiceVerificationPage } from './components/procurement/InvoiceVerificationPage';
import { PurchaseContractsPage } from './components/procurement/PurchaseContractsPage';
import { BatchSerialTraceabilityPage } from './components/inventory/BatchSerialTraceabilityPage';
import { QualityControlPage } from './components/inventory/QualityControlPage';
import { WarehouseStructurePage } from './components/warehouse/WarehouseStructurePage';
import { WarehouseStrategyPage } from './components/warehouse/WarehouseStrategyPage';
import { BarcodePrintingPage } from './components/warehouse/BarcodePrintingPage';
import { BOMPage } from './components/manufacturing/BOMPage';
import { WorkCenterPage } from './components/manufacturing/WorkCenterPage';
import { ProductionOrdersPage } from './components/manufacturing/ProductionOrdersPage';
import { MRPPage } from './components/manufacturing/MRPPage';
import { ShopFloorControlPage } from './components/manufacturing/ShopFloorControlPage';
import { ProductCostingPage } from './components/manufacturing/ProductCostingPage';
import { ProductionVariancePage } from './components/manufacturing/ProductionVariancePage';
import { ProjectDashboardPage } from './components/ps/ProjectReportsPage';
import { WBSPage } from './components/ps/WBSPage';
import { NetworkPage } from './components/ps/NetworkPage';
import { CostPlanningPage } from './components/ps/CostPlanningPage';
import { ResourcePlanningPage } from './components/ps/ResourcePlanningPage';
import { SchedulePage } from './components/ps/SchedulePage';
import { TimesheetPage } from './components/ps/TimesheetPage';
import { ProjectProcurementPage } from './components/ps/ProjectProcurementPage';
import { ProjectBillingPage } from './components/ps/ProjectBillingPage';
import { UsersPage } from './components/admin/UsersPage';
import { CompanyInfoPage } from './components/admin/CompanyInfoPage';
import { BIDashboardsPage } from './components/bi/BIDashboardsPage';

// Centralized Master Data Pages
import { AccountsPage as MasterDataAccountsPage } from './components/master-data/AccountsPage';
import { PartiesPage as MasterDataPartiesPage } from './components/master-data/PartiesPage';
import { GoodsPage as MasterDataGoodsPage } from './components/master-data/GoodsPage';
import { CostCentersPage as MasterDataCostCentersPage } from './components/master-data/CostCentersPage';
import { DetailedAccountsPage as MasterDataDetailedAccountsPage } from './components/master-data/DetailedAccountsPage';
import { BanksPage as MasterDataBanksPage } from './components/master-data/BanksPage';
import { BankAccountsPage as MasterDataBankAccountsPage } from './components/master-data/BankAccountsPage';
import { CashDeskPage as MasterDataCashDeskPage } from './components/master-data/CashDeskPage';
import { AssetClassesPage as MasterDataAssetClassesPage } from './components/master-data/AssetClassesPage';

// HCM Pages
import { EmployeeMasterPage } from './components/hcm/admin/EmployeeMasterPage';
import { OrgStructurePage } from './components/hcm/admin/OrgStructurePage';
import { PayrollCalculationPage } from './components/hcm/payroll/PayrollCalculationPage';
import { PayrollReportsPage } from './components/hcm/payroll/PayrollReportsPage';
import { AttendancePage } from './components/hcm/time/AttendancePage';
import { RecruitmentPage } from './components/hcm/talent/RecruitmentPage';
import { PerformancePage } from './components/hcm/talent/PerformancePage';
import { LearningPage } from './components/hcm/talent/LearningPage';
import { EmployeePortalPage } from './components/hcm/ess/EmployeePortalPage';


import type { JournalEntry, Check, TreasuryDoc, ToastData, AccountNode, Invoice, Good, Party, SupplierInvoice, SupplierPayment, RecurringEntry, FiscalYearStatus, JournalEntryTemplate, CustomerReceipt, CostCenterNode, StandardCost, ActualProductionData, Activity, InternalOrder, Budget, FixedAsset, AssetClass, TaxRate, Currency, ExchangeRate, TafsiliGroup, TafsiliAccount, CheckHistory, CheckStatus, Bank, BankAccount, BankStatementTransaction, CashDesk, Quote, SalesOrder, DeliveryNote, SalesContract, Opportunity, SupportTicket, TicketReply, ServiceContract, FieldServiceOrder, POSTerminal, POSTransaction, POSCloseout, PriceList, DiscountRule, PricingProcedure, InventoryMovement, PurchaseRequest, PurchaseRequestStatus, PurchaseOrder, GoodsReceipt, Stocktake, RFQ, PurchaseContract, Batch, SerialNumber, InspectionLot, WarehouseStructureNode, PutawayStrategy, PickingStrategy, BOM, WorkCenter, Routing, ProductionOrder, MRPDemand, MRPResult, BOMItem, RoutingOperation, ProjectDefinition, WBSNode, NetworkActivity, TimesheetEntry, ProjectBillingMilestone, Role, User, CompanyInfo, Employee, OrgUnit, Payslip, AttendanceRecord, JobOpening, Candidate, PerformanceReview, TrainingCourse, AssetTransaction, MaintenanceObject, MaintenanceOrder, PreventivePlan, BIWidget } from './types';
import { v4 as uuidv4 } from 'uuid';

// --- MOCK DATA HELPERS ---
const today = new Date();
const formatDate = (date: Date) => date.toLocaleDateString('fa-IR-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' });
const formatDateISO = (date: Date) => date.toISOString().split('T')[0];
const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

// --- MOCK DATA ---
const mockParties: Party[] = [
    { id: 'p1', code: '1001', name: 'شرکت پیشگامان', type: 'حقوقی', nationalId: '10101234567', phone: '02188888888', address: 'تهران، خیابان ولیعصر' },
    { id: 'p2', code: '1002', name: 'فروشگاه مرکزی', type: 'حقیقی', nationalId: '0012345678', phone: '09121234567', address: 'تهران، بازار' },
    { id: 'p3', code: '2001', name: 'تامین کالا گستر', type: 'حقوقی', nationalId: '14001234567', phone: '02166666666', address: 'تهران، خیابان آزادی' },
    { id: 'p4', code: '2002', name: 'بازرگانی پارس', type: 'حقوقی', nationalId: '14009876543', phone: '02177777777', address: 'اصفهان، شهرک صنعتی' },
];

const mockGoods: Good[] = [
    { id: 'g1', code: '101', name: 'لپ‌تاپ ایسوس', unit: 'عدد', stock: 15, purchasePrice: 25000000, salePrice: 32000000, category: 'کالای دیجیتال', inventoryAccountCode: '110501', cogsAccountCode: '510101', type: 'Finished Good' },
    { id: 'g2', code: '102', name: 'ماوس بی‌سیم', unit: 'عدد', stock: 50, purchasePrice: 450000, salePrice: 850000, category: 'لوازم جانبی', inventoryAccountCode: '110502', cogsAccountCode: '510102', type: 'Finished Good' },
    { id: 'g3', code: '201', name: 'ورق MDF', unit: 'متر', stock: 200, purchasePrice: 1200000, salePrice: 0, category: 'مواد اولیه', inventoryAccountCode: '110503', cogsAccountCode: '510103', type: 'Raw Material' },
];

const mockBanks: Bank[] = [
    { id: 'b1', code: '10', name: 'بانک مرکزی' },
    { id: 'b2', code: '11', name: 'بانک صنعت و معدن' },
    { id: 'b3', code: '12', name: 'بانک ملت' },
    { id: 'b4', code: '13', name: 'بانک تجارت' },
    { id: 'b5', code: '14', name: 'بانک مسکن' },
    { id: 'b6', code: '15', name: 'بانک سپه' },
    { id: 'b7', code: '16', name: 'بانک کشاورزی' },
    { id: 'b8', code: '17', name: 'بانک ملی' },
    { id: 'b9', code: '18', name: 'بانک صادرات' },
];

const mockJournalEntries: JournalEntry[] = [
    { id: '1', serialNumber: 1001, docNumber: 101, date: formatDate(daysAgo(-30)), description: 'ثبت هزینه‌های حقوق و دستمزد مرداد ماه', status: 'ثبت شده', lines: [
        { id: 'l1-1', accountCode: '5201', accountName: 'هزینه حقوق و دستمزد', description: 'حقوق مرداد', debit: 150000000, credit: 0 },
        { id: 'l1-2', accountCode: '1101', accountName: 'موجودی نقد و بانک', description: 'پرداخت حقوق مرداد', debit: 0, credit: 150000000 },
    ], totalDebit: 150000000, totalCredit: 150000000, sourceModule: 'GL' },
    { id: '2', serialNumber: 1002, docNumber: 102, date: formatDate(daysAgo(-29)), description: 'خرید اثاثه اداری و پرداخت از بانک', status: 'تایید شده', lines: [
        { id: 'l2-1', accountCode: '1201', accountName: 'دارایی‌های ثابت مشهود', description: 'خرید میز', debit: 25000000, credit: 0 },
        { id: 'l2-2', accountCode: '1101', accountName: 'موجودی نقد و بانک', description: 'پرداخت وجه میز', debit: 0, credit: 25000000 },
    ], totalDebit: 25000000, totalCredit: 25000000, sourceModule: 'AP' },
    { id: '3', serialNumber: 1003, docNumber: 103, date: formatDate(daysAgo(-28)), description: 'پرداخت قبض اینترنت شرکت', status: 'پیش‌نویس', lines: [], totalDebit: 1800000, totalCredit: 1800000, sourceModule: 'GL' },
    { id: '4', serialNumber: 1004, docNumber: 104, date: formatDate(daysAgo(-65)), description: 'هزینه اجاره تیر ماه', status: 'ثبت شده', lines: [
        { id: 'l4-1', accountCode: '5202', accountName: 'هزینه اجاره', description: 'اجاره تیر', debit: 50000000, credit: 0 },
        { id: 'l4-2', accountCode: '1101', accountName: 'موجودی نقد و بانک', description: 'پرداخت اجاره تیر', debit: 0, credit: 50000000 },
    ], totalDebit: 50000000, totalCredit: 50000000, sourceModule: 'GL' },
    { id: 'inv-j-1', serialNumber: 1005, docNumber: 105, date: formatDate(daysAgo(-50)), description: 'فروش به مشتری آلفا - فاکتور F-1403-101', status: 'ثبت شده', lines: [
        { id: 'inv-l1', accountCode: '1103', accountName: 'حساب‌ها و اسناد دریافتنی تجاری', description: 'مشتری آلفا', debit: 22000000, credit: 0, tafsiliId: 'ta1', tafsiliName: 'مشتری آلفا' },
        { id: 'inv-l2', accountCode: '4101', accountName: 'فروش', description: 'فروش کالا', debit: 0, credit: 22000000 },
    ], totalDebit: 22000000, totalCredit: 22000000, sourceModule: 'AR' },
];

const mockChecks: Check[] = [
    { id: 'c1', checkNumber: '112233', dueDate: formatDate(daysAgo(-10)), dueDateObj: daysAgo(-10), type: 'دریافتی', partyName: 'شرکت پیشگامان', amount: 15000000, bankName: 'ملت', status: 'پاس شده', bankAccountId: 'ba1', isCleared: true, history: [
        { status: 'در جریان وصول', date: formatDate(daysAgo(-15)), user: 'علی رضایی' },
        { status: 'پاس شده', date: formatDate(daysAgo(-10)), user: 'سارا احمدی' }
    ]},
    { id: 'c2', checkNumber: '445566', dueDate: formatDate(daysAgo(15)), dueDateObj: daysAgo(15), type: 'دریافتی', partyName: 'فروشگاه مرکزی', amount: 25000000, bankName: 'صادرات', status: 'در جریان وصول', history: [], bankAccountId: undefined, isCleared: false }
];

const mockCustomerInvoices: Invoice[] = [
    { id: 'inv1', invoiceNumber: 'F-1403-101', customerId: 'p1', customerName: 'شرکت پیشگامان', customerEmail: '', customerAddress: '', issueDate: formatDate(daysAgo(-10)), dueDate: formatDate(daysAgo(0)), dueDateObj: daysAgo(0), lines: [{ id: 'l1', itemCode: '101', itemName: 'لپ‌تاپ ایسوس', quantity: 2, rate: 32000000 }], subtotal: 64000000, tax: 5760000, discount: 0, total: 69760000, paidAmount: 20000000, status: 'پرداخت قسمتی', notes: '' },
    { id: 'inv2', invoiceNumber: 'F-1403-102', customerId: 'p2', customerName: 'فروشگاه مرکزی', customerEmail: '', customerAddress: '', issueDate: formatDate(daysAgo(-2)), dueDate: formatDate(daysAgo(10)), dueDateObj: daysAgo(10), lines: [{ id: 'l2', itemCode: '102', itemName: 'ماوس بی‌سیم', quantity: 10, rate: 850000 }], subtotal: 8500000, tax: 765000, discount: 0, total: 9265000, paidAmount: 0, status: 'ارسال شده', notes: '' },
];

const mockSupplierInvoices: SupplierInvoice[] = [
    { id: 'sinv1', invoiceNumber: '98765', supplierId: 'p3', supplierName: 'تامین کالا گستر', invoiceDate: formatDate(daysAgo(-15)), dueDate: formatDate(daysAgo(-5)), dueDateObj: daysAgo(-5), lines: [{ id: 'sl1', itemCode: '101', itemName: 'لپ‌تاپ ایسوس', quantity: 5, rate: 25000000, total: 125000000 }], subtotal: 125000000, tax: 11250000, totalAmount: 136250000, paidAmount: 136250000, status: 'پرداخت شده' },
];

const mockTreasuryDocs: TreasuryDoc[] = [
    { id: 'td1', docNumber: 1001, date: formatDate(daysAgo(-10)), partyId: 'p1', partyName: 'شرکت پیشگامان', amount: 20000000, paymentMethod: 'حواله', description: 'پیش دریافت فاکتور 101', type: 'دریافت', status: 'نهایی', bankAccountId: 'ba1' },
    { id: 'td2', docNumber: 1002, date: formatDate(daysAgo(-5)), partyId: 'p3', partyName: 'تامین کالا گستر', amount: 136250000, paymentMethod: 'چک', description: 'تسویه فاکتور 98765', type: 'پرداخت', status: 'نهایی', checkNumber: '112233', checkDueDate: formatDate(daysAgo(25)) },
];

const mockBankAccounts: BankAccount[] = [
    { id: 'ba1', bankName: 'بانک ملت', branchName: 'مرکزی', accountNumber: '1234567890', iban: 'IR123456789012345678901234', accountType: 'جاری', currency: 'ریال', isActive: true, balance: 450000000 },
    { id: 'ba2', bankName: 'بانک پاسارگاد', branchName: 'جردن', accountNumber: '0987654321', iban: 'IR098765432109876543210987', accountType: 'پس‌انداز', currency: 'ریال', isActive: true, balance: 1250000000 },
];

const mockCashDesks: CashDesk[] = [
    { id: 'cd1', name: 'صندوق مرکزی', balance: 15000000 },
    { id: 'cd2', name: 'تنخواه گردان', balance: 5000000 },
];

export const App: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [toasts, setToasts] = useState<ToastData[]>([]);

    // --- STATE INITIALIZATION WITH MOCKS ---
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
    const [checks, setChecks] = useState<Check[]>(mockChecks);
    const [treasuryDocs, setTreasuryDocs] = useState<TreasuryDoc[]>(mockTreasuryDocs);
    const [customerInvoices, setCustomerInvoices] = useState<Invoice[]>(mockCustomerInvoices);
    const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>(mockSupplierInvoices);
    const [goods, setGoods] = useState<Good[]>(mockGoods);
    const [parties, setParties] = useState<Party[]>(mockParties);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
    const [banks, setBanks] = useState<Bank[]>(mockBanks);
    const [cashDesks, setCashDesks] = useState<CashDesk[]>(mockCashDesks);
    
    const [accounts, setAccounts] = useState<AccountNode[]>([
        { code: '1', name: 'دارایی‌ها', type: 'group', children: [
            { code: '11', name: 'دارایی‌های جاری', type: 'group', children: [
                { code: '1101', name: 'موجودی نقد و بانک', type: 'account' },
                { code: '1103', name: 'حساب‌ها و اسناد دریافتنی تجاری', type: 'account' },
                { code: '1105', name: 'موجودی کالا', type: 'group', children: [
                    { code: '110501', name: 'کالای ساخته شده', type: 'account' },
                    { code: '110502', name: 'کالای تجاری', type: 'account' },
                    { code: '110503', name: 'مواد اولیه', type: 'account' },
                ] },
            ]},
            { code: '12', name: 'دارایی‌های ثابت', type: 'group', children: [
                { code: '1201', name: 'دارایی‌های ثابت مشهود', type: 'account' },
                { code: '1202', name: 'استهلاک انباشته', type: 'account' },
            ]}
        ]},
        { code: '2', name: 'بدهی‌ها', type: 'group', children: [
            { code: '21', name: 'بدهی‌های جاری', type: 'group', children: [
                { code: '2101', name: 'حساب‌های پرداختنی تجاری', type: 'account' },
            ]}
        ]},
        { code: '3', name: 'حقوق صاحبان سهام', type: 'group', children: [
            { code: '31', name: 'سرمایه', type: 'account' },
            { code: '32', name: 'سود (زیان) انباشته', type: 'account' },
        ]},
        { code: '4', name: 'درآمدها', type: 'group', children: [
             { code: '41', name: 'درآمدهای عملیاتی', type: 'group', children: [
                { code: '4101', name: 'فروش', type: 'account' },
            ]}
        ]},
        { code: '5', name: 'هزینه‌ها', type: 'group', children: [
             { code: '51', name: 'بهای تمام شده', type: 'group', children: [
                { code: '5101', name: 'بهای تمام شده کالای فروش رفته', type: 'account' },
             ]},
             { code: '52', name: 'هزینه‌های اداری و عمومی', type: 'group', children: [
                { code: '5201', name: 'هزینه حقوق و دستمزد', type: 'account' },
                { code: '5202', name: 'هزینه اجاره', type: 'account' },
                { code: '5203', name: 'هزینه استهلاک', type: 'account' },
            ]}
        ]},
    ]);
    
    const [recurringEntries, setRecurringEntries] = useState<RecurringEntry[]>([]);
    const [fiscalYear, setFiscalYear] = useState<FiscalYearStatus>({ year: 1403, status: 'باز', closingStep: 0 });
    const [journalEntryTemplates, setJournalEntryTemplates] = useState<JournalEntryTemplate[]>([]);
    const [taxRates, setTaxRates] = useState<TaxRate[]>([{ id: 'tr1', startDate: '2024-03-20', endDate: null, vatRate: 9, dutiesRate: 0 }]);
    const [currencies, setCurrencies] = useState<Currency[]>([{ id: 'c1', code: 'USD', name: 'دلار آمریکا' }, { id: 'c2', code: 'EUR', name: 'یورو' }]);
    const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
    const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>([]);
    const [salesContracts, setSalesContracts] = useState<SalesContract[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
    const [serviceContracts, setServiceContracts] = useState<ServiceContract[]>([]);
    const [fieldServiceOrders, setFieldServiceOrders] = useState<FieldServiceOrder[]>([]);
    const [posTerminals, setPosTerminals] = useState<POSTerminal[]>([]);
    const [priceLists, setPriceLists] = useState<PriceList[]>([]);
    const [discountRules, setDiscountRules] = useState<DiscountRule[]>([]);
    const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([]);
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([]);
    const [stocktakes, setStocktakes] = useState<Stocktake[]>([]);
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [purchaseContracts, setPurchaseContracts] = useState<PurchaseContract[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [serialNumbers, setSerialNumbers] = useState<SerialNumber[]>([]);
    const [inspectionLots, setInspectionLots] = useState<InspectionLot[]>([]);
    const [warehouseStructure, setWarehouseStructure] = useState<WarehouseStructureNode[]>([]);
    const [warehouseStrategies, setWarehouseStrategies] = useState<{ putaway: PutawayStrategy[], picking: PickingStrategy[] }>({ putaway: [], picking: [] });
    const [boms, setBoms] = useState<BOM[]>([]);
    const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
    const [routings, setRoutings] = useState<Routing[]>([]);
    const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
    const [projects, setProjects] = useState<ProjectDefinition[]>([]);
    const [wbs, setWbs] = useState<WBSNode[]>([]);
    const [networkActivities, setNetworkActivities] = useState<NetworkActivity[]>([]);
    const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
    const [projectBillings, setProjectBillings] = useState<ProjectBillingMilestone[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ name: 'شرکت نمونه', legalName: 'شرکت نمونه سهامی خاص', nationalId: '10101234567', registrationNumber: '12345', address: 'تهران، میدان ونک', phone: '02188881234', email: 'info@example.com', website: 'www.example.com', logoUrl: '' });
    const [biWidgets, setBiWidgets] = useState<BIWidget[]>([]);
    const [tafsiliGroups, setTafsiliGroups] = useState<TafsiliGroup[]>([{id: 'tg1', name: 'اشخاص حقیقی'}, {id: 'tg2', name: 'اشخاص حقوقی'}, {id: 'tg3', name: 'پروژه‌ها'}]);
    const [tafsiliAccounts, setTafsiliAccounts] = useState<TafsiliAccount[]>([
        { id: 'ta1', groupId: 'tg2', code: '1001', name: 'شرکت پیشگامان', linkedGLAccounts: ['1103', '2101'] },
        { id: 'ta2', groupId: 'tg1', code: '1002', name: 'فروشگاه مرکزی', linkedGLAccounts: ['1103', '2101'] },
    ]);
    const [costCenters, setCostCenters] = useState<CostCenterNode[]>([
        { code: '2000', name: 'تولید', type: 'group', children: [
            { code: '2100', name: 'دایره مونتاژ', type: 'Cost Center' },
            { code: '2200', name: 'دایره بسته‌بندی', type: 'Cost Center' },
        ]},
        { code: '1000', name: 'اداری و تشکیلاتی', type: 'group', children: [
            { code: '1100', name: 'مدیریت', type: 'Cost Center' },
            { code: '1200', name: 'حسابداری', type: 'Cost Center' },
        ]},
        { code: '3000', name: 'خدمات', type: 'group', children: [
            { code: '3100', name: 'تاسیسات', type: 'Service Center' },
        ]},
    ]);
    
    const [assetClasses, setAssetClasses] = useState<AssetClass[]>([{id: 'ac1', name: 'اثاثه اداری', depreciationMethod: 'Straight-line', usefulLife: 10}, {id: 'ac2', name: 'ماشین‌آلات', depreciationMethod: 'Straight-line', usefulLife: 5}]);
    const [assets, setAssets] = useState<FixedAsset[]>([
        { id: 'fa1', code: '1001', description: 'میز مدیریت', assetClassId: 'ac1', acquisitionDate: '1402/01/15', acquisitionCost: 50000000, salvageValue: 5000000, status: 'Active' },
    ]);
    const [assetTransactions, setAssetTransactions] = useState<AssetTransaction[]>([]);
    const [maintenanceObjects, setMaintenanceObjects] = useState<MaintenanceObject[]>([]);
    const [maintenanceOrders, setMaintenanceOrders] = useState<MaintenanceOrder[]>([]);
    const [preventivePlans, setPreventivePlans] = useState<PreventivePlan[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [orgStructure, setOrgStructure] = useState<OrgUnit[]>([]);
    const [payslips, setPayslips] = useState<Payslip[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
    const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    
    // Helper to show toast
    const showToast = (message: string, type: ToastData['type'] = 'success') => {
        const id = uuidv4();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const dismissToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const saveJournalEntryRef = useRef<HTMLButtonElement>(null);

    // --- Handlers (Simplified for Demo) ---
    const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'serialNumber'>) => {
        const serialNumber = (journalEntries.length > 0 ? Math.max(...journalEntries.map(e => e.serialNumber)) : 1000) + 1;
        const newEntry: JournalEntry = { id: uuidv4(), serialNumber, ...entry };
        setJournalEntries(prev => [newEntry, ...prev]);
    };

    const addTreasuryDoc = (doc: Omit<TreasuryDoc, 'id' | 'docNumber'>) => {
        const docNumber = (treasuryDocs.length > 0 ? Math.max(...treasuryDocs.map(d => d.docNumber)) : 1000) + 1;
        setTreasuryDocs(prev => [{ id: uuidv4(), docNumber, ...doc }, ...prev]);
    }

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard': return <DashboardPage journalEntries={journalEntries} checks={checks} treasuryDocs={treasuryDocs} customerInvoices={customerInvoices} supplierInvoices={supplierInvoices} onNavigate={setActivePage} accounts={accounts} />;
            case 'financials-gl-new': return <NewJournalEntryPage onNavigate={setActivePage} addJournalEntry={addJournalEntry} nextSerialNumber={(journalEntries.length > 0 ? Math.max(...journalEntries.map(e => e.serialNumber)) : 1000) + 1} showToast={showToast} accounts={accounts} templates={journalEntryTemplates} tafsiliGroups={tafsiliGroups} tafsiliAccounts={tafsiliAccounts} saveButtonRef={saveJournalEntryRef} />;
            case 'financials-gl-list': return <JournalEntriesListPage journalEntries={journalEntries} onNavigate={setActivePage} deleteJournalEntry={(id) => setJournalEntries(prev => prev.filter(e => e.id !== id))} reverseJournalEntry={(id) => { const entry = journalEntries.find(e => e.id === id); if (entry) addJournalEntry({ ...entry, description: `برگشت سند ${entry.docNumber}`, lines: entry.lines.map(l => ({ ...l, debit: l.credit, credit: l.debit })), isReversing: true, status: 'پیش‌نویس', date: formatDateISO(new Date()) }); }} />;
            case 'financials-convert-docs': return <ConvertDocumentsPage onNavigate={setActivePage} addJournalEntry={addJournalEntry} showToast={showToast} journalEntries={journalEntries} />;
            case 'financials-gl-recurring': return <RecurringEntriesPage recurringEntries={recurringEntries} onRunEntries={() => {}} setRecurringEntries={setRecurringEntries} accounts={accounts} showToast={showToast} />;
            case 'financials-gl-closing': return <YearEndClosingPage fiscalYear={fiscalYear} updateFiscalYear={update => setFiscalYear(prev => ({ ...prev, ...update }))} showToast={showToast} accounts={accounts} addJournalEntry={addJournalEntry} />;
            case 'financials-gl-templates': return <JournalEntryTemplatesPage templates={journalEntryTemplates} addTemplate={t => setJournalEntryTemplates(prev => [...prev, { ...t, id: uuidv4() }])} updateTemplate={t => setJournalEntryTemplates(prev => prev.map(ex => ex.id === t.id ? t : ex))} deleteTemplate={id => setJournalEntryTemplates(prev => prev.filter(t => t.id !== id))} accounts={accounts} />;
            case 'financials-ap-invoices': return <SupplierInvoicesListPage invoices={supplierInvoices} parties={parties} goods={goods} addInvoice={inv => setSupplierInvoices(prev => [...prev, { ...inv, id: uuidv4() }])} updateInvoice={inv => setSupplierInvoices(prev => prev.map(ex => ex.id === inv.id ? inv : ex))} deleteInvoice={id => setSupplierInvoices(prev => prev.filter(i => i.id !== id))} showToast={showToast} />;
            case 'financials-ap-payments': return <SupplierPaymentsPage payments={[]} invoices={supplierInvoices} parties={parties} addPayment={() => {}} deletePayment={() => {}} showToast={showToast} />;
            case 'financials-ap-aging': return <APRAgingReportPage invoices={supplierInvoices} />;
            case 'financials-ar-invoices': return <CustomerInvoicesListPage invoices={customerInvoices} parties={parties} onNavigate={setActivePage} postInvoice={id => { setCustomerInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'ثبت نهایی' } : inv)); showToast('فاکتور نهایی شد.'); }} />;
            case 'financials-ar-receipts': return <CustomerReceiptsPage receipts={[]} invoices={customerInvoices} parties={parties} addReceipt={() => {}} deleteReceipt={() => {}} showToast={showToast} />;
            case 'financials-ar-dunning': return <DunningReportPage invoices={customerInvoices} />;
            case 'financials-cost-allocation': return <CostAllocationPage costCenters={costCenters} addJournalEntry={addJournalEntry} showToast={showToast} />;
            case 'financials-cost-report': return <CostCenterReportPage costCenters={costCenters} />;
            case 'financials-cost-standard': return <StandardCostingPage goods={goods} standardCosts={[]} actualData={{ goodId: '', producedQty: 0, actualMaterialPrice: 0, actualMaterialQty: 0, actualLaborRate: 0, actualLaborHours: 0, actualOverhead: 0 }} setActualData={() => {}} />;
            case 'financials-cost-abc': return <ActivityBasedCostingPage activities={[]} setActivities={() => {}} goods={goods} />;
            case 'financials-cost-internal-orders': return <InternalOrdersPage internalOrders={[]} addInternalOrder={() => {}} updateInternalOrder={() => {}} deleteInternalOrder={() => {}} showToast={showToast} />;
            case 'financials-budget-define': return <DefineBudgetPage budgets={budgets} accounts={accounts} costCenters={costCenters} onSaveBudget={b => { setBudgets(prev => { const existing = prev.findIndex(ex => ex.id === b.id); if (existing > -1) { const newArr = [...prev]; newArr[existing] = b; return newArr; } return [...prev, b]; }); showToast('بودجه ذخیره شد.'); }} />;
            case 'financials-budget-actuals': return <BudgetActualsReportPage budgets={budgets} accounts={accounts} costCenters={costCenters} journalEntries={journalEntries} />;
            case 'financials-reports-standard': return <StandardReportsPage accounts={accounts} journalEntries={journalEntries} />;
            case 'financials-reports-statements': return <FinancialStatementsPage accounts={accounts} journalEntries={journalEntries} />;
            case 'financials-reports-consolidation': return <ConsolidationPage />;
            case 'financials-reports-builder': return <ReportBuilderPage />;
            case 'financials-setup-tax': return <TaxSettingsPage taxRates={taxRates} setTaxRates={setTaxRates} showToast={showToast} />;
            case 'financials-setup-currency': return <CurrencySettingsPage currencies={currencies} exchangeRates={exchangeRates} setExchangeRates={setExchangeRates} showToast={showToast} />;
            case 'treasury-dashboard': return <TreasuryDashboardPage treasuryDocs={treasuryDocs} bankAccounts={bankAccounts} cashDesks={cashDesks} checks={checks} onNavigate={setActivePage} />;
            case 'treasury-receive': return <NewReceiptPage onNavigate={setActivePage} addTreasuryDoc={addTreasuryDoc} showToast={showToast} bankAccounts={bankAccounts} cashDesks={cashDesks} parties={parties} />;
            case 'treasury-payment': return <NewPaymentPage onNavigate={setActivePage} addTreasuryDoc={addTreasuryDoc} showToast={showToast} bankAccounts={bankAccounts} cashDesks={cashDesks} parties={parties} />;
            case 'treasury-cash-checks': return <BankOperationsPage checks={checks} onNavigate={setActivePage} deleteCheck={id => setChecks(prev => prev.filter(c => c.id !== id))} updateCheckStatus={(id, status) => setChecks(prev => prev.map(c => c.id === id ? { ...c, status } : c))} />;
            case 'treasury-new-check': return <NewCheckPage onNavigate={setActivePage} addCheck={c => setChecks(prev => [...prev, { id: uuidv4(), ...c }])} showToast={showToast} />;
            case 'treasury-bank-reconciliation': return <BankReconciliationPage bankAccounts={bankAccounts} treasuryDocs={treasuryDocs} checks={checks} bankStatement={[]} onReconcile={() => {}} showToast={showToast} />;
            case 'treasury-liquidity-forecast': return <CashFlowForecastPage invoices={customerInvoices} supplierInvoices={supplierInvoices} checks={checks} bankAccounts={bankAccounts} />;
            case 'asset-fixed-master': return <AssetMasterPage assets={assets} assetClasses={assetClasses} onSaveAsset={a => { if ('id' in a) setAssets(prev => prev.map(ex => ex.id === a.id ? a : ex)); else setAssets(prev => [...prev, { ...a, id: uuidv4() }]); showToast('دارایی ذخیره شد'); }} onDeleteAsset={id => setAssets(prev => prev.filter(a => a.id !== id))} />;
            case 'asset-fixed-depreciation': return <DepreciationRunPage assets={assets} assetClasses={assetClasses} addJournalEntry={addJournalEntry} showToast={showToast} />;
            case 'asset-transactions': return <AssetTransactionsPage transactions={assetTransactions} assets={assets} onSave={t => { setAssetTransactions(prev => [...prev, { ...t, id: uuidv4() }]); showToast('تراکنش ثبت شد'); }} />;
            case 'asset-pm-objects': return <MaintenanceObjectsPage objects={maintenanceObjects} onSave={o => { if ('id' in o) setMaintenanceObjects(prev => prev.map(ex => ex.id === o.id ? o : ex)); else setMaintenanceObjects(prev => [...prev, { ...o, id: uuidv4() }]); showToast('تجهیز ذخیره شد'); }} onDelete={id => setMaintenanceObjects(prev => prev.filter(o => o.id !== id))} />;
            case 'asset-pm-orders': return <MaintenanceOrdersPage orders={maintenanceOrders} objects={maintenanceObjects} onSave={o => { setMaintenanceOrders(prev => [...prev, { ...o, id: uuidv4(), orderNumber: maintenanceOrders.length + 1, status: 'Open', creationDate: formatDateISO(new Date()) }]); showToast('دستور کار ایجاد شد'); }} />;
            case 'asset-pm-preventive': return <PreventiveMaintenancePage plans={preventivePlans} objects={maintenanceObjects} onSave={p => { setPreventivePlans(prev => [...prev, { ...p, id: uuidv4() }]); showToast('برنامه ایجاد شد'); }} />;
            case 'sales-ops-quote': return <NewQuotePage onNavigate={setActivePage} addQuote={q => setQuotes(prev => [...prev, { ...q, id: uuidv4(), quoteNumber: `Q-${quotes.length + 100}` }])} showToast={showToast} parties={parties} goods={goods} />;
            case 'sales-ops-order': return <NewOrderPage onNavigate={setActivePage} addSalesOrder={o => setSalesOrders(prev => [...prev, { ...o, id: uuidv4(), orderNumber: `SO-${salesOrders.length + 100}` }])} showToast={showToast} parties={parties} goods={goods} quotes={quotes} />;
            case 'sales-ops-delivery': return <NewDeliveryPage onNavigate={setActivePage} addDeliveryNote={d => { setDeliveryNotes(prev => [...prev, { ...d, id: uuidv4(), deliveryNumber: `DN-${deliveryNotes.length + 100}` }]); showToast('حواله ارسال شد.'); }} showToast={showToast} salesOrders={salesOrders} goods={goods} />;
            case 'sales-ops-billing': return <NewInvoicePage onNavigate={setActivePage} addInvoice={inv => setCustomerInvoices(prev => [...prev, { ...inv, id: uuidv4(), invoiceNumber: `INV-${customerInvoices.length + 100}`, status: 'پیش‌نویس' }])} showToast={showToast} parties={parties} goods={goods} priceLists={priceLists} discountRules={discountRules} />;
            case 'sales-ops-contracts': return <SalesContractsPage onNavigate={setActivePage} addSalesContract={c => setSalesContracts(prev => [...prev, { ...c, id: uuidv4(), contractNumber: `SC-${salesContracts.length + 100}` }])} showToast={showToast} parties={parties} salesContracts={salesContracts} />;
            case 'sales-crm-opportunities': return <OpportunitiesPage opportunities={opportunities} onUpdateOpportunity={o => setOpportunities(prev => prev.map(ex => ex.id === o.id ? o : ex))} onAddOpportunity={o => setOpportunities(prev => [...prev, { ...o, id: uuidv4() }])} parties={parties} showToast={showToast} />;
            case 'sales-crm-service-tickets': return <SupportTicketsPage tickets={supportTickets} parties={parties} onUpdateTicket={t => setSupportTickets(prev => prev.map(ex => ex.id === t.id ? t : ex))} onAddTicket={t => setSupportTickets(prev => [...prev, { ...t, id: uuidv4(), ticketNumber: supportTickets.length + 1000 }])} onAddReply={(tid, r) => setSupportTickets(prev => prev.map(t => t.id === tid ? { ...t, replies: [...(t.replies || []), { ...r, id: uuidv4() }] } : t))} showToast={showToast} />;
            case 'sales-crm-service-contracts': return <ServiceContractsListPage contracts={serviceContracts} parties={parties} onAddContract={c => setServiceContracts(prev => [...prev, { ...c, id: uuidv4(), contractNumber: `SVR-${serviceContracts.length + 100}` }])} onUpdateContract={c => setServiceContracts(prev => prev.map(ex => ex.id === c.id ? c : ex))} showToast={showToast} />;
            case 'sales-crm-field-service': return <FieldServicePage serviceOrders={fieldServiceOrders} parties={parties} tickets={supportTickets} onAddOrder={o => setFieldServiceOrders(prev => [...prev, { ...o, id: uuidv4(), orderNumber: `FSO-${fieldServiceOrders.length + 100}` }])} onUpdateOrder={o => setFieldServiceOrders(prev => prev.map(ex => ex.id === o.id ? o : ex))} showToast={showToast} />;
            case 'sales-pos-terminals': return <POSTerminalsPage terminals={posTerminals} setTerminals={setPosTerminals} showToast={showToast} />;
            case 'sales-pos-closing': return <POSClosingPage terminals={posTerminals} transactions={[]} onRunCloseout={() => showToast('صندوق بسته شد.')} showToast={showToast} />;
            case 'sales-pricing-lists': return <PriceListsPage priceLists={priceLists} onUpdatePriceList={pl => setPriceLists(prev => prev.map(ex => ex.id === pl.id ? pl : ex))} goods={goods} showToast={showToast} />;
            case 'sales-pricing-discounts': return <DiscountsPage discountRules={discountRules} onAddDiscountRule={r => setDiscountRules(prev => [...prev, { ...r, id: uuidv4() }])} onUpdateDiscountRule={r => setDiscountRules(prev => prev.map(ex => ex.id === r.id ? r : ex))} onDeleteDiscountRule={id => setDiscountRules(prev => prev.filter(r => r.id !== id))} goods={goods} parties={parties} showToast={showToast} />;
            case 'sales-pricing-procedure': return <PricingProcedurePage procedure={{ id: 'pp1', name: 'Standard Pricing', steps: [] }} />;
            case 'sales-pricing-analysis': return <PriceAnalysisPage procedure={{ id: 'pp1', name: 'Standard', steps: [] }} priceLists={priceLists} discountRules={discountRules} parties={parties} goods={goods} />;
            case 'sales-analytics-dashboard': return <SalesAnalyticsDashboardPage invoices={customerInvoices} goods={goods} parties={parties} />;
            case 'procurement-req': return <PurchaseRequestPage purchaseRequests={purchaseRequests} goods={goods} onAddRequest={r => setPurchaseRequests(prev => [...prev, { ...r, id: uuidv4(), requestNumber: purchaseRequests.length + 1000 }])} showToast={showToast} />;
            case 'procurement-rfq': return <RFQPage rfqs={rfqs} purchaseRequests={purchaseRequests} suppliers={parties.filter(p => p.code.startsWith('2'))} goods={goods} showToast={showToast} />;
            case 'procurement-po': return <PurchaseOrderPage purchaseOrders={purchaseOrders} purchaseRequests={purchaseRequests} suppliers={parties.filter(p => p.code.startsWith('2'))} goods={goods} onAddOrder={o => { setPurchaseOrders(prev => [...prev, { ...o, id: uuidv4(), poNumber: purchaseOrders.length + 1000 }]); showToast('سفارش خرید صادر شد.'); }} showToast={showToast} />;
            case 'procurement-receipt': return <GoodsReceiptPage goodsReceipts={goodsReceipts} purchaseOrders={purchaseOrders} goods={goods} onAddReceipt={r => { setGoodsReceipts(prev => [...prev, { ...r, id: uuidv4(), receiptNumber: goodsReceipts.length + 1000 }]); showToast('رسید انبار ثبت شد.'); }} showToast={showToast} />;
            case 'procurement-invoice-verify': return <InvoiceVerificationPage supplierInvoices={supplierInvoices} purchaseOrders={purchaseOrders} goodsReceipts={goodsReceipts} showToast={showToast} />;
            case 'procurement-contracts': return <PurchaseContractsPage contracts={purchaseContracts} suppliers={parties.filter(p => p.code.startsWith('2'))} showToast={showToast} />;
            case 'inventory-movements': return <InventoryMovementsPage movements={inventoryMovements} />;
            case 'inventory-stocktaking': return <InventoryStocktakingPage stocktakes={stocktakes} goods={goods} onAddStocktake={s => { setStocktakes(prev => [...prev, { ...s, id: uuidv4(), documentNumber: stocktakes.length + 1000 }]); showToast('سند انبارگردانی ایجاد شد.'); }} onPostStocktake={() => showToast('مغایرت انبارگردانی ثبت شد.')} showToast={showToast} />;
            case 'inventory-batch-serial': return <BatchSerialTraceabilityPage batches={batches} serialNumbers={serialNumbers} />;
            case 'inventory-quality': return <QualityControlPage inspectionLots={inspectionLots} setInspectionLots={setInspectionLots} showToast={showToast} />;
            case 'warehouse-structure': return <WarehouseStructurePage structure={warehouseStructure} setStructure={setWarehouseStructure} showToast={showToast} />;
            case 'warehouse-strategy': return <WarehouseStrategyPage strategies={warehouseStrategies} setStrategies={setWarehouseStrategies} showToast={showToast} />;
            case 'warehouse-barcode': return <BarcodePrintingPage goods={goods} />;
            case 'procurement-analytics-dashboard': return <ProcurementAnalyticsDashboardPage purchaseOrders={purchaseOrders} suppliers={parties.filter(p => p.code.startsWith('2'))} goods={goods} />;
            case 'mfg-data-bom': return <BOMPage boms={boms} goods={goods} onSaveBOM={b => { const exists = boms.find(ex => ex.id === b.id); if (exists) setBoms(prev => prev.map(ex => ex.id === b.id ? b : ex)); else setBoms(prev => [...prev, b]); showToast('BOM ذخیره شد.'); }} />;
            case 'mfg-data-workcenter': return <WorkCenterPage workCenters={workCenters} routings={routings} goods={goods} onSaveWorkCenter={wc => { const exists = workCenters.find(ex => ex.id === wc.id); if (exists) setWorkCenters(prev => prev.map(ex => ex.id === wc.id ? wc : ex)); else setWorkCenters(prev => [...prev, wc]); showToast('مرکز کاری ذخیره شد.'); }} onSaveRouting={r => { const exists = routings.find(ex => ex.id === r.id); if (exists) setRoutings(prev => prev.map(ex => ex.id === r.id ? r : ex)); else setRoutings(prev => [...prev, r]); showToast('مسیر تولید ذخیره شد.'); }} />;
            case 'mfg-control-orders': return <ProductionOrdersPage productionOrders={productionOrders} goods={goods} boms={boms} routings={routings} onAddOrder={o => { setProductionOrders(prev => [...prev, { ...o, id: uuidv4(), orderNumber: productionOrders.length + 1000, status: 'ایجاد شده' }]); showToast('دستور تولید ایجاد شد.'); }} onUpdateOrder={(id, action, data) => { setProductionOrders(prev => prev.map(o => o.id === id ? { ...o, status: action === 'release' ? 'آزاد شده' : o.status } : o)); showToast('وضعیت دستور تغییر کرد.'); }} />;
            case 'mfg-control-mrp': return <MRPPage goods={goods} runMRP={() => []} onConvert={() => showToast('پیشنهاد تبدیل شد.')} />;
            case 'mfg-control-sfc': return <ShopFloorControlPage activeOrders={productionOrders.filter(o => o.status === 'در حال تولید')} workCenters={workCenters} routings={routings} onConfirmOperation={() => showToast('عملیات تایید شد.')} />;
            case 'mfg-costing-product': return <ProductCostingPage completedOrders={productionOrders.filter(o => o.status === 'بسته شده' || o.status === 'تایید شده')} />;
            case 'mfg-costing-variance': return <ProductionVariancePage completedOrders={productionOrders} />;
            case 'ps-def-wbs': return <WBSPage wbs={wbs} setWbs={setWbs} projects={projects} />;
            case 'ps-def-networks': return <NetworkPage activities={networkActivities} setActivities={setNetworkActivities} wbs={wbs} />;
            case 'ps-plan-cost': return <CostPlanningPage wbs={wbs} setWbs={setWbs} projects={projects} />;
            case 'ps-plan-resource': return <ResourcePlanningPage activities={networkActivities} />;
            case 'ps-plan-schedule': return <SchedulePage activities={networkActivities} wbs={wbs} projects={projects} />;
            case 'ps-exec-timesheet': return <TimesheetPage timesheets={timesheets} setTimesheets={setTimesheets} wbs={wbs} />;
            case 'ps-exec-procurement': return <ProjectProcurementPage purchaseRequests={purchaseRequests} purchaseOrders={purchaseOrders} />;
            case 'ps-exec-billing': return <ProjectBillingPage projectBillings={projectBillings} projects={projects} />;
            case 'ps-control-reports': return <ProjectDashboardPage projects={projects} wbs={wbs} />;
            case 'admin-setup-users': return <UsersPage users={users} roles={roles} onSaveUser={u => { if ('id' in u) setUsers(prev => prev.map(ex => ex.id === u.id ? u : ex)); else setUsers(prev => [...prev, { ...u, id: uuidv4() }]); showToast('کاربر ذخیره شد.'); }} />;
            case 'admin-setup-company': return <CompanyInfoPage companyInfo={companyInfo} onSave={info => { setCompanyInfo(info); showToast('اطلاعات شرکت بروز شد.'); }} />;
            case 'bi-dashboards': return <BIDashboardsPage widgets={biWidgets} setWidgets={setBiWidgets} invoices={customerInvoices} parties={parties} />;
            case 'master-data-gl-accounts': return <MasterDataAccountsPage accounts={accounts} addAccount={(acc, p) => showToast('حساب افزوده شد')} updateAccount={acc => showToast('حساب ویرایش شد')} deleteAccount={code => showToast('حساب حذف شد')} getAccountLedger={() => []} />;
            case 'master-data-parties': return <MasterDataPartiesPage parties={parties} addParty={p => { setParties(prev => [...prev, { ...p, id: uuidv4() }]); showToast('طرف حساب افزوده شد'); }} updateParty={p => { setParties(prev => prev.map(ex => ex.id === p.id ? p : ex)); showToast('طرف حساب ویرایش شد'); }} deleteParty={id => { setParties(prev => prev.filter(p => p.id !== id)); showToast('طرف حساب حذف شد'); }} />;
            case 'master-data-goods': return <MasterDataGoodsPage goods={goods} addGood={g => { setGoods(prev => [...prev, { ...g, id: uuidv4() }]); showToast('کالا افزوده شد'); }} updateGood={g => { setGoods(prev => prev.map(ex => ex.id === g.id ? g : ex)); showToast('کالا ویرایش شد'); }} deleteGood={id => { setGoods(prev => prev.filter(g => g.id !== id)); showToast('کالا حذف شد'); }} />;
            case 'master-data-cost-centers': return <MasterDataCostCentersPage costCenters={costCenters} addCostCenter={(c, p) => { setCostCenters(prev => [...prev, c]); showToast('مرکز هزینه افزوده شد'); }} updateCostCenter={c => { setCostCenters(prev => prev.map(ex => ex.code === c.code ? c : ex)); showToast('مرکز هزینه ویرایش شد'); }} deleteCostCenter={c => { setCostCenters(prev => prev.filter(ex => ex.code !== c)); showToast('مرکز هزینه حذف شد'); }} />;
            case 'master-data-detailed-accounts': return <MasterDataDetailedAccountsPage tafsiliGroups={tafsiliGroups} tafsiliAccounts={tafsiliAccounts} glAccounts={accounts} setTafsiliAccounts={setTafsiliAccounts} showToast={showToast} />;
            case 'master-data-banks': return <MasterDataBanksPage banks={banks} onSave={b => { if ('id' in b) setBanks(prev => prev.map(ex => ex.id === b.id ? b : ex)); else setBanks(prev => [...prev, { ...b, id: uuidv4() }]); showToast('بانک ذخیره شد'); }} onDelete={id => setBanks(prev => prev.filter(b => b.id !== id))} />;
            case 'master-data-bank-accounts': return <MasterDataBankAccountsPage bankAccounts={bankAccounts} addBankAccount={a => { setBankAccounts(prev => [...prev, { ...a, id: uuidv4() }]); showToast('حساب بانکی افزوده شد'); }} updateBankAccount={a => { setBankAccounts(prev => prev.map(ex => ex.id === a.id ? a : ex)); showToast('حساب بانکی ویرایش شد'); }} deleteBankAccount={id => setBankAccounts(prev => prev.filter(a => a.id !== id))} showToast={showToast} />;
            case 'master-data-cash-desks': return <MasterDataCashDeskPage cashDesks={cashDesks} treasuryDocs={treasuryDocs} addCashDesk={d => { setCashDesks(prev => [...prev, { ...d, id: uuidv4() }]); showToast('صندوق افزوده شد'); }} updateCashDesk={d => { setCashDesks(prev => prev.map(ex => ex.id === d.id ? d : ex)); showToast('صندوق ویرایش شد'); }} deleteCashDesk={id => setCashDesks(prev => prev.filter(d => d.id !== id))} showToast={showToast} />;
            case 'master-data-asset-classes': return <MasterDataAssetClassesPage assetClasses={assetClasses} onSave={ac => { if ('id' in ac) setAssetClasses(prev => prev.map(ex => ex.id === ac.id ? ac : ex)); else setAssetClasses(prev => [...prev, { ...ac, id: uuidv4() }]); showToast('کلاس دارایی ذخیره شد'); }} onDelete={id => setAssetClasses(prev => prev.filter(ac => ac.id !== id))} />;
            case 'hcm-admin-master': return <EmployeeMasterPage employees={employees} onSaveEmployee={e => { if ('id' in e) setEmployees(prev => prev.map(ex => ex.id === e.id ? e : ex)); else setEmployees(prev => [...prev, { ...e, id: uuidv4() }]); showToast('کارمند ذخیره شد'); }} showToast={showToast} />;
            case 'hcm-admin-org': return <OrgStructurePage orgStructure={orgStructure} />;
            case 'hcm-payroll-calc': return <PayrollCalculationPage onRunPayroll={() => showToast('محاسبه حقوق انجام شد')} payslips={payslips} showToast={showToast} />;
            case 'hcm-payroll-reports': return <PayrollReportsPage />;
            case 'hcm-time-attendance': return <AttendancePage attendance={attendance} />;
            case 'hcm-talent-recruitment': return <RecruitmentPage jobOpenings={jobOpenings} candidates={candidates} onUpdateCandidate={c => setCandidates(prev => prev.map(ex => ex.id === c.id ? c : ex))} />;
            case 'hcm-talent-performance': return <PerformancePage reviews={performanceReviews} />;
            case 'hcm-talent-learning': return <LearningPage courses={trainingCourses} />;
            case 'hcm-ess-portal': return employees.length > 0 ? <EmployeePortalPage employee={employees[0]} payslips={payslips} attendance={attendance} /> : <div>کارمندی یافت نشد</div>;
            default: return <DashboardPage journalEntries={journalEntries} checks={checks} treasuryDocs={treasuryDocs} customerInvoices={customerInvoices} supplierInvoices={supplierInvoices} onNavigate={setActivePage} accounts={accounts} />;
        }
    };

    const breadcrumbs = useMemo(() => {
        const findPath = (groups: any[]): { label: string, path?: string }[] => {
            for (const group of groups) {
                for (const item of group.items) {
                    if (item.path === activePage) return [{ label: item.label }];
                    if (item.children) {
                        const found = item.children.find((child: any) => child.path === activePage);
                        if (found) return [{ label: item.label }, { label: found.label }];
                        // Deep search
                        for(const child of item.children) {
                             if(child.children) {
                                 const deepFound = child.children.find((c: any) => c.path === activePage);
                                 if(deepFound) return [{ label: item.label }, { label: child.label }, { label: deepFound.label }];
                             }
                        }
                    }
                }
            }
            return [];
        };
        return findPath(navGroups);
    }, [activePage]);

    const pageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'داشبورد';

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className={`flex h-screen bg-gray-50 dark:bg-[#0f111a] font-sans text-right ${theme}`} dir="rtl">
            <Sidebar isOpen={sidebarOpen} activePage={activePage} onNavigate={setActivePage} onCloseMobile={() => setSidebarOpen(false)} />
            
            <div className={`flex-1 flex flex-col transition-none ${sidebarOpen ? 'md:mr-72' : 'mr-0'}`}>
                <Header 
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                    onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                    currentTheme={theme}
                    breadcrumbs={breadcrumbs}
                    pageTitle={pageTitle}
                />
                
                <main className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    {renderContent()}
                </main>
            </div>
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
};
