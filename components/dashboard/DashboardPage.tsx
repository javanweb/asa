
import React, { useMemo } from 'react';
import type { StatCardData, JournalEntry, Check, TreasuryDoc, AccountNode, Invoice, SupplierInvoice } from '../../types';
import { 
    IconUser, IconBuildingStore, IconTrendingUp, IconTrendingDown, IconCurrencyDollar,
    IconChartPie, IconWallet, IconFileText, IconPlusCircle, IconClock, IconCalculator, IconActivity, IconBrain, IconCalendar
} from '../Icons';
import { IncomeExpenseChart, ExpenseBreakdownChart } from '../charts/Charts';

// --- Reusable Components ---
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
        {children}
    </div>
);

const CardHeader: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode }> = ({ title, subtitle, icon }) => (
    <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div>
            <h3 className="text-md font-bold text-gray-800 dark:text-white flex items-center gap-2">
                {icon && <span className="text-primary">{icon}</span>}
                {title}
            </h3>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);

const toPersianNumerals = (num: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]).replace('.', '٫');
};

const StatCard: React.FC<{ data: StatCardData }> = ({ data }) => {
    const colorVariants = {
        green: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'text-emerald-600', border: 'border-emerald-200' },
        red: { bg: 'bg-rose-50 dark:bg-rose-500/10', icon: 'text-rose-600', border: 'border-rose-200' },
        blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', icon: 'text-blue-600', border: 'border-blue-200' },
        orange: { bg: 'bg-amber-50 dark:bg-amber-500/10', icon: 'text-amber-600', border: 'border-amber-200' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-500/10', icon: 'text-purple-600', border: 'border-purple-200' },
    };
    const colorClass = colorVariants[data.color];

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border ${colorClass.border} dark:border-gray-700 relative h-full flex flex-col justify-between transition-all hover:shadow-md`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{data.title}</p>
                    <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-2 tracking-tight">{data.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${colorClass.bg}`}>
                    {React.cloneElement(data.icon, { className: `w-6 h-6 ${colorClass.icon}` })}
                </div>
            </div>
            
            {data.change !== undefined && (
                <div className={`flex items-center mt-4 text-xs font-bold ${data.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <span className={`flex items-center px-1.5 py-0.5 rounded ${data.change >= 0 ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                        {data.change >= 0 ? <IconTrendingUp className="w-3 h-3 mr-1" /> : <IconTrendingDown className="w-3 h-3 mr-1" />}
                        %{toPersianNumerals(Math.abs(data.change))}
                    </span>
                    <span className="text-gray-400 mr-2 font-normal">نسبت به دوره قبل</span>
                </div>
            )}
        </div>
    );
};

const RatioCard: React.FC<{ title: string; value: number; benchmark: number; good: boolean }> = ({ title, value, benchmark, good }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
        <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
            <p className="text-xs text-gray-400 mt-1">استاندارد صنعت: {benchmark}</p>
        </div>
        <div className="text-right">
            <p className={`text-xl font-bold ${good ? 'text-emerald-600' : 'text-rose-500'}`}>{value.toFixed(2)}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${good ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {good ? 'مطلوب' : 'نامطلوب'}
            </span>
        </div>
    </div>
);


// --- Main Dashboard Page ---
interface DashboardPageProps {
    journalEntries: JournalEntry[];
    checks: Check[];
    treasuryDocs: TreasuryDoc[];
    customerInvoices: Invoice[];
    supplierInvoices: SupplierInvoice[];
    onNavigate: (page: any) => void;
    accounts: AccountNode[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ journalEntries, checks, treasuryDocs, customerInvoices, supplierInvoices, onNavigate, accounts }) => {
    
    const formatValue = (value: number, unit: 'M' | null = 'M'): string => {
        const sign = value < 0 ? '−' : '';
        const absValue = Math.abs(value);
        const inMillions = (absValue / 1000000).toFixed(1);
        return `${sign}${toPersianNumerals(inMillions)} M`;
    };

    const kpiData = useMemo(() => {
        // Simulated data for calculating ratios
        const currentAssets = 1500000000; // Mock
        const currentLiabilities = 800000000; // Mock
        const inventory = 400000000; // Mock
        const totalEquity = 2000000000; // Mock

        const totalSales = customerInvoices.filter(inv => inv.status !== 'پیش‌نویس').reduce((sum, inv) => sum + inv.total, 0);
        
        const revenues = journalEntries.flatMap(j => j.lines).filter(l => l.accountCode.startsWith('4')).reduce((sum, l) => sum + l.credit - l.debit, 0);
        const expenses = journalEntries.flatMap(j => j.lines).filter(l => l.accountCode.startsWith('5')).reduce((sum, l) => sum + l.debit - l.credit, 0);
        const netProfit = revenues - expenses;

        // Ratios
        const currentRatio = currentAssets / currentLiabilities;
        const quickRatio = (currentAssets - inventory) / currentLiabilities;
        const roe = (netProfit / totalEquity) * 100;
        const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

        return { totalSales, netProfit, currentRatio, quickRatio, roe, profitMargin };
    }, [journalEntries, customerInvoices]);

    const statCardsData: StatCardData[] = [
        { title: 'سود خالص (Net Profit)', value: formatValue(kpiData.netProfit, null), icon: <IconActivity />, color: 'green', change: 12 },
        { title: 'فروش کل (Revenue)', value: formatValue(kpiData.totalSales), icon: <IconCurrencyDollar />, color: 'blue', change: 8.5 },
        { title: 'حاشیه سود (Margin)', value: `%${toPersianNumerals(kpiData.profitMargin.toFixed(1))}`, icon: <IconChartPie />, color: 'purple', change: -1.2 },
        { title: 'بازده حقوق صاحبان سهام (ROE)', value: `%${toPersianNumerals(kpiData.roe.toFixed(1))}`, icon: <IconTrendingUp />, color: 'orange', change: 2.4 },
    ];

    const { monthlyFlowsData, expenseBreakdownChartData } = useMemo(() => {
        const monthlyFlows = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return { name: d.toLocaleDateString('fa-IR', { month: 'long' }), 'درآمد': Math.random() * 1000, 'هزینه': Math.random() * 800 };
        }).reverse();
        
        const expenseData = [
            { name: 'حقوق و دستمزد', value: 45 },
            { name: 'اجاره', value: 20 },
            { name: 'بازاریابی', value: 15 },
            { name: 'اداری', value: 10 },
            { name: 'سایر', value: 10 },
        ];

        return { monthlyFlowsData: monthlyFlows, expenseBreakdownChartData: expenseData };
    }, []);
    
    return (
        <div className="space-y-6 animate-fade-in-right">
            
            {/* Header & AI Insight */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-9">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">داشبورد مالی و مدیریتی</h2>
                        <div className="flex gap-2">
                            <button className="btn-secondary text-sm flex items-center gap-2"><IconCalendar className="w-4 h-4"/> دوره: سال مالی ۱۴۰۳</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {statCardsData.map((stat) => (
                            <StatCard key={stat.title} data={stat} />
                        ))}
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white h-full shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-white/20 rounded-lg"><IconBrain className="w-5 h-5"/></div>
                                <h3 className="font-bold">هوش مصنوعی</h3>
                            </div>
                            <p className="text-sm opacity-90 leading-relaxed mb-4">
                                وضعیت نقدینگی در ۳۰ روز آینده با <span className="font-bold text-yellow-300">۱۵٪ کاهش</span> مواجه خواهد شد. پیشنهاد می‌شود پرداخت فاکتورهای غیرضروری به تعویق بیفتد.
                            </p>
                            <button className="w-full py-2 bg-white text-indigo-700 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">
                                تحلیل کامل ریسک
                            </button>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
            
            {/* Analysis Section */}
            <div className="grid grid-cols-12 gap-6">
                {/* Ratios */}
                <div className="col-span-12 lg:col-span-4">
                    <Card className="h-full">
                        <CardHeader title="نسبت‌های مالی کلیدی" icon={<IconCalculator/>} />
                        <div className="p-5 space-y-4">
                            <RatioCard title="نسبت جاری (Current Ratio)" value={kpiData.currentRatio} benchmark={1.5} good={kpiData.currentRatio > 1.5} />
                            <RatioCard title="نسبت آنی (Quick Ratio)" value={kpiData.quickRatio} benchmark={1.0} good={kpiData.quickRatio > 1.0} />
                            <div className="pt-4 border-t dark:border-gray-700">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">تحلیل دوپونت (DuPont)</h4>
                                <div className="flex justify-between text-sm">
                                    <div className="text-center">
                                        <span className="block font-bold text-gray-800 dark:text-gray-200">%12</span>
                                        <span className="text-[10px] text-gray-400">حاشیه سود</span>
                                    </div>
                                    <span className="text-gray-300">×</span>
                                    <div className="text-center">
                                        <span className="block font-bold text-gray-800 dark:text-gray-200">1.5</span>
                                        <span className="text-[10px] text-gray-400">گردش دارایی</span>
                                    </div>
                                    <span className="text-gray-300">×</span>
                                    <div className="text-center">
                                        <span className="block font-bold text-gray-800 dark:text-gray-200">2.1</span>
                                        <span className="text-[10px] text-gray-400">اهرم مالی</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Chart */}
                <div className="col-span-12 lg:col-span-8">
                    <Card className="h-full">
                        <CardHeader title="روند درآمد و هزینه (P&L Trend)" icon={<IconActivity/>} />
                        <div className="p-4 h-80">
                            <IncomeExpenseChart data={monthlyFlowsData} />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Operations & Quick Access */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                    <Card>
                        <CardHeader title="اسناد نیازمند بررسی" subtitle="5 سند در صف تایید مدیر مالی" icon={<IconFileText/>} />
                        <div className="overflow-x-auto p-5 pt-0">
                            <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400 border-b dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-3">شرح سند</th>
                                        <th className="px-4 py-3">مبلغ</th>
                                        <th className="px-4 py-3">کاربر</th>
                                        <th className="px-4 py-3">وضعیت</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1,2,3].map(i => (
                                        <tr key={i} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">تامین تنخواه گردان - مرداد</td>
                                            <td className="px-4 py-3 font-mono">50,000,000</td>
                                            <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gray-200"></div> <span className="text-xs">علی رضایی</span></div></td>
                                            <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-bold">منتظر تایید</span></td>
                                            <td className="px-4 py-3 text-left"><button className="text-primary hover:underline text-xs">بررسی</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-4">
                     <Card>
                        <CardHeader title="عملیات سریع" icon={<IconPlusCircle/>} />
                         <div className="grid grid-cols-2 gap-3 p-5">
                            <button className="quick-access-btn group" onClick={() => onNavigate('financials-gl-new')}>
                                <div className="icon-box bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <IconFileText className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">سند جدید</span>
                            </button>
                             <button className="quick-access-btn group" onClick={() => onNavigate('sales-ops-billing')}>
                                <div className="icon-box bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <IconCurrencyDollar className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">فاکتور فروش</span>
                            </button>
                            <button className="quick-access-btn group" onClick={() => onNavigate('treasury-payment')}>
                                <div className="icon-box bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                    <IconWallet className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">پرداخت وجه</span>
                            </button>
                             <button className="quick-access-btn group" onClick={() => onNavigate('financials-reports-standard')}>
                                <div className="icon-box bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <IconChartPie className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">گزارشات</span>
                            </button>
                         </div>
                    </Card>
                </div>
            </div>
            <style>{`
                .quick-access-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; border-radius: 1rem; border: 1px solid #e5e7eb; background-color: white; transition: all 0.2s; } 
                .dark .quick-access-btn { background-color: #1f2937; border-color: #374151; } 
                .quick-access-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                .icon-box { padding: 0.75rem; border-radius: 0.75rem; margin-bottom: 0.5rem; }
            `}</style>
        </div>
    );
};
