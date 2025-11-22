
import React, { useState, useMemo } from 'react';
import type { ConvertibleDocument, JournalEntry, JournalEntryLine, JournalEntryStatus, ToastData } from '../../types';
import { IconChevronRight, IconFilter, IconFileText, IconCheckCircle, IconPlusCircle, IconSwitchHorizontal } from '../Icons';

const mockConvertibleDocs: ConvertibleDocument[] = [
    { id: 'pf1', docNumber: 1, date: '۱۴۰۳/۰۵/۱۰', type: 'پیش‌فاکتور', partyName: 'شرکت آلفا', amount: 15000000 },
    { id: 'pf2', docNumber: 2, date: '۱۴۰۳/۰۵/۱۱', type: 'پیش‌فاکتور', partyName: 'فروشگاه برادران حسینی', amount: 8750000 },
    { id: 'wr1', docNumber: 101, date: '۱۴۰۳/۰۵/۱۲', type: 'رسید انبار', partyName: 'تامین کننده گاما', amount: 22000000 },
    { id: 'pf3', docNumber: 3, date: '۱۴۰۳/۰۵/۱۳', type: 'پیش‌فاکتور', partyName: 'مشتری ویژه', amount: 4500000 },
];

interface ConvertDocumentsPageProps {
    onNavigate: (page: 'financials-gl-list') => void;
    addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'serialNumber'>) => void;
    showToast: (message: string, type?: ToastData['type']) => void;
    journalEntries: JournalEntry[];
}

export const ConvertDocumentsPage: React.FC<ConvertDocumentsPageProps> = ({ onNavigate, addJournalEntry, showToast, journalEntries }) => {
    const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

    const handleSelectDoc = (id: string) => {
        setSelectedDocs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const resultingJournalLines = useMemo((): JournalEntryLine[] => {
        const lines: JournalEntryLine[] = [];
        mockConvertibleDocs.forEach(doc => {
            if (selectedDocs.has(doc.id)) {
                if (doc.type === 'پیش‌فاکتور') {
                    lines.push({ id: `${doc.id}-d`, accountCode: '1103', accountName: 'حساب‌های دریافتنی', description: `بابت پیش فاکتور ${doc.docNumber} - ${doc.partyName}`, debit: doc.amount, credit: 0 });
                    lines.push({ id: `${doc.id}-c`, accountCode: '4101', accountName: 'فروش', description: `بابت پیش فاکتور ${doc.docNumber} - ${doc.partyName}`, debit: 0, credit: doc.amount });
                } else if (doc.type === 'رسید انبار') {
                    lines.push({ id: `${doc.id}-d`, accountCode: '1105', accountName: 'موجودی کالا', description: `بابت رسید انبار ${doc.docNumber} - ${doc.partyName}`, debit: doc.amount, credit: 0 });
                    lines.push({ id: `${doc.id}-c`, accountCode: '2101', accountName: 'حساب‌های پرداختنی', description: `بابت رسید انبار ${doc.docNumber} - ${doc.partyName}`, debit: 0, credit: doc.amount });
                }
            }
        });
        return lines;
    }, [selectedDocs]);

    const { debit: totalDebit, credit: totalCredit } = useMemo(() => {
        return resultingJournalLines.reduce((acc, line) => {
            acc.debit += line.debit;
            acc.credit += line.credit;
            return acc;
        }, { debit: 0, credit: 0 });
    }, [resultingJournalLines]);
    
    const handleConvertAndSave = () => {
        if (resultingJournalLines.length === 0) {
             showToast('لطفا ابتدا حداقل یک سند را برای تبدیل انتخاب کنید.', 'error');
             return;
        }
        
        const nextDocNumber = (journalEntries.length > 0 ? Math.max(...journalEntries.map(e => e.docNumber)) : 0) + 1;

        const newEntryData: Omit<JournalEntry, 'id' | 'serialNumber'> = {
            docNumber: nextDocNumber,
            date: new Date().toLocaleDateString('fa-IR-u-nu-latn'),
            description: `سند حاصل از تبدیل ${selectedDocs.size} سند موقت`,
            status: 'ثبت شده' as JournalEntryStatus,
            lines: resultingJournalLines,
            totalDebit,
            totalCredit,
            sourceModule: 'GL',
        };

        addJournalEntry(newEntryData);
        showToast('سند حسابداری با موفقیت ایجاد و ثبت شد.');
        onNavigate('financials-gl-list');
    };

    return (
        <div className="flex flex-col h-full space-y-6 p-2">
             <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تبدیل اسناد عملیاتی</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">انتخاب اسناد موقت و صدور اتوماتیک سند حسابداری.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => onNavigate('financials-gl-list')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold text-sm">انصراف</button>
                    <button 
                        onClick={handleConvertAndSave}
                        disabled={selectedDocs.size === 0}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-600 transition-all transform hover:-translate-y-0.5 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <IconSwitchHorizontal className="w-5 h-5" />
                        <span>تبدیل و صدور سند ({selectedDocs.size})</span>
                    </button>
                </div>
            </div>
            
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Source Side */}
                <div className="bg-white dark:bg-[#1E2130] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-[#151923]">
                        <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                            ۱. اسناد قابل تبدیل
                        </h2>
                    </div>
                    
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex gap-2">
                         <select className="py-2 px-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:ring-2 ring-primary/30">
                            <option>همه انواع سند</option>
                            <option>پیش‌فاکتور</option>
                            <option>رسید انبار</option>
                        </select>
                        <input type="text" placeholder="جستجو..." className="py-2 px-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:ring-2 ring-primary/30 flex-grow"/>
                    </div>

                     <div className="overflow-auto flex-grow p-2">
                        <table className="w-full text-sm text-right">
                            <thead className="text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="p-3 w-10"><input type="checkbox" className="rounded border-gray-300"/></th>
                                    <th className="p-3">نوع سند</th>
                                    <th className="p-3">شماره / تاریخ</th>
                                    <th className="p-3">طرف حساب</th>
                                    <th className="p-3">مبلغ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {mockConvertibleDocs.map(doc => (
                                <tr key={doc.id} 
                                    className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors rounded-lg ${selectedDocs.has(doc.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                    onClick={() => handleSelectDoc(doc.id)}
                                >
                                    <td className="p-3"><input type="checkbox" checked={selectedDocs.has(doc.id)} readOnly className="rounded border-gray-300 text-primary focus:ring-primary"/></td>
                                    <td className="p-3 font-medium text-blue-600">{doc.type}</td>
                                    <td className="p-3">
                                        <div className="font-mono font-bold text-gray-700 dark:text-gray-300">{doc.docNumber}</div>
                                        <div className="text-xs text-gray-400">{doc.date}</div>
                                    </td>
                                    <td className="p-3 font-medium">{doc.partyName}</td>
                                    <td className="p-3 font-mono font-bold">{(doc.amount ?? 0).toLocaleString('fa-IR')}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>

                {/* Target Side */}
                <div className="bg-white dark:bg-[#1E2130] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col relative overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-[#151923]">
                        <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                            ۲. پیش‌نمایش سند حسابداری
                        </h2>
                    </div>

                    {resultingJournalLines.length > 0 ? (
                        <div className="flex flex-col h-full">
                            <div className="overflow-auto flex-grow p-2">
                                <table className="w-full text-sm text-right">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 sticky top-0">
                                        <tr>
                                            <th className="p-3">شرح آرتیکل</th>
                                            <th className="p-3 w-32 text-left text-emerald-600">بدهکار</th>
                                            <th className="p-3 w-32 text-left text-rose-600">بستانکار</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {resultingJournalLines.map(line => (
                                            <tr key={line.id}>
                                                <td className="p-3">
                                                    <div className="font-bold text-gray-700 dark:text-gray-300">{line.accountName}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-xs">{line.description}</div>
                                                </td>
                                                <td className="p-3 font-mono text-left">{line.debit > 0 ? (line.debit ?? 0).toLocaleString('fa-IR') : '-'}</td>
                                                <td className="p-3 font-mono text-left">{line.credit > 0 ? (line.credit ?? 0).toLocaleString('fa-IR') : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-[#151923] border-t border-gray-100 dark:border-gray-700 mt-auto">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">جمع کل سند:</span>
                                    <div className="flex gap-8">
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-400 uppercase">بدهکار</p>
                                            <p className="font-mono font-bold text-emerald-600 text-lg">{(totalDebit ?? 0).toLocaleString('fa-IR')}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-400 uppercase">بستانکار</p>
                                            <p className="font-mono font-bold text-rose-600 text-lg">{(totalCredit ?? 0).toLocaleString('fa-IR')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
                            <IconFileText className="w-16 h-16 mb-4 opacity-20"/>
                            <p>هیچ سندی برای تبدیل انتخاب نشده است.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
