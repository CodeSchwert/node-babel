import mongoose from 'mongoose';
const { Schema } = mongoose;

const model = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  owner: { type: String, required: true },
  admins: [ String ]
});

export default mongoose.model('Marketplaces', model, 'marketplaces');
