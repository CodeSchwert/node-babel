import express from 'express';
import { connect } from './database';
import Books from './models/bookModel';

connect();

const server = express();

const PORT = 5000;

server.get('/books', async (req, res) => {
  try {
    const books = await Books.find({});
    console.log(books); // should be an array of objects

    return res.json(books);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e);
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
