import mongoose, { Schema } from 'mongoose';

const model = new Schema({
  firstName: String,
  lastName: String,
  username: { type: String, required: true, unique: true },
  usernameLowercase: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  groups: [],
  token: { type: String, unique: true }
});

export default mongoose.model('Users', model, 'users');
