"use client";
import React, { useState, useEffect } from 'react';
import { GraduationCap, ClipboardCheck, BookOpen, TrendingUp, Menu, X, ArrowRight, CheckCircle, Users, Award, Sparkles, Zap, Target, Calendar, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import Link

from 'next/link';
export default function CampusMateHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [attendanceData, setAttendanceData] = useState([
    { subject: 'Computer Networks', attended: 28, total: 35, percentage: 80 },
    { subject: 'Operating Systems', attended: 22, total: 30, percentage: 73.3 },
    { subject: 'SQL Database', attended: 31, total: 38, percentage: 81.6 },
  ]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return 'from-emerald-500 to-green-500';
    if (percentage >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 75) return <CheckCircle2 className="w-4 h-4" />;
    if (percentage >= 70) return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 75) return 'Safe';
    if (percentage >= 70) return 'At Risk';
    return 'Critical';
  };

  const features = [
    {
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: "AI Attendance Predictor",
      description: "Smart algorithms predict your semester attendance and alert you before it's too late",
       href: "/attendance-tracker",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Placement AI Coach",
      description: "Personalized prep roadmaps powered by ML analyzing top company patterns",
       href: "/placement",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Intelligent Notes Library",
      description: "AI-curated study materials ranked by peer reviews and exam relevance",
       href: "/",
    },
    
  ];
const WaitlistBadgeAlt = () => {
  return (
    <div className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl shadow-xl ">
      {/* Avatar Stack with Counter */}
      <div className="relative">
        <div className="flex -space-x-3">
          {[
            { letter: 'SS', bg: 'bg-blue-500' },
            { letter: 'BK', bg: 'bg-purple-500' },
            { letter: 'RY', bg: 'bg-indigo-500' }
          ].map((avatar, i) => (
            <div 
              key={i} 
              className={`w-11 h-11 rounded-full ${avatar.bg} border-3 border-white flex items-center justify-center text-sm font-semibold text-white shadow-lg`}
            >
              {avatar.letter}
            </div>
          ))}
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md border-2 border-white">
          7
        </div>
      </div>
      
      {/* Text Content */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-white">7 on waitlist</span>
          <span className="px-2 py-0.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-full border border-emerald-400/20">
            Active
          </span>
        </div>
        <p className="text-sm text-slate-400">Join the waitlist for early access</p>
      </div>
    </div>
  );
};
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Hero Section with Live Demo */}
      <section className="relative pt-24 pb-12 px-6 min-h-screen flex items-center">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="relative z-10">
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full mb-4 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">AI-Powered Academic Assistant</span>
              </div> */}
              
              <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-[1.1]">
                Meet your new
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <br />
                Placement partner
              </h1>
              
              <p className="text-lg text-gray-400 mb-6 leading-relaxed max-w-xl">
                Automate attendance tracking, access intelligent study resources, and ace placements with AI agents that actually understand your college journey.
              </p>

              {/* <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 text-sm">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                <button className="px-6 py-3 rounded-2xl font-semibold text-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
                  Watch Demo
                </button>
              </div> */}

              {/* Trust Indicators */}
               <WaitlistBadgeAlt />

            </div>

            {/* Right - Live Attendance Demo */}
            <div className="relative" style={{ transform: 'perspective(1000px) rotateY(-11deg)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-3xl" />
              
              <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.1]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-blue-400" />
                      <h3 className="text-base font-semibold">Attendance Tracker</h3>
                    </div>
                    <p className="text-xs text-gray-400">Real-time monitoring</p>
                  </div>
                  <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <span className="text-emerald-400 text-xs font-semibold">LIVE</span>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="mb-4 p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Overall Attendance</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      79.8%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: '79.8%'}} />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">Above minimum threshold</span>
                  </div>
                </div>

                {/* Subject List */}
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                  {attendanceData.map((subject, idx) => (
                    <div key={idx} className="group p-3 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-xs mb-0.5">{subject.subject}</div>
                          <div className="text-xs text-gray-500">{subject.attended}/{subject.total} classes</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r ${getStatusColor(subject.percentage)} bg-opacity-10 rounded-lg`}>
                            {getStatusIcon(subject.percentage)}
                            <span className="text-xs font-semibold">{getStatusText(subject.percentage)}</span>
                          </div>
                          <span className="text-base font-bold">{subject.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getStatusColor(subject.percentage)} rounded-full transition-all duration-500`}
                          style={{width: `${subject.percentage}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Insight */}
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg mt-0.5">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-xs mb-1">AI Insight</div>
                      <div className="text-xs text-gray-400 leading-relaxed">
                        You can skip 2 more classes in OS this month and still maintain 75%. Perfect attendance in CN recommended.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Scrollbar Styles */}
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(255, 255, 255, 0.05);
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(139, 92, 246, 0.5);
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(139, 92, 246, 0.7);
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Powered by Advanced AI</span>
            </div> */}
            <h2 className="text-5xl font-bold mb-4">
              Intelligence meets
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> simplicity</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
               <Link
    key={idx}
    href={feature.href}
    className="group relative block"
  >
    {/* glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

    {/* card */}
    <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-all h-full cursor-pointer">
      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl w-fit mb-4">
        {feature.icon}
      </div>

      <h3 className="text-xl font-bold mb-2">
        {feature.title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed">
        {feature.description}
      </p>
    </div>
  </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20" />
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 text-center">
             
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to transform your college experience?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join 5000+ students using AI to stay ahead in academics and placements
              </p>
              <button className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 mx-auto w-fit">
                  <Link href="/attendance-tracker">
                       Join the waitlist now
                  </Link>
                  
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}