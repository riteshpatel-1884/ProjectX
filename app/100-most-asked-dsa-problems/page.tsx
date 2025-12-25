"use client"
import React, { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import { Search, TrendingUp, Code, CheckCircle, Circle, Target, Award, Zap, MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';

// Types
interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: number;
  companies: string[];
  category: string;
  solved: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DSAProgress {
  totalSolved: number;
  totalProblems: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  completionPercentage: number;
  lastSolvedAt?: string;
}
// Problem Data
const DSA_PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "Reverse Linked List",
    difficulty: "Medium",
    frequency: 163,
    companies: ["Amazon", "Microsoft", "Google", "Meta", "Flipkart"],
    category: "Linked List",
    solved: false,
  },
  {
    id: 2,
    title: "Cycle Detection in Singly Linked List",
    difficulty: "Medium",
    frequency: 147,
    companies: ["Amazon", "Google", "Microsoft", "Adobe", "Uber"],
    category: "Linked List",
    solved: false,
  },
  {
    id: 3,
    title: "Trapping Rain Water",
    difficulty: "Medium",
    frequency: 139,
    companies: ["Google", "Amazon", "Microsoft", "Meta", "Apple"],
    category: "Array",
    solved: false,
  },
  {
    id: 4,
    title: "Reverse the String",
    difficulty: "Easy",
    frequency: 117,
    companies: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant"],
    category: "String",
    solved: false,
  },
  {
    id: 5,
    title: "Two Sum",
    difficulty: "Easy",
    frequency: 132,
    companies: ["Google", "Amazon", "Microsoft", "Meta", "Adobe", "Uber"],
    category: "Array",
    solved: false,
  },
  {
    id: 6,
    title: "Pair Sum",
    difficulty: "Easy",
    frequency: 101,
    companies: ["Amazon", "Flipkart", "Paytm", "Swiggy", "Zomato"],
    category: "Array",
    solved: false,
  },
  {
    id: 7,
    title: "Maximum Subarray Sum",
    difficulty: "Medium",
    frequency: 112,
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Netflix"],
    category: "Array",
    solved: false,
  },
  {
    id: 8,
    title: "Merge Sort",
    difficulty: "Easy",
    frequency: 110,
    companies: ["Microsoft", "Amazon", "Google", "Samsung"],
    category: "Sorting",
    solved: false,
  },
  {
    id: 9,
    title: "Anagram Pairs",
    difficulty: "Medium",
    frequency: 120,
    companies: ["Amazon", "Microsoft", "Google", "Adobe"],
    category: "String",
    solved: false,
  },
  {
    id: 10,
    title: "Valid Parentheses",
    difficulty: "Easy",
    frequency: 104,
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Oracle"],
    category: "Stack",
    solved: false,
  },
  {
    id: 11,
    title: "Find Number of Islands",
    difficulty: "Medium",
    frequency: 120,
    companies: ["Amazon", "Google", "Microsoft", "Uber", "Airbnb"],
    category: "Graph",
    solved: false,
  },
  {
    id: 12,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    frequency: 104,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Binary Search",
    solved: false,
  },
  {
    id: 13,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    frequency: 115,
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Apple"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 14,
    title: "Next Greater Element",
    difficulty: "Easy",
    frequency: 90,
    companies: ["Amazon", "Microsoft", "Flipkart", "Paytm"],
    category: "Stack",
    solved: false,
  },
  {
    id: 15,
    title: "N Queens",
    difficulty: "Hard",
    frequency: 100,
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    category: "Backtracking",
    solved: false,
  },
  {
    id: 16,
    title: "Level Order Traversal",
    difficulty: "Easy",
    frequency: 92,
    companies: ["Amazon", "Microsoft", "Google", "Meta", "Flipkart"],
    category: "Binary Tree",
    solved: false,
  },
  {
    id: 17,
    title: "Merge Two Sorted Linked List",
    difficulty: "Medium",
    frequency: 98,
    companies: ["Amazon", "Microsoft", "Google", "Adobe", "Uber"],
    category: "Linked List",
    solved: false,
  },
  {
    id: 18,
    title: "Find Prime Numbers",
    difficulty: "Easy",
    frequency: 74,
    companies: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant"],
    category: "Math",
    solved: false,
  },
  {
    id: 19,
    title: "LRU Cache Implementation",
    difficulty: "Medium",
    frequency: 100,
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Apple"],
    category: "Design",
    solved: false,
  },
  {
    id: 20,
    title: "Left View of Binary Tree",
    difficulty: "Medium",
    frequency: 95,
    companies: ["Amazon", "Google", "Microsoft", "Flipkart"],
    category: "Binary Tree",
    solved: false,
  },
  {
    id: 21,
    title: "Second Largest Element in the Array",
    difficulty: "Easy",
    frequency: 74,
    companies: ["Amazon", "TCS", "Infosys", "Wipro"],
    category: "Array",
    solved: false,
  },
  {
    id: 22,
    title: "House Robber",
    difficulty: "Medium",
    frequency: 100,
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Netflix"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 23,
    title: "Merge Two Sorted Arrays",
    difficulty: "Medium",
    frequency: 85,
    companies: ["Amazon", "Microsoft", "Google", "Adobe"],
    category: "Array",
    solved: false,
  },
  {
    id: 24,
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    frequency: 92,
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Apple"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 25,
    title: "Rat in a Maze",
    difficulty: "Easy",
    frequency: 73,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Backtracking",
    solved: false,
  },
  {
    id: 26,
    title: "Rotting Oranges",
    difficulty: "Medium",
    frequency: 85,
    companies: ["Amazon", "Google", "Microsoft", "Uber"],
    category: "Graph",
    solved: false,
  },
  {
    id: 27,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    frequency: 93,
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Adobe"],
    category: "String",
    solved: false,
  },
  {
    id: 28,
    title: "Wildcard Pattern Matching",
    difficulty: "Hard",
    frequency: 85,
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 29,
    title: "Count Ways To Reach The N-th Stairs",
    difficulty: "Medium",
    frequency: 91,
    companies: ["Amazon", "Google", "Microsoft", "Paytm"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 30,
    title: "N-th Fibonacci Number",
    difficulty: "Medium",
    frequency: 75,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 31,
    title: "First Missing Positive",
    difficulty: "Medium",
    frequency: 85,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Array",
    solved: false,
  },
  {
    id: 32,
    title: "Stack Using Queue",
    difficulty: "Medium",
    frequency: 73,
    companies: ["Amazon", "Microsoft", "Flipkart"],
    category: "Stack",
    solved: false,
  },
  {
    id: 33,
    title: "Delete Kth Node From End",
    difficulty: "Medium",
    frequency: 87,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Linked List",
    solved: false,
  },
  {
    id: 34,
    title: "Sort an Array of 0s, 1s and 2s",
    difficulty: "Easy",
    frequency: 70,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Array",
    solved: false,
  },
  {
    id: 35,
    title: "0/1 Knapsack",
    difficulty: "Medium",
    frequency: 87,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 36,
    title: "Rotate Array",
    difficulty: "Easy",
    frequency: 78,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Array",
    solved: false,
  },
  {
    id: 37,
    title: "Bubble Sort",
    difficulty: "Easy",
    frequency: 61,
    companies: ["TCS", "Infosys", "Wipro"],
    category: "Sorting",
    solved: false,
  },
  {
    id: 38,
    title: "Maximum in Sliding Window of Size K",
    difficulty: "Medium",
    frequency: 77,
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Uber"],
    category: "Array",
    solved: false,
  },
  {
    id: 39,
    title: "Quick Sort",
    difficulty: "Medium",
    frequency: 73,
    companies: ["Amazon", "Microsoft", "Google", "Adobe"],
    category: "Sorting",
    solved: false,
  },
  {
    id: 40,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    frequency: 83,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "String",
    solved: false,
  },
  {
    id: 41,
    title: "Group Anagrams",
    difficulty: "Medium",
    frequency: 140,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "String",
    solved: false,
  },
  {
    id: 42,
    title: "Subarray With Given Sum",
    difficulty: "Medium",
    frequency: 65,
    companies: ["Amazon", "Google", "Microsoft", "Flipkart"],
    category: "Array",
    solved: false,
  },
  {
    id: 43,
    title: "Chocolate Distribution Problem",
    difficulty: "Medium",
    frequency: 80,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Array",
    solved: false,
  },
  {
    id: 44,
    title: "Sort Array",
    difficulty: "Medium",
    frequency: 57,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Sorting",
    solved: false,
  },
  {
    id: 45,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    frequency: 160,
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Bloomberg"],
    category: "Array",
    solved: false,
  },
  {
    id: 46,
    title: "Reverse Stack Using Recursion",
    difficulty: "Easy",
    frequency: 66,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Stack",
    solved: false,
  },
  {
    id: 47,
    title: "Search in Row Wise and Column Wise Sorted Matrix",
    difficulty: "Medium",
    frequency: 79,
    companies: ["Amazon", "Google", "Microsoft", "Adobe"],
    category: "Matrix",
    solved: false,
  },
  {
    id: 48,
    title: "Matrix Chain Multiplication",
    difficulty: "Hard",
    frequency: 115,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 49,
    title: "Minimum Jumps",
    difficulty: "Medium",
    frequency: 73,
    companies: ["Amazon", "Google", "Microsoft", "Flipkart"],
    category: "Greedy",
    solved: false,
  },
  {
    id: 50,
    title: "Add Two Numbers",
    difficulty: "Medium",
    frequency: 66,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Linked List",
    solved: false,
  },
  {
    id: 51,
    title: "Merge Intervals",
    difficulty: "Medium",
    frequency: 79,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Array",
    solved: false,
  },
  {
    id: 52,
    title: "Minimum Number of Platforms",
    difficulty: "Medium",
    frequency: 73,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Greedy",
    solved: false,
  },
  {
    id: 53,
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    frequency: 67,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Array",
    solved: false,
  },
  {
    id: 54,
    title: "Minimum Cost Path",
    difficulty: "Medium",
    frequency: 73,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 55,
    title: "Intersection of Two Linked Lists",
    difficulty: "Easy",
    frequency: 125,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Linked List",
    solved: false,
  },
  {
    id: 56,
    title: "LCA of Binary Tree",
    difficulty: "Medium",
    frequency: 79,
    companies: ["Amazon", "Google", "Microsoft", "Uber"],
    category: "Binary Tree",
    solved: false,
  },
  {
    id: 57,
    title: "Missing Number",
    difficulty: "Medium",
    frequency: 60,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Array",
    solved: false,
  },
  {
    id: 58,
    title: "Covid Vaccination",
    difficulty: "Medium",
    frequency: 71,
    companies: ["TCS", "Infosys", "Wipro"],
    category: "Simulation",
    solved: false,
  },
  {
    id: 59,
    title: "Coin Change Problem",
    difficulty: "Medium",
    frequency: 150,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 60,
    title: "Implementation: HashMap",
    difficulty: "Easy",
    frequency: 62,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Hashing",
    solved: false,
  },
  {
    id: 61,
    title: "Count Inversions",
    difficulty: "Medium",
    frequency: 74,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Divide and Conquer",
    solved: false,
  },
  {
    id: 62,
    title: "String Palindrome",
    difficulty: "Easy",
    frequency: 76,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "String",
    solved: false,
  },
  {
    id: 63,
    title: "Binary Search",
    difficulty: "Easy",
    frequency: 180,
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Adobe"],
    category: "Binary Search",
    solved: false,
  },
  {
    id: 64,
    title: "Kadane's Algorithm",
    difficulty: "Medium",
    frequency: 165,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Array",
    solved: false,
  },
  {
    id: 65,
    title: "Detect Cycle in Graph",
    difficulty: "Medium",
    frequency: 150,
    companies: ["Amazon", "Google", "Microsoft", "Uber"],
    category: "Graph",
    solved: false,
  },
  {
    id: 66,
    title: "Topological Sort",
    difficulty: "Medium",
    frequency: 142,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Graph",
    solved: false,
  },
  {
    id: 67,
    title: "Dijkstra's Algorithm",
    difficulty: "Medium",
    frequency: 138,
    companies: ["Amazon", "Google", "Microsoft", "Uber"],
    category: "Graph",
    solved: false,
  },
  {
    id: 68,
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    frequency: 155,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Binary Tree",
    solved: false,
  },
  {
    id: 69,
    title: "Binary Tree Height",
    difficulty: "Easy",
    frequency: 148,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Binary Tree",
    solved: false,
  },
  {
    id: 70,
    title: "Check if Binary Tree is Balanced",
    difficulty: "Medium",
    frequency: 135,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Binary Tree",
    solved: false,
  },
  {
    id: 71,
    title: "Lowest Common Ancestor (BST)",
    difficulty: "Easy",
    frequency: 145,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Binary Search Tree",
    solved: false,
  },
  {
    id: 72,
    title: "Insert Delete Search in BST",
    difficulty: "Medium",
    frequency: 130,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Binary Search Tree",
    solved: false,
  },
  {
    id: 73,
    title: "Heap Sort",
    difficulty: "Medium",
    frequency: 125,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Heap",
    solved: false,
  },
  {
    id: 74,
    title: "Kth Largest Element in Array",
    difficulty: "Medium",
    frequency: 170,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Heap",
    solved: false,
  },
  {
    id: 75,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    frequency: 160,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Binary Search",
    solved: false,
  },
  {
    id: 76,
    title: "Word Break Problem",
    difficulty: "Medium",
    frequency: 140,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 77,
    title: "Edit Distance",
    difficulty: "Hard",
    frequency: 132,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 78,
    title: "Subset Sum Problem",
    difficulty: "Medium",
    frequency: 128,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Dynamic Programming",
    solved: false,
  },
  {
    id: 79,
    title: "Permutations of a String",
    difficulty: "Medium",
    frequency: 150,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Backtracking",
    solved: false,
  },
  {
    id: 80,
    title: "Combination Sum",
    difficulty: "Medium",
    frequency: 145,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Backtracking",
    solved: false,
  },
  {
    id: 81,
    title: "Sudoku Solver",
    difficulty: "Hard",
    frequency: 120,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Backtracking",
    solved: false,
  },
  {
    id: 82,
    title: "Flood Fill Algorithm",
    difficulty: "Easy",
    frequency: 155,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Graph",
    solved: false,
  },
  {
    id: 83,
    title: "Binary Search on Answer",
    difficulty: "Medium",
    frequency: 145,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Binary Search",
    solved: false,
  },
  {
    id: 84,
    title: "Allocate Minimum Pages",
    difficulty: "Medium",
    frequency: 138,
    companies: ["Amazon", "Microsoft", "Google"],
    category: "Binary Search",
    solved: false,
  },
  {
    id: 85,
    title: "Aggressive Cows",
    difficulty: "Medium",
    frequency: 132,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Binary Search",
    solved: false,
  },
  {
    id: 86,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    frequency: 155,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Heap",
    solved: false,
  },
  {
    id: 87,
    title: "K Closest Points to Origin",
    difficulty: "Medium",
    frequency: 148,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Heap",
    solved: false,
  },
  {
    id: 88,
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    frequency: 160,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Deque",
    solved: false,
  },
  {
    id: 89,
    title: "Minimum Window Substring",
    difficulty: "Hard",
    frequency: 158,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Sliding Window",
    solved: false,
  },
  {
    id: 90,
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    frequency: 142,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Sliding Window",
    solved: false,
  },
  {
    id: 91,
    title: "Graph BFS Traversal",
    difficulty: "Easy",
    frequency: 170,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Graph",
    solved: false,
  },
  {
    id: 92,
    title: "Graph DFS Traversal",
    difficulty: "Easy",
    frequency: 168,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Graph",
    solved: false,
  },
  {
    id: 93,
    title: "Detect Cycle in Directed Graph",
    difficulty: "Medium",
    frequency: 150,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Graph",
    solved: false,
  },
  {
    id: 94,
    title: "Clone a Graph",
    difficulty: "Medium",
    frequency: 135,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Graph",
    solved: false,
  },
  {
    id: 95,
    title: "Trie Implementation",
    difficulty: "Medium",
    frequency: 140,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Trie",
    solved: false,
  },
  {
    id: 96,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    frequency: 155,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Trie",
    solved: false,
  },
  {
    id: 97,
    title: "Word Search",
    difficulty: "Medium",
    frequency: 145,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Backtracking",
    solved: false,
  },
  {
    id: 98,
    title: "Number of Distinct Islands",
    difficulty: "Medium",
    frequency: 130,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Graph",
    solved: false,
  },
  {
    id: 99,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    frequency: 145,
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    category: "Binary Tree",
    solved: false,
  },
  {
    id: 100,
    title: "LFU Cache",
    difficulty: "Hard",
    frequency: 140,
    companies: ["Amazon", "Google", "Microsoft"],
    category: "Design",
    solved: false,
  },
];

const DSATracker: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>(DSA_PROBLEMS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('frequency');
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);
  
  // AI Chat States
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const companies: string[] = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Adobe", "Bloomberg"];
  
  // Fetch user's progress from database on component mount
  useEffect(() => {
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    try {
      setIsLoadingProgress(true);
      const response = await fetch('/api/dsa-progress');
      
      if (response.ok) {
        const data = await response.json();
        const { problemsSolved } = data;
        
        // Update problems with solved status
        if (problemsSolved && problemsSolved.length > 0) {
          setProblems(prevProblems => 
            prevProblems.map(problem => ({
              ...problem,
              solved: problemsSolved.some((solved: any) => solved.problemId === problem.id)
            }))
          );
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setIsLoadingProgress(false);
    }
  };

     const toggleSolved = async (id: number): Promise<void> => {
    const problem = problems.find(p => p.id === id);
    if (!problem) return;

    const newSolvedStatus = !problem.solved;

    // Optimistic update
    setProblems(problems.map(p => 
      p.id === id ? { ...p, solved: newSolvedStatus } : p
    ));

    try {
      const response = await fetch('/api/dsa-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: problem.id,
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.category,
          solved: newSolvedStatus
        }),
      });

      if (!response.ok) {
        // Revert on error
        setProblems(problems.map(p => 
          p.id === id ? { ...p, solved: !newSolvedStatus } : p
        ));
        throw new Error('Failed to update problem status');
      }
    } catch (error) {
      console.error('Error updating problem status:', error);
      alert('Failed to update progress. Please try again.');
    }
  };
  
  const getDifficultyColor = (difficulty: string): string => {
    switch(difficulty) {
      case 'Easy': return 'text-emerald-400';
      case 'Medium': return 'text-amber-400';
      case 'Hard': return 'text-rose-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty: string): string => {
    switch(difficulty) {
      case 'Easy': return 'bg-emerald-500/20 border-emerald-400/30';
      case 'Medium': return 'bg-amber-500/20 border-amber-400/30';
      case 'Hard': return 'bg-rose-500/20 border-rose-400/30';
      default: return 'bg-gray-500/20 border-gray-400/30';
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProblems = problems.length;
    const solvedProblems = problems.filter(p => p.solved).length;
    const easyTotal = problems.filter(p => p.difficulty === 'Easy').length;
    const mediumTotal = problems.filter(p => p.difficulty === 'Medium').length;
    const hardTotal = problems.filter(p => p.difficulty === 'Hard').length;
    const easySolved = problems.filter(p => p.difficulty === 'Easy' && p.solved).length;
    const mediumSolved = problems.filter(p => p.difficulty === 'Medium' && p.solved).length;
    const hardSolved = problems.filter(p => p.difficulty === 'Hard' && p.solved).length;
    const totalFrequency = problems.reduce((sum, p) => sum + p.frequency, 0);
    const completionPercentage = ((solvedProblems / totalProblems) * 100).toFixed(1);

    return {
      totalProblems,
      solvedProblems,
      easyTotal,
      mediumTotal,
      hardTotal,
      easySolved,
      mediumSolved,
      hardSolved,
      totalFrequency,
      completionPercentage
    };
  }, [problems]);

  const filteredAndSortedProblems = useMemo(() => {
    let filtered = problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
      const matchesCompany = selectedCompany === 'all' || problem.companies.includes(selectedCompany);
      return matchesSearch && matchesDifficulty && matchesCompany;
    });

    if (sortBy === 'frequency') {
      filtered = [...filtered].sort((a, b) => b.frequency - a.frequency);
    } else if (sortBy === 'difficulty') {
      const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      filtered = [...filtered].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    }

    return filtered;
  }, [problems, searchTerm, selectedDifficulty, selectedCompany, sortBy]);

  const sendMessage = async (customMessage?: string): Promise<void> => {
    const messageToSend = customMessage || inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are an AI assistant helping users with their DSA (Data Structures and Algorithms) preparation. 

Current User Statistics:
- Total Problems: ${stats.totalProblems}
- Problems Solved: ${stats.solvedProblems} (${stats.completionPercentage}%)
- Easy Problems: ${stats.easySolved}/${stats.easyTotal} solved
- Medium Problems: ${stats.mediumSolved}/${stats.mediumTotal} solved
- Hard Problems: ${stats.hardSolved}/${stats.hardTotal} solved

Available Problem Categories: ${Array.from(new Set(problems.map(p => p.category))).join(', ')}
Top Companies: ${companies.join(', ')}

The user is tracking ${problems.length} of the most frequently asked interview problems. Help them with study plans, problem recommendations, interview preparation tips, or answer any questions about DSA concepts. Be concise and practical.`;

      const response = await fetch("/api/100-dsa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         model: "llama-3.3-70b-versatile", 
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...messages.map(msg => ({ 
              role: msg.role, 
              content: msg.content 
            })),
            { 
              role: "user", 
              content: messageToSend 
            }
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const assistantMessage = data.choices[0].message.content;
        if (assistantMessage && assistantMessage.trim()) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: assistantMessage 
          }]);
        }
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoadingProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-purple-300 text-lg">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Glow Effect */}
        <div className="mb-8 relative pt-24">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl -z-10"></div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-3 flex items-center gap-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200">
               
                Top 100 DSA Problems
              </h1>
              <p className="text-purple-300 flex items-center gap-2 text-lg">
                
                Master the most frequently asked interview questions
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                AI Assistant
              </button>
            </div>
          </div>

          {/* Enhanced Progress Section */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-purple-300" />
                <h2 className="text-xl font-bold">Your Progress</h2>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-lg border border-purple-400/30">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="font-bold text-lg">{stats.completionPercentage}% Complete</span>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-200">Overall Progress</span>
                <span className="font-semibold">{stats.solvedProblems} / {stats.totalProblems}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden border border-white/20">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-500 rounded-full shadow-lg shadow-purple-500/50"
                  style={{ width: `${stats.completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-500/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-emerald-400 font-semibold flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    Easy
                  </span>
                  <span className="text-white font-bold">{stats.easySolved}/{stats.easyTotal}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${(stats.easySolved / stats.easyTotal) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-amber-500/10 backdrop-blur-sm rounded-xl p-4 border border-amber-400/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-amber-400 font-semibold flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    Medium
                  </span>
                  <span className="text-white font-bold">{stats.mediumSolved}/{stats.mediumTotal}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${(stats.mediumSolved / stats.mediumTotal) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-rose-500/10 backdrop-blur-sm rounded-xl p-4 border border-rose-400/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-rose-400 font-semibold flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    Hard
                  </span>
                  <span className="text-white font-bold">{stats.hardSolved}/{stats.hardTotal}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-rose-400 transition-all duration-500"
                    style={{ width: `${(stats.hardSolved / stats.hardTotal) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl p-5 border border-cyan-400/30 shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105">
              <div className="text-cyan-300 text-4xl font-bold mb-1">{stats.totalProblems}</div>
              <div className="text-purple-200 text-sm font-medium">Total Problems</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-xl p-5 border border-emerald-400/30 shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-105">
              <div className="text-emerald-300 text-4xl font-bold mb-1">{stats.solvedProblems}</div>
              <div className="text-purple-200 text-sm font-medium">Problems Solved</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl p-5 border border-purple-400/30 shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105">
              <div className="text-purple-300 text-4xl font-bold mb-1">{stats.totalFrequency.toLocaleString()}</div>
              <div className="text-purple-200 text-sm font-medium">Total Frequency</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-xl p-5 border border-orange-400/30 shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-105">
              <div className="text-orange-300 text-4xl font-bold mb-1">{companies.length}</div>
              <div className="text-purple-200 text-sm font-medium">Top Companies</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all cursor-pointer"
            >
              <option value="all" className="bg-purple-900">All Difficulties</option>
              <option value="Easy" className="bg-purple-900">Easy</option>
              <option value="Medium" className="bg-purple-900">Medium</option>
              <option value="Hard" className="bg-purple-900">Hard</option>
            </select>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all cursor-pointer"
            >
              <option value="all" className="bg-purple-900">All Companies</option>
              {companies.map(company => (
                <option key={company} value={company} className="bg-purple-900">{company}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all cursor-pointer"
            >
              <option value="frequency" className="bg-purple-900">Most Asked First</option>
              <option value="difficulty" className="bg-purple-900">By Difficulty</option>
            </select>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {filteredAndSortedProblems.map((problem, index) => (
            <div
              key={problem.id}
              className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
                problem.solved 
                  ? 'border-emerald-400/50 shadow-lg shadow-emerald-500/20' 
                  : 'border-white/20 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20'
              }`}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center font-bold text-xl border border-purple-400/30 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">{problem.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-lg text-sm font-semibold border ${getDifficultyBg(problem.difficulty)}`}>
                        {problem.category}
                      </span>
                      <span className={`font-bold text-lg ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-purple-200 mb-4">
                    <div className="flex items-center gap-2 bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-400/30">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-cyan-300">{problem.frequency}</span>
                      <span>times asked</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map(company => (
                      <span
                        key={company}
                        className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/40 px-3 py-1.5 rounded-lg text-xs font-semibold hover:scale-105 transition-transform"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => toggleSolved(problem.id)}
                  className={`flex-shrink-0 w-12 h-12 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                    problem.solved
                      ? 'bg-emerald-500/30 border-2 border-emerald-400 hover:bg-emerald-500/40 shadow-lg shadow-emerald-500/30'
                      : 'bg-white/10 border-2 border-white/30 hover:bg-white/20 hover:border-purple-400'
                  }`}
                  aria-label={problem.solved ? "Mark as unsolved" : "Mark as solved"}
                >
                  {problem.solved ? (
                    <CheckCircle className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <Circle className="w-7 h-7 text-white/50" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

   {/* AI Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-3">
          <div className="bg-gradient-to-br from-purple-900/98 to-indigo-900/98 backdrop-blur-2xl rounded-3xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.4)] w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-800/40 to-indigo-800/40">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-purple-500/50">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI DSA Assistant</h3>
                  <p className="text-xs text-purple-300">Your personal coding interview coach</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all hover:rotate-90 duration-300"
              >
                <X className="w-5 h-5 text-purple-200" />
              </button>
            </div>

            {/* Chat Messages - Custom scrollbar hidden */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-hide" style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}>
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                
                /* Moving light streak effect */
                @keyframes light-streak {
                  0% {
                    transform: translateX(-100%) skewX(-15deg);
                    opacity: 0;
                  }
                  50% {
                    opacity: 0.8;
                  }
                  100% {
                    transform: translateX(300%) skewX(-15deg);
                    opacity: 0;
                  }
                }
                
                .user-message-content {
                  position: relative;
                  overflow: hidden;
                  border-radius: 1rem;
                }
                
                .user-message-content::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 50%;
                  height: 100%;
                  background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.3),
                    transparent
                  );
                  animation: light-streak 2s ease-in-out infinite;
                  pointer-events: none;
                }
              `}</style>
              
              {messages.length === 0 && (
                <div className="text-center text-purple-300 py-16">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-400/30">
                    <Sparkles className="w-10 h-10 text-purple-400" />
                  </div>
                  <p className="text-lg font-semibold mb-2 text-white">Ready to ace your coding interviews?</p>
                  <p className="text-sm text-purple-300">Choose a quick action below or ask me anything!</p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'user' ? (
                    <div className="max-w-[85%]">
                      <div className="user-message-content bg-gradient-to-br from-purple-600 to-blue-400 text-white px-4 py-3 shadow-lg border border-purple-400/50">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed relative z-10">{message.content}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[85%] px-4 py-3 rounded-2xl shadow-lg bg-gradient-to-br from-white/15 to-white/10 border border-white/20 text-white backdrop-blur-sm">
                      <div className="text-sm leading-relaxed space-y-1 whitespace-pre-wrap">
  <ReactMarkdown
    components={{
      p: ({ children }) => <p className="m-0">{children}</p>,
      h1: ({ children }) => <p className="font-bold m-0">{children}</p>,
      h2: ({ children }) => <p className="font-bold m-0">{children}</p>,
      h3: ({ children }) => <p className="font-bold m-0">{children}</p>,
      li: ({ children }) => <li className="m-0">{children}</li>,
      ul: ({ children }) => <ul className="pl-4 my-1">{children}</ul>,
      ol: ({ children }) => <ol className="pl-4 my-1">{children}</ol>,
    }}
  >
    {message.content}
  </ReactMarkdown>
</div>


                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-white/15 to-white/10 border border-white/20 px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg backdrop-blur-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className="text-purple-300 text-sm">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions - Moved Above Input */}
            <div className="px-6 py-3 border-t border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const studyPlanPrompt = `Generate a personalized study plan for me based on my current progress:
- Total Problems: ${stats.totalProblems}
- Solved: ${stats.solvedProblems} (${stats.completionPercentage}%)
- Easy: ${stats.easySolved}/${stats.easyTotal}
- Medium: ${stats.mediumSolved}/${stats.mediumTotal}
- Hard: ${stats.hardSolved}/${stats.hardTotal}

Please create a detailed weekly study plan with specific problem recommendations.`;
                    setInputMessage(studyPlanPrompt);
                    setTimeout(() => sendMessage(studyPlanPrompt), 100);
                  }}
                  className="text-xs bg-gradient-to-r from-purple-600/40 to-pink-600/40 hover:from-purple-600/60 hover:to-pink-600/60 px-3 py-2 rounded-lg border border-purple-400/40 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 text-white font-medium"
                  disabled={isLoading}
                >
                  📅 AI Study Plan
                </button>
                <button
                  onClick={() => {
                    setInputMessage("What should I focus on next based on my progress?");
                    setTimeout(() => sendMessage("What should I focus on next based on my progress?"), 100);
                  }}
                  className="text-xs bg-gradient-to-r from-blue-600/40 to-cyan-600/40 hover:from-blue-600/60 hover:to-cyan-600/60 px-3 py-2 rounded-lg border border-blue-400/40 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 text-white font-medium"
                  disabled={isLoading}
                >
                  📚 What to study next?
                </button>
                <button
                  onClick={() => {
                    setInputMessage("Give me interview tips for FAANG companies");
                    setTimeout(() => sendMessage("Give me interview tips for FAANG companies"), 100);
                  }}
                  className="text-xs bg-gradient-to-r from-emerald-600/40 to-green-600/40 hover:from-emerald-600/60 hover:to-green-600/60 px-3 py-2 rounded-lg border border-emerald-400/40 transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 text-white font-medium"
                  disabled={isLoading}
                >
                  🎯 Interview Tips
                </button>
                <button
                  onClick={() => {
                    setInputMessage("Recommend 5 problems to strengthen my weak areas");
                    setTimeout(() => sendMessage("Recommend 5 problems to strengthen my weak areas"), 100);
                  }}
                  className="text-xs bg-gradient-to-r from-orange-600/40 to-red-600/40 hover:from-orange-600/60 hover:to-red-600/60 px-3 py-2 rounded-lg border border-orange-400/40 transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 text-white font-medium"
                  disabled={isLoading}
                >
                  🔥 Problem Recommendations
                </button>
              </div>
            </div>

            {/* Chat Input */}
            <div className="px-6 py-4 border-t border-purple-500/20 bg-gradient-to-r from-purple-900/40 to-indigo-900/40">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about DSA, algorithms, or interview prep..."
                  className="flex-1 bg-white/10 border border-purple-400/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-sm backdrop-blur-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSATracker;