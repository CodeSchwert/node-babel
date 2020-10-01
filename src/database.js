import mongoose from 'mongoose';

const opts = { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};

export const connect = () => {
  // connect to mongoDB with mongoose
  mongoose.connect('mongodb://localhost:27017/bazaarAPI', opts, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Connected to MongoDB');
  });
};

export const disconnect = () => {
  mongoose.disconnect();
};
