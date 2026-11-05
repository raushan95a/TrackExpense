import mongoose from 'mongoose';
import {
  CASE_INSENSITIVE_COLLATION,
  CATEGORY_ICON_MAX_LENGTH,
  CATEGORY_NAME_MAX_LENGTH,
  DEFAULT_CATEGORY_COLOR,
  HEX_COLOR_PATTERN,
} from '../constants/category.js';
import { TRANSACTION_TYPE_VALUES } from '../constants/transaction.js';

const categorySchema = new mongoose.Schema(
  {
    // null marks a system default shared by all users.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true, maxlength: CATEGORY_NAME_MAX_LENGTH },
    type: { type: String, enum: TRANSACTION_TYPE_VALUES, required: true },
    icon: { type: String, trim: true, maxlength: CATEGORY_ICON_MAX_LENGTH, default: '' },
    color: { type: String, match: HEX_COLOR_PATTERN, default: DEFAULT_CATEGORY_COLOR },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.id;
        return ret;
      },
    },
  },
);

categorySchema.index(
  { user: 1, type: 1, name: 1 },
  { unique: true, collation: CASE_INSENSITIVE_COLLATION },
);

categorySchema.virtual('isDefault').get(function isDefault() {
  return this.user === null;
});

export const Category = mongoose.model('Category', categorySchema);
