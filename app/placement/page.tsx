
"use client"

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronRight, Award, Target, TrendingUp, Book, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation'; // ✅ CHANGED: from 'next/router' to 'next/navigation'
import { SUBJECTS_DATA } from '@/lib/placementData'; // ✅ ADDED: Import data from central file

export default function PlacementTracker() {
  const router = useRouter(); // ✅ ADDED: Declare router
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [lastRevised, setLastRevised] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('placementProgress');
    const savedRevised = localStorage.getItem('lastRevised');
    if (saved) setCompletedTopics(JSON.parse(saved));
    if (savedRevised) setLastRevised(JSON.parse(savedRevised));
  }, []);

  const toggleTopic = (topicId: string) => {
    const newCompleted: Record<string, boolean> = { ...completedTopics, [topicId]: !completedTopics[topicId] };
    setCompletedTopics(newCompleted);
    localStorage.setItem('placementProgress', JSON.stringify(newCompleted));
    
    if (newCompleted[topicId]) {
      const newRevised: Record<string, string> = { ...lastRevised, [topicId]: new Date().toLocaleDateString() };
      setLastRevised(newRevised);
      localStorage.setItem('lastRevised', JSON.stringify(newRevised));
    }
  };

  const getSubjectProgress = (subjectKey: keyof typeof SUBJECTS_DATA) => {
    const topics = SUBJECTS_DATA[subjectKey].topics;
    const completed = topics.filter(t => completedTopics[t.id]).length;
    return { completed, total: topics.length, percentage: Math.round((completed / topics.length) * 100) };
  };

  const getStatus = (percentage: number) => {
    if (percentage === 0) return { text: 'Not Started', color: 'bg-gray-100 text-gray-600' };
    if (percentage === 100) return { text: 'Completed', color: 'bg-green-100 text-green-700' };
    return { text: 'In Progress', color: 'bg-blue-100 text-blue-700' };
  };

  const getOverallProgress = () => {
    const allTopics = Object.values(SUBJECTS_DATA).flatMap(s => s.topics);
    const completed = allTopics.filter(t => completedTopics[t.id]).length;
    return { completed, total: allTopics.length, percentage: Math.round((completed / allTopics.length) * 100) };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const overall = getOverallProgress();

  const filteredTopics = selectedSubject 
    ? SUBJECTS_DATA[selectedSubject as keyof typeof SUBJECTS_DATA].topics.filter(t => 
        filterDifficulty === 'All' || t.difficulty === filterDifficulty
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8 pt-24 ">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-white">Track my Placement</h1>
              <p className="text-purple-200 mt-1">Track my readiness for core interview subjects</p>
            </div>
            <span className="ml-auto px-3 py-1 bg-purple-500/30 text-purple-100 text-sm font-medium rounded-full backdrop-blur-sm border border-purple-400/30">
              Core Subjects Only
            </span>
          </div>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Overall Readiness</h2>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-400">{overall.percentage}%</div>
              <div className="text-sm text-purple-200">{overall.completed} of {overall.total} topics</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overall.percentage}%` }}
            />
          </div>
        </div>

        {/* Subject Cards or Detail View */}
        {!selectedSubject ? (
          <div className="grid md:grid-cols-2 gap-6">
            {(Object.entries(SUBJECTS_DATA) as [keyof typeof SUBJECTS_DATA, typeof SUBJECTS_DATA[keyof typeof SUBJECTS_DATA]][]).map(([key, subject]) => {
              const progress = getSubjectProgress(key);
              const status = getStatus(progress.percentage);
              
              return (
                <div 
                  key={key}
                  className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 hover:bg-white/15 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className={`inline-block px-3 py-1 bg-gradient-to-r ${subject.color} text-white text-xs font-semibold rounded-full mb-2`}>
                        {key}
                      </div>
                      <h3 className="text-xl font-semibold text-white">{subject.name}</h3>
                    </div>
                    <span className={`px-3 py-1 ${status.color} text-xs font-medium rounded-full`}>
                      {status.text}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-purple-200 mb-2">
                      <span>Progress</span>
                      <span className="font-semibold">{progress.completed}/{progress.total} topics</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5">
                      <div 
                        className={`bg-gradient-to-r ${subject.color} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-2xl font-bold text-white">{progress.percentage}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSubject(key)}
                    className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all font-medium border border-white/30"
                  >
                    <Book className="w-4 h-4" />
                    View Topics
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* Detail View */
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rotate-180 text-white" />
                </button>
                <div>
                  <div className={`inline-block px-3 py-1 bg-gradient-to-r ${SUBJECTS_DATA[selectedSubject as keyof typeof SUBJECTS_DATA].color} text-white text-xs font-semibold rounded-full mb-1`}>
                    {selectedSubject}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{SUBJECTS_DATA[selectedSubject as keyof typeof SUBJECTS_DATA].name}</h2>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-200" />
                <select 
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-3 py-1.5 bg-white/20 border border-white/30 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm"
                >
                  <option className="text-gray-900">All</option>
                  <option className="text-gray-900">Easy</option>
                  <option className="text-gray-900">Medium</option>
                  <option className="text-gray-900">Hard</option>
                </select>
              </div>
            </div>

           <div className="space-y-3">
  {filteredTopics.map((topic) => (
    <div
      key={topic.id}
      className="flex items-center gap-4 p-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/15 transition-colors backdrop-blur-sm"
    >
      <button
        onClick={() => toggleTopic(topic.id)}
        className="flex-shrink-0"
      >
        {completedTopics[topic.id] ? (
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        ) : (
          <Circle className="w-6 h-6 text-purple-300" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`text-base font-medium ${
              completedTopics[topic.id]
                ? 'text-purple-300 line-through'
                : 'text-white'
            }`}
          >
            {topic.name}
          </span>

          {topic.questions.length > 0 && (
            <span className="text-xs px-2 py-0.5 bg-blue-500/30 text-blue-200 rounded-full">
              {topic.questions.length} questions
            </span>
          )}
        </div>

        {completedTopics[topic.id] && lastRevised[topic.id] && (
          <p className="text-xs text-purple-200 mt-1">
            Last revised: {lastRevised[topic.id]}
          </p>
        )}
      </div>

      <span
        className={`px-2.5 py-1 ${getDifficultyColor(
          topic.difficulty
        )} text-xs font-medium rounded-full`}
      >
        {topic.difficulty}
      </span>

      
      {topic.questions.length > 0 ? (
        <button
          onClick={() =>
            router.push(`/placement/${selectedSubject}/${topic.slug}`)
          }
          className="flex cursor-pointer items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
        >
          Practice
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <span className="text-xs text-purple-300 italic">Coming soon</span>
      )}
    </div>
  ))}
</div>


            {filteredTopics.length === 0 && (
              <div className="text-center py-12 text-purple-200">
                No topics found for selected difficulty
              </div>
            )}
          </div>
        )}

        {/* Quick Stats Footer */}
        {!selectedSubject && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.entries(SUBJECTS_DATA) as [keyof typeof SUBJECTS_DATA, typeof SUBJECTS_DATA[keyof typeof SUBJECTS_DATA]][]).map(([key, subject]) => {
              const progress = getSubjectProgress(key);
              return (
                <div key={key} className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-4 text-center">
                  <div className={`inline-block px-3 py-1 bg-gradient-to-r ${subject.color} text-white text-xs font-semibold rounded-2xl mb-2`}>
                    {key}
                  </div>
                  <div className="text-2xl font-bold text-white">{progress.completed}/{progress.total}</div>
                  <div className="text-xs text-purple-200">completed</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}