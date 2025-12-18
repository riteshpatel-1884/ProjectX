"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BookOpen, CheckCircle2, Circle, Lightbulb, Star, Clock, TrendingUp } from 'lucide-react';
import { Question } from '@/lib/placementData';

interface TopicQuestionsProps {
  subjectKey: string;
  subjectName: string;
  topicName: string;
  topicId: string;
  subjectColor: string;
  questions: Question[];
}

export default function TopicQuestions({
  subjectKey,
  subjectName,
  topicName,
  topicId,
  subjectColor,
  questions
}: TopicQuestionsProps) {
  const router = useRouter();
  const [completedQuestions, setCompletedQuestions] = useState<Record<string, boolean>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem(`${topicId}_progress`);
    if (saved) setCompletedQuestions(JSON.parse(saved));
  }, [topicId]);

  const toggleQuestion = (questionId: string) => {
    const newCompleted: Record<string, boolean> = { 
      ...completedQuestions, 
      [questionId]: !completedQuestions[questionId] 
    };
    setCompletedQuestions(newCompleted);
    localStorage.setItem(`${topicId}_progress`, JSON.stringify(newCompleted));
  };

  const toggleExpand = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const toggleHint = (questionId: string) => {
    setShowHints({ ...showHints, [questionId]: !showHints[questionId] });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch(frequency) {
      case 'Very High': return 'text-red-400';
      case 'High': return 'text-orange-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const completedCount = Object.values(completedQuestions).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8 mt-24">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Topics</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className={`inline-block px-3 py-1 bg-gradient-to-r ${subjectColor} text-white text-xs font-semibold rounded-full mb-2`}>
                {subjectKey} - {subjectName}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{topicName}</h1>
              <p className="text-purple-200">Recently asked interview questions</p>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-400">{progressPercentage}%</div>
              <div className="text-sm text-purple-200">{completedCount}/{questions.length} completed</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-white/20 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 text-center">
            <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{questions.length}</div>
            <div className="text-xs text-purple-200">Total Questions</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {questions.filter(q => q.frequency === 'Very High' || q.frequency === 'High').length}
            </div>
            <div className="text-xs text-purple-200">High Frequency</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 text-center">
            <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">~{Math.ceil(questions.length * 5)}</div>
            <div className="text-xs text-purple-200">Minutes to Complete</div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
            >
              {/* Question Header */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleQuestion(q.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    {completedQuestions[q.id] ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-purple-300" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-white flex items-start gap-2">
                        <span className="text-purple-300">Q{index + 1}.</span>
                        {q.question}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2.5 py-1 ${getDifficultyColor(q.difficulty)} text-xs font-medium rounded-full border`}>
                        {q.difficulty}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Star className={`w-4 h-4 ${getFrequencyColor(q.frequency)} fill-current`} />
                        <span className="text-xs text-purple-200">{q.frequency} frequency</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="text-sm text-blue-300 hover:text-blue-200 font-medium transition-colors"
                    >
                      {expandedQuestion === q.id ? '▼ Hide Answer' : '▶ Show Answer'}
                    </button>
                  </div>
                </div>

                {/* Expanded Answer */}
                {expandedQuestion === q.id && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    {/* Answer */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Answer:
                      </h4>
                      <p className="text-sm text-purple-100 leading-relaxed whitespace-pre-line">
                        {q.answer}
                      </p>
                    </div>

                    {/* Key Points */}
                    <div className="mb-4">
                      <button
                        onClick={() => toggleHint(q.id)}
                        className="text-sm font-semibold text-yellow-300 mb-2 flex items-center gap-2 hover:text-yellow-200 transition-colors"
                      >
                        <Lightbulb className="w-4 h-4" />
                        {showHints[q.id] ? '▼ Hide Key Points' : '▶ Show Key Points'}
                      </button>
                      
                      {showHints[q.id] && (
                        <ul className="space-y-2 ml-6">
                          {q.keyPoints.map((point, idx) => (
                            <li key={idx} className="text-sm text-purple-100 flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Follow-up */}
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-xs font-semibold text-pink-300 mb-1">💡 Follow-up Question:</p>
                      <p className="text-sm text-purple-200 italic">{q.followUp}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-xl border border-white/20 p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            {progressPercentage === 100 ? '🎉 Great Job!' : '📚 Keep Going!'}
          </h3>
          <p className="text-purple-200 mb-4">
            {progressPercentage === 100 
              ? 'You\'ve completed all questions for this topic!' 
              : `${questions.length - completedCount} questions remaining`}
          </p>
          {progressPercentage === 100 && (
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              Back to Topics
            </button>
          )}
        </div>
      </div>
    </div>
  );
}