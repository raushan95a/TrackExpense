import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { BCRYPT_SALT_ROUNDS, NAME_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../constants/auth.js';
import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from '../constants/currency.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: NAME_MAX_LENGTH },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: PASSWORD_MIN_LENGTH, select: false },
    currency: {
      type: String,
      enum: SUPPORTED_CURRENCIES,
      default: DEFAULT_CURRENCY,
      uppercase: true,
    },
    passwordChangedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.passwordChangedAt;
        return ret;
      },
    },
  },
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
  if (!this.isNew) this.passwordChangedAt = new Date();
});

/** Compares a plain-text candidate with the stored hash (requires +password). */
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

/** True when the password changed after the given JWT `iat` (seconds). */
userSchema.methods.changedPasswordAfter = function changedPasswordAfter(jwtIssuedAt) {
  if (!this.passwordChangedAt) return false;
  return Math.floor(this.passwordChangedAt.getTime() / 1000) > jwtIssuedAt;
};

export const User = mongoose.model('User', userSchema);
