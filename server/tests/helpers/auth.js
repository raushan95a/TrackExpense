import { User } from '../../src/models/User.js';
import { generateToken } from '../../src/utils/generateToken.js';

let counter = 0;

/** Creates a user directly in the DB and returns it with an Authorization header. */
export const createAuthedUser = async (overrides = {}) => {
  counter += 1;
  const user = await User.create({
    name: `User ${counter}`,
    email: `user${counter}@example.com`,
    password: 'secret123',
    ...overrides,
  });
  return { user, headers: { Authorization: `Bearer ${generateToken(user.id)}` } };
};
