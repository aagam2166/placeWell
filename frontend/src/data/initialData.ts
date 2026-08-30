import { DatabaseState } from '../types/database';

export const initialDatabase: DatabaseState = {
  users: [
    {
      user_id: 1,
      name: 'Vatsal Shah',
      email: 'vatsal.shah@vjti.ac.in',
      password_hash: '$2b$12$e6x8L3n9Qz1V8wR2k4p8u.m9N2o7V3b4q6',
      college: 'Veermata Jijabai Technological Institute (VJTI)',
      branch: 'Computer Engineering',
      graduation_year: 2026,
      phone: '+91 98765 43210',
      created_at: '2024-08-15T09:30:00Z',
    },
    {
      user_id: 2,
      name: 'Aditya Kulkarni',
      email: 'aditya.k@alumni.vjti.ac.in',
      password_hash: '$2b$12$K89s7d8f6sd9f87sd6f98s7df687sd6f8',
      college: 'Veermata Jijabai Technological Institute (VJTI)',
      branch: 'Computer Engineering',
      graduation_year: 2025,
      phone: '+91 98234 11223',
      created_at: '2024-09-01T14:15:00Z',
    },
    {
      user_id: 3,
      name: 'Sneha Verma',
      email: 'sneha.v@iitb.ac.in',
      password_hash: '$2b$12$P098d7f6s5d4f3s2a1b9c8d7e6f5g4h3j',
      college: 'IIT Bombay',
      branch: 'Electrical Engineering',
      graduation_year: 2025,
      phone: '+91 97123 44556',
      created_at: '2024-09-10T11:20:00Z',
    },
    {
      user_id: 4,
      name: 'Rohan Sharma',
      email: 'rohan.s@pilani.bits-pilani.ac.in',
      password_hash: '$2b$12$M123k4j5h6g7f8d9s0a1b2c3d4e5f6g7h',
      college: 'BITS Pilani',
      branch: 'Computer Science',
      graduation_year: 2025,
      phone: '+91 96345 77889',
      created_at: '2024-09-15T16:45:00Z',
    },
    {
      user_id: 5,
      name: 'Pooja Reddy',
      email: 'pooja.r@iiit.ac.in',
      password_hash: '$2b$12$Z987y6x5w4v3u2t1s0r9q8p7o6n5m4l3k',
      college: 'IIIT Hyderabad',
      branch: 'Computer Science & Engineering',
      graduation_year: 2025,
      phone: '+91 95456 88990',
      created_at: '2024-10-02T10:00:00Z',
    },
    {
      user_id: 6,
      name: 'Kavya Nair',
      email: 'kavya.n@nitt.edu',
      password_hash: '$2b$12$Q456w7e8r9t0y1u2i3o4p5a6s7d8f9g0h',
      college: 'NIT Trichy',
      branch: 'Electronics & Communication',
      graduation_year: 2024,
      phone: '+91 94567 12345',
      created_at: '2024-10-18T13:10:00Z',
    },
    {
      user_id: 7,
      name: 'Aarav Mehta',
      email: 'aarav.m@dtu.ac.in',
      password_hash: '$2b$12$X111a222b333c444d555e666f777g888h',
      college: 'Delhi Technological University (DTU)',
      branch: 'Software Engineering',
      graduation_year: 2025,
      phone: '+91 93678 23456',
      created_at: '2024-11-05T08:45:00Z',
    },
  ],

  companies: [
    {
      company_id: 1,
      name: 'Qualcomm',
      industry: 'Semiconductor & Wireless Tech',
      website: 'https://www.qualcomm.com',
      logo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&auto=format&fit=crop&q=80',
    },
    {
      company_id: 2,
      name: 'Microsoft',
      industry: 'Enterprise Software & Cloud',
      website: 'https://www.microsoft.com',
      logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    },
    {
      company_id: 3,
      name: 'Google',
      industry: 'Internet & Artificial Intelligence',
      website: 'https://about.google',
      logo_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
    },
    {
      company_id: 4,
      name: 'Uber',
      industry: 'Mobility & Distributed Systems',
      website: 'https://www.uber.com',
      logo_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=128&auto=format&fit=crop&q=80',
    },
    {
      company_id: 5,
      name: 'Nvidia',
      industry: 'GPU Computing & AI Infrastructure',
      website: 'https://www.nvidia.com',
      logo_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=128&auto=format&fit=crop&q=80',
    },
    {
      company_id: 6,
      name: 'Goldman Sachs',
      industry: 'Financial Technology & Quantitative Trading',
      website: 'https://www.goldmansachs.com',
      logo_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=128&auto=format&fit=crop&q=80',
    },
    {
      company_id: 7,
      name: 'Cisco',
      industry: 'Networking & Cybersecurity',
      website: 'https://www.cisco.com',
      logo_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=128&auto=format&fit=crop&q=80',
    },
    {
      company_id: 8,
      name: 'Amazon',
      industry: 'E-Commerce & Cloud Infrastructure',
      website: 'https://www.amazon.jobs',
      logo_url: 'https://images.unsplash.com/photo-1523474253243-78dd387445ee?w=128&auto=format&fit=crop&q=80',
    },
  ],

  skills: [
    { skill_id: 1, skill_name: 'DSA' },
    { skill_id: 2, skill_name: 'C++' },
    { skill_id: 3, skill_name: 'Embedded Systems' },
    { skill_id: 4, skill_name: 'Operating Systems' },
    { skill_id: 5, skill_name: 'System Design' },
    { skill_id: 6, skill_name: 'Computer Networks' },
    { skill_id: 7, skill_name: 'Python' },
    { skill_id: 8, skill_name: 'Linux' },
    { skill_id: 9, skill_name: 'DBMS & SQL' },
    { skill_id: 10, skill_name: 'Web Dev' },
  ],

  topics: [
    { topic_id: 1, skill_id: 1, topic_name: 'Graphs & BFS/DFS', parent_topic_id: null, category: 'dsa' },
    { topic_id: 2, skill_id: 1, topic_name: 'Dynamic Programming', parent_topic_id: null, category: 'dsa' },
    { topic_id: 3, skill_id: 1, topic_name: 'Binary Trees & BST', parent_topic_id: null, category: 'dsa' },
    { topic_id: 4, skill_id: 1, topic_name: 'Arrays & Two Pointers', parent_topic_id: null, category: 'dsa' },
    { topic_id: 5, skill_id: 2, topic_name: 'Pointers & Memory Allocation', parent_topic_id: null, category: 'tech_stack' },
    { topic_id: 6, skill_id: 2, topic_name: 'STL Containers & Iterators', parent_topic_id: null, category: 'tech_stack' },
    { topic_id: 7, skill_id: 2, topic_name: 'OOP & Polymorphism in C++', parent_topic_id: null, category: 'tech_stack' },
    { topic_id: 8, skill_id: 3, topic_name: 'RTOS & Task Scheduling', parent_topic_id: null, category: 'tech_stack' },
    { topic_id: 9, skill_id: 3, topic_name: 'Microcontrollers, UART & I2C', parent_topic_id: null, category: 'tech_stack' },
    { topic_id: 10, skill_id: 3, topic_name: 'Interrupts & ISR Handling', parent_topic_id: null, category: 'tech_stack' },
    { topic_id: 11, skill_id: 4, topic_name: 'Process Synchronization & Mutexes', parent_topic_id: null, category: 'subject' },
    { topic_id: 12, skill_id: 4, topic_name: 'Virtual Memory, Paging & TLB', parent_topic_id: null, category: 'subject' },
    { topic_id: 13, skill_id: 5, topic_name: 'Rate Limiting & Caching (Redis)', parent_topic_id: null, category: 'tech_stack' },
    { topic_id: 14, skill_id: 5, topic_name: 'High-Level Scalable Architecture', parent_topic_id: null, category: 'tech_stack' },
    { topic_id: 15, skill_id: 6, topic_name: 'TCP 3-Way Handshake & Congestion', parent_topic_id: null, category: 'subject' },
    { topic_id: 16, skill_id: 8, topic_name: 'Kernel Space vs User Space', parent_topic_id: null, category: 'subject' },
    { topic_id: 17, skill_id: 9, topic_name: 'Indexing, B+ Trees & ACID Properties', parent_topic_id: null, category: 'tech_stack' },
    { topic_id: 18, skill_id: 10, topic_name: 'Behavioral & Scenario-Based Questions', parent_topic_id: null, category: 'soft_skill' },
  ],

  interview_experiences: [
    {
      experience_id: 1,
      user_id: 2,
      company_id: 1,
      role_title: 'Embedded Systems Intern',
      experience_type: 'internship',
      year: 2025,
      result: 'selected',
      overall_difficulty: 4,
      ctc_or_stipend: 'Γé╣75,000 / month',
      total_rounds: 3,
      summary_text: 'The interview focused heavily on C language internals, bitwise manipulation, RTOS concepts, and real-time ISR constraints. Interviewers were supportive but dug very deep into memory layouts, volatile keyword mechanics, and pointer arithmetic.',
      is_anonymous_public: true,
      status: 'verified',
      created_at: '2024-11-20T10:00:00Z',
    },
    {
      experience_id: 2,
      user_id: 3,
      company_id: 1,
      role_title: 'Embedded Systems Intern',
      experience_type: 'internship',
      year: 2025,
      result: 'selected',
      overall_difficulty: 4,
      ctc_or_stipend: 'Γé╣75,000 / month',
      total_rounds: 3,
      summary_text: 'Had an Online Assessment consisting of 30 MCQs on C/C++ & OS, followed by 2 technical rounds. They asked me to implement a circular buffer from scratch and debug a deadlock scenario in a multithreaded sensor driver.',
      is_anonymous_public: true,
      status: 'verified',
      created_at: '2024-12-05T14:30:00Z',
    },
    {
      experience_id: 3,
      user_id: 6,
      company_id: 1,
      role_title: 'Software Engineer',
      experience_type: 'placement',
      year: 2024,
      result: 'selected',
      overall_difficulty: 4,
      ctc_or_stipend: 'Γé╣28 LPA',
      total_rounds: 4,
      summary_text: 'Qualcomm full-time SDE drives test standard DSA (Trees, Graphs) in Round 1, followed by Low-Level C++ design, Multithreading & Memory Management in Round 2, and System Architecture + Behavioral in Round 3.',
      is_anonymous_public: true,
      status: 'verified',
      created_at: '2024-10-25T09:00:00Z',
    },
    {
      experience_id: 4,
      user_id: 4,
      company_id: 2,
      role_title: 'Software Engineer',
      experience_type: 'placement',
      year: 2025,
      result: 'selected',
      overall_difficulty: 3,
      ctc_or_stipend: 'Γé╣45 LPA (CTC)',
      total_rounds: 4,
      summary_text: 'Microsoft placement process was very structured. OA had 3 medium problems on Codility. Three rounds of interviews: 1st DSA (DP on Trees), 2nd Low-Level Design of a Document Editor, and 3rd Director round evaluating cultural fit and high-level thinking.',
      is_anonymous_public: true,
      status: 'verified',
      created_at: '2024-11-28T16:20:00Z',
    },
    {
      experience_id: 5,
      user_id: 5,
      company_id: 3,
      role_title: 'Software Engineer',
      experience_type: 'placement',
      year: 2025,
      result: 'selected',
      overall_difficulty: 5,
      ctc_or_stipend: 'Γé╣55 LPA (CTC)',
      total_rounds: 4,
      summary_text: 'Classic Google interview bar. Every round had 1-2 complex algorithmic problems where time and space complexities had to be optimized to the absolute mathematical limit. Communication and edge-case handling were strictly evaluated.',
      is_anonymous_public: true,
      status: 'verified',
      created_at: '2024-12-10T11:45:00Z',
    },
    {
      experience_id: 6,
      user_id: 7,
      company_id: 4,
      role_title: 'Software Engineer',
      experience_type: 'placement',
      year: 2025,
      result: 'selected',
      overall_difficulty: 4,
      ctc_or_stipend: 'Γé╣48 LPA (CTC)',
      total_rounds: 4,
      summary_text: 'Uber focused intensely on clean code, edge case testing, and distributed concurrency. One round was pure Machine Coding where I had to write a working in-memory ride matching engine with driver geolocation simulation.',
      is_anonymous_public: true,
      status: 'verified',
      created_at: '2024-12-15T18:00:00Z',
    },
    {
      experience_id: 7,
      user_id: 1,
      company_id: 1,
      role_title: 'Embedded Systems Intern',
      experience_type: 'internship',
      year: 2025,
      result: 'rejected',
      overall_difficulty: 4,
      ctc_or_stipend: 'Γé╣75,000 / month',
      total_rounds: 3,
      summary_text: 'Cleared the OA with a strong score, but the technical round emphasized pointer-heavy C debugging and low-level memory behavior, where the final round did not meet the expected standard.',
      is_anonymous_public: false,
      status: 'draft',
      created_at: '2025-01-10T09:00:00Z',
    }
  ],

  rounds: [
    // Experience 1 (Qualcomm - Embedded Systems Intern)
    {
      round_id: 1,
      experience_id: 1,
      topic_id: 5,
      round_number: 1,
      round_type: 'OA',
      duration_minutes: 90,
      description_text: 'Aptitude, C Language basics, Bitwise operations, OS Paging & Cache concepts, and 2 coding questions on string parsing and bit reversal.',
      difficulty_rating: 3,
      platform_used: 'HackerEarth',
      difficulty: 3,
      notes: 'Time management is key. DonΓÇÖt get stuck on aptitude questions; code test cases carry the highest weightage.',
    },
    {
      round_id: 2,
      experience_id: 1,
      topic_id: 8,
      round_number: 2,
      round_type: 'Tech',
      duration_minutes: 60,
      description_text: 'Deep dive into C pointers, function pointers, memory layout (stack, heap, text, bss), and implementing a custom malloc free block tracker.',
      difficulty_rating: 4,
      platform_used: 'Microsoft Teams & CollabEdit',
      difficulty: 4,
      notes: 'Interviewer wrote tricky C code snippets with undefined behavior and asked for exact step-by-step memory explanations.',
    },
    {
      round_id: 3,
      experience_id: 1,
      topic_id: 18,
      round_number: 3,
      round_type: 'HR',
      duration_minutes: 30,
      description_text: 'Discussion on past hardware/embedded college projects, handling project deadlines, team collaboration, and interest in modem/DSP firmware.',
      difficulty_rating: 2,
      platform_used: 'Microsoft Teams',
      difficulty: 2,
      notes: 'Friendly conversation. Be genuinely enthusiastic about Qualcomm wireless & IoT chips.',
    },

    // Experience 2 (Qualcomm - Embedded Systems Intern)
    {
      round_id: 4,
      experience_id: 2,
      topic_id: 8,
      round_number: 1,
      round_type: 'OA',
      duration_minutes: 90,
      description_text: 'Online test with 25 technical MCQs covering Computer Architecture, Cache replacement policies, C structures and 2 coding tasks.',
      difficulty_rating: 3,
      platform_used: 'HackerEarth',
      difficulty: 3,
      notes: 'MCQs had negative marking. Be careful when guessing.',
    },
    {
      round_id: 5,
      experience_id: 2,
      topic_id: 10,
      round_number: 2,
      round_type: 'Tech',
      duration_minutes: 75,
      description_text: 'Implement a thread-safe circular buffer (Ring Buffer) for UART packet ingestion. Discussed priority inversion and mutex vs semaphore in RTOS.',
      difficulty_rating: 5,
      platform_used: 'Google Meet + CoderPad',
      difficulty: 5,
      notes: 'Make sure you understand atomic operations and volatile qualifiers in embedded firmware.',
    },

    // Experience 4 (Microsoft - SDE)
    {
      round_id: 6,
      experience_id: 4,
      topic_id: 2,
      round_number: 1,
      round_type: 'OA',
      duration_minutes: 70,
      description_text: '3 coding questions on Codility testing string manipulation, greedy choice, and a dynamic programming problem on grid paths.',
      difficulty_rating: 3,
      platform_used: 'Codility',
      difficulty: 3,
      notes: 'All edge cases like empty inputs, max bounds, and integer overflows must pass for 100% test score.',
    },
    {
      round_id: 7,
      experience_id: 4,
      topic_id: 1,
      round_number: 2,
      round_type: 'Tech',
      duration_minutes: 60,
      description_text: 'Graph problem involving shortest path in a weighted grid with obstacles, followed by Trie prefix search optimization.',
      difficulty_rating: 4,
      platform_used: 'Microsoft Teams',
      difficulty: 4,
      notes: 'Wrote clean modular code with descriptive variable names.',
    },
    {
      round_id: 8,
      experience_id: 4,
      topic_id: 14,
      round_number: 3,
      round_type: 'SysDesign',
      duration_minutes: 60,
      description_text: 'Low-level design of an in-memory collaborative document editor with undo/redo operations using Command Pattern and OT/CRDT discussion.',
      difficulty_rating: 4,
      platform_used: 'Microsoft Teams Whiteboard',
      difficulty: 4,
      notes: 'Drew clean UML class diagrams and showed OOP principles (SOLID).',
    },
    {
      round_id: 9,
      experience_id: 4,
      topic_id: 18,
      round_number: 4,
      round_type: 'HR',
      duration_minutes: 45,
      description_text: 'Partner Director round: Behavioral questions, discussion on learning from technical failures, and alignment with Microsoft growth mindset.',
      difficulty_rating: 3,
      platform_used: 'Microsoft Teams',
      difficulty: 3,
      notes: 'Used STAR method for all behavioral stories.',
    },

    // Experience 5 (Google - SDE)
    {
      round_id: 10,
      experience_id: 5,
      topic_id: 1,
      round_number: 1,
      round_type: 'Tech',
      duration_minutes: 45,
      description_text: 'Hard graph traversal question with state tracking using Bitmask Dynamic Programming on DAG.',
      difficulty_rating: 5,
      platform_used: 'Google Meet + Google Docs',
      difficulty: 5,
      notes: 'Strict 45 minute limit. Model problem as a mathematical graph immediately.',
    },
    {
      round_id: 11,
      experience_id: 5,
      topic_id: 2,
      round_number: 2,
      round_type: 'Tech',
      duration_minutes: 45,
      description_text: 'Interval scheduling with resource constraints and prefix-sum segment tree optimization.',
      difficulty_rating: 5,
      platform_used: 'Google Meet + Google Docs',
      difficulty: 5,
      notes: 'Dry ran with 3 different edge cases before declaring code ready.',
    },
  ],

  questions: [
    // Questions for Qualcomm Exp 1 Round 1
    {
      question_id: 1,
      round_id: 1,
      topic_id: 5,
      question_text: 'Given an unsigned 32-bit integer, reverse the order of bits in O(1) time using bitwise operations and lookup tables.',
      question_type: 'coding',
      difficulty: 3,
      reference_link: 'https://leetcode.com/problems/reverse-bits/',
    },
    {
      question_id: 2,
      round_id: 1,
      topic_id: 5,
      question_text: 'Explain what happens when an array pointer is cast to a void pointer and dereferenced in C. What is type punning?',
      question_type: 'theory',
      difficulty: 3,
      reference_link: '',
    },

    // Questions for Qualcomm Exp 1 Round 2
    {
      question_id: 3,
      round_id: 2,
      topic_id: 8,
      question_text: 'Implement a lockless Single-Producer Single-Consumer (SPSC) Circular Queue using volatile pointers and memory barriers.',
      question_type: 'coding',
      difficulty: 5,
      reference_link: '',
    },
    {
      question_id: 4,
      round_id: 2,
      topic_id: 11,
      question_text: 'What is priority inversion in RTOS? How does Priority Inheritance Protocol resolve deadlock and unbounded latency?',
      question_type: 'theory',
      difficulty: 4,
      reference_link: 'https://en.wikipedia.org/wiki/Priority_inversion',
    },
    {
      question_id: 5,
      round_id: 2,
      topic_id: 5,
      question_text: 'You have a 32-bit micro-controller with 64KB RAM. Design a memory-efficient bitmap allocator for 128 fixed 512-byte packet buffers.',
      question_type: 'puzzle',
      difficulty: 4,
      reference_link: '',
    },

    // Questions for Qualcomm Exp 2 Round 2
    {
      question_id: 6,
      round_id: 5,
      topic_id: 10,
      question_text: 'Write a C interrupt service routine (ISR) for a GPIO button debouncer without calling blocking sleep/delay functions.',
      question_type: 'coding',
      difficulty: 4,
      reference_link: '',
    },

    // Questions for Microsoft Exp 4 Round 2
    {
      question_id: 7,
      round_id: 7,
      topic_id: 1,
      question_text: 'Given a network of microservices with latency weights, find the minimum critical path latency avoiding cyclic dependencies.',
      question_type: 'coding',
      difficulty: 4,
      reference_link: 'https://leetcode.com/problems/course-schedule-ii/',
    },
    {
      question_id: 8,
      round_id: 7,
      topic_id: 3,
      question_text: 'Serialize and Deserialize a Binary Tree with full recovery in O(N) time and linear space.',
      question_type: 'coding',
      difficulty: 3,
      reference_link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
    },

    // Questions for Microsoft Exp 4 Round 3
    {
      question_id: 9,
      round_id: 8,
      topic_id: 14,
      question_text: 'Design a scalable Pastebin service capable of handling 10,000 writes/sec with 24-hour TTL and URL shortening.',
      question_type: 'theory',
      difficulty: 4,
      reference_link: '',
    },

    // Questions for Google Exp 5 Round 1
    {
      question_id: 10,
      round_id: 10,
      topic_id: 1,
      question_text: 'Find the minimum cost to traverse all nodes in an undirected graph with non-uniform edge re-weighting rules.',
      question_type: 'coding',
      difficulty: 5,
      reference_link: 'https://leetcode.com/problems/shortest-path-visiting-all-nodes/',
    },
    {
      question_id: 11,
      round_id: 11,
      topic_id: 2,
      question_text: 'Given N continuous event intervals, determine the maximum concurrent overlap and construct optimal schedule.',
      question_type: 'coding',
      difficulty: 5,
      reference_link: 'https://leetcode.com/problems/my-calendar-three/',
    },
  ],

  resources: [
    {
      resource_id: 1,
      experience_id: 1,
      title: 'FreeRTOS Architecture & Kernel Concepts Guide',
      url: 'https://www.freertos.org/Documentation/RTOS_book.html',
      created_at: '2024-11-20T10:00:00Z',
    },
    {
      resource_id: 2,
      experience_id: 1,
      title: 'Bit Twiddling Hacks ΓÇö Stanford Graphics',
      url: 'http://graphics.stanford.edu/~seander/bithacks.html',
      created_at: '2024-11-20T10:00:00Z',
    },
    {
      resource_id: 3,
      experience_id: 4,
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      url: 'https://refactoring.guru/design-patterns',
      created_at: '2024-11-28T16:20:00Z',
    },
    {
      resource_id: 4,
      experience_id: 5,
      title: 'Algorithms 4th Edition by Sedgewick & Wayne',
      url: 'https://algs4.cs.princeton.edu/home/',
      created_at: '2024-12-10T11:45:00Z',
    },
    {
      resource_id: 5,
      experience_id: 2,
      title: 'Embedded C Coding Standard (Barr Group)',
      url: 'https://barrgroup.com/embedded-systems/books/embedded-c-coding-standard',
      created_at: '2024-12-05T14:30:00Z',
    },
  ],

  skill_resources: [
    { skill_id: 3, resource_id: 1 },
    { skill_id: 2, resource_id: 2 },
    { skill_id: 5, resource_id: 3 },
    { skill_id: 1, resource_id: 4 },
    { skill_id: 3, resource_id: 5 },
    { skill_id: 2, resource_id: 5 },
  ],

  user_skills: [
    // Current user (Vatsal Shah) skills
    { user_id: 1, skill_id: 2, proficiency_level: 'advanced' }, // C++
    { user_id: 1, skill_id: 1, proficiency_level: 'advanced' }, // DSA
    { user_id: 1, skill_id: 7, proficiency_level: 'intermediate' }, // Python
    { user_id: 1, skill_id: 3, proficiency_level: 'intermediate' }, // Embedded Systems
    { user_id: 1, skill_id: 8, proficiency_level: 'beginner' }, // Linux
    { user_id: 1, skill_id: 4, proficiency_level: 'intermediate' }, // OS

    // User 2 skills
    { user_id: 2, skill_id: 3, proficiency_level: 'advanced' },
    { user_id: 2, skill_id: 2, proficiency_level: 'advanced' },
    { user_id: 2, skill_id: 8, proficiency_level: 'advanced' },

    // User 4 skills
    { user_id: 4, skill_id: 1, proficiency_level: 'advanced' },
    { user_id: 4, skill_id: 5, proficiency_level: 'intermediate' },
    { user_id: 4, skill_id: 2, proficiency_level: 'advanced' },
  ],

  company_skills: [
    // Qualcomm
    { company_id: 1, skill_id: 3, usage_type: 'core_stack' }, // Embedded Systems
    { company_id: 1, skill_id: 2, usage_type: 'core_stack' }, // C++
    { company_id: 1, skill_id: 8, usage_type: 'frequent_interview_topic' }, // Linux
    { company_id: 1, skill_id: 4, usage_type: 'frequent_interview_topic' }, // OS
    { company_id: 1, skill_id: 1, usage_type: 'frequent_interview_topic' }, // DSA

    // Microsoft
    { company_id: 2, skill_id: 1, usage_type: 'core_stack' }, // DSA
    { company_id: 2, skill_id: 5, usage_type: 'core_stack' }, // System Design
    { company_id: 2, skill_id: 2, usage_type: 'frequent_interview_topic' }, // C++
    { company_id: 2, skill_id: 9, usage_type: 'frequent_interview_topic' }, // DBMS

    // Google
    { company_id: 3, skill_id: 1, usage_type: 'core_stack' }, // DSA
    { company_id: 3, skill_id: 2, usage_type: 'core_stack' }, // C++
    { company_id: 3, skill_id: 5, usage_type: 'frequent_interview_topic' }, // System Design
    { company_id: 3, skill_id: 4, usage_type: 'frequent_interview_topic' }, // OS

    // Uber
    { company_id: 4, skill_id: 1, usage_type: 'core_stack' }, // DSA
    { company_id: 4, skill_id: 5, usage_type: 'core_stack' }, // System Design
    { company_id: 4, skill_id: 6, usage_type: 'frequent_interview_topic' }, // Computer Networks
    { company_id: 4, skill_id: 7, usage_type: 'frequent_interview_topic' }, // Python

    // Nvidia
    { company_id: 5, skill_id: 2, usage_type: 'core_stack' }, // C++
    { company_id: 5, skill_id: 3, usage_type: 'core_stack' }, // Embedded Systems
    { company_id: 5, skill_id: 4, usage_type: 'frequent_interview_topic' }, // OS
    { company_id: 5, skill_id: 8, usage_type: 'frequent_interview_topic' }, // Linux

    // Goldman Sachs
    { company_id: 6, skill_id: 1, usage_type: 'core_stack' }, // DSA
    { company_id: 6, skill_id: 2, usage_type: 'core_stack' }, // C++
    { company_id: 6, skill_id: 9, usage_type: 'frequent_interview_topic' }, // DBMS & SQL
    { company_id: 6, skill_id: 4, usage_type: 'frequent_interview_topic' }, // OS

    // Cisco
    { company_id: 7, skill_id: 6, usage_type: 'core_stack' }, // Computer Networks
    { company_id: 7, skill_id: 2, usage_type: 'core_stack' }, // C++
    { company_id: 7, skill_id: 8, usage_type: 'frequent_interview_topic' }, // Linux
    { company_id: 7, skill_id: 4, usage_type: 'frequent_interview_topic' }, // OS

    // Amazon
    { company_id: 8, skill_id: 1, usage_type: 'core_stack' }, // DSA
    { company_id: 8, skill_id: 5, usage_type: 'core_stack' }, // System Design
    { company_id: 8, skill_id: 10, usage_type: 'frequent_interview_topic' }, // Web Dev
    { company_id: 8, skill_id: 9, usage_type: 'frequent_interview_topic' }, // DBMS
  ],
};
