import 'dotenv/config';
import prisma from '../src/config/prisma.js';
import fs from 'fs';
import path from 'path';

const hardcodedData = {
  users: [
    { user_id: 1, name: 'Vatsal Shah', email: 'vatsal.shah@vjti.ac.in', auth_provider: 'local', auth_provider_id: 'seed|1' },
    { user_id: 2, name: 'Aditya Kulkarni', email: 'aditya.k@alumni.vjti.ac.in', auth_provider: 'local', auth_provider_id: 'seed|2' },
    { user_id: 3, name: 'Sneha Verma', email: 'sneha.v@iitb.ac.in', auth_provider: 'local', auth_provider_id: 'seed|3' },
    { user_id: 4, name: 'Rohan Sharma', email: 'rohan.s@pilani.bits-pilani.ac.in', auth_provider: 'local', auth_provider_id: 'seed|4' },
    { user_id: 5, name: 'Pooja Reddy', email: 'pooja.r@iiit.ac.in', auth_provider: 'local', auth_provider_id: 'seed|5' },
    { user_id: 6, name: 'Kavya Nair', email: 'kavya.n@nitt.edu', auth_provider: 'local', auth_provider_id: 'seed|6' },
    { user_id: 7, name: 'Aarav Mehta', email: 'aarav.m@dtu.ac.in', auth_provider: 'local', auth_provider_id: 'seed|7' },
  ],
  companies: [
    { company_id: 1, name: 'Qualcomm' },
    { company_id: 2, name: 'Microsoft' },
    { company_id: 3, name: 'Google' },
    { company_id: 4, name: 'Uber' },
    { company_id: 5, name: 'Nvidia' },
    { company_id: 6, name: 'Goldman Sachs' },
    { company_id: 7, name: 'Cisco' },
    { company_id: 8, name: 'Amazon' },
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
    { topic_id: 1, skill_id: 1, topic_name: 'Graphs & BFS/DFS' },
    { topic_id: 2, skill_id: 1, topic_name: 'Dynamic Programming' },
    { topic_id: 3, skill_id: 1, topic_name: 'Binary Trees & BST' },
    { topic_id: 4, skill_id: 1, topic_name: 'Arrays & Two Pointers' },
    { topic_id: 5, skill_id: 2, topic_name: 'Pointers & Memory Allocation' },
    { topic_id: 6, skill_id: 2, topic_name: 'STL Containers & Iterators' },
    { topic_id: 7, skill_id: 2, topic_name: 'OOP & Polymorphism in C++' },
    { topic_id: 8, skill_id: 3, topic_name: 'RTOS & Task Scheduling' },
    { topic_id: 9, skill_id: 3, topic_name: 'Microcontrollers, UART & I2C' },
    { topic_id: 10, skill_id: 3, topic_name: 'Interrupts & ISR Handling' },
    { topic_id: 11, skill_id: 4, topic_name: 'Process Synchronization & Mutexes' },
    { topic_id: 12, skill_id: 4, topic_name: 'Virtual Memory, Paging & TLB' },
    { topic_id: 13, skill_id: 5, topic_name: 'Rate Limiting & Caching (Redis)' },
    { topic_id: 14, skill_id: 5, topic_name: 'High-Level Scalable Architecture' },
    { topic_id: 15, skill_id: 6, topic_name: 'TCP 3-Way Handshake & Congestion' },
    { topic_id: 16, skill_id: 8, topic_name: 'Kernel Space vs User Space' },
    { topic_id: 17, skill_id: 9, topic_name: 'Indexing, B+ Trees & ACID Properties' },
    { topic_id: 18, skill_id: 10, topic_name: 'Behavioral & Scenario-Based Questions' },
  ],
  experiences: [
    {
      experience_id: 1,
      user_id: 2,
      company_id: 1,
      role_title: 'Embedded Systems Intern',
      experience_type: 'internship',
      year: 2025,
      result: 'selected',
      overall_difficulty: 4,
      ctc_or_stipend: '₹75,000 / month',
      summary_text: 'The interview focused heavily on C language internals, bitwise manipulation, RTOS concepts, and real-time ISR constraints. Interviewers were supportive but dug very deep into memory layouts, volatile keyword mechanics, and pointer arithmetic.',
      is_anonymous_public: true,
      status: 'verified',
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
      ctc_or_stipend: '₹75,000 / month',
      summary_text: 'Had an Online Assessment consisting of 30 MCQs on C/C++ & OS, followed by 2 technical rounds. They asked me to implement a circular buffer from scratch and debug a deadlock scenario in a multithreaded sensor driver.',
      is_anonymous_public: true,
      status: 'verified',
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
      ctc_or_stipend: '₹28 LPA',
      summary_text: 'Qualcomm full-time SDE drives test standard DSA (Trees, Graphs) in Round 1, followed by Low-Level C++ design, Multithreading & Memory Management in Round 2, and System Architecture + Behavioral in Round 3.',
      is_anonymous_public: true,
      status: 'verified',
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
      ctc_or_stipend: '₹45 LPA (CTC)',
      summary_text: 'Microsoft placement process was very structured. OA had 3 medium problems on Codility. Three rounds of interviews: 1st DSA (DP on Trees), 2nd Low-Level Design of a Document Editor, and 3rd Director round evaluating cultural fit and high-level thinking.',
      is_anonymous_public: true,
      status: 'verified',
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
      ctc_or_stipend: '₹55 LPA (CTC)',
      summary_text: 'Classic Google interview bar. Every round had 1-2 complex algorithmic problems where time and space complexities had to be optimized to the absolute mathematical limit. Communication and edge-case handling were strictly evaluated.',
      is_anonymous_public: true,
      status: 'verified',
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
      ctc_or_stipend: '₹48 LPA (CTC)',
      summary_text: 'Uber focused intensely on clean code, edge case testing, and distributed concurrency. One round was pure Machine Coding where I had to write a working in-memory ride matching engine with driver geolocation simulation.',
      is_anonymous_public: true,
      status: 'verified',
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
      ctc_or_stipend: '₹75,000 / month',
      summary_text: 'Cleared the OA with a strong score, but the technical round emphasized pointer-heavy C debugging and low-level memory behavior, where the final round did not meet the expected standard.',
      is_anonymous_public: false,
      status: 'draft',
    }
  ],
  rounds: [
    { round_id: 1, experience_id: 1, topic_id: 5, round_number: 1, round_type: 'OA', duration_minutes: 90, description_text: 'Aptitude, C Language basics, Bitwise operations, OS Paging & Cache concepts, and 2 coding questions on string parsing and bit reversal.', difficulty_rating: 3, platform_used: 'HackerEarth', notes: 'Time management is key.' },
    { round_id: 2, experience_id: 1, topic_id: 8, round_number: 2, round_type: 'Tech', duration_minutes: 60, description_text: 'Deep dive into C pointers, function pointers, memory layout (stack, heap, text, bss), and implementing a custom malloc free block tracker.', difficulty_rating: 4, platform_used: 'Microsoft Teams & CollabEdit', notes: 'Interviewer wrote tricky C code snippets.' },
    { round_id: 3, experience_id: 1, topic_id: 18, round_number: 3, round_type: 'HR', duration_minutes: 30, description_text: 'Discussion on past hardware/embedded college projects, handling project deadlines, team collaboration, and interest in modem/DSP firmware.', difficulty_rating: 2, platform_used: 'Microsoft Teams', notes: 'Friendly conversation.' },
    { round_id: 4, experience_id: 2, topic_id: 8, round_number: 1, round_type: 'OA', duration_minutes: 90, description_text: 'Online test with 25 technical MCQs covering Computer Architecture, Cache replacement policies, C structures and 2 coding tasks.', difficulty_rating: 3, platform_used: 'HackerEarth', notes: 'MCQs had negative marking.' },
    { round_id: 5, experience_id: 2, topic_id: 10, round_number: 2, round_type: 'Tech', duration_minutes: 75, description_text: 'Implement a thread-safe circular buffer (Ring Buffer) for UART packet ingestion. Discussed priority inversion and mutex vs semaphore in RTOS.', difficulty_rating: 5, platform_used: 'Google Meet + CoderPad', notes: 'Make sure you understand atomic operations.' },
    { round_id: 6, experience_id: 4, topic_id: 2, round_number: 1, round_type: 'OA', duration_minutes: 70, description_text: '3 coding questions on Codility testing string manipulation, greedy choice, and a dynamic programming problem on grid paths.', difficulty_rating: 3, platform_used: 'Codility', notes: 'All edge cases must pass.' },
    { round_id: 7, experience_id: 4, topic_id: 1, round_number: 2, round_type: 'Tech', duration_minutes: 60, description_text: 'Graph problem involving shortest path in a weighted grid with obstacles, followed by Trie prefix search optimization.', difficulty_rating: 4, platform_used: 'Microsoft Teams', notes: 'Wrote clean modular code.' },
    { round_id: 8, experience_id: 4, topic_id: 14, round_number: 3, round_type: 'SysDesign', duration_minutes: 60, description_text: 'Low-level design of an in-memory collaborative document editor with undo/redo operations using Command Pattern and OT/CRDT discussion.', difficulty_rating: 4, platform_used: 'Microsoft Teams Whiteboard', notes: 'Drew clean UML class diagrams.' },
    { round_id: 9, experience_id: 4, topic_id: 18, round_number: 4, round_type: 'HR', duration_minutes: 45, description_text: 'Partner Director round: Behavioral questions, discussion on learning from technical failures, and alignment with Microsoft growth mindset.', difficulty_rating: 3, platform_used: 'Microsoft Teams', notes: 'Used STAR method.' },
    { round_id: 10, experience_id: 5, topic_id: 1, round_number: 1, round_type: 'Tech', duration_minutes: 45, description_text: 'Hard graph traversal question with state tracking using Bitmask Dynamic Programming on DAG.', difficulty_rating: 5, platform_used: 'Google Meet + Google Docs', notes: 'Strict 45 minute limit.' },
    { round_id: 11, experience_id: 5, topic_id: 2, round_number: 2, round_type: 'Tech', duration_minutes: 45, description_text: 'Interval scheduling with resource constraints and prefix-sum segment tree optimization.', difficulty_rating: 5, platform_used: 'Google Meet + Google Docs', notes: 'Dry ran with 3 different edge cases.' },
  ],
  questions: [
    { question_id: 1, round_id: 1, topic_id: 5, question_text: 'Given an unsigned 32-bit integer, reverse the order of bits in O(1) time using bitwise operations and lookup tables.', question_type: 'coding', difficulty: 3, reference_link: 'https://leetcode.com/problems/reverse-bits/' },
    { question_id: 2, round_id: 1, topic_id: 5, question_text: 'Explain what happens when an array pointer is cast to a void pointer and dereferenced in C. What is type punning?', question_type: 'theory', difficulty: 3, reference_link: '' },
    { question_id: 3, round_id: 2, topic_id: 8, question_text: 'Implement a lockless Single-Producer Single-Consumer (SPSC) Circular Queue using volatile pointers and memory barriers.', question_type: 'coding', difficulty: 5, reference_link: '' },
    { question_id: 4, round_id: 2, topic_id: 11, question_text: 'What is priority inversion in RTOS? How does Priority Inheritance Protocol resolve deadlock and unbounded latency?', question_type: 'theory', difficulty: 4, reference_link: 'https://en.wikipedia.org/wiki/Priority_inversion' },
    { question_id: 5, round_id: 2, topic_id: 5, question_text: 'You have a 32-bit micro-controller with 64KB RAM. Design a memory-efficient bitmap allocator for 128 fixed 512-byte packet buffers.', question_type: 'puzzle', difficulty: 4, reference_link: '' },
    { question_id: 6, round_id: 5, topic_id: 10, question_text: 'Write a C interrupt service routine (ISR) for a GPIO button debouncer without calling blocking sleep/delay functions.', question_type: 'coding', difficulty: 4, reference_link: '' },
    { question_id: 7, round_id: 7, topic_id: 1, question_text: 'Given a network of microservices with latency weights, find the minimum critical path latency avoiding cyclic dependencies.', question_type: 'coding', difficulty: 4, reference_link: 'https://leetcode.com/problems/course-schedule-ii/' },
    { question_id: 8, round_id: 7, topic_id: 3, question_text: 'Serialize and Deserialize a Binary Tree with full recovery in O(N) time and linear space.', question_type: 'coding', difficulty: 3, reference_link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
    { question_id: 9, round_id: 8, topic_id: 14, question_text: 'Design a scalable Pastebin service capable of handling 10,000 writes/sec with 24-hour TTL and URL shortening.', question_type: 'theory', difficulty: 4, reference_link: '' },
    { question_id: 10, round_id: 10, topic_id: 1, question_text: 'Find the minimum cost to traverse all nodes in an undirected graph with non-uniform edge re-weighting rules.', question_type: 'coding', difficulty: 5, reference_link: 'https://leetcode.com/problems/shortest-path-visiting-all-nodes/' },
    { question_id: 11, round_id: 11, topic_id: 2, question_text: 'Given N continuous event intervals, determine the maximum concurrent overlap and construct optimal schedule.', question_type: 'coding', difficulty: 5, reference_link: 'https://leetcode.com/problems/my-calendar-three/' },
  ],
  resources: [
    { resource_id: 1, experience_id: 1, title: 'FreeRTOS Architecture & Kernel Concepts Guide', url: 'https://www.freertos.org/Documentation/RTOS_book.html' },
    { resource_id: 2, experience_id: 1, title: 'Bit Twiddling Hacks — Stanford Graphics', url: 'http://graphics.stanford.edu/~seander/bithacks.html' },
    { resource_id: 3, experience_id: 4, title: 'Design Patterns: Elements of Reusable Object-Oriented Software', url: 'https://refactoring.guru/design-patterns' },
    { resource_id: 4, experience_id: 5, title: 'Algorithms 4th Edition by Sedgewick & Wayne', url: 'https://algs4.cs.princeton.edu/home/' },
    { resource_id: 5, experience_id: 2, title: 'Embedded C Coding Standard (Barr Group)', url: 'https://barrgroup.com/embedded-systems/books/embedded-c-coding-standard' },
  ]
};

async function seed() {
  console.log("Starting seed process...");

  // 1. Users
  const userMap = {};
  for (const u of hardcodedData.users) {
    let user = await prisma.users.findUnique({ where: { email: u.email } });
    if (!user) {
      user = await prisma.users.create({
        data: {
          name: u.name,
          email: u.email,
          auth_provider: u.auth_provider,
          auth_provider_id: u.auth_provider_id
        }
      });
    }
    userMap[u.user_id] = user.user_id;
  }

  // 2. Companies
  const companyMap = {};
  for (const c of hardcodedData.companies) {
    let comp = await prisma.companies.findFirst({ where: { name: { equals: c.name, mode: 'insensitive' } } });
    if (!comp) {
      comp = await prisma.companies.create({ data: { name: c.name } });
    }
    companyMap[c.company_id] = comp.company_id;
  }

  // 3. Skills
  const skillMap = {};
  for (const s of hardcodedData.skills) {
    let skill = await prisma.skills.findFirst({ where: { skill_name: { equals: s.skill_name, mode: 'insensitive' } } });
    if (!skill) {
      skill = await prisma.skills.create({ data: { skill_name: s.skill_name } });
    }
    skillMap[s.skill_id] = skill.skill_id;
  }

  // 4. Topics
  const topicMap = {};
  for (const t of hardcodedData.topics) {
    let topic = await prisma.topics.findFirst({ where: { topic_name: { equals: t.topic_name, mode: 'insensitive' } } });
    if (!topic) {
      topic = await prisma.topics.create({ 
        data: { 
          topic_name: t.topic_name,
          skill_id: t.skill_id ? skillMap[t.skill_id] : null 
        } 
      });
    }
    topicMap[t.topic_id] = topic.topic_id;
  }

  // 5. Experiences
  const expMap = {};
  for (const e of hardcodedData.experiences) {
    // Check if it exists (we use role_title and year to guess)
    let exp = await prisma.interview_experiences.findFirst({
      where: {
        user_id: userMap[e.user_id],
        company_id: companyMap[e.company_id],
        role_title: e.role_title,
        year: e.year
      }
    });

    if (!exp) {
      exp = await prisma.interview_experiences.create({
        data: {
          user_id: userMap[e.user_id],
          company_id: companyMap[e.company_id],
          role_title: e.role_title,
          experience_type: e.experience_type,
          year: e.year,
          result: e.result,
          overall_difficulty: e.overall_difficulty,
          ctc_or_stipend: e.ctc_or_stipend,
          summary_text: e.summary_text,
          is_anonymous_public: e.is_anonymous_public,
          status: e.status
        }
      });
      console.log(`Created experience: ${e.role_title} at Company ID ${e.company_id}`);
    }
    expMap[e.experience_id] = exp.experience_id;
  }

  // 6. Rounds and Topics
  const roundMap = {};
  for (const r of hardcodedData.rounds) {
    if (!expMap[r.experience_id]) continue;
    
    let round = await prisma.rounds.findFirst({
      where: {
        experience_id: expMap[r.experience_id],
        round_number: r.round_number
      }
    });

    if (!round) {
      round = await prisma.rounds.create({
        data: {
          experience_id: expMap[r.experience_id],
          round_number: r.round_number,
          round_type: r.round_type,
          duration_minutes: r.duration_minutes,
          description_text: r.description_text,
          platform_used: r.platform_used,
          difficulty: r.difficulty_rating,
          notes: r.notes
        }
      });

      if (r.topic_id && topicMap[r.topic_id]) {
        await prisma.round_topics.create({
          data: {
            round_id: round.round_id,
            topic_id: topicMap[r.topic_id]
          }
        });
      }
    }
    roundMap[r.round_id] = round.round_id;
  }

  // 7. Questions and Topics
  for (const q of hardcodedData.questions) {
    if (!roundMap[q.round_id]) continue;

    let question = await prisma.questions.findFirst({
      where: {
        round_id: roundMap[q.round_id],
        question_text: q.question_text
      }
    });

    if (!question) {
      question = await prisma.questions.create({
        data: {
          round_id: roundMap[q.round_id],
          question_text: q.question_text,
          question_type: q.question_type,
          difficulty: q.difficulty,
          reference_link: q.reference_link
        }
      });

      if (q.topic_id && topicMap[q.topic_id]) {
        await prisma.question_topics.create({
          data: {
            question_id: question.question_id,
            topic_id: topicMap[q.topic_id]
          }
        });
      }
    }
  }

  // 8. Resources
  for (const r of hardcodedData.resources) {
    if (!expMap[r.experience_id]) continue;

    let res = await prisma.resources.findFirst({
      where: {
        experience_id: expMap[r.experience_id],
        title: r.title
      }
    });

    if (!res) {
      await prisma.resources.create({
        data: {
          experience_id: expMap[r.experience_id],
          title: r.title,
          content: r.url
        }
      });
    }
  }

  console.log("Seeding complete!");
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
