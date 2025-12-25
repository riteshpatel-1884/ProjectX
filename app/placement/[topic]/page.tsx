"use client"

import { useParams, useRouter } from 'next/navigation';
import { getTopicBySlug } from '@/lib/placementData';
import TopicQuestions from '@/app/components/placement/TopicQuestions';
import { ChevronLeft } from 'lucide-react';

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicSlug = params.topic as string;

  // Get the topic data - now searches across all subjects
  const result = getTopicBySlug(topicSlug);

  // Handle invalid routes
  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Topic Not Found</h1>
          <p className="text-purple-200 mb-6">The topic you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/placement')}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all mx-auto"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Placement Tracker
          </button>
        </div>
      </div>
    );
  }

  const { topic, subjectKey, subject } = result;

  // Handle topics with no questions yet
  if (topic.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className={`inline-block px-3 py-1 bg-gradient-to-r ${subject.color} text-white text-xs font-semibold rounded-full mb-4`}>
            {subjectKey} - {subject.name}
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{topic.name}</h1>
          <p className="text-purple-200 mb-6">Questions for this topic are coming soon! Check back later.</p>
          <button
            onClick={() => router.push('/placement')}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all mx-auto"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Placement Tracker
          </button>
        </div>
      </div>
    );
  }

  return (
    <TopicQuestions
      subjectKey={subjectKey}
      subjectName={subject.name}
      topicName={topic.name}
      topicId={topic.id}
      subjectColor={subject.color}
      questions={topic.questions}
    />
  );
}