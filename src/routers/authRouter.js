import { Router } from 'express';
import argon2 from 'argon2';
import User from '../models/userModel';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { body } = req;
    console.log(body);

    if (
      !body.hasOwnProperty('username') ||
      !body.hasOwnProperty('email') ||
      !body.hasOwnProperty('password')
    ) {
      return res.status(400).json({ 
        error: 'Username, email, password required!' 
      });
    }
    const { username, email, password } = body;

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({ error: 'Username already taken!' });
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ error: 'Email address already in use!' });
    }

    const hash = await argon2.hash(password);

    const user = new User({ ...body, password: hash });

    await user.save();

    return res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
