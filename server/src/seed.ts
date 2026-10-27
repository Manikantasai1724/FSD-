import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db';
import User from './models/User';
import ExchangeRequest from './models/ExchangeRequest';
import Challenge from './models/Challenge';
import Discussion from './models/Discussion';
import bcrypt from 'bcryptjs';

const SEED_USERS = [
  {
    name: 'Alex Chen', email: 'alex@example.com', password: 'pass123',
    bio: 'Full-stack developer and UI/UX enthusiast. Passionate about teaching Python and learning design.',
    skillsTeach: ['Python', 'React', 'Data Analysis', 'Machine Learning'],
    skillsLearn: ['UI/UX Design', 'Graphic Design', 'Photography'],
    reputation: 4.8, streak: 12, exchanges: 8, badges: ['first_exchange', 'teacher', 'streak_7'],
    joinDate: '2024-01-15', location: 'San Francisco, CA', category: 'Technology', level: 'Advanced'
  },
  {
    name: 'Priya Sharma', email: 'priya@example.com', password: 'pass123',
    bio: 'UX Designer at a startup. Love helping others with design thinking and visual storytelling.',
    skillsTeach: ['UI/UX Design', 'Figma', 'Graphic Design', 'Brand Identity'],
    skillsLearn: ['Python', 'JavaScript', 'Data Analysis'],
    reputation: 4.9, streak: 21, exchanges: 15, badges: ['first_exchange', 'teacher', 'learner', 'top_rated'],
    joinDate: '2024-02-08', location: 'New York, NY', category: 'Design', level: 'Expert'
  },
  {
    name: 'Marcus Johnson', email: 'marcus@example.com', password: 'pass123',
    bio: 'Guitarist and music producer. Also passionate about web development and language learning.',
    skillsTeach: ['Guitar', 'Music Theory', 'Audio Production'],
    skillsLearn: ['React', 'Node.js', 'Spanish'],
    reputation: 4.5, streak: 5, exchanges: 4, badges: ['first_exchange'],
    joinDate: '2024-03-20', location: 'Austin, TX', category: 'Music', level: 'Intermediate'
  },
  {
    name: 'Sofia Rodriguez', email: 'sofia@example.com', password: 'pass123',
    bio: 'Spanish language teacher and passionate photographer. Helping the world connect through language.',
    skillsTeach: ['Spanish', 'French', 'Photography', 'Portrait Photography'],
    skillsLearn: ['Guitar', 'Cooking', 'Fitness Training'],
    reputation: 4.7, streak: 9, exchanges: 11, badges: ['first_exchange', 'teacher', 'connector'],
    joinDate: '2024-01-28', location: 'Miami, FL', category: 'Language', level: 'Expert'
  },
  {
    name: 'James Park', email: 'james@example.com', password: 'pass123',
    bio: 'Fitness coach and nutrition expert. Let me help you transform your health!',
    skillsTeach: ['Fitness Training', 'Nutrition', 'Yoga', 'Meditation'],
    skillsLearn: ['Photography', 'Video Editing', 'Social Media Marketing'],
    reputation: 4.6, streak: 30, exchanges: 20, badges: ['first_exchange', 'teacher', 'learner', 'streak_7', 'mentor'],
    joinDate: '2023-12-05', location: 'Chicago, IL', category: 'Fitness', level: 'Expert'
  },
  {
    name: 'Aisha Patel', email: 'aisha@example.com', password: 'pass123',
    bio: 'Marketing strategist who loves creative writing. Building brands, one story at a time.',
    skillsTeach: ['Content Marketing', 'SEO', 'Creative Writing', 'Social Media'],
    skillsLearn: ['UI/UX Design', 'Brand Identity', 'Video Production'],
    reputation: 4.4, streak: 7, exchanges: 6, badges: ['first_exchange', 'streak_7'],
    joinDate: '2024-04-10', location: 'Boston, MA', category: 'Marketing', level: 'Intermediate'
  },
  {
    name: 'David Kim', email: 'david@example.com', password: 'pass123',
    bio: 'Chef turned cooking educator. Professional culinary skills made accessible for everyone.',
    skillsTeach: ['Cooking', 'Baking', 'Meal Prep', 'Korean Cuisine'],
    skillsLearn: ['Business Strategy', 'Finance', 'Marketing'],
    reputation: 4.9, streak: 14, exchanges: 17, badges: ['first_exchange', 'teacher', 'top_rated', 'mentor'],
    joinDate: '2024-02-14', location: 'Seattle, WA', category: 'Cooking', level: 'Expert'
  },
  {
    name: 'Emma Wilson', email: 'emma@example.com', password: 'pass123',
    bio: 'Finance professional and artist. Balancing numbers and creativity every day.',
    skillsTeach: ['Personal Finance', 'Investing', 'Oil Painting', 'Watercolor'],
    skillsLearn: ['Cooking', 'Yoga', 'Meditation'],
    reputation: 4.3, streak: 3, exchanges: 3, badges: ['first_exchange'],
    joinDate: '2024-05-01', location: 'Denver, CO', category: 'Finance', level: 'Intermediate'
  }
];

const SEED_CHALLENGES = [
  {
    title: 'Build a Mini Website', category: 'Technology',
    description: 'Create a fully responsive landing page for a fictional product. Include hero section, features, and contact form.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 47, prize: '🏆 Featured on platform + 50 reputation points',
    difficulty: 'Intermediate', tags: ['HTML', 'CSS', 'JavaScript'],
    submissions: 23, votes: 156
  },
  {
    title: 'Design a Brand Logo', category: 'Design',
    description: 'Create a modern logo for "GreenLeaf" — an eco-friendly sustainable products company.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 34, prize: '🎨 Designer Badge + 40 reputation points',
    difficulty: 'Beginner', tags: ['Figma', 'Illustrator', 'Branding'],
    submissions: 18, votes: 89
  },
  {
    title: '30-Day Fitness Challenge', category: 'Fitness',
    description: 'Complete a 30-day workout program. Document your journey and share progress photos.',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 89, prize: '💪 Fitness Champion Badge + 60 reputation points',
    difficulty: 'All Levels', tags: ['Fitness', 'Wellness', 'Consistency'],
    submissions: 45, votes: 234
  },
  {
    title: 'Cook a Traditional Dish', category: 'Cooking',
    description: 'Cook an authentic dish from a culture different from your own and share the recipe and story.',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 62, prize: '👨‍🍳 Culinary Explorer Badge + 35 reputation points',
    difficulty: 'Beginner', tags: ['Cooking', 'Culture', 'Recipe'],
    submissions: 31, votes: 178
  }
];

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await ExchangeRequest.deleteMany({});
    await Challenge.deleteMany({});
    await Discussion.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Hash passwords and create users
    const hashedPassword = await bcrypt.hash('pass123', 12);
    const createdUsers = await User.insertMany(
      SEED_USERS.map((u) => ({ ...u, password: hashedPassword, lastLogin: new Date().toDateString() }))
    );

    console.log(`👥 Created ${createdUsers.length} users`);

    // Create seed requests using actual user IDs
    const userIdMap = createdUsers.reduce((map, user) => {
      map[user.email] = user._id.toString();
      return map;
    }, {} as Record<string, string>);

    const seedRequests = [
      {
        fromUserId: userIdMap['priya@example.com'],
        toUserId: userIdMap['alex@example.com'],
        skillRequested: 'Python', skillOffered: 'UI/UX Design',
        status: 'incoming' as const,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Hi! I noticed you teach Python. I can offer UX design sessions in return. Would love to connect!'
      },
      {
        fromUserId: userIdMap['sofia@example.com'],
        toUserId: userIdMap['alex@example.com'],
        skillRequested: 'React', skillOffered: 'Spanish',
        status: 'incoming' as const,
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        message: "Hola! I'd love to exchange Spanish lessons for help with React. 1:1 sessions, flexible schedule."
      },
      {
        fromUserId: userIdMap['alex@example.com'],
        toUserId: userIdMap['marcus@example.com'],
        skillRequested: 'Guitar', skillOffered: 'Python',
        status: 'sent' as const,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        message: "I've been wanting to learn guitar for years. I can teach Python in exchange!"
      },
      {
        fromUserId: userIdMap['james@example.com'],
        toUserId: userIdMap['alex@example.com'],
        skillRequested: 'Photography', skillOffered: 'Fitness Training',
        status: 'accepted' as const,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Would love to learn photography! Can offer personal training in return.'
      }
    ];

    await ExchangeRequest.insertMany(seedRequests);
    console.log(`📨 Created ${seedRequests.length} exchange requests`);

    // Create challenges
    await Challenge.insertMany(SEED_CHALLENGES);
    console.log(`🏆 Created ${SEED_CHALLENGES.length} challenges`);

    // Create discussions using actual user IDs
    const seedDiscussions = [
      {
        authorId: userIdMap['alex@example.com'], authorName: 'Alex Chen',
        title: 'Best resources for learning React in 2024?',
        content: 'Looking for recommendations on learning React. What courses or projects worked best for you?',
        votes: 24, comments: 12, date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), category: 'Technology'
      },
      {
        authorId: userIdMap['priya@example.com'], authorName: 'Priya Sharma',
        title: 'Tips for making portfolio projects stand out',
        content: "After reviewing many portfolios, I've noticed what makes some stand out. Sharing my thoughts here.",
        votes: 45, comments: 19, date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), category: 'Design'
      },
      {
        authorId: userIdMap['sofia@example.com'], authorName: 'Sofia Rodriguez',
        title: 'Language exchange tips — what works best?',
        content: "I've been doing language exchanges for 3 years. Here are my top strategies for making it effective.",
        votes: 31, comments: 8, date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), category: 'Language'
      },
      {
        authorId: userIdMap['david@example.com'], authorName: 'David Kim',
        title: 'How to teach cooking online effectively',
        content: 'Sharing my experience setting up virtual cooking classes that actually work.',
        votes: 18, comments: 6, date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), category: 'Cooking'
      }
    ];

    await Discussion.insertMany(seedDiscussions);
    console.log(`💬 Created ${seedDiscussions.length} discussions`);

    console.log('\n✅ Database seeded successfully!');
    console.log('📧 Demo login: alex@example.com / pass123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
