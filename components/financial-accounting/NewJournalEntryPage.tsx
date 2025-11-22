
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import type { JournalEntry, JournalEntryLine, ToastData, AccountNode, JournalEntryTemplate, TafsiliGroup, TafsiliAccount } from '../../types';
import { 
    IconPlusCircle, IconTrash, IconChevronRight, IconDeviceFloppy, IconScale, IconSettings, 
    IconTable, IconCalendar, IconFile, IconMenu, IconBrain, IconCheckCircle, IconXCircle, 
    IconSearch, IconCopy, IconWallet, IconBolt
} from '../Icons';
import { Modal } from '../common/Modal';
import { v4 as uuidv4 } from 'uuid';

// --- Helpers ---
const flattenAccounts = (nodes: AccountNode[]): { code: string; name: string }[] => {
    let flatList: { code: string; name: string }[] = [];
    nodes.forEach(node => {
        if (node.type === 'account') flatList.push({ code: node.code, name: node.name });
        if (node.children) flatList = flatList.concat(flattenAccounts(node.children));
    });
    return flatList;
};

const initialLine: Omit<JournalEntryLine, 'id'> = {
    accountCode: '', accountName: '', description: '', debit: 0, credit: 0, tafsiliId: '', tafsiliName: '', costCenterId: '', projectId: '', currency: 'IRR'
};

// --- AI Assistant Component ---
const AIAssistant: React.FC<{ lines: JournalEntryLine[], difference: number }> = ({ lines, difference }) => {
    const analysis = useMemo(() => {
        const alerts = [];
        if (difference !== 0) alerts.push({ type: 'error', text: 'سند تراز نیست. اختلاف را بررسی کنید.' });
        
        const cashLines = lines.filter(l => l.accountCode.startsWith('1101')); // Assuming 1101 is Cash/Bank
        const totalCashOut = cashLines.reduce((sum, l) => sum + Number(l.credit), 0);
        
        if (totalCashOut > 100000000) alerts.push({ type: 'warning', text: 'هشدار: خروج نقدینگی بیش از حد معمول (۱۰۰ میلیون ریال).' });
        if (lines.length > 0 && !lines[0].description) alerts.push({ type: 'info', text: 'پیشنهاد: شرح سند برای سطر اول وارد نشده است.' });
        
        const duplicates = lines.filter((l, i) => lines.findIndex(x => x.accountCode === l.accountCode && x.accountCode !== '') !== i);
        if (duplicates.length > 0) alerts.push({ type: 'info', text: 'نکته: حساب تکراری در سند استفاده شده است.' });

        return alerts;
    }, [lines, difference]);

    if (analysis.length === 0) return (
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 animate-pulse">
            <IconCheckCircle className="w-4 h-4"/>
            هوش مصنوعی: سند فاقد ریسک به نظر می‌رسد.
        </div>
    );

    return (
        <div className="flex flex-col gap-2">
            {analysis.map((alert, idx) => (
                <div key={idx} className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border ${
                    alert.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 
                    alert.type === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                    'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                    {alert.type === 'error' ? <IconXCircle className="w-4 h-4"/> : <IconBrain className="w-4 h-4"/>}
                    {alert.text}
                </div>
            ))}
        </div>
    );
};

// --- Main Page ---
interface NewJournalEntryPageProps {
    onNavigate: (page: 'financials-gl-list') => void;
    addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'serialNumber'>) => void;
    nextSerialNumber: number;
    showToast: (message: string, type?: ToastData['type']) => void;
    accounts: AccountNode[];
    templates: JournalEntryTemplate[];
    tafsiliGroups: TafsiliGroup[];
    tafsiliAccounts: TafsiliAccount[];
    saveButtonRef: React.RefObject<HTMLButtonElement>;
}

export const NewJournalEntryPage: React.FC<NewJournalEntryPageProps> = ({ onNavigate, addJournalEntry, nextSerialNumber, showToast, accounts, templates, tafsiliGroups, tafsiliAccounts, saveButtonRef }) => {
    const [docNumber, setDocNumber] = useState(nextSerialNumber.toString());
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [description, setDescription] = useState('');
    const [referenceNo, setReferenceNo] = useState('');
    const [lines, setLines] = useState<JournalEntryLine[]>([
        { id: uuidv4(), ...initialLine },
        { id: uuidv4(), ...initialLine },
        { id: uuidv4(), ...initialLine },
        { id: uuidv4(), ...initialLine },
    ]);
    const [focusedCell, setFocusedCell] = useState<{idx: number, field: string} | null>(null);

    const flatAccounts = useMemo(() => flattenAccounts(accounts), [accounts]);

    const { totalDebit, totalCredit, difference } = useMemo(() => {
        const totals = lines.reduce((acc, line) => {
            acc.debit += Number(line.debit) || 0;
            acc.credit += Number(line.credit) || 0;
            return acc;
        }, { debit: 0, credit: 0 });
        return { totalDebit: totals.debit, totalCredit: totals.credit, difference: totals.debit - totals.credit };
    }, [lines]);

    const isBalanced = Math.abs(difference) < 1;

    const handleLineChange = useCallback((id: string, field: keyof JournalEntryLine, value: any) => {
        setLines(prevLines => prevLines.map(line => {
            if (line.id !== id) return line;
            const updates: Partial<JournalEntryLine> = { [field]: value };
            
            if (field === 'accountCode') {
                const acc = flatAccounts.find(a => a.code === value || a.name === value); // Search by code or name
                if (acc) {
                    updates.accountCode = acc.code; // Normalize to code
                    updates.accountName = acc.name;
                }
            }
            if (field === 'tafsiliId') {
                 const taf = tafsiliAccounts.find(t => t.id === value);
                 if(taf) updates.tafsiliName = taf.name;
            }
            if (field === 'description' && value === '*') {
                const idx = prevLines.findIndex(l => l.id === id);
                if (idx > 0) updates.description = prevLines[idx - 1].description;
                else updates.description = description; 
            }
            if (field === 'debit' && Number(value) > 0) updates.credit = 0;
            if (field === 'credit' && Number(value) > 0) updates.debit = 0;

            return { ...line, ...updates };
        }));
    }, [flatAccounts, tafsiliAccounts, description]);

    const addLine = useCallback(() => {
        setLines(prev => [...prev, { ...initialLine, id: uuidv4(), description: description || prev[prev.length-1]?.description || '' }]);
    }, [description]);

    const removeLine = (id: string) => {
        if (lines.length <= 1) return;
        setLines(prev => prev.filter(l => l.id !== id));
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number, field: string) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (field === 'accountCode') document.getElementById(`row-${index}-tafsili`)?.focus();
            else if (field === 'tafsiliId') document.getElementById(`row-${index}-desc`)?.focus();
            else if (field === 'description') document.getElementById(`row-${index}-debit`)?.focus();
            else if (field === 'debit') document.getElementById(`row-${index}-credit`)?.focus();
            else if (field === 'credit') {
                if (index === lines.length - 1) {
                    addLine();
                    setTimeout(() => document.getElementById(`row-${index + 1}-accountCode`)?.focus(), 50);
                } else {
                    document.getElementById(`row-${index + 1}-accountCode`)?.focus();
                }
            }
        }
        if (e.key === 'ArrowUp' && index > 0) {
             // Simplified focusing logic for demo
             document.getElementById(`row-${index - 1}-${field}`)?.focus();
        }
        if (e.key === 'ArrowDown' && index < lines.length - 1) {
             document.getElementById(`row-${index + 1}-${field}`)?.focus();
        }
        if (e.key === 'F2') handleSave();
        if (e.key === 'Insert') addLine();
    };

    const handleSave = () => {
        if (!isBalanced) { showToast('سند تراز نیست.', 'error'); return; }
        const validLines = lines.filter(l => l.accountCode && (l.debit > 0 || l.credit > 0));
        if(validLines.length === 0) { showToast('سند خالی است.', 'error'); return; }

        addJournalEntry({
            docNumber: Number(docNumber),
            date: new Date(date).toLocaleDateString('fa-IR-u-nu-latn'),
            description: description || 'سند صادره',
            status: 'ثبت شده',
            lines: validLines,
            totalDebit,
            totalCredit,
            sourceModule: 'GL',
            referenceNumber: referenceNo
        });
        showToast('سند با موفقیت ثبت شد.');
        onNavigate('financials-gl-list');
    };

    const autoBalance = () => {
        if (difference !== 0) {
            const newLineId = uuidv4();
            setLines(prev => [...prev, { ...initialLine, id: newLineId, [difference > 0 ? 'credit' : 'debit']: Math.abs(difference), description }]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F111A]">
            {/* Top Bar */}
            <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-[#1E2130] border-b dark:border-gray-700 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('financials-gl-list')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 transition-all">
                        <IconChevronRight className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">سند حسابداری جدید</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">فرم ثبت سند استاندارد • F2 برای ذخیره</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium">
                        <IconBolt className="w-4 h-4"/> حالت ثبت سریع فعال است
                    </div>
                    <button onClick={handleSave} className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20 px-6 py-2.5">
                        <IconDeviceFloppy className="w-5 h-5"/> ثبت نهایی
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-1 overflow-hidden">
                {/* Form Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Metadata Form */}
                    <div className="p-6 grid grid-cols-12 gap-4 bg-white/50 dark:bg-[#1E2130]/50 backdrop-blur-sm border-b dark:border-gray-700">
                        <div className="col-span-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase mb-1.5 block">شماره سند</label>
                            <input type="text" value={docNumber} onChange={e => setDocNumber(e.target.value)} className="input-field font-mono text-center font-bold" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase mb-1.5 block">تاریخ سند</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field font-mono text-center" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase mb-1.5 block">شماره عطف</label>
                            <input type="text" value={referenceNo} onChange={e => setReferenceNo(e.target.value)} className="input-field font-mono text-center" />
                        </div>
                        <div className="col-span-6">
                            <label className="text-[11px] font-bold text-gray-500 uppercase mb-1.5 block">شرح کلی سند</label>
                            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="مثال: بابت هزینه حقوق و دستمزد..." className="input-field" />
                        </div>
                    </div>

                    {/* Data Grid */}
                    <div className="flex-1 overflow-auto bg-white dark:bg-[#151923] relative">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 dark:bg-[#1E2130] sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="w-12 p-3 text-xs font-bold text-gray-500 border-b dark:border-gray-700 text-center">#</th>
                                    <th className="w-40 p-3 text-xs font-bold text-gray-500 border-b dark:border-gray-700 text-right border-l dark:border-gray-700">کد حساب</th>
                                    <th className="min-w-[180px] p-3 text-xs font-bold text-gray-500 border-b dark:border-gray-700 text-right border-l dark:border-gray-700">نام حساب</th>
                                    <th className="w-48 p-3 text-xs font-bold text-gray-500 border-b dark:border-gray-700 text-right border-l dark:border-gray-700">تفصیلی</th>
                                    <th className="min-w-[250px] p-3 text-xs font-bold text-gray-500 border-b dark:border-gray-700 text-right border-l dark:border-gray-700">شرح آرتیکل</th>
                                    <th className="w-40 p-3 text-xs font-bold text-emerald-600 border-b dark:border-gray-700 text-left border-l dark:border-gray-700">بدهکار</th>
                                    <th className="w-40 p-3 text-xs font-bold text-rose-600 border-b dark:border-gray-700 text-left border-l dark:border-gray-700">بستانکار</th>
                                    <th className="w-12 p-3 border-b dark:border-gray-700"></th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {lines.map((line, idx) => (
                                    <tr key={line.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                                        <td className="text-center text-gray-400 text-xs border-b dark:border-gray-800">{idx + 1}</td>
                                        
                                        <td className="p-0 border-b dark:border-gray-800 border-l dark:border-gray-800">
                                            <input 
                                                id={`row-${idx}-accountCode`}
                                                value={line.accountCode}
                                                onChange={e => handleLineChange(line.id, 'accountCode', e.target.value)}
                                                onKeyDown={e => handleKeyDown(e, idx, 'accountCode')}
                                                className="w-full h-full px-3 py-2.5 bg-transparent focus:bg-white dark:focus:bg-black focus:ring-2 ring-inset ring-primary outline-none font-mono text-sm"
                                                placeholder="کد حساب..."
                                                list={`accs-${line.id}`}
                                            />
                                            <datalist id={`accs-${line.id}`}>{flatAccounts.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}</datalist>
                                        </td>

                                        <td className="px-3 py-2 border-b dark:border-gray-800 border-l dark:border-gray-800 text-gray-500 text-xs truncate bg-gray-50/30 dark:bg-gray-800/30">
                                            {line.accountName}
                                        </td>

                                        <td className="p-0 border-b dark:border-gray-800 border-l dark:border-gray-800">
                                            <select 
                                                id={`row-${idx}-tafsiliId`}
                                                value={line.tafsiliId}
                                                onChange={e => handleLineChange(line.id, 'tafsiliId', e.target.value)}
                                                onKeyDown={e => handleKeyDown(e, idx, 'tafsiliId')}
                                                className="w-full h-full px-2 bg-transparent focus:bg-white dark:focus:bg-black focus:ring-2 ring-inset ring-primary outline-none text-xs"
                                            >
                                                <option value=""></option>
                                                {tafsiliAccounts.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </select>
                                        </td>

                                        <td className="p-0 border-b dark:border-gray-800 border-l dark:border-gray-800">
                                            <input 
                                                id={`row-${idx}-description`}
                                                value={line.description}
                                                onChange={e => handleLineChange(line.id, 'description', e.target.value)}
                                                onKeyDown={e => handleKeyDown(e, idx, 'description')}
                                                className="w-full h-full px-3 py-2 bg-transparent focus:bg-white dark:focus:bg-black focus:ring-2 ring-inset ring-primary outline-none"
                                                placeholder={description || "شرح..."}
                                            />
                                        </td>

                                        <td className="p-0 border-b dark:border-gray-800 border-l dark:border-gray-800">
                                            <input 
                                                id={`row-${idx}-debit`}
                                                type="number"
                                                value={line.debit || ''}
                                                onChange={e => handleLineChange(line.id, 'debit', e.target.value)}
                                                onKeyDown={e => handleKeyDown(e, idx, 'debit')}
                                                className={`w-full h-full px-3 py-2 bg-transparent focus:bg-white dark:focus:bg-black focus:ring-2 ring-inset ring-emerald-500 outline-none font-mono font-bold text-left ${line.debit > 0 ? 'text-emerald-600 bg-emerald-50/20' : ''}`}
                                            />
                                        </td>

                                        <td className="p-0 border-b dark:border-gray-800 border-l dark:border-gray-800">
                                            <input 
                                                id={`row-${idx}-credit`}
                                                type="number"
                                                value={line.credit || ''}
                                                onChange={e => handleLineChange(line.id, 'credit', e.target.value)}
                                                onKeyDown={e => handleKeyDown(e, idx, 'credit')}
                                                className={`w-full h-full px-3 py-2 bg-transparent focus:bg-white dark:focus:bg-black focus:ring-2 ring-inset ring-rose-500 outline-none font-mono font-bold text-left ${line.credit > 0 ? 'text-rose-600 bg-rose-50/20' : ''}`}
                                            />
                                        </td>

                                        <td className="text-center border-b dark:border-gray-800 border-l dark:border-gray-800">
                                            <button onClick={() => removeLine(line.id)} className="text-gray-300 hover:text-rose-500 p-1 transition-colors"><IconTrash className="w-4 h-4"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div onClick={addLine} className="p-3 text-xs text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 font-medium">
                            <IconPlusCircle className="w-4 h-4"/> افزودن سطر جدید (Insert)
                        </div>
                    </div>

                    {/* Footer Status */}
                    <div className="bg-white dark:bg-[#1E2130] border-t dark:border-gray-700 p-4 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.1)] z-20">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-8">
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">جمع بدهکار</p><p className="text-xl font-mono font-bold text-emerald-600">{totalDebit.toLocaleString('fa-IR')}</p></div>
                                <div className="w-px bg-gray-200 dark:bg-gray-700 h-10"></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">جمع بستانکار</p><p className="text-xl font-mono font-bold text-rose-600">{totalCredit.toLocaleString('fa-IR')}</p></div>
                                <div className="w-px bg-gray-200 dark:bg-gray-700 h-10"></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">اختلاف تراز</p>
                                    <p className={`text-xl font-mono font-bold ${isBalanced ? 'text-gray-400' : 'text-red-600 animate-pulse'}`}>{Math.abs(difference).toLocaleString('fa-IR')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {!isBalanced && <button onClick={autoBalance} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors"><IconScale className="w-4 h-4"/> تراز خودکار</button>}
                                {isBalanced && <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold"><IconCheckCircle className="w-4 h-4"/> سند تراز است</div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: AI & Info */}
                <div className="w-72 bg-gray-50 dark:bg-[#151923] border-r dark:border-gray-700 p-4 overflow-y-auto hidden xl:block">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><IconBrain className="w-5 h-5 text-primary"/> دستیار هوشمند</h3>
                    <AIAssistant lines={lines} difference={difference} />
                    
                    <div className="mt-8">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-xs uppercase tracking-wider">کلیدهای میانبر</h3>
                        <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                            <li className="flex justify-between"><span>ذخیره سند</span><kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 rounded">F2</kbd></li>
                            <li className="flex justify-between"><span>سطر جدید</span><kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 rounded">Insert</kbd></li>
                            <li className="flex justify-between"><span>کپی شرح</span><kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 rounded">*</kbd></li>
                            <li className="flex justify-between"><span>جابجایی</span><kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 rounded">Enter</kbd></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
