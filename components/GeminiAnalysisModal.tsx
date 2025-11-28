
import React, { useEffect, useRef, useState } from 'react';
import type { Student } from '../types';
import { analyzeStudentData } from '../services/geminiService';
import { CloseIcon, LoaderIcon } from './icons';

/**
 * GeminiAnalysisModal
 * - Defensive async handling (abort & mounted checks)
 * - Safe HTML rendering (attempts dynamic DOMPurify import; falls back to plain-text)
 * - Accessibility: role="dialog", aria-modal, focus management, Escape handling, backdrop click
 * - Prevents body scroll while open
 * - Error state + simple retry
 */

interface GeminiAnalysisModalProps {
  student: Student | null;
  onClose: () => void;
}

const GeminiAnalysisModal: React.FC<GeminiAnalysisModalProps> = ({ student, onClose }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const mountedRef = useRef(true);
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });
  const purifierRef = useRef<any | null>(null);

  // keep mountedRef accurate
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // lock body scroll when open
  useEffect(() => {
    if (!student) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [student]);

  // keyboard: Escape
  useEffect(() => {
    if (!student) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [student, onClose]);

  // focus management: move focus to close button when modal opens
  useEffect(() => {
    if (student) {
      // small timeout to allow render
      setTimeout(() => closeBtnRef.current?.focus(), 10);
    }
  }, [student]);

  // dynamic import of DOMPurify (best-effort). If unavailable, fallback to plain text sanitizer.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('dompurify').catch(() => null);
        if (!cancelled && mod) purifierRef.current = (mod as any).default || mod;
      } catch {
        purifierRef.current = null;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // main analysis fetch with abort + error handling
  useEffect(() => {
    if (!student) {
      setAnalysis('');
      setError(null);
      setIsLoading(false);
      return;
    }

    abortRef.current.aborted = false;
    setIsLoading(true);
    setError(null);
    setAnalysis('');

    const currentStudent = student;
    let didSet = false;

    (async () => {
      try {
        /**
         * If your analyzeStudentData supports AbortSignal, pass one.
         * e.g., const controller = new AbortController(); analyzeStudentData(student, { signal: controller.signal })
         * Here we do a safe-guard pattern: ignore results if aborted or student changed.
         */
        const result = await analyzeStudentData(currentStudent);
        if (!mountedRef.current || abortRef.current.aborted) return;
        // ensure the response belongs to the currently open student (guard against race)
        if (currentStudent !== student) return;
        setAnalysis(typeof result === 'string' ? result : String(result));
        didSet = true;
      } catch (err: any) {
        if (!mountedRef.current || abortRef.current.aborted) return;
        setError(err?.message ?? 'Failed to fetch analysis.');
      } finally {
        if (mountedRef.current && !abortRef.current.aborted) setIsLoading(false);
      }
    })();

    return () => {
      // mark aborted so any in-flight promise knows to ignore its result
      abortRef.current.aborted = true;
      if (!didSet) setIsLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student]);

  if (!student) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) onClose();
  };

  const renderSanitized = (html: string) => {
    const purifier = purifierRef.current;
    if (purifier && typeof purifier.sanitize === 'function') {
      // DOMPurify present
      return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: purifier.sanitize(html) }} />;
    }
    // fallback: render as preformatted text (escape HTML)
    return <pre className="whitespace-pre-wrap break-words text-sm">{html}</pre>;
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-200"
      aria-hidden={false}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`AI Analysis for ${student.studentName}`}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all duration-300 scale-100"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Analysis — {student.studentName}</h3>
          <div className="flex items-center space-x-2">
            <button
              ref={closeBtnRef}
              onClick={onClose}
              aria-label="Close analysis modal"
              className="p-2 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-slate-500 dark:text-slate-400">
              <LoaderIcon className="w-12 h-12 animate-spin" />
              <p className="text-lg">Analyzing student data — this may take a few moments.</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <p className="text-red-600 dark:text-red-400 font-medium">Error: {error}</p>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <p>If this keeps failing, check your network or the AI service health.</p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    // simple retry: re-trigger effect by toggling student reference
                    setIsLoading(true);
                    setError(null);
                    setAnalysis('');
                    // small microtask to let state settle before effect retriggers
                    setTimeout(() => {
                      // no-op; effect depends on `student` which hasn't changed; so manually call analyze
                      abortRef.current.aborted = false;
                      (async () => {
                        try {
                          const result = await analyzeStudentData(student);
                          if (!mountedRef.current || abortRef.current.aborted) return;
                          setAnalysis(typeof result === 'string' ? result : String(result));
                        } catch (err: any) {
                          if (!mountedRef.current) return;
                          setError(err?.message ?? 'Retry failed.');
                        } finally {
                          if (mountedRef.current) setIsLoading(false);
                        }
                      })();
                    }, 50);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : analysis ? (
            renderSanitized(analysis)
          ) : (
            <div className="text-slate-600 dark:text-slate-400">
              <p>No analysis available.</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScaleModal {
          0% { opacity: 0; transform: scale(.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal { animation: fadeInScaleModal 180ms ease-out forwards; }
      `}</style>
    </div>
  );
};

export default GeminiAnalysisModal;
