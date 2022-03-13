import jwt from 'jsonwebtoken';

import config from '../config.js';
import User from '../models/User.js';

const handleErrors = (err) => {
	let errors = { email: '', password: '' };

	if (err.message.includes('incorrect email')) {
		errors.email = err.message;
		return errors;
	}

	if (err.message.includes('incorrect password')) {
		errors.password = err.message;
		return errors;
	}

	if (err.code === 11000) {
		errors.email = 'that email is already registered';
		return errors;
	}

	if (err.message.includes('user validation failed')) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	return errors;
};

const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign({ id }, config.secret, {
		expiresIn: maxAge,
	});
};

const signup_get = (req, res) => {
	res.render('index');
};

const login_get = (req, res) => {
	res.render('index');
};

const signup_post = (req, res) => {
	const { email, password } = req.body;

	User.create({ email, password })
		.then((user) => {
			const token = createToken(user._id);
			res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
			res.status(201).json({ user: user._id });
		})
		.catch((err) => {
			const errors = handleErrors(err);
			res.status(400).json({ errors });
		});
};

const login_post = (req, res) => {
	const { email, password } = req.body;

	User.login(email, password)
		.then((user) => {
			const token = createToken(user._id);
			res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
			res.status(200).json({ user: user._id });
		})
		.catch((err) => {
			const errors = handleErrors(err);
			res.status(400).send({ errors });
		});
};

const logout_get = (req, res) => {
	res.cookie('jwt', '', { maxAge: 1 });
	res.cookie('user', '', { maxAge: 1 });
	res.redirect('/');
};

export default { signup_get, login_get, signup_post, login_post, logout_get };
