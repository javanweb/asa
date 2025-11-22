
import React, { useState, useMemo } from 'react';
import type { JournalEntry, JournalEntryStatus } from '../../types';
import { 
    IconPlusCircle, IconSearch, IconFilter, IconDotsVertical, IconEdit, 
    IconTrash, IconEye, IconChevronLeft, IconChevronRight, IconCopy, 
    IconFile, IconCheckCircle, IconXCircle, IconChart, IconPrinter
} from '../Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ITEMS_PER_PAGE = 10;

const statusMap: { [key in JournalEntryStatus]: { class: string, text: string, icon: React.ReactNode } } = {
    'پیش‌نویس': { class: 'bg-gray-100 text-gray-600 border-gray-200', text: 'پیش‌نویس', icon: <IconFile className="w-3 h-3"/> },
    'تایید شده': { class: 'bg-blue-50 text-blue-600 border-blue-200', text: 'تایید شده', icon: <IconCheckCircle className="w-3 h-3"/> },
    'ثبت شده': { class: 'bg-emerald-50 text-emerald-600 border-emerald-200', text: 'ثبت قطعی', icon: <IconCheckCircle className="w-3 h-3"/> },
    'باطل شده': { class: 'bg-rose-50 text-rose-600 border-rose-200', text: 'باطل شده', icon: <IconXCircle className="w-3 h-3"/> },
};

interface JournalEntriesListPageProps {
    journalEntries: JournalEntry[];
    onNavigate: (page: 'financials-gl-new') => void;
    deleteJournalEntry: (id: string) => void;
    reverseJournalEntry: (id: string) => void;
}

export const JournalEntriesListPage: React.FC<JournalEntriesListPageProps> = ({ journalEntries, onNavigate, deleteJournalEntry, reverseJournalEntry }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<JournalEntryStatus | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    // --- Analytics Data ---
    const chartData = useMemo(() => {
        const data = journalEntries.slice(0, 15).map(e => ({
            name: e.docNumber,
            amount: e.totalDebit
        }));
        return data;
    }, [journalEntries]);

    const stats = useMemo(() => ({
        totalDocs: journalEntries.length,
        drafts: journalEntries.filter(e => e.status === 'پیش‌نویس').length,
        volume: journalEntries.reduce((sum, e) => sum + e.totalDebit, 0),
        avgVolume: journalEntries.length > 0 ? journalEntries.reduce((sum, e) => sum + e.totalDebit, 0) / journalEntries.length : 0
    }), [journalEntries]);

    const filteredEntries = useMemo(() => {
        return journalEntries.filter(entry => {
            const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) || String(entry.docNumber).includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
            return matchesSearch && matchesStatus;
        }).sort((a, b) => b.docNumber - a.docNumber);
    }, [journalEntries, searchTerm, statusFilter]);

    const paginatedEntries = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredEntries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredEntries, currentPage]);

    const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col h-full space-y-6 p-2">
            {/* Header Dashboard */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#1E2130] rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">روند ثبت اسناد</h2>
                            <p className="text-sm text-gray-500">نمای گرافیکی حجم ریالی اسناد اخیر</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary font-mono">{(stats.volume/1000000).toFixed(0)} M</p>
                            <p className="text-xs text-gray-400">گردش کل دوره</p>
                        </div>
                    </div>
                    <div className="h-48 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7367F0" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#7367F0" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#1E2130', border: 'none', borderRadius: '8px', color: '#fff'}}
                                    formatter={(value: number) => value.toLocaleString('fa-IR')}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#7367F0" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                </div>

                <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#1E2130] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-2"><IconFile className="w-6 h-6"/></div>
                        <div><p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalDocs}</p><p className="text-xs text-gray-500">کل اسناد</p></div>
                    </div>
                    <div className="bg-white dark:bg-[#1E2130] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-2"><IconEdit className="w-6 h-6"/></div>
                        <div><p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.drafts}</p><p className="text-xs text-gray-500">پیش‌نویس</p></div>
                    </div>
                    <div className="col-span-2 bg-primary text-white rounded-2xl p-6 shadow-lg shadow-primary/30 flex items-center justify-between cursor-pointer hover:bg-primary-600 transition-colors" onClick={() => onNavigate('financials-gl-new')}>
                        <div>
                            <h3 className="font-bold text-lg">سند حسابداری جدید</h3>
                            <p className="text-blue-100 text-sm">ثبت رویداد مالی جدید در سیستم</p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-full"><IconPlusCircle className="w-8 h-8"/></div>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white dark:bg-[#1E2130] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col flex-grow">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-4 flex-grow max-w-2xl">
                        <div className="relative flex-grow">
                            <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="جستجو در شرح، شماره سند، مبلغ..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#151923] border-transparent focus:bg-white dark:focus:bg-black focus:ring-2 ring-primary/20 transition-all text-sm"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value as any)}
                            className="py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-[#151923] border-transparent text-sm cursor-pointer focus:ring-2 ring-primary/20"
                        >
                            <option value="all">همه وضعیت‌ها</option>
                            {Object.entries(statusMap).map(([key, val]) => <option key={key} value={key}>{val.text}</option>)}
                        </select>
                        <button className="p-2.5 bg-gray-50 dark:bg-[#151923] rounded-xl text-gray-500 hover:text-primary transition-colors"><IconFilter className="w-5 h-5"/></button>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn-secondary text-xs flex items-center gap-2"><IconPrinter className="w-4 h-4"/> چاپ لیست</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50/50 dark:bg-[#151923]/50">
                            <tr>
                                <th className="px-6 py-4 w-24">شماره</th>
                                <th className="px-6 py-4 w-32">تاریخ</th>
                                <th className="px-6 py-4">شرح سند</th>
                                <th className="px-6 py-4 w-40">مبلغ (ریال)</th>
                                <th className="px-6 py-4 w-32">وضعیت</th>
                                <th className="px-6 py-4 w-24 text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {paginatedEntries.map((entry) => (
                                <tr key={entry.id} className="group hover:bg-gray-50 dark:hover:bg-[#151923] transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-gray-700 dark:text-gray-300">{entry.docNumber}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono text-xs">{entry.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-md">{entry.description}</div>
                                        <div className="text-[10px] text-gray-400 mt-1 flex gap-2">
                                            <span>{entry.lines.length} آرتیکل</span>
                                            <span>•</span>
                                            <span>توسط: سیستم</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-semibold tracking-tight text-gray-800 dark:text-gray-200">{(entry.totalDebit ?? 0).toLocaleString('fa-IR')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 w-fit ${statusMap[entry.status].class}`}>
                                            {statusMap[entry.status].icon}
                                            {statusMap[entry.status].text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                       <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" title="مشاهده"><IconEye className="w-4 h-4"/></button>
                                            <button onClick={() => reverseJournalEntry(entry.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="سند معکوس"><IconCopy className="w-4 h-4"/></button>
                                            {entry.status !== 'ثبت شده' && <button onClick={() => deleteJournalEntry(entry.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors" title="حذف"><IconTrash className="w-4 h-4"/></button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="text-xs text-gray-500">صفحه {currentPage} از {totalPages}</div>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"><IconChevronRight className="w-4 h-4"/></button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"><IconChevronLeft className="w-4 h-4"/></button>
                    </div>
                </div>
            </div>
        </div>
    );
};
