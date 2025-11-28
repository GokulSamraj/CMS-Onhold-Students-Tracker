
import React, { useMemo } from 'react';
import type { Student } from '../types';
import { initiators } from '../types';
import { CheckCircleIcon, UsersIcon } from './icons';

interface TeamTasksProps {
  students: Student[];
}

const TeamTasks: React.FC<TeamTasksProps> = ({ students }) => {
  // Group students by 'Initiated By' to determine the "Task List" for each user
  const tasksByUser = useMemo(() => {
    const data: Record<string, Student[]> = {};
    
    // Initialize for all known initiators so they appear even if they have 0 tasks
    initiators.forEach(initiator => {
        data[initiator.name] = [];
    });

    // Distribute students
    students.forEach(student => {
      const name = student.initiatedBy;
      if (data[name]) {
        data[name].push(student);
      } else {
        // Handle case where initiator isn't in the hardcoded list but is in the data
        if (name) {
            data[name] = data[name] || [];
            data[name].push(student);
        }
      }
    });

    return data;
  }, [students]);

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Team Task Log</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Breakdown of students tracked and managed by each team member.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(Object.entries(tasksByUser) as [string, Student[]][]).map(([userName, userStudents]) => (
          <div 
            key={userName} 
            className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md ${userStudents.length === 0 ? 'opacity-60 grayscale' : ''}`}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-300 uppercase">
                   {userName.substring(0, 2)}
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-tight line-clamp-1" title={userName}>
                    {userName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {initiators.find(i => i.name === userName)?.team || 'Unknown Team'}
                    </p>
                </div>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 text-xs font-bold px-2 py-1 rounded-md">
                {userStudents.length}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              {userStudents.length > 0 ? (
                <ul className="space-y-3">
                  {userStudents.map(student => (
                    <li key={student.id} className="group">
                      <div className="flex items-start space-x-2.5">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                            {student.studentName}
                          </p>
                          <div className="flex items-center space-x-2 mt-0.5">
                             <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 rounded">
                                {student.status}
                             </span>
                             <span className="text-[10px] text-slate-400 truncate">
                                {student.initiatedDate}
                             </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-6">
                   <UsersIcon className="w-8 h-8 opacity-20 mb-2" />
                   <p className="text-xs">No tasks recorded yet.</p>
                </div>
              )}
            </div>
            
            {userStudents.length > 0 && (
                 <div className="bg-slate-50 dark:bg-slate-700/30 p-2 text-center border-t border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        Last active: {[...userStudents].sort((a,b) => new Date(b.initiatedDate).getTime() - new Date(a.initiatedDate).getTime())[0].initiatedDate}
                    </span>
                 </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamTasks;
