// placementData.ts - Central data structure for all subjects and topics

export interface Question {
  id: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: 'Very High' | 'High' | 'Medium' | 'Low';
  answer: string;
  keyPoints: string[];
  followUp: string;
}

export interface Topic {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  slug: string;
  questions: Question[];
}

export interface Subject {
  name: string;
  color: string;
  topics: Topic[];
}

export const SUBJECTS_DATA: Record<string, Subject> = {
  CN: {
    name: 'Computer Networks',
    color: 'from-blue-500 to-cyan-500',
    topics: [
      {
        id: 'cn1',
        name: 'OSI vs TCP/IP Model',
        difficulty: 'Easy',
        slug: 'osi-vs-tcpip',
        questions: []
      },
      {
        id: 'cn2',
        name: 'TCP vs UDP',
        difficulty: 'Medium',
        slug: 'tcp-vs-udp',
        questions: [
          {
            id: 'q1',
            question: 'What are the main differences between TCP and UDP?',
            difficulty: 'Easy',
            frequency: 'Very High',
            answer: `TCP (Transmission Control Protocol) is connection-oriented, reliable, and ensures data delivery in order. It uses acknowledgments and retransmission for lost packets. UDP (User Datagram Protocol) is connectionless, faster but unreliable, with no guarantee of delivery or order. TCP has higher overhead due to connection establishment and error checking, while UDP is lightweight and preferred for real-time applications.`,
            keyPoints: [
              'TCP: Connection-oriented, UDP: Connectionless',
              'TCP: Reliable delivery, UDP: No reliability guarantee',
              'TCP: Ordered packets, UDP: No ordering',
              'TCP: Slower but accurate, UDP: Faster but may lose data',
              'TCP: Used for HTTP, FTP, Email; UDP: Used for DNS, streaming, gaming'
            ],
            followUp: 'Can you give real-world examples where each protocol is preferred?'
          },
          {
            id: 'q2',
            question: 'Explain the TCP 3-way handshake process.',
            difficulty: 'Medium',
            frequency: 'Very High',
            answer: `The TCP 3-way handshake establishes a connection between client and server:\n1. SYN: Client sends SYN packet with initial sequence number to server\n2. SYN-ACK: Server responds with SYN-ACK, acknowledging client's SYN and sending its own sequence number\n3. ACK: Client sends ACK to acknowledge server's SYN\n\nAfter these three steps, the connection is established and data transfer can begin.`,
            keyPoints: [
              'Step 1: Client → Server (SYN)',
              'Step 2: Server → Client (SYN-ACK)',
              'Step 3: Client → Server (ACK)',
              'Ensures both sides are ready for data transmission',
              'Synchronizes sequence numbers for reliable communication'
            ],
            followUp: 'What happens if the connection fails during the handshake?'
          },
          {
            id: 'q3',
            question: 'When would you use UDP instead of TCP?',
            difficulty: 'Easy',
            frequency: 'High',
            answer: `UDP is preferred when:\n- Speed is more important than reliability (real-time applications)\n- Small data packets are being sent (DNS queries)\n- Broadcasting to multiple recipients simultaneously\n- Applications can handle packet loss (video streaming, online gaming)\n- Low latency is critical (VoIP, live video conferencing)\n\nExamples: Video streaming (Netflix, YouTube), online gaming, DNS lookups, VoIP calls, IoT sensor data.`,
            keyPoints: [
              'Real-time applications (gaming, streaming)',
              'DNS queries',
              'VoIP and video conferencing',
              'Broadcasting and multicasting',
              'When occasional data loss is acceptable'
            ],
            followUp: 'How does streaming handle packet loss if UDP doesn\'t guarantee delivery?'
          },
          {
            id: 'q4',
            question: 'What is the TCP congestion control mechanism?',
            difficulty: 'Hard',
            frequency: 'Medium',
            answer: `TCP congestion control prevents network overload using several algorithms:\n\n1. Slow Start: Begins with small congestion window, doubles with each ACK until threshold\n2. Congestion Avoidance: After threshold, increases window linearly\n3. Fast Retransmit: Resends lost packet after 3 duplicate ACKs without waiting for timeout\n4. Fast Recovery: Reduces window by half instead of restarting from slow start\n\nKey mechanisms include:\n- Congestion Window (CWND): Limits unacknowledged data\n- Additive Increase Multiplicative Decrease (AIMD)\n- Timeout detection for packet loss`,
            keyPoints: [
              'Slow Start phase with exponential growth',
              'Congestion Avoidance with linear growth',
              'Fast Retransmit on duplicate ACKs',
              'Fast Recovery to avoid slow start',
              'AIMD algorithm for fairness'
            ],
            followUp: 'What triggers TCP to enter the congestion avoidance phase?'
          },
          {
            id: 'q5',
            question: 'Explain TCP flow control and the sliding window protocol.',
            difficulty: 'Medium',
            frequency: 'Medium',
            answer: `TCP flow control prevents sender from overwhelming receiver using sliding window protocol:\n\n- Receiver advertises available buffer space (window size) in ACK packets\n- Sender can only transmit data up to the window size\n- Window "slides" forward as data is acknowledged\n- Zero window: Receiver buffers full, sender stops until window opens\n\nWindow size dynamically adjusts based on:\n- Receiver's buffer capacity\n- Network conditions\n- Acknowledgments received`,
            keyPoints: [
              'Prevents receiver buffer overflow',
              'Receiver advertises window size',
              'Sender respects window limit',
              'Window slides as ACKs arrive',
              'Dynamic adjustment based on conditions'
            ],
            followUp: 'What is the difference between flow control and congestion control?'
          },
          {
            id: 'q6',
            question: 'What is the purpose of UDP checksum?',
            difficulty: 'Easy',
            frequency: 'Low',
            answer: `UDP checksum provides basic error detection:\n\n- Calculated over UDP header, data, and pseudo-header (IP addresses, protocol)\n- Sender computes checksum and includes it in UDP header\n- Receiver recalculates checksum and compares\n- If mismatch detected, packet is discarded (not corrected)\n\nNote: UDP checksum is optional in IPv4 but mandatory in IPv6. Even with checksum, UDP doesn't request retransmission - it simply drops corrupt packets.`,
            keyPoints: [
              'Detects data corruption in transit',
              'Calculated over header and data',
              'Optional in IPv4, mandatory in IPv6',
              'Corrupt packets are discarded, not corrected',
              'No retransmission mechanism'
            ],
            followUp: 'Why is checksum optional in IPv4 but mandatory in IPv6?'
          },
          {
            id: 'q7',
            question: 'How does TCP handle out-of-order packets?',
            difficulty: 'Medium',
            frequency: 'High',
            answer: `TCP ensures in-order delivery using sequence numbers:\n\n1. Each byte of data is assigned a sequence number\n2. Receiver expects packets in sequential order\n3. If packet arrives out of order, receiver buffers it\n4. Receiver sends ACK for last in-order byte received\n5. Sender retransmits missing packets based on duplicate ACKs or timeout\n6. Once missing packets arrive, buffered data is delivered to application in correct order\n\nThis guarantees the application receives data exactly as sent, even if network delivers packets out of order.`,
            keyPoints: [
              'Sequence numbers track byte order',
              'Out-of-order packets are buffered',
              'ACKs indicate last in-order byte',
              'Missing packets trigger retransmission',
              'Application receives ordered data'
            ],
            followUp: 'What happens if the buffer fills up with out-of-order packets?'
          },
          {
            id: 'q8',
            question: 'Compare the header sizes of TCP and UDP. Why the difference?',
            difficulty: 'Easy',
            frequency: 'Medium',
            answer: `TCP Header: 20-60 bytes (20 bytes minimum)\nUDP Header: 8 bytes (fixed)\n\nTCP header is larger because it includes:\n- Sequence and acknowledgment numbers (8 bytes)\n- Window size for flow control\n- Flags for connection management (SYN, ACK, FIN)\n- Options field (up to 40 bytes) for features like timestamps\n\nUDP header is minimal with only:\n- Source and destination ports (4 bytes)\n- Length field (2 bytes)\n- Checksum (2 bytes)\n\nThe size difference reflects TCP's reliability features vs UDP's simplicity and speed focus.`,
            keyPoints: [
              'TCP: 20-60 bytes (complex)',
              'UDP: 8 bytes (simple)',
              'TCP includes sequence/ACK numbers',
              'TCP has connection management fields',
              'UDP trades features for minimal overhead'
            ],
            followUp: 'What are some common TCP options that increase header size?'
          }
        ]
      },
      {
        id: 'cn3',
        name: 'Flow & Congestion Control',
        difficulty: 'Hard',
        slug: 'flow-congestion-control',
        questions: []
      },
      {
        id: 'cn4',
        name: 'HTTP vs HTTPS',
        difficulty: 'Easy',
        slug: 'http-vs-https',
        questions: []
      },
      {
        id: 'cn5',
        name: 'DNS Working',
        difficulty: 'Medium',
        slug: 'dns-working',
        questions: []
      },
      {
        id: 'cn6',
        name: 'Subnet Masking',
        difficulty: 'Hard',
        slug: 'subnet-masking',
        questions: []
      },
      {
        id: 'cn7',
        name: 'ARP & RARP',
        difficulty: 'Medium',
        slug: 'arp-rarp',
        questions: []
      },
      {
        id: 'cn8',
        name: 'Network Security Basics',
        difficulty: 'Medium',
        slug: 'network-security',
        questions: []
      }
    ]
  },
  OOPs: {
    name: 'Object Oriented Programming',
    color: 'from-purple-500 to-pink-500',
    topics: [
      {
        id: 'oop1',
        name: 'Encapsulation',
        difficulty: 'Easy',
        slug: 'encapsulation',
        questions: []
      },
      {
        id: 'oop2',
        name: 'Inheritance',
        difficulty: 'Easy',
        slug: 'inheritance',
        questions: []
      },
      {
        id: 'oop3',
        name: 'Polymorphism',
        difficulty: 'Medium',
        slug: 'polymorphism',
        questions: []
      },
      {
        id: 'oop4',
        name: 'Abstraction',
        difficulty: 'Medium',
        slug: 'abstraction',
        questions: []
      },
      {
        id: 'oop5',
        name: 'SOLID Principles',
        difficulty: 'Hard',
        slug: 'solid-principles',
        questions: []
      },
      {
        id: 'oop6',
        name: 'Design Patterns',
        difficulty: 'Hard',
        slug: 'design-patterns',
        questions: []
      },
      {
        id: 'oop7',
        name: 'Interface vs Abstract Class',
        difficulty: 'Medium',
        slug: 'interface-vs-abstract',
        questions: []
      }
    ]
  },
  OS: {
    name: 'Operating Systems',
    color: 'from-orange-500 to-red-500',
    topics: [
      {
        id: 'os1',
        name: 'Process vs Thread',
        difficulty: 'Easy',
        slug: 'process-vs-thread',
        questions: []
      },
      {
        id: 'os2',
        name: 'Deadlock Conditions',
        difficulty: 'Medium',
        slug: 'deadlock-conditions',
        questions: []
      },
      {
        id: 'os3',
        name: 'CPU Scheduling Algorithms',
        difficulty: 'Hard',
        slug: 'cpu-scheduling',
        questions: []
      },
      {
        id: 'os4',
        name: 'Memory Management',
        difficulty: 'Medium',
        slug: 'memory-management',
        questions: []
      },
      {
        id: 'os5',
        name: 'Paging vs Segmentation',
        difficulty: 'Hard',
        slug: 'paging-vs-segmentation',
        questions: []
      },
      {
        id: 'os6',
        name: 'Virtual Memory',
        difficulty: 'Medium',
        slug: 'virtual-memory',
        questions: []
      },
      {
        id: 'os7',
        name: 'System Calls',
        difficulty: 'Easy',
        slug: 'system-calls',
        questions: []
      },
      {
        id: 'os8',
        name: 'Semaphores & Mutex',
        difficulty: 'Hard',
        slug: 'semaphores-mutex',
        questions: []
      }
    ]
  },
  DBMS: {
    name: 'Database Management Systems',
    color: 'from-green-500 to-emerald-500',
    topics: [
      {
        id: 'db1',
        name: 'Normalization (1NF to BCNF)',
        difficulty: 'Hard',
        slug: 'normalization',
        questions: []
      },
      {
        id: 'db2',
        name: 'Indexing Types',
        difficulty: 'Medium',
        slug: 'indexing-types',
        questions: []
      },
      {
        id: 'db3',
        name: 'ACID Properties',
        difficulty: 'Easy',
        slug: 'acid-properties',
        questions: []
      },
      {
        id: 'db4',
        name: 'SQL Joins',
        difficulty: 'Medium',
        slug: 'sql-joins',
        questions: []
      },
      {
        id: 'db5',
        name: 'Transactions & Concurrency',
        difficulty: 'Hard',
        slug: 'transactions-concurrency',
        questions: []
      },
      {
        id: 'db6',
        name: 'ER Diagrams',
        difficulty: 'Easy',
        slug: 'er-diagrams',
        questions: []
      },
      {
        id: 'db7',
        name: 'NoSQL vs SQL',
        difficulty: 'Medium',
        slug: 'nosql-vs-sql',
        questions: []
      }
    ]
  }
};

// Helper function to get topic by subject and slug
export function getTopicBySlug(subjectKey: string, topicSlug: string) {
  const subject = SUBJECTS_DATA[subjectKey];
  if (!subject) return null;
  return subject.topics.find(topic => topic.slug === topicSlug);
}

// Helper function to get all topic slugs for static generation
export function getAllTopicSlugs() {
  const slugs: { subject: string; topic: string }[] = [];
  Object.keys(SUBJECTS_DATA).forEach(subjectKey => {
    SUBJECTS_DATA[subjectKey].topics.forEach(topic => {
      slugs.push({ subject: subjectKey, topic: topic.slug });
    });
  });
  return slugs;
}