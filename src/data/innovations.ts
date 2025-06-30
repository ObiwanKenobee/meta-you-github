import { Innovation, Challenge } from '../types';

export const innovations: Innovation[] = [
  // Jim Rohn - Personal Development & Philosophy
  {
    id: 'rohn-1',
    title: 'The Five Pillars Life Design',
    description: 'Master the art of designing your life across philosophy, attitude, activity, results, and lifestyle.',
    ageGroups: ['teens', 'young-adults', 'adults', 'middle-age', 'seniors'],
    category: 'philosophical',
    difficulty: 'intermediate',
    mentor: 'Jim Rohn'
  },
  {
    id: 'rohn-2',
    title: 'Seasonal Success Cycles',
    description: 'Learn to plant in spring, tend in summer, harvest in fall, and plan in winter - applied to life goals.',
    ageGroups: ['young-adults', 'adults', 'middle-age', 'seniors'],
    category: 'philosophical',
    difficulty: 'advanced',
    mentor: 'Jim Rohn'
  },

  // Steve Jobs - Innovation & Design Thinking
  {
    id: 'jobs-1',
    title: 'Simplicity Through Subtraction',
    description: 'Master the art of removing the unnecessary to reveal the essential in any project or life area.',
    ageGroups: ['teens', 'young-adults', 'adults', 'middle-age'],
    category: 'creative',
    difficulty: 'intermediate',
    mentor: 'Steve Jobs'
  },
  {
    id: 'jobs-2',
    title: 'Reality Distortion Field',
    description: 'Develop the ability to inspire others to achieve the impossible through vision and conviction.',
    ageGroups: ['young-adults', 'adults', 'middle-age'],
    category: 'entrepreneurial',
    difficulty: 'advanced',
    mentor: 'Steve Jobs'
  },

  // Steve Wozniak - Technical Innovation & Problem Solving
  {
    id: 'woz-1',
    title: 'Elegant Engineering Mindset',
    description: 'Learn to solve complex problems with simple, elegant solutions that anyone can understand.',
    ageGroups: ['children', 'teens', 'young-adults', 'adults'],
    category: 'technical',
    difficulty: 'beginner',
    mentor: 'Steve Wozniak'
  },
  {
    id: 'woz-2',
    title: 'Democratizing Technology',
    description: 'Create innovations that make complex technology accessible to everyone.',
    ageGroups: ['teens', 'young-adults', 'adults', 'middle-age'],
    category: 'technical',
    difficulty: 'advanced',
    mentor: 'Steve Wozniak'
  },

  // Leonardo da Vinci - Renaissance Thinking
  {
    id: 'davinci-1',
    title: 'Curiosità Cultivation',
    description: 'Develop insatiable curiosity and the ability to question everything around you.',
    ageGroups: ['children', 'teens', 'young-adults', 'adults', 'middle-age', 'seniors'],
    category: 'creative',
    difficulty: 'beginner',
    mentor: 'Leonardo da Vinci'
  },
  {
    id: 'davinci-2',
    title: 'Sfumato Mastery',
    description: 'Embrace ambiguity and paradox as sources of creative breakthrough.',
    ageGroups: ['young-adults', 'adults', 'middle-age', 'seniors'],
    category: 'creative',
    difficulty: 'advanced',
    mentor: 'Leonardo da Vinci'
  },

  // Delacroix - Artistic Expression & Emotional Intelligence
  {
    id: 'delacroix-1',
    title: 'Emotional Color Theory',
    description: 'Use color and visual expression to understand and communicate emotions.',
    ageGroups: ['children', 'teens', 'young-adults', 'adults'],
    category: 'creative',
    difficulty: 'intermediate',
    mentor: 'Eugène Delacroix'
  },
  {
    id: 'delacroix-2',
    title: 'Passionate Precision',
    description: 'Balance intense emotion with technical mastery in any creative endeavor.',
    ageGroups: ['teens', 'young-adults', 'adults', 'middle-age'],
    category: 'creative',
    difficulty: 'advanced',
    mentor: 'Eugène Delacroix'
  }
];

export const ageGroupChallenges: Record<string, Challenge[]> = {
  children: [
    {
      id: 'child-1',
      title: 'Young Inventor\'s Workshop',
      description: 'Build simple machines and understand how things work, inspired by da Vinci\'s curiosity.',
      ageGroup: 'children',
      duration: '2 weeks',
      rewards: ['Inventor Badge', 'Digital Sketchbook'],
      skills: ['Curiosity', 'Problem Solving', 'Creativity']
    },
    {
      id: 'child-2',
      title: 'Emotion Artist Challenge',
      description: 'Express feelings through colors and shapes like Delacroix.',
      ageGroup: 'children',
      duration: '1 week',
      rewards: ['Artist Badge', 'Color Palette Tool'],
      skills: ['Emotional Intelligence', 'Artistic Expression']
    }
  ],
  teens: [
    {
      id: 'teen-1',
      title: 'Design Thinking Bootcamp',
      description: 'Learn Jobs\' approach to creating products people love.',
      ageGroup: 'teens',
      duration: '4 weeks',
      rewards: ['Design Thinker Badge', 'Prototype Kit'],
      skills: ['Design Thinking', 'User Empathy', 'Innovation']
    },
    {
      id: 'teen-2',
      title: 'Code for Good Challenge',
      description: 'Build apps that solve real problems, following Wozniak\'s democratization principles.',
      ageGroup: 'teens',
      duration: '6 weeks',
      rewards: ['Tech for Good Badge', 'Mentorship Session'],
      skills: ['Programming', 'Social Impact', 'Problem Solving']
    }
  ],
  'young-adults': [
    {
      id: 'ya-1',
      title: 'Personal Philosophy Framework',
      description: 'Develop your life philosophy using Jim Rohn\'s principles.',
      ageGroup: 'young-adults',
      duration: '8 weeks',
      rewards: ['Philosopher Badge', 'Personal Mission Statement'],
      skills: ['Self-Awareness', 'Goal Setting', 'Values Clarification']
    },
    {
      id: 'ya-2',
      title: 'Renaissance Project',
      description: 'Combine art, science, and technology in one innovative project.',
      ageGroup: 'young-adults',
      duration: '12 weeks',
      rewards: ['Renaissance Badge', 'Innovation Showcase'],
      skills: ['Interdisciplinary Thinking', 'Project Management', 'Innovation']
    }
  ],
  adults: [
    {
      id: 'adult-1',
      title: 'Leadership Through Innovation',
      description: 'Lead teams to breakthrough innovations using principles from all mentors.',
      ageGroup: 'adults',
      duration: '16 weeks',
      rewards: ['Innovation Leader Badge', 'Team Coaching Session'],
      skills: ['Leadership', 'Team Building', 'Strategic Thinking']
    },
    {
      id: 'adult-2',
      title: 'Life Mastery Integration',
      description: 'Integrate all five mentor approaches into a comprehensive life system.',
      ageGroup: 'adults',
      duration: '20 weeks',
      rewards: ['Life Master Badge', 'Personal Board of Advisors'],
      skills: ['Life Design', 'Integration', 'Mastery']
    }
  ],
  'middle-age': [
    {
      id: 'ma-1',
      title: 'Wisdom Synthesis Project',
      description: 'Create something that combines your life experience with new innovations.',
      ageGroup: 'middle-age',
      duration: '24 weeks',
      rewards: ['Wisdom Synthesizer Badge', 'Legacy Project Platform'],
      skills: ['Wisdom Application', 'Mentorship', 'Legacy Building']
    }
  ],
  seniors: [
    {
      id: 'senior-1',
      title: 'Sage Mentor Program',
      description: 'Share your wisdom while learning new technologies and approaches.',
      ageGroup: 'seniors',
      duration: 'Ongoing',
      rewards: ['Sage Badge', 'Intergenerational Impact Award'],
      skills: ['Mentorship', 'Knowledge Transfer', 'Continuous Learning']
    }
  ]
};