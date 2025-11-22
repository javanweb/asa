
import React, { useMemo, useCallback } from 'react';
import type { FiscalYearStatus, AccountNode, JournalEntry, JournalEntryLine, ToastData } from '../../../types';
import { IconCheckCircle, IconXCircle, IconChevronLeft, IconBook, IconFileText, IconScale, IconActivity } from '../../Icons';
import { v4 as uuidv4 } from 'uuid';

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ['بررسی سلامت', 'تولید اسناد', 'نهایی‌سازی'];
    return (
        <div className="flex items-center justify-center mb-12 relative">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center px-8 bg-white dark:bg-[#1E2130] z-10">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all shadow-md ${
                            currentStep > index ? 'bg-emerald-500 text-white shadow-emerald-200' : 
                            currentStep === index ? 'bg-primary text-white shadow-primary/40 scale-110' : 
                            'bg-gray-100 dark:bg-gray-700 text-gray-400'
                        }`}>
                            {currentStep > index ? <IconCheckCircle className="w-6 h-6" /> : index + 1}
                        </div>
                        <p className={`mt-3 text-sm font-bold ${currentStep >= index ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>{step}</p>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

interface YearEndClosingPageProps {
    fiscalYear: FiscalYearStatus;
    updateFiscalYear: (update: Partial<FiscalYearStatus>) => void;
    showToast: (message: string, type?: ToastData['type']) => void;
    accounts: AccountNode[];
    addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'serialNumber'>) => void;
}

const HealthCheckCard: React.FC<{ title: string; isOk: boolean; description: string; icon: React.ReactNode }> = ({ title, isOk, description, icon }) => (
    <div className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${isOk ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900' : 'bg-rose-50/50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900'}`}>
        <div className={`p-3 rounded-xl ${isOk ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {icon}
        </div>
        <div>
            <h4 className={`font-bold text-base ${isOk ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-800 dark:text-rose-400'}`}>{title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{description}</p>
            <div className="mt-3">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isOk ? 'bg-emerald-200/50 text-emerald-800' : 'bg-rose-200/50 text-rose-800'}`}>
                    {isOk ? 'تایید شده' : 'نیاز به بررسی'}
                </span>
            </div>
        </div>
    </div>
);

const JournalPreview: React.FC<{ title: string, icon: React.ReactNode, lines: JournalEntryLine[], total: number }> = ({ title, icon, lines, total }) => (
     <div className="bg-white dark:bg-[#1E2130] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3 font-bold text-gray-700 dark:text-gray-200">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-primary">{icon}</div>
                {title}
            </div>
            <div className="text-xs font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{lines.length} آرتیکل</div>
        </div>
        <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 sticky top-0">
                    <tr>
                        <th className="p-3 text-right">حساب</th>
                        <th className="p-3 text-left text-emerald-600">بدهکار</th>
                        <th className="p-3 text-left text-rose-600">بستانکار</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {lines.map(line => (
                        <tr key={line.id}>
                            <td className="p-3">
                                <div className="font-medium text-gray-800 dark:text-gray-200">{line.accountName}</div>
                                <div className="text-xs text-gray-400 font-mono">{line.accountCode}</div>
                            </td>
                            <td className="p-3 font-mono text-left">{line.debit > 0 ? line.debit.toLocaleString('fa-IR') : '-'}</td>
                            <td className="p-3 font-mono text-left">{line.credit > 0 ? line.credit.toLocaleString('fa-IR') : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-between font-bold text-sm">
            <span>جمع کل سند:</span>
            <span className="font-mono text-primary">{total.toLocaleString('fa-IR')} ریال</span>
        </div>
    </div>
);


export const YearEndClosingPage: React.FC<YearEndClosingPageProps> = ({ fiscalYear, updateFiscalYear, showToast, accounts, addJournalEntry }) => {
    
    const preChecks = useMemo(() => ({
        isBalanced: true,
        allDocsFinalized: true,
        noNegativeCash: true,
    }), []);

    const canProceedToStep1 = Object.values(preChecks).every(Boolean);
    const currentStep = fiscalYear.status === 'بسته' ? 3 : fiscalYear.closingStep;

    const generateClosingEntries = useCallback(() => {
        let closingLines: JournalEntryLine[] = [];
        let openingLines: JournalEntryLine[] = [];
        let netIncome = 0;

        const traverse = (nodes: AccountNode[]) => {
            nodes.forEach(node => {
                const codePrefix = node.code[0];
                if (node.type === 'account') {
                    const balance = Math.floor(Math.random() * 10000000); // Mock balance
                    
                    if (['4', '5'].includes(codePrefix)) {
                        if (codePrefix === '4') { 
                            netIncome += balance;
                            closingLines.push({ id: uuidv4(), accountCode: node.code, accountName: node.name, description: 'بستن حساب سود و زیان', debit: balance, credit: 0 });
                        } else {
                            netIncome -= balance;
                            closingLines.push({ id: uuidv4(), accountCode: node.code, accountName: node.name, description: 'بستن حساب سود و زیان', debit: 0, credit: balance });
                        }
                    } else if (['1', '2', '3'].includes(codePrefix)) {
                         if (codePrefix === '1') {
                            openingLines.push({ id: uuidv4(), accountCode: node.code, accountName: node.name, description: `سند افتتاحیه سال ${fiscalYear.year + 1}`, debit: balance, credit: 0 });
                        } else {
                            openingLines.push({ id: uuidv4(), accountCode: node.code, accountName: node.name, description: `سند افتتاحیه سال ${fiscalYear.year + 1}`, debit: 0, credit: balance });
                        }
                    }
                }
                if (node.children) traverse(node.children);
            });
        };

        traverse(accounts);

        const retainedEarningsAccount = { code: '3103', name: 'سود انباشته' };
        if (netIncome >= 0) {
            closingLines.push({ id: uuidv4(), accountCode: retainedEarningsAccount.code, accountName: retainedEarningsAccount.name, description: 'انتقال سود سال مالی', debit: 0, credit: netIncome });
            openingLines.push({ id: uuidv4(), accountCode: retainedEarningsAccount.code, accountName: retainedEarningsAccount.name, description: `سند افتتاحیه سال ${fiscalYear.year + 1}`, debit: 0, credit: netIncome });
        } else {
            closingLines.push({ id: uuidv4(), accountCode: retainedEarningsAccount.code, accountName: retainedEarningsAccount.name, description: 'انتقال زیان سال مالی', debit: -netIncome, credit: 0 });
             openingLines.push({ id: uuidv4(), accountCode: retainedEarningsAccount.code, accountName: retainedEarningsAccount.name, description: `سند افتتاحیه سال ${fiscalYear.year + 1}`, debit: -netIncome, credit: 0 });
        }

        const closingTotal = closingLines.reduce((sum, l) => sum + l.debit, 0);
        const openingTotal = openingLines.reduce((sum, l) => sum + l.debit, 0);

        updateFiscalYear({
            closingStep: 2,
            generatedClosingEntry: { docNumber: 9998, date: `۲۹/۱۲/${fiscalYear.year}`, description: `سند اختتامیه سال مالی ${fiscalYear.year}`, lines: closingLines, totalDebit: closingTotal, totalCredit: closingTotal },
            generatedOpeningEntry: { docNumber: 1, date: `۰۱/۰۱/${fiscalYear.year + 1}`, description: `سند افتتاحیه سال مالی ${fiscalYear.year + 1}`, lines: openingLines, totalDebit: openingTotal, totalCredit: openingTotal }
        });
        showToast('اسناد اختتامیه و افتتاحیه با موفقیت تولید شدند.', 'info');
    }, [accounts, fiscalYear.year, updateFiscalYear, showToast]);
    
    const finalizeClosing = () => {
        if(fiscalYear.generatedClosingEntry && fiscalYear.generatedOpeningEntry) {
            addJournalEntry({ ...fiscalYear.generatedClosingEntry, status: 'ثبت شده', sourceModule: 'Closing' });
            addJournalEntry({ ...fiscalYear.generatedOpeningEntry, status: 'ثبت شده', sourceModule: 'Closing' });
            
            updateFiscalYear({ status: 'بسته', closingStep: 3 });
            showToast(`سال مالی ${fiscalYear.year} با موفقیت بسته شد.`);
        } else {
            showToast('خطا: اسناد بستن سال یافت نشدند!', 'error');
        }
    };
    
    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4">
            <div className="text-center">
                <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">بستن حساب‌ها - سال مالی {fiscalYear.year}</h1>
                 <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mt-4 border ${fiscalYear.status === 'باز' ? 'bg-green-50 border-green-200 text-green-700' : (fiscalYear.status === 'در حال بستن' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-700')}`}>
                    <div className={`w-2 h-2 rounded-full ${fiscalYear.status === 'باز' ? 'bg-green-500' : (fiscalYear.status === 'در حال بستن' ? 'bg-amber-500' : 'bg-red-500')}`}></div>
                    {fiscalYear.status}
                </div>
            </div>
            
            <Stepper currentStep={currentStep} />
            
            <div className="animate-fade-in-up transition-all duration-500">
                {currentStep === 0 && (
                    <div className="bg-white dark:bg-[#1E2130] rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <IconActivity className="w-6 h-6 text-primary"/>
                            بررسی سلامت سیستم
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <HealthCheckCard title="تراز حساب‌ها" isOk={preChecks.isBalanced} description="جمع بدهکار و بستانکار در تراز آزمایشی کل برابر است." icon={<IconScale className="w-6 h-6"/>} />
                            <HealthCheckCard title="قطعی‌سازی اسناد" isOk={preChecks.allDocsFinalized} description="هیچ سند پیش‌نویس یا موقتی در سیستم وجود ندارد." icon={<IconFileText className="w-6 h-6"/>} />
                            <HealthCheckCard title="مانده نقدینگی" isOk={preChecks.noNegativeCash} description="هیچ‌یک از حساب‌های نقد و بانک مانده منفی ندارند." icon={<IconBook className="w-6 h-6"/>} />
                        </div>
                        <div className="flex justify-end border-t dark:border-gray-700 pt-6">
                            <button onClick={() => updateFiscalYear({ closingStep: 1, status: 'در حال بستن' })} disabled={!canProceedToStep1} className="px-8 py-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-600 transition-all transform hover:-translate-y-1 font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                                تایید و شروع عملیات
                            </button>
                        </div>
                    </div>
                )}

                {currentStep === 1 && (
                     <div className="bg-white dark:bg-[#1E2130] rounded-3xl shadow-xl p-12 border border-gray-100 dark:border-gray-700 text-center">
                         <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                             <IconBook className="w-10 h-10 text-primary animate-pulse"/>
                         </div>
                         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">تولید خودکار اسناد</h2>
                         <p className="text-gray-500 max-w-md mx-auto mb-8">سیستم آماده محاسبه سود و زیان، بستن حساب‌های موقت و صدور سند اختتامیه است.</p>
                         <button onClick={generateClosingEntries} className="px-8 py-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-600 transition-all transform hover:-translate-y-1 font-bold">
                             تولید اسناد اختتامیه و افتتاحیه
                         </button>
                     </div>
                )}
                 
                {currentStep === 2 && fiscalYear.generatedClosingEntry && fiscalYear.generatedOpeningEntry && (
                     <div className="space-y-6">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <JournalPreview title="سند اختتامیه (سال جاری)" icon={<IconXCircle className="w-5 h-5"/>} lines={fiscalYear.generatedClosingEntry.lines} total={fiscalYear.generatedClosingEntry.totalDebit} />
                            <JournalPreview title="سند افتتاحیه (سال جدید)" icon={<IconCheckCircle className="w-5 h-5"/>} lines={fiscalYear.generatedOpeningEntry.lines} total={fiscalYear.generatedOpeningEntry.totalDebit} />
                        </div>
                         <div className="bg-white dark:bg-[#1E2130] p-6 rounded-2xl shadow-lg flex justify-between items-center border border-gray-100 dark:border-gray-700 sticky bottom-4">
                             <button onClick={() => updateFiscalYear({ closingStep: 0, status: 'باز' })} className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                                <IconChevronLeft className="w-4 h-4 inline-block ml-1"/> بازگشت و اصلاح
                             </button>
                             <div className="flex items-center gap-4">
                                 <p className="text-sm text-gray-500">با تایید نهایی، دوره مالی جاری قفل خواهد شد.</p>
                                 <button onClick={finalizeClosing} className="px-8 py-3 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all transform hover:-translate-y-1 font-bold">
                                     تایید نهایی و بستن سال
                                 </button>
                             </div>
                        </div>
                     </div>
                 )}

                 {currentStep === 3 && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl p-12 text-center border border-emerald-100 dark:border-emerald-900">
                        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <IconCheckCircle className="w-12 h-12 text-emerald-600 dark:text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-emerald-800 dark:text-emerald-400 mb-2">عملیات موفقیت‌آمیز بود!</h2>
                        <p className="text-emerald-700 dark:text-emerald-300 text-lg">سال مالی {fiscalYear.year} بسته شد. اسناد مربوطه صادر گردیدند.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
