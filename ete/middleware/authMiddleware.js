import jwt from 'jsonwebtoken';
import config from '../config.js';
import User from '../models/User.js';

const maxAge = 1 * 60 * 60;

const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, config.secret, (err, decodedToken) => {
			if (err) {
				console.error(err.message);
				res.redirect('/login');
			} else {
				next();
			}
		});
	} else {
		res.redirect('/login');
	}
};

const checkUser = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, config.secret, async (err, decodedToken) => {
			if (err) {
				console.error(err.message);
				res.locals.user = null;
				next();
			} else {
				const cookieUser = req.cookies.user;
				if (cookieUser) {
					res.locals.user = cookieUser;
					next();
				} else {
					let user = await User.findById(decodedToken.id);

					let userdata = user.email;

					res.locals.user = userdata;
					res.cookie('user', userdata, {
						httpOnly: true,
						maxAge: maxAge * 1000,
					});
					next();
				}
			}
		});
	} else {
		res.locals.user = null;
		next();
	}
};

export { requireAuth, checkUser };
