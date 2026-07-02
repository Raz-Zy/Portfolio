// English messages — the source of truth for all translatable UI text.
// `km.ts` is typed as `typeof en`, so any key added here that is missing there
// is a compile-time error. Keys are grouped by section (= the section id).
//
// What is NOT here (stays in the components as locale-invariant config):
//   icons, colors, images, links, skill/tech proper-noun names, numeric levels.
// Those are merged with these messages by array index at render time.

export const en = {
  nav: {
    logo: 'Portfolio',
    hero: 'Home',
    about: 'About',
    education: 'Education',
    skills: 'Skills',
    design: 'UX/UI Design',
    github: 'GitHub',
    experience: 'Experience',
    contact: 'Contact',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    toggleDarkMode: 'Toggle dark mode',
    toggleLanguage: 'Toggle language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  hero: {
    role: 'Aspiring Developer & Creative Designer',
    tagline:
      "Passionate about creating beautiful, functional digital experiences through code and design. Let's build something amazing together.",
    viewWork: 'View My Work',
    contactMe: 'Contact Me',
    scroll: 'Scroll Down to Explore',
  },

  about: {
    title: 'About Me',
    subtitle:
      'Get to know me better - my journey, passions, and what drives me forward.',
    journeyTitle: 'My Journey',
    journey:
      "I'm a passionate developer and creative designer with a love for crafting beautiful, functional digital experiences. My journey began with curiosity about how things work and evolved into a deep appreciation for clean code and thoughtful design.",
    loveTitle: 'What I Love',
    love:
      "I'm driven by the intersection of technology and creativity. Whether it's building responsive web applications, creating stunning visual designs, or solving complex problems, I find joy in bringing ideas to life.",
    philosophyTitle: 'My Philosophy',
    philosophyQuote:
      '"Great design is not just about making things look good - it\'s about making them work beautifully."',
    philosophy:
      'I believe in continuous learning, attention to detail, and the power of collaboration. Every project is an opportunity to grow and create something meaningful that makes a positive impact.',
  },

  education: {
    title: 'Education',
    subtitle:
      'My academic journey and the foundations that shaped my expertise.',
    // Parallel to the icon config array in Education.tsx (same order).
    items: [
      {
        degree: 'Instructor Position',
        institution: 'Korea Software HRD Center',
        duration: '2025 - Present',
        location: 'Phnom Penh, Cambodia',
        description:
          'Currently serving as an instructor, teaching software development and IT skills to students in the Korea Software HRD Center program.',
      },
      {
        degree: 'Software Development Training',
        institution: 'Korea Software HRD Center',
        duration: '2024 - 2025',
        location: 'Phnom Penh, Cambodia',
        description:
          'Intensive software development training program focusing on modern programming languages, web development, and software engineering practices.',
      },
      {
        degree: 'Bachelor of Information Technology',
        institution: 'Royal University of Phnom Penh',
        duration: '2020 - 2024',
        location: 'Phnom Penh, Cambodia',
        description:
          'Comprehensive IT education covering software development, database management, networking, and computer systems. Gained strong foundation in programming and technology.',
      },
      {
        degree: 'High School Diploma',
        institution: '10 January 1979 High School',
        duration: '2019 - 2020',
        location: 'Siem Reap, Cambodia',
        description:
          'Successfully completed secondary education with focus on science and mathematics, laying the foundation for further studies in technology.',
      },
    ],
  },

  skills: {
    title: 'Skills & Expertise',
    subtitle:
      'A comprehensive overview of my technical abilities and personal strengths.',
    technicalTitle: 'Technical Skills',
    softTitle: 'Soft Skills',
    // Parallel to hardSkillsData in Skills.tsx (category titles only).
    categories: [
      'Programming',
      'DevOps Engineering',
      'Graphic Design',
      'Video Editing',
      'AI Tools',
    ],
    // Parallel to softSkillsData in Skills.tsx.
    soft: [
      { name: 'Flexibility', description: 'Adapting to new challenges' },
      { name: 'Time Management', description: 'Efficient task prioritization' },
      { name: 'Adaptability', description: 'Thriving in changing environments' },
      { name: 'Problem-Solving', description: 'Creative solution finding' },
      { name: 'Communication', description: 'Clear and effective interaction' },
      { name: 'Creativity', description: 'Innovative thinking approach' },
      { name: 'Focus', description: 'Sustained attention to detail' },
      { name: 'Confidence', description: 'Self-assured decision making' },
    ],
  },

  design: {
    title: 'UX/UI Design',
    subtitle:
      'Designing user-centered digital experiences for web applications including employee evaluation systems, deployment platforms, and task management tools',
    processTitle: 'My Design Process',
    projectsTitle: 'Featured Design Projects',
    stepLabel: 'STEP {step}',
    status: {
      completed: 'completed',
      'in-progress': 'in-progress',
      concept: 'concept',
    },
    // Parallel to designProcess in UXUIDesign.tsx.
    process: [
      {
        title: 'Research & Discovery',
        description:
          'Understanding user needs, market research, and competitive analysis',
      },
      {
        title: 'Ideation & Concept',
        description:
          'Brainstorming solutions, user journey mapping, and wireframing',
      },
      {
        title: 'Design & Prototype',
        description:
          'Creating high-fidelity designs, prototypes, and design systems',
      },
      {
        title: 'Test & Iterate',
        description:
          'User testing, feedback collection, and continuous improvement',
      },
      {
        title: 'Deliver & Launch',
        description:
          'Final implementation, handoff to development, and launch analysis',
      },
    ],
    // Parallel to designProjects in UXUIDesign.tsx (title/tools/image/link kept in config).
    projects: [
      {
        type: 'Web Application',
        description:
          'An employee evaluation system to streamline performance assessments with intuitive user experience',
        features: [
          'Performance Evaluation',
          'Employee Dashboard',
          'Progress Tracking',
          'Reporting System',
        ],
      },
      {
        type: 'Web Platform',
        description:
          'A platform for automated deployment processes with focus on developer experience and workflow optimization',
        features: [
          'Automated Deployment',
          'Pipeline Management',
          'Developer Dashboard',
          'Status Monitoring',
        ],
      },
      {
        type: 'Task Management System',
        description:
          'A comprehensive task management system designed for improved productivity and team collaboration',
        features: [
          'Task Organization',
          'Team Collaboration',
          'Progress Visualization',
          'Productivity Analytics',
        ],
      },
    ],
  },

  github: {
    title: 'GitHub Portfolio',
    subtitle: 'Explore my latest projects and contributions on GitHub',
    loading: 'Loading GitHub data...',
    orgLoading: 'Loading organization repositories...',
    repositories: 'Repositories',
    followers: 'Followers',
    organizationsStat: 'Organizations',
    viewProfile: 'View Profile',
    backToOrgs: 'Back to Organizations',
    orgRepositories: '{org} Repositories',
    showingRepos: 'Showing {count} repositories',
    noReposForOrg: 'No repositories found for {org}',
    noReposForOrgDesc:
      'This organization may not have public repositories or you may not have access to them.',
    personal: 'Personal ({count})',
    organizations: 'Organizations ({count})',
    personalWord: 'personal',
    organizationWord: 'organization',
    organizationLabel: 'Organization',
    noDescription: 'No description available',
    clickToView: 'Click to view repositories',
    noFilterRepos: 'No {filter} repositories found',
    noFilterReposDesc: 'Try switching to a different filter or check back later.',
    noOrgs: 'No organizations found',
    noOrgsDesc: "You don't seem to be part of any organizations yet.",
    viewAll: 'View All Repositories',
    private: 'Private',
    personalRepoTitle: 'Personal Repository',
    orgRepoTitle: 'Organization Repository',
  },

  experience: {
    title: 'Experience',
    subtitle: 'My professional journey and the projects that have shaped my career.',
    viewProject: 'View Project',
    technologiesUsed: 'Technologies Used:',
    // Parallel to experienceData in Experience.tsx.
    items: [
      {
        title: 'Computer Teacher',
        company: 'Educational Institution',
        type: 'Full-time',
        duration: 'Aug 2022 - Mar 2025',
        location: 'Cambodia',
        description: [
          'Served as a computer teacher, gaining valuable experience in my first professional role',
          'Developed effective teaching methodologies to help students understand complex concepts',
          'Learned how to explain technical concepts clearly and adapt to different learning styles',
          'Built strong communication skills while managing classroom environments',
          'Mentored students in computer literacy and basic programming concepts',
        ],
        technologies: [
          'Microsoft Office',
          'Windows',
          'Educational Software',
          'Basic Programming',
        ],
      },
      {
        title: 'Computer Repair Technician',
        company: 'Freelance',
        type: 'Contract',
        duration: 'Ongoing',
        location: 'Cambodia',
        description: [
          'Provided technical support and computer repair services to customers',
          'Specialized in Windows setup, configuration, and troubleshooting',
          'Diagnosed and resolved hardware and software issues for desktops and laptops',
          'Delivered excellent customer service while explaining technical problems in simple terms',
          'Gained hands-on experience with various computer hardware and software systems',
        ],
        technologies: [
          'Windows OS',
          'Hardware Troubleshooting',
          'Software Installation',
          'System Diagnostics',
        ],
      },
      {
        title: 'Software Developer',
        company: 'Personal Projects',
        type: 'Project-based',
        duration: '2023 - Present',
        location: 'Cambodia',
        description: [
          'Developed Assessify - An employee evaluation system to streamline performance assessments',
          'Created ZenTrio - A comprehensive task management system for improved productivity',
          'Built PipeJet - A platform for automated deployment processes',
          'Gained experience in full-stack development and project management',
          'Applied modern development practices and technologies in real-world applications',
        ],
        technologies: [
          'React',
          'Node.js',
          'JavaScript',
          'Database Management',
          'Deployment Automation',
        ],
      },
    ],
  },

  contact: {
    title: 'Get In Touch',
    subtitle: "Ready to collaborate or have a question? I'd love to hear from you.",
    connectTitle: "Let's Connect",
    connect:
      "I'm always open to discussing new opportunities, creative ideas, or potential collaborations. Whether you have a project in mind or just want to say hello, feel free to reach out!",
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    locationLabel: 'Location',
    locationValue: 'Phnom Penh, Cambodia',
    followMe: 'Follow Me',
    downloadResume: 'Download Resume',
    sendTitle: 'Send Message',
    sendButton: 'Send Message',
    waitButton: 'Wait {time}',
    rateLimitLabel: 'Rate Limit',
    rateLimitNotice:
      'You can send another message in {time}. This helps prevent spam.',
    nameLabel: 'Your Name',
    namePlaceholder: 'John Doe',
    emailAddressLabel: 'Email Address',
    emailPlaceholder: 'john@example.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell me about your project or just say hello...',
    validation: {
      nameRequired: 'Name is required',
      nameMax: 'Name must be less than 100 characters',
      nameRegex: 'Name can only contain letters and spaces',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email address',
      emailMax: 'Email address is too long',
      messageRequired: 'Message is required',
      messageMin: 'Message must be at least 10 characters',
      messageMax: 'Message must be less than 2000 characters for email compatibility',
    },
    modal: {
      nextMessageIn: 'Next message in: {time}',
      great: 'Great!',
      gotIt: 'Got it',
      rateLimitTitle: 'Rate Limit Reached',
      rateLimitBody:
        'You can only send one message per day to prevent spam. Please wait before sending another message.',
      successTitle: 'Message Sent!',
      successBody:
        "Thank you for your message! Your email client will open to send the message. I'll get back to you as soon as possible.",
    },
  },
}

export type Messages = typeof en
