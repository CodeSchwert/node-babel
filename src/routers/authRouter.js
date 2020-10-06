import { Router } from 'express';
import argon2 from 'argon2';
import User from '../models/userModel';
import registerSchema from '../validation/authRegisterUser';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { body } = req;
    const validValues = await registerSchema.validateAsync(body);
    console.log('validValues:', validValues);

    const { username, email, password } = validValues;

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
    // catch custom validation errors
    if (e.message.startsWith('Invalid')) {
      return res.status(400).json({ error: e.message });
    }

    next(e);
  }
});

export default router;
