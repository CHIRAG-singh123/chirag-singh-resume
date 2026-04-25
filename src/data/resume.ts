import rawResumeText from '../resume-text.md?raw'
import type { ResumeData } from '../lib/resume/types'

export const RAW_RESUME_TEXT = rawResumeText

export const resume: ResumeData = {
  personal: {
    name: 'Chirag Singh',
    title: 'AI-Augmented Software Engineer',
    phone: '+91 9723247995',
    email: 'chiragsinghpawar@gmail.com',
    github: 'github.com/CHIRAG-singh123',
    githubUrl: 'https://github.com/CHIRAG-singh123',
    linkedin: 'linkedin.com/in/thechiragsingh',
    linkedinUrl: 'https://www.linkedin.com/in/thechiragsingh',
    location: 'Ahmedabad, Gujarat, India',
  },

  summary:
    "Master's degree in Computer Science and a Bachelor's degree in Information Technology from LJ University. Proficient in Python, Java, JavaScript, and MongoDB, with hands-on experience across Django, the MERN stack, and TensorFlow. Strongly motivated to build scalable full-stack applications, advance AI/ML solutions, and deliver innovation through data-driven systems.",

  skills: [
    {
      label: 'Languages',
      items: ['Python', 'Java', 'JavaScript', 'PHP'],
    },
    {
      label: 'Frameworks',
      items: [
        'Django',
        'MERN (MongoDB, Express.js, React, Node.js)',
        'Angular',
        'Laravel',
        'TensorFlow',
        'Keras',
        'Scikit-learn',
      ],
    },
    {
      label: 'Technologies',
      items: [
        'NLP',
        'Machine Learning',
        'Deep Learning',
        'Computer Vision',
        'GANs',
        'API Integration',
        'Responsive Web Design',
        'Git',
      ],
    },
    {
      label: 'Tools',
      items: ['OpenCV', 'Matplotlib', 'NumPy', 'TQDM', 'ImageIO'],
    },
  ],

  projects: [
    {
      name: 'IGAN-Face-Generation',
      tagline: 'High-Resolution Face Generation',
      bullets: [
        'Developed a custom TensorFlow-based GAN to generate realistic human faces.',
        'Utilized Keras, OpenCV, NumPy, and Matplotlib for image processing and visualization.',
        'Created training progress GIFs and checkpoints, achieving high-resolution outputs over 200 epochs.',
      ],
      stack: ['TensorFlow', 'Keras', 'OpenCV', 'NumPy', 'Matplotlib', 'ImageIO'],
    },
    {
      name: 'Sentiment Analysis',
      tagline: 'ChatGPT Tweets',
      bullets: [
        'Built a system using CatBoost, LightGBM, XGBoost, and CNN, achieving 83%+ accuracy.',
        'Applied CTGAN for data augmentation, K-Means, hierarchical clustering, and PCA with Python, TensorFlow, and NLP tools.',
      ],
      stack: ['Python', 'TensorFlow', 'CatBoost', 'LightGBM', 'XGBoost', 'CNN', 'NLP'],
    },
    {
      name: 'Rhythm Realm',
      tagline: 'Music Streaming Platform',
      bullets: [
        'Developed a MERN stack app with Spotify API, Google OAuth, and JWT authentication.',
        'Implemented playlists, history, and responsive dark/light modes for scalable, secure playback.',
      ],
      stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Spotify API', 'Google OAuth', 'JWT'],
    },
    {
      name: 'Zentro',
      tagline: 'Comprehensive ERP & CRM Solution',
      bullets: [
        'Independently built a full-stack ERP/CRM system with document management, real-time chat, lead/deal tracking, used five APIs collaboratively in Chat-bot and customer analytics.',
        'Automated user data handling for efficient, scalable management.',
      ],
      stack: ['Full-Stack', 'Real-time Chat', 'CRM', 'ERP', 'Chatbot', 'Analytics'],
    },
    {
      name: 'LJ Learning Platform',
      tagline: 'Full-Stack Online Learning Platform',
      bullets: [
        'Collaboratively engineered a full-stack online learning platform.',
        'Built interactive course modules with real-time collaboration, progress tracking, and secure document sharing for seamless user engagement.',
        'Integrated five APIs into a chatbot and analytics engine for personalized recommendations, instant feedback, and data-driven insights.',
        'Automated scalable user onboarding and data workflows, supporting high concurrency while ensuring privacy and efficiency.',
      ],
      stack: ['Full-Stack', 'Real-time Collaboration', 'Analytics', 'Chatbot'],
    },
    {
      name: 'Admission Bot',
      tagline: 'LJ University',
      bullets: [
        'Created a Tkinter-based AI chatbot with 75%+ FAQ accuracy using NLTK, TF-IDF, and FuzzyWuzzy.',
        'Integrated multilingual support (Google Translate) and summarization (TextBlob), with BERT compatibility.',
      ],
      stack: ['Python', 'Tkinter', 'NLTK', 'TF-IDF', 'FuzzyWuzzy', 'Google Translate', 'TextBlob', 'BERT'],
    },
    {
      name: 'CustomerSync',
      tagline: 'Full-Stack CRM Solution',
      bullets: [
        'Built with Angular, Node.js/Express, and MongoDB, featuring responsive UI and secure APIs.',
        'Automated user data handling for efficient, scalable management.',
      ],
      stack: ['Angular', 'Node.js', 'Express', 'MongoDB'],
    },
  ],

  experience: [
    {
      title: 'AI-Enabled Digital Twin Platform for Telecom Infrastructure',
      company: 'BIMBOSS CONSULTANTS',
      period: '12 Jan 2026 – 21 Apr 2026 (Internship)',
      bullets: [
        'Developed a scalable AI-enabled digital twin platform for telecom towers, enabling real-time 3D visualization, centralized asset management, and lifecycle tracking.',
        'Built a high-performance full-stack system with React, TypeScript, and Cesium, integrating Supabase, AWS S3 and OneDrive for secure file handling and multi-format model support.',
        'Implemented dynamic site management, bulk operations, and a responsive UI, delivering a production-ready, cloud-deployed solution with improved efficiency and reduced manual effort.',
      ],
    },
  ],

  achievements: [
    'Generated high-resolution faces using a custom IGAN with TensorFlow, showcasing deep learning and computer vision expertise.',
    'Achieved 83%+ accuracy in sentiment analysis for ChatGPT tweets using GAN, CNN, and CatBoost.',
    'Developed an AI-powered chatbot for LJ University with >75% FAQ accuracy and multilingual support.',
    'Built a scalable MERN-based music streaming platform with Spotify API integration.',
    'Presented a poster at an international conference, earning certificates.',
  ],

  certificates: [
    {
      title: 'Full-Stack Web Development (MERN Stack)',
      description: 'Mastered MongoDB, Express.js, React, and Node.js.',
    },
    {
      title: 'Machine Learning with Python',
      description: 'Built models using TensorFlow and Scikit-learn.',
    },
    {
      title: 'Cyber Security Fundamentals',
      description: 'Google Certification.',
    },
  ],

  certificatesExtra:
    'For more certificates visit my Coursera Account: https://www.coursera.org/learner/chiragsingh',

  education: [
    {
      degree: 'Master of Science in Information Technology',
      school: 'L.J University',
      period: '06/2024 – 07/2026',
      location: 'Ahmedabad, Gujarat',
    },
    {
      degree: 'Bachelor of Science in Information Technology',
      school: 'L.J University',
      period: '06/2021 – 07/2023',
      location: 'Ahmedabad, Gujarat',
    },
  ],
}

export const CONTACT_LINKS = {
  phoneHref: `tel:${resume.personal.phone.replace(/\s+/g, '')}`,
  emailHref: `mailto:${resume.personal.email}`,
  githubHref: resume.personal.githubUrl,
  linkedinHref: resume.personal.linkedinUrl,
  resumeHref: '/CHIRAG_SINGH_FINAL.pdf',
  profileImage: '/Image/Profile.png',
  courseraHref: 'https://www.coursera.org/learner/chiragsingh',
}
