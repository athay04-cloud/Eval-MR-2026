/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SurveyForm } from './components/SurveyForm';
import { PinLoginModal } from './components/PinLoginModal';
import { EvaluatorQueue } from './components/EvaluatorQueue';
import { EvaluatorWorkspace } from './components/EvaluatorWorkspace';
import { PrintReportModal } from './components/PrintReportModal';
import { SecurityShield } from './components/SecurityShield';
import { Respondent } from './types';
import {
  INITIAL_MOCK_RESPONDENTS,
  STORAGE_KEY_RESPONDENTS,
  STORAGE_KEY_AUTH,
} from './data/mockData';

export default function App() {
  // Portal state: 'public' | 'evaluator'
  const [currentPortal, setCurrentPortal] = useState<'public' | 'evaluator'>('public');

  // Evaluator authentication state
  const [isEvaluatorLoggedIn, setIsEvaluatorLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  // PIN Modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Evaluator sub-view: queue list or active workspace
  const [selectedRespondent, setSelectedRespondent] = useState<Respondent | null>(null);

  // Print Report modal state
  const [printTargetRespondent, setPrintTargetRespondent] = useState<Respondent | null>(null);

  // Respondents list loaded from LocalStorage
  const [respondents, setRespondents] = useState<Respondent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RESPONDENTS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed; // Can be empty array []
        }
      }
    } catch {
      // Fallback
    }
    // Seed initial mock data only on first visit if never set
    localStorage.setItem(STORAGE_KEY_RESPONDENTS, JSON.stringify(INITIAL_MOCK_RESPONDENTS));
    return INITIAL_MOCK_RESPONDENTS;
  });

  // Sync respondents to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RESPONDENTS, JSON.stringify(respondents));
    } catch (e) {
      console.error('Failed to save respondents to LocalStorage', e);
    }
  }, [respondents]);

  // Handle Login Success
  const handleLoginSuccess = () => {
    setIsEvaluatorLoggedIn(true);
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    setIsLoginModalOpen(false);
    setCurrentPortal('evaluator');
  };

  // Handle Logout
  const handleLogout = () => {
    setIsEvaluatorLoggedIn(false);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    setSelectedRespondent(null);
    setCurrentPortal('public');
  };

  // Switch portal handler
  const handleSwitchPortal = (portal: 'public' | 'evaluator') => {
    if (portal === 'evaluator' && !isEvaluatorLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setCurrentPortal(portal);
  };

  // Handle new survey submission from Public Form
  const handleSubmitNewRespondent = (newRespondent: Respondent) => {
    setRespondents((prev) => [newRespondent, ...prev]);
  };

  // Handle saving evaluation from Workspace
  const handleSaveEvaluation = (updatedRespondent: Respondent) => {
    setRespondents((prev) =>
      prev.map((item) => (item.id === updatedRespondent.id ? updatedRespondent : item))
    );
    setSelectedRespondent(updatedRespondent);
  };

  // Delete single respondent
  const handleDeleteRespondent = (id: string) => {
    setRespondents((prev) => prev.filter((item) => item.id !== id));
    if (selectedRespondent?.id === id) {
      setSelectedRespondent(null);
    }
  };

  // Clear all respondents from database
  const handleClearAllRespondents = () => {
    setRespondents([]);
    localStorage.setItem(STORAGE_KEY_RESPONDENTS, JSON.stringify([]));
    setSelectedRespondent(null);
  };

  // Reset to initial mock dataset
  const handleResetToMock = () => {
    setRespondents(INITIAL_MOCK_RESPONDENTS);
    localStorage.setItem(STORAGE_KEY_RESPONDENTS, JSON.stringify(INITIAL_MOCK_RESPONDENTS));
    setSelectedRespondent(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Header
        currentPortal={currentPortal}
        isEvaluatorLoggedIn={isEvaluatorLoggedIn}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onSwitchPortal={handleSwitchPortal}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {currentPortal === 'public' ? (
          /* PORTAL 1: FORMULIR SURVEI RESPONDEN (Halaman Publik) */
          <SurveyForm onSubmitSuccess={handleSubmitNewRespondent} />
        ) : (
          /* PORTAL 2: PORTAL EVALUATOR (Halaman Terproteksi) */
          <div>
            {selectedRespondent ? (
              <EvaluatorWorkspace
                respondent={selectedRespondent}
                onBack={() => setSelectedRespondent(null)}
                onSaveEvaluation={handleSaveEvaluation}
                onPrintReport={(resp) => setPrintTargetRespondent(resp)}
              />
            ) : (
              <EvaluatorQueue
                respondents={respondents}
                onSelectRespondent={(resp) => setSelectedRespondent(resp)}
                onPrintRespondent={(resp) => setPrintTargetRespondent(resp)}
                onDeleteRespondent={handleDeleteRespondent}
                onClearAllRespondents={handleClearAllRespondents}
                onResetToMock={handleResetToMock}
                onGoToPublicForm={() => setCurrentPortal('public')}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Sistem Survei & Evaluasi Manajemen Risiko (SMR)</span>
            <span>·</span>
            <span>Kementerian Hukum RI</span>
          </div>
        </div>
      </footer>

      {/* Evaluator PIN Authentication Modal */}
      <PinLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Print & PDF Export Modal */}
      <PrintReportModal
        isOpen={Boolean(printTargetRespondent)}
        onClose={() => setPrintTargetRespondent(null)}
        respondent={printTargetRespondent}
      />

      {/* Anti-Copas and Anti-SS Security Guard */}
      <SecurityShield isPrintModalOpen={Boolean(printTargetRespondent)} />
    </div>
  );
}
