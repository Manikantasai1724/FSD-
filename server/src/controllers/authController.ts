import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken, AuthRequest } from '../middleware/auth';

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, skillsTeach, skillsLearn, bio, location } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      skillsTeach: skillsTeach || [],
      skillsLearn: skillsLearn || [],
      bio: bio || '',
      location: location || '',
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toDateString(),
      streak: 1,
      reputation: 0,
      exchanges: 0,
      badges: [],
      category: skillsTeach?.[0] ? 'Technology' : 'Other',
      level: 'Beginner',
    });

    const token = generateToken({ userId: user._id.toString(), email: user.email });

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    res.status(201).json({
      success: true,
      token,
      user: { ...userWithoutPassword, id: user._id.toString() },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Update streak logic
    const today = new Date().toDateString();
    const lastLogin = user.lastLogin;
    if (lastLogin !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastLogin === yesterday) {
        user.streak = (user.streak || 0) + 1;
      } else if (!lastLogin) {
        user.streak = 1;
      } else {
        user.streak = 1;
      }
      user.lastLogin = today;
      await user.save();
    }

    const token = generateToken({ userId: user._id.toString(), email: user.email });

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    res.json({
      success: true,
      token,
      user: { ...userWithoutPassword, id: user._id.toString() },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ ...user.toObject(), id: user._id.toString() });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}
