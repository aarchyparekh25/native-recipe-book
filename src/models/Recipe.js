import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 0 },
    unit: { type: String, trim: true },
  },
  { _id: false }
);

const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true, index: true },
    ingredients: { type: [IngredientSchema], default: [] },
    steps: { type: [String], default: [] },
    imageUrl: { type: String, trim: true },
    prepTimeMins: { type: Number, default: 0 },
    cookTimeMins: { type: Number, default: 0 },
    servings: { type: Number, default: 1 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // New field
  },
  { timestamps: true }
);

RecipeSchema.index({ title: 'text', description: 'text', category: 'text' });

export const Recipe = mongoose.model('Recipe', RecipeSchema);