import { Router } from 'express';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/userModel';
import registerSchema from '../validation/authRegisterUser';
import loginSchema from '../validation/authLoginUser';

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

    const user = new User({ 
      ...body,
      usernameLowercase: username.toLowerCase(),
      password: hash
    });

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

router.post('/login', async (req, res, next) => {
  try { 
    // login with username
    const { body } = req;
    const validValues = await loginSchema.validateAsync(body);
    console.log('validValues:', validValues);

    const { username, password } = validValues;

    const checkUser = await User.findOne({ usernameLowercase: username.toLowerCase() });
    if (!Boolean(checkUser)) {
      return res.status(404).json({ error: 'Username not found!' });
    }

    if (!(await argon2.verify(checkUser.password, password))) {
      return res.status(400).json({ error: 'Incorrect password!!' });
    }

    const token = uuidv4();

    checkUser.token = token;
    await checkUser.save();

    return res.status(200).json({
      success: true,
      token
    });
  } catch (e) {
    // catch custom validation errors
    if (e.message.startsWith('Invalid')) {
      return res.status(400).json({ error: e.message });
    }

    next(e);
  }
});

export default router;
