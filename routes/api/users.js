const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', [
    check('name', 'Name is Required')
        .not()
        .isEmpty(),
    check('email', 'Please include valid Email')
        .isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
        .isLength({ min: 6 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body;

        try {

            // see if user is exists
            let user = await User.findOne({ email });

            if (user) {
                res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            // Get user Gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            })

            // Encrypt Password

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            // Return json web token
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                process.env.JWT_SECERET,
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                })

        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

module.exports = router;