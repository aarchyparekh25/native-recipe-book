import jwt from 'jsonwebtoken';
import { Recipe } from '../models/Recipe.js';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const resolvers = {
  Query: {
    health: () => 'OK',
    recipe: async (_, { id }) => {
      const recipe = await Recipe.findById(id).lean();
      if (!recipe) throw new Error('Recipe not found');
      return { ...recipe, id: recipe._id.toString() };
    },
    recipes: async (_, { filter, page = 1, pageSize = 10 }) => {
      const skip = (page - 1) * pageSize;
      let query = {};
      if (filter) {
        const { q, category, minPrepTime, maxPrepTime } = filter;
        if (q) {
          query.$text = { $search: q };
        }
        if (category) {
          query.category = category;
        }
        if (minPrepTime || maxPrepTime) {
          query.prepTimeMins = {};
          if (minPrepTime) query.prepTimeMins.$gte = minPrepTime;
          if (maxPrepTime) query.prepTimeMins.$lte = maxPrepTime;
        }
      }
      const [nodes, total] = await Promise.all([
        Recipe.find(query).skip(skip).limit(pageSize).lean(),
        Recipe.countDocuments(query),
      ]);
      return {
        nodes: nodes.map(node => ({ ...node, id: node._id.toString() })),
        pageInfo: {
          total,
          page,
          pageSize,
          hasNextPage: skip + nodes.length < total,
        },
      };
    },
    categories: async () => {
      return await Recipe.distinct('category');
    },
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const currentUser = await User.findById(user.id).lean();
      if (!currentUser) throw new Error('User not found');
      return { ...currentUser, id: currentUser._id.toString() };
    },
  },
  Mutation: {
    addRecipe: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const recipe = new Recipe({ ...input, createdBy: user.id });
      await recipe.save();
      return { ...recipe.toObject(), id: recipe._id.toString() };
    },
    updateRecipe: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const recipe = await Recipe.findById(id);
      if (!recipe) throw new Error('Recipe not found');
      if (recipe.createdBy.toString() !== user.id) throw new Error('Not authorized');
      Object.assign(recipe, input);
      await recipe.save();
      return { ...recipe.toObject(), id: recipe._id.toString() };
    },
    deleteRecipe: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const recipe = await Recipe.findById(id);
      if (!recipe) throw new Error('Recipe not found');
      if (recipe.createdBy.toString() !== user.id) throw new Error('Not authorized');
      await recipe.deleteOne();
      return true;
    },
    signup: async (_, { input }) => {
      const { email, password } = input;
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('Email already exists');
      const user = new User({ email, password });
      await user.save();
      const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '1d' });
      return { token, user: { ...user.toObject(), id: user._id.toString() } };
    },
    login: async (_, { input }) => {
      const { email, password } = input;
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid email or password');
      const isValid = await user.comparePassword(password);
      if (!isValid) throw new Error('Invalid email or password');
      const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '1d' });
      return { token, user: { ...user.toObject(), id: user._id.toString() } };
    },
  },
  Recipe: {
    createdBy: async (parent) => {
      const user = await User.findById(parent.createdBy).lean();
      if (!user) throw new Error('User not found');
      return { ...user, id: user._id.toString() };
    },
    id: (parent) => parent._id.toString(),
  },
  User: {
    id: (parent) => parent._id.toString(),
  },
};