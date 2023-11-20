const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
//@desc Get all users
//@route GET /api/users
//@access private
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

//@desc Add an user
//@route POST /api/users
//@access public
const createUser = asyncHandler(async (req, res) => {
    const { username, password, email, nome, cognome, dataNascita, numeroDiTelefono } = req.body;
    
    if (!username || !password || !email || !nome || !cognome || !dataNascita || !numeroDiTelefono) {
        res.status(400);
        throw new Error("Sono richiesti tutti i campi");
    }
    const userAvailable = await User.findOne({email});
    console.log(userAvailable)
    if(userAvailable) {
        res.status(400);
        throw new Error("Utente già esistente");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    const user = await User.create({
        username,
        password: hashedPassword,
        email,
        nome,
        cognome,
        dataDiNascita: dataNascita,
        numeroDiTelefono,
        abilitato: false,
        ruolo: "Utente"
    });
    console.log(user);
    if (user) {
        res.status(201).json({_id: user.id, email: user.email});
    } else {
        res.status(400);
        throw new Error("Dati non validi");
    }
    
});

//@desc Login
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error("Tutti i campi sono richiesti");
    }
    const user = await User.findOne({email});
    if(user && user.abilitato && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id,
                ruolo: user.ruolo
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
        );
        res.cookie('JWT_TOKEN', accessToken, {httpOnly: false, sameSite: 'None', secure: true });
        res.status(200).json({accessToken})
    }else if(!user.abilitato) {
        res.status(403).json({message: "Utente non abilitato"})
    } else {
        res.status(401);
        throw new Error("email o password errate");
    }
});
//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
})

//@desc Current user info
//@route GET /api/users/logout
//@access private
const logout = asyncHandler(async(req, res) => {
    res.clearCookie('JWT_TOKEN');
    res.status(200);
})

//@desc Current user info
//@route PUT /api/users/enable-user/:id
//@access private admin only
const enableUser = asyncHandler(async(req, res) => {
    const id = req.params.id;
    const authHeader = req.headers('Authorization');
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
    if(decodedToken.ruolo === 'Admin') {
        const result = await User.updateOne({_id: id}, {$set: {abilitato: true} });

        if (result.nModified > 0) {
            res.status(200).json({message: 'User updated'});
        } else {
            res.status(400).json({message: 'User not found'});
        }
    } else {
        res.status(403).json({message: 'Accesso negato.'});
    }
});
module.exports = { getUsers, createUser, loginUser, currentUser, logout, enableUser };