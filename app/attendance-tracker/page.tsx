"use client"
import React, { useState } from 'react';
import { GraduationCap, Plus, Edit2, Trash2, AlertTriangle, CheckCircle2, XCircle, Target, BookOpen, Sparkles, Brain, TrendingUp, MessageSquare, Loader2, Zap } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  attended: number;
  total: number;
  color: string;
}

interface FormData {
  name: string;
  attended: string;
  total: string;
}

interface AIInsight {
  type: 'success' | 'warning' | 'danger' | 'info';
  message: string;
}

export default function AIAttendanceTracker() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Computer Networks', attended: 28, total: 35, color: 'from-blue-500 to-cyan-500' },
    { id: 2, name: 'Operating Systems', attended: 22, total: 30, color: 'from-purple-500 to-pink-500' },
    { id: 3, name: 'SQL Database', attended: 31, total: 38, color: 'from-emerald-500 to-green-500' },
    { id: 4, name: 'OOPs (Java)', attended: 26, total: 32, color: 'from-orange-500 to-red-500' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', attended: '', total: '' });
  const [minAttendance, setMinAttendance] = useState(75);
  
  // AI States
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  const calculatePercentage = (attended: number, total: number): number => {
    return total > 0 ? (attended / total) * 100 : 0;
  };

  const getOverallAttendance = (): number => {
    const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
    const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
    return calculatePercentage(totalAttended, totalClasses);
  };

  const getStatusColor = (percentage: number): string => {
    if (percentage >= minAttendance) return 'from-emerald-500 to-green-500';
    if (percentage >= minAttendance - 5) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getStatusIcon = (percentage: number): React.ReactElement => {
    if (percentage >= minAttendance) return <CheckCircle2 className="w-4 h-4" />;
    if (percentage >= minAttendance - 5) return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const getStatusText = (percentage: number): string => {
    if (percentage >= minAttendance) return 'Safe';
    if (percentage >= minAttendance - 5) return 'At Risk';
    return 'Critical';
  };

  const canSkip = (subject: Subject): number => {
    const percentage = calculatePercentage(subject.attended, subject.total);
    if (percentage < minAttendance) return 0;

    let skip = 0;
    let attended = subject.attended;
    let total = subject.total;

    while (calculatePercentage(attended, total + 1) >= minAttendance) {
      skip++;
      total++;
    }

    return skip;
  };

  const mustAttend = (subject: Subject): number => {
    const percentage = calculatePercentage(subject.attended, subject.total);
    if (percentage >= minAttendance) return 0;

    let attend = 0;
    let attended = subject.attended;
    let total = subject.total;

    while (calculatePercentage(attended, total) < minAttendance) {
      attend++;
      attended++;
      total++;
    }

    return attend;
  };

  // Groq API Integration via Next.js API Route - SUPER FAST & SECURE!
  const generateAIInsights = async () => {
    setIsGeneratingInsights(true);
    
    try {
      const attendanceData = subjects.map(s => ({
        name: s.name,
        percentage: calculatePercentage(s.attended, s.total).toFixed(1),
        attended: s.attended,
        total: s.total,
        canSkip: canSkip(s),
        mustAttend: mustAttend(s)
      }));

      const prompt = `You are an academic advisor AI. Analyze this student's attendance data and provide 3-4 concise, actionable insights. Be specific and helpful.

Minimum Required Attendance: ${minAttendance}%
Overall Attendance: ${getOverallAttendance().toFixed(1)}%

Subjects:
${attendanceData.map(s => `- ${s.name}: ${s.percentage}% (${s.attended}/${s.total} classes)`).join('\n')}

Format your response as a JSON array of insights, each with "type" (success/warning/danger/info) and "message" (one sentence).
Example: [{"type": "warning", "message": "Focus on Operating Systems - you need 5 more classes to reach 75%"}]

Respond ONLY with the JSON array, no other text.`;

      const response = await fetch("/api/attendance-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API Error');
      }
      
      const text = data.content.trim();
      const cleanText = text.replace(/```json|```/g, "").trim();
      const insights = JSON.parse(cleanText);
      setAiInsights(insights);
    } catch (error) {
      console.error('AI Insights error:', error);
      setAiInsights([{
        type: 'info',
        message: 'Unable to generate insights. Please try again later.'
      }]);
    }
    
    setIsGeneratingInsights(false);
  };

  const handleAIChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    const newMessages = [...chatMessages, { role: 'user' as const, content: userMessage }];
    setChatMessages(newMessages);

    try {
      const attendanceData = subjects.map(s => ({
        name: s.name,
        percentage: calculatePercentage(s.attended, s.total).toFixed(1),
        attended: s.attended,
        total: s.total
      }));

      const systemPrompt = `You are a helpful academic advisor assistant. Answer questions about this student's attendance.

Current Data:
- Minimum Required: ${minAttendance}%
- Overall Attendance: ${getOverallAttendance().toFixed(1)}%
- Subjects: ${JSON.stringify(attendanceData, null, 2)}

Provide helpful, concise responses (2-3 sentences max).`;

      const response = await fetch("/api/attendance-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API Error');
      }
      
      const aiResponse = data.content;
      setChatMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    }

    setIsChatLoading(false);
  };

  const handleAddSubject = () => {
    if (formData.name && formData.attended && formData.total) {
      const colors = [
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-emerald-500 to-green-500',
        'from-orange-500 to-red-500',
        'from-indigo-500 to-violet-500',
        'from-rose-500 to-pink-500'
      ];

      if (editingSubject) {
        setSubjects(subjects.map(s =>
          s.id === editingSubject.id
            ? { ...s, name: formData.name, attended: parseInt(formData.attended), total: parseInt(formData.total) }
            : s
        ));
        setEditingSubject(null);
      } else {
        const newSubject: Subject = {
          id: Date.now(),
          name: formData.name,
          attended: parseInt(formData.attended),
          total: parseInt(formData.total),
          color: colors[subjects.length % colors.length]
        };
        setSubjects([...subjects, newSubject]);
      }

      setFormData({ name: '', attended: '', total: '' });
      setShowAddModal(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      attended: subject.attended.toString(),
      total: subject.total.toString()
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleAttendanceChange = (id: number, attended: number, total: number) => {
    setSubjects(subjects.map(s =>
      s.id === id ? { ...s, attended, total } : s
    ));
  };

  const overallPercentage = getOverallAttendance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto relative pt-24">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/50">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Attendance Tracker
              </h1>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Powered by Groq AI (Secure)</span>
              </div>
            </div>
          </div> 
          <div className="flex gap-2">
            <button
              onClick={() => setShowAIChat(!showAIChat)}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
                AI Chat
              </div>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
                Add
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* AI Insights Section */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI Insights</h2>
                  <p className="text-white/60 text-sm flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Lightning-fast recommendations
                  </p>
                </div>
              </div>
              <button
                onClick={generateAIInsights}
                disabled={isGeneratingInsights}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGeneratingInsights ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Insights
                  </>
                )}
              </button>
            </div>

            {aiInsights.length > 0 && (
              <div className="space-y-2">
                {aiInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      insight.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' :
                      insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                      insight.type === 'danger' ? 'bg-red-500/10 border-red-500/20' :
                      'bg-blue-500/10 border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {insight.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
                      {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />}
                      {insight.type === 'danger' && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
                      {insight.type === 'info' && <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />}
                      <p className="text-sm text-white/90">{insight.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {aiInsights.length === 0 && !isGeneratingInsights && (
              <div className="text-center py-8 text-white/40">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Click "Generate Insights" to get AI-powered recommendations</p>
              </div>
            )}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-sm font-medium">Overall Attendance</span>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-3">
                <div className={`text-4xl font-bold bg-gradient-to-r ${getStatusColor(overallPercentage)} bg-clip-text text-transparent`}>
                  {overallPercentage.toFixed(1)}%
                </div>
                <p className="text-white/40 text-xs">
                  Total Classes: {subjects.reduce((sum, s) => sum + s.total, 0)}
                </p>
                <div className={`flex items-center gap-2 text-sm ${overallPercentage >= minAttendance ? 'text-emerald-400' : 'text-red-400'}`}>
                  {getStatusIcon(overallPercentage)}
                  {getStatusText(overallPercentage)}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-sm font-medium">Total Subjects</span>
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {subjects.length}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-sm font-medium">Min. Required</span>
                <Target className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent flex items-baseline">
                {minAttendance}%
                <input
                  type="number"
                  value={minAttendance}
                  onChange={(e) => setMinAttendance(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-12 bg-transparent border-b border-white/20 text-xs outline-none ml-1"
                />
              </div>
            </div>
          </div>

          {/* Subjects List */}
          <div className="space-y-4">
            {subjects.map((subject) => {
              const percentage = calculatePercentage(subject.attended, subject.total);
              const skip = canSkip(subject);
              const attend = mustAttend(subject);

              return (
                <div key={subject.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{subject.name}</h3>
                      <p className="text-white/60 text-sm">{subject.attended} / {subject.total} classes</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getStatusColor(percentage)} bg-opacity-20 border border-white/10`}>
                        {getStatusIcon(percentage)}
                        <span className="text-xs font-medium">{getStatusText(percentage)}</span>
                      </div>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${getStatusColor(percentage)} bg-clip-text text-transparent`}>
                        {percentage.toFixed(1)}%
                      </div>
                      <button
                        onClick={() => handleEdit(subject)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${subject.color} transition-all duration-500`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => handleAttendanceChange(subject.id, subject.attended + 1, subject.total + 1)}
                      className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-xs font-medium transition-colors"
                    >
                      + Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(subject.id, subject.attended, subject.total + 1)}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-medium transition-colors"
                    >
                      + Absent
                    </button>
                    <button
                      disabled={subject.total === 0}
                      onClick={() => handleAttendanceChange(subject.id, Math.max(0, subject.attended - 1), subject.total - 1)}
                      className="px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      Undo
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-3 border border-white/10">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-white/80">
                        {percentage >= minAttendance ? (
                          <span>✓ You can skip {skip} more {skip === 1 ? 'class' : 'classes'} and stay above {minAttendance}%</span>
                        ) : (
                          <span>⚠ Attend next {attend} {attend === 1 ? 'class' : 'classes'} to reach {minAttendance}%</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {subjects.length === 0 && (
            <div className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <h3 className="text-xl font-semibold mb-2 text-white/60">No subjects added yet</h3>
              <p className="text-white/40 mb-6">Start tracking your attendance by adding your first subject</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="group relative inline-flex"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Your First Subject
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Chat Panel */}
      {showAIChat && (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-slate-900 rounded-2xl border border-white/10 shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1">
                  AI Assistant
                  <Zap className="w-3 h-3 text-yellow-400" />
                </h3>
                <p className="text-white/60 text-xs">Lightning-fast responses</p>
              </div>
            </div>
            <button
              onClick={() => setShowAIChat(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="text-center text-white/40 text-sm mt-8">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Ask me about your attendance!</p>
                <div className="space-y-1 mt-3 text-xs">
                  <p className="text-white/30">Try asking:</p>
                  <p>"Which subject should I prioritize?"</p>
                  <p>"Can I skip class tomorrow?"</p>
                  <p>"Am I safe in all subjects?"</p>
                </div>
              </div>
            )}
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-white/5 border border-white/10'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs text-white/60">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                placeholder="Ask about your attendance..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-purple-500 transition-colors text-sm"
              />
              <button
                onClick={handleAIChat}
                disabled={isChatLoading || !chatInput.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSubject(null);
                  setFormData({ name: '', attended: '', total: '' });
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Subject Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Computer Networks"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Classes Attended</label>
                <input
                  type="number"
                  value={formData.attended}
                  onChange={(e) => setFormData({...formData, attended: e.target.value})}
                  placeholder="28"
                  min="0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Total Classes</label>
                <input
                  type="number"
                  value={formData.total}
                  onChange={(e) => setFormData({...formData, total: e.target.value})}
                  placeholder="35"
                  min="0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {formData.attended && formData.total && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="text-sm text-white/60 mb-1">Current Percentage</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {calculatePercentage(parseInt(formData.attended), parseInt(formData.total)).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSubject(null);
                  setFormData({ name: '', attended: '', total: '' });
                }}
                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium hover:scale-105 transition-transform"
              >
                {editingSubject ? 'Update' : 'Add Subject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}