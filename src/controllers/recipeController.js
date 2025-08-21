import { GraphQLError } from 'graphql';
import { Recipe } from '../models/Recipe.js';

export const recipeController = {
  health: () => 'ok',

  async getRecipe(_, { id }) {
    return Recipe.findById(id);
  },

  async getRecipes(_, { filter = {}, page = 1, pageSize = 10 }) {
    const where = {};

    if (filter.category) where.category = filter.category;
    if (filter.minPrepTime != null || filter.maxPrepTime != null) {
      where.prepTimeMins = {};
      if (filter.minPrepTime != null) where.prepTimeMins.$gte = filter.minPrepTime;
      if (filter.maxPrepTime != null) where.prepTimeMins.$lte = filter.maxPrepTime;
    }

    let query = Recipe.find(where);
    if (filter.q?.trim()) {
      query = Recipe.find({ ...where, $text: { $search: filter.q.trim() } });
    }

    const skip = (page - 1) * pageSize;
    const [nodes, total] = await Promise.all([
      query.sort({ createdAt: -1 }).skip(skip).limit(pageSize).exec(),
      Recipe.countDocuments(filter.q ? { ...where, $text: { $search: filter.q.trim() } } : where)
    ]);

    return {
      nodes,
      pageInfo: {
        total,
        page,
        pageSize,
        hasNextPage: skip + nodes.length < total
      }
    };
  },

  async getCategories() {
    const cats = await Recipe.distinct('category');
    return cats.filter(Boolean).sort((a, b) => a.localeCompare(b));
  },

  async addRecipe(_, { input }) {
    const doc = new Recipe({ ...input });
    await doc.save();
    return doc;
  },

  async updateRecipe(_, { id, input }) {
    const doc = await Recipe.findById(id);
    if (!doc) throw new GraphQLError('Recipe not found', { extensions: { code: 'NOT_FOUND' } });

    Object.assign(doc, input);
    await doc.save();
    return doc;
  },

  async deleteRecipe(_, { id }) {
    const res = await Recipe.findByIdAndDelete(id);
    return !!res;
  }
};
