
import React, { useState } from 'react';
import type { RecurringEntry, AccountNode, ToastData } from '../../../types';
import { IconDeviceFloppy, IconPlusCircle, IconEdit, IconTrash, IconClock, IconCheckCircle, IconCalendar, IconBolt } from '../../Icons';
import { Modal } from '../../common/Modal';
import { v4 as uuidv4 } from 'uuid';

const RecurringEntryForm: React.FC<{
    onSave: (entry: RecurringEntry) => void,
    onCancel: () => void,
    initialData?: RecurringEntry,
    accounts: AccountNode[],
}> = ({ onSave, onCancel, initialData, accounts }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        frequency: initialData?.frequency || 'ماهانه',
        startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
        nextDueDate: initialData?.nextDueDate || new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialData?.id || uuidv4(),
            ...formData,
            status: 'فعال',
            lines: initialData?.lines || [] 
        } as RecurringEntry);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label-form">عنوان الگو</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field w-full" required/></div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="label-form">دوره تناوب</label><select value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value as any})} className="input-field w-full"><option value="ماهانه">ماهانه</option><option value="سالانه">سالانه</option><option value="هفتگی">هفتگی</option></select></div>
                <div><label className="label-form">تاریخ شروع</label><input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="input-field w-full"/></div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-300 flex items-start gap-3 border border-blue-100 dark:border-blue-800">
                <IconClock className="w-5 h-5 flex-shrink-0 mt-0.5"/>
                <p>پس از ذخیره، می‌توانید آرتیکل‌های سند را در بخش ویرایش مدیریت کنید. سیستم به صورت خودکار در سررسید به شما یادآوری خواهد کرد.</p>
            </div>
             <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                <button type="button" onClick={onCancel} className="btn-secondary">لغو</button>
                <button type="submit" className="btn-primary">ذخیره و ادامه</button>
            </div>
        </form>
    );
};

interface RecurringEntriesPageProps {
    recurringEntries: RecurringEntry[];
    onRunEntries: () => void;
    setRecurringEntries: React.Dispatch<React.SetStateAction<RecurringEntry[]>>;
    accounts: AccountNode[];
    showToast: (message: string, type?: ToastData['type']) => void;
}

export const RecurringEntriesPage: React.FC<RecurringEntriesPageProps> = ({ recurringEntries, onRunEntries, setRecurringEntries, accounts, showToast }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<RecurringEntry | null>(null);

    const handleSave = (entry: RecurringEntry) => {
        if(editingEntry) {
            setRecurringEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
            showToast('الگوی دوره‌ای با موفقیت به‌روزرسانی شد.');
        } else {
            setRecurringEntries(prev => [{...entry, id: uuidv4()}, ...prev]);
            showToast('الگوی جدید ایجاد شد.');
        }
        setModalOpen(false);
        setEditingEntry(null);
    }

    const pendingRuns = recurringEntries.filter(r => r.status === 'فعال' && new Date(r.nextDueDate) <= new Date()).length;
    
    return (
        <div className="space-y-6 p-2">
            <style>{`.label-form{display:block;font-size:.875rem;font-weight:500;color:#374151;margin-bottom:.25rem}.dark .label-form{color:#D1D5DB}.input-field{padding:.5rem .75rem;border-radius:.5rem;background-color:#F9FAFB;border:1px solid #E5E7EB;width:100%}.dark .input-field{background-color:#374151;border-color:#4B5563}.btn-primary{padding:.5rem 1rem;background-color:hsl(262 83% 58%);color:#fff;border-radius:.5rem;font-weight:500;transition:all .2s}.btn-primary:hover{background-color:hsl(262 75% 52%)}.btn-secondary{padding:.5rem 1rem;background-color:#E5E7EB;color:#1F2937;border-radius:.5rem;font-weight:500}.dark .btn-secondary{background-color:#4B5563;color:#F9FAFB}`}</style>
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">اتوماسیون اسناد (Recurring)</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">مدیریت اسناد تکرارشونده و زمان‌بندی شده.</p>
                </div>
                 <button onClick={() => { setEditingEntry(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-600 transition-all active:scale-95">
                    <IconPlusCircle className="w-5 h-5" />
                    <span className="font-bold">الگوی جدید</span>
                </button>
            </div>

            {/* Automation Dashboard Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black mb-2 tracking-tight">وضعیت پردازش خودکار</h2>
                        <p className="text-indigo-100 font-medium flex items-center gap-2">
                            <IconBolt className="w-5 h-5 animate-pulse"/>
                            {pendingRuns > 0 
                                ? `${pendingRuns} سند در صف اجرا قرار دارد.` 
                                : 'سیستم به‌روز است. هیچ سند معوقی وجود ندارد.'}
                        </p>
                    </div>
                    {pendingRuns > 0 && (
                        <button 
                            onClick={onRunEntries}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl shadow-lg hover:bg-gray-50 transition-all transform hover:-translate-y-1 font-bold"
                        >
                            <IconDeviceFloppy className="w-5 h-5" />
                            <span>اجرای گروهی ({pendingRuns})</span>
                        </button>
                    )}
                </div>
                {/* Decorative Background Circles */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/30 rounded-full blur-2xl"></div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-8 mb-4">الگوهای فعال</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {recurringEntries.map(entry => (
                    <div key={entry.id} className="bg-white dark:bg-[#1E2130] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col group hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-500 group-hover:bg-primary-50 group-hover:text-primary transition-colors">
                                <IconClock className="w-6 h-6"/>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${entry.status === 'فعال' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                                {entry.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">{entry.name}</h3>
                        <p className="text-sm text-gray-500 mb-6">تناوب: {entry.frequency}</p>
                        
                        <div className="mt-auto space-y-2">
                            <div className="flex justify-between text-sm p-2 rounded-lg bg-gray-50 dark:bg-[#151923]">
                                <span className="text-gray-500">آخرین اجرا:</span>
                                <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">{entry.lastRunDate || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm p-2 rounded-lg bg-gray-50 dark:bg-[#151923]">
                                <span className="text-gray-500">سررسید بعدی:</span>
                                <span className={`font-mono font-bold ${new Date(entry.nextDueDate) <= new Date() ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {entry.nextDueDate}
                                </span>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => { setEditingEntry(entry); setModalOpen(true); }} className="flex-1 py-2.5 text-sm font-bold text-primary bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">ویرایش</button>
                                <button className="py-2.5 px-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><IconTrash className="w-5 h-5"/></button>
                            </div>
                        </div>
                    </div>
                 ))}
            </div>
            
             <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingEntry ? "ویرایش الگوی دوره‌ای" : "ایجاد الگوی دوره‌ای جدید"}>
                <RecurringEntryForm onSave={handleSave} onCancel={() => setModalOpen(false)} initialData={editingEntry!} accounts={accounts} />
            </Modal>
        </div>
    );
};
