import React, { useState, useEffect } from 'react';
import {
  getAllQuestionsForAdmin,
  submitProductAnswer,
  moderateQuestionDB
} from '../services/engagementService';
import {
  HelpCircle,
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  Filter,
  Car,
  Award,
  EyeOff,
  Check
} from 'lucide-react';

export default function AdminProductQuestionsConsole() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isOfficial, setIsOfficial] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, [statusFilter]);

  const loadQuestions = async () => {
    setLoading(true);
    const data = await getAllQuestionsForAdmin(statusFilter);
    setQuestions(data);
    setLoading(false);
  };

  const handleOpenAnswerModal = (q) => {
    setSelectedQuestion(q);
    setAnswerText(q.answer || '');
    setIsOfficial(true);
    setFeedback(null);
  };

  const handleSaveAnswer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const res = await submitProductAnswer({
      questionId: selectedQuestion.id,
      answerText,
      isOfficial
    });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        setSelectedQuestion(null);
        loadQuestions();
      }, 1200);
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
    setSubmitting(false);
  };

  const handleModerateQuestion = async (qId, status) => {
    const res = await moderateQuestionDB(qId, status);
    if (res.success) {
      loadQuestions();
    }
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Q&A Management</h1>
          <p className="text-muted-foreground text-sm">
            Answer customer compatibility, fitment, and technical part inquiries with official badges
          </p>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="flex justify-between items-center mb-6 bg-card border border-border p-4 rounded-2xl">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filter Status:</span>
        </div>

        <div className="flex space-x-2">
          {['all', 'pending', 'approved', 'answered', 'hidden'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider capitalize transition-all ${
                statusFilter === st
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-bold text-base mb-1">No Questions Found</h3>
          <p className="text-muted-foreground text-xs">No customer product inquiries match the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className={`bg-card border p-5 rounded-2xl shadow-sm ${
                q.status === 'pending' ? 'border-amber-300 bg-amber-50/20' : 'border-border'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-base text-foreground">{q.customer_name}</span>
                    {q.customer_email && (
                      <span className="text-xs text-muted-foreground">({q.customer_email})</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>Product: {q.product?.name || q.product_id}</span>
                    <span>•</span>
                    <span>Asked on {new Date(q.created_at).toLocaleDateString('en-IN')}</span>

                    {q.vehicle && (
                      <span className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded border border-blue-200 flex items-center space-x-1">
                        <Car className="w-3 h-3" />
                        <span>
                          {q.vehicle.make} {q.vehicle.model} {q.vehicle.variant}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      q.status === 'answered' || q.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : q.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {q.status.replace('_', ' ').toUpperCase()}
                  </span>

                  <button
                    onClick={() => handleOpenAnswerModal(q)}
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{q.answer ? 'Edit Answer' : 'Respond'}</span>
                  </button>

                  {q.status !== 'hidden' && (
                    <button
                      onClick={() => handleModerateQuestion(q.id, 'hidden')}
                      title="Hide Question"
                      className="p-1.5 border border-border rounded-xl text-muted-foreground hover:bg-muted"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-muted/40 p-3 rounded-xl mb-3 text-sm font-medium text-foreground">
                <span className="font-bold text-primary mr-2">Q:</span>
                "{q.question}"
              </div>

              {/* Answer Text if published */}
              {q.answer && (
                <div className="bg-emerald-50/60 border border-emerald-200/60 p-3 rounded-xl text-sm text-emerald-950">
                  <div className="flex items-center space-x-1 text-xs font-bold text-emerald-800 mb-1">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Official AutoZoneIndia Answer</span>
                  </div>
                  <p>{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Answer Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Respond to Customer Question</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Question from {selectedQuestion.customer_name}: "{selectedQuestion.question}"
            </p>

            {feedback && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium ${
                  feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSaveAnswer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                  Official Technical Answer
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide precise compatibility details, part numbers, or specifications..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs font-medium">
                <input
                  type="checkbox"
                  id="chkOfficial"
                  checked={isOfficial}
                  onChange={(e) => setIsOfficial(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="chkOfficial">Mark as "Official AutoZoneIndia Answer"</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedQuestion(null)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Answer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

