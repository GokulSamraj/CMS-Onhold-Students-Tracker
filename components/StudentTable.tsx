
import React, { useState, useEffect } from 'react';
import type { Student } from '../types';
import { Status } from '../types';
import { AnalyzeIcon, TrashIcon, ExclamationCircleIcon, PencilSquareIcon, BellIcon, BellSlashIcon } from './icons';

interface StudentTableProps {
    students: Student[];
    onAnalyze: (student: Student) => void;
    onDelete?: (id: string) => void;
    onEdit: (student: Student) => void;
    onToggleReminder?: (student: Student) => void;
}

const getStatusBadgeClass = (status?: Status): string => {
    switch (status) {
        case Status.ON_HOLD:
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200';
        case Status.ADDED:
            return 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200';
        case Status.PENDING:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
        case Status.REFUNDED:
            return 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200';
        case Status.DISCONTINUED:
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200';
        default:
            return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    }
}


const StudentTable: React.FC<StudentTableProps> = ({ students, onAnalyze, onDelete, onEdit, onToggleReminder }) => {
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (studentToDelete) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [studentToDelete]);

    const tableHeaders = [
        'Initiated Date', 'Student Name', 'Phone Number', 'Registered Mail ID', 'Category', 'Held School / Section',
        'Changed to School / Section', 'Reminder Date', 'Initiated By', 'Team', 'Reason to hold',
        'Follow Up Comments', 'Status', 'Auto-Reminders', 'Actions'
    ];

    if (students.length === 0) {
        return (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                     <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">No Students Found</h3>
                <p className="mt-1 text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    No records match your criteria. Add a new student or adjust your filters.
                </p>
            </div>
        )
    }

    const handleDeleteClick = (student: Student) => {
        setStudentToDelete(student);
    };

    const confirmDelete = () => {
        if (studentToDelete && onDelete) {
            onDelete(studentToDelete.id);
            setStudentToDelete(null);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400 relative">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700 sticky top-0 z-10 shadow-sm">
                            <tr>
                                {tableHeaders.map(header => (
                                    <th key={header} scope="col" className="px-6 py-4 font-bold whitespace-nowrap bg-slate-50 dark:bg-slate-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {students.map((student) => {
                                const isRemindersOn = !student.stopReminders;
                                return (
                                    <tr key={student.id} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{student.initiatedDate}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">{student.studentName}</td>
                                        
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {student.phoneNumber || '-'}
                                        </td>

                                        <td className="px-6 py-4">
                                            {student.registeredMailId}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="inline-block max-w-[150px] truncate" title={student.category}>{student.category}</span>
                                        </td>
                                        <td className="px-6 py-4">{student.heldSchoolSection}</td>
                                        <td className="px-6 py-4">{student.changedToSchoolSection || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{student.reminderDate}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-300 uppercase">
                                                    {student.initiatedBy.substring(0, 2)}
                                                </div>
                                                <span className="whitespace-nowrap">{student.initiatedBy}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs">{student.team || '-'}</td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={student.reasonToHold}>{student.reasonToHold}</td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={student.followUpComments}>{student.followUpComments || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusBadgeClass(student.status)}`}>
                                                {student.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {onToggleReminder && (
                                                <button
                                                    onClick={() => onToggleReminder(student)}
                                                    className={`p-1.5 rounded-full transition-colors ${
                                                        isRemindersOn 
                                                            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 hover:bg-indigo-200' 
                                                            : 'bg-slate-100 text-slate-400 dark:bg-slate-700/50 dark:text-slate-500 hover:bg-slate-200'
                                                    }`}
                                                    title={isRemindersOn ? "Auto-reminders Active (Click to stop)" : "Auto-reminders Stopped (Click to activate)"}
                                                >
                                                    {isRemindersOn ? <BellIcon className="w-4 h-4" /> : <BellSlashIcon className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <button 
                                                    onClick={() => onEdit(student)}
                                                    className="group flex items-center font-medium transition-colors text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    title="Edit Student"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => onAnalyze(student)}
                                                    className="group flex items-center font-medium transition-colors text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                                                    title="AI Analysis"
                                                >
                                                    <AnalyzeIcon className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                                                    Analyze
                                                </button>
                                                {onDelete && (
                                                    <button 
                                                        onClick={() => handleDeleteClick(student)}
                                                        className="group flex items-center font-medium transition-colors text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                        title="Delete Student"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {studentToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div 
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
                            <ExclamationCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        
                        <h3 id="modal-title" className="text-lg font-bold text-center text-slate-900 dark:text-white mb-2">
                            Delete Student Record?
                        </h3>
                        
                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">{studentToDelete.studentName}</span>? 
                            This action cannot be undone.
                        </p>
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setStudentToDelete(null)}
                                className="flex-1 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentTable;
