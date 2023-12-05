const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/authentication');
const Usuario = require('../models/usuarios');


const signIn = async (req, res) => {
    let { email, password } = req.body;

    try {
        // Buscar usuario por email usando Mongoose
        const user = await Usuario.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ msg: "Usuario con este correo no encontrado" });
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                // Desestructurar el usuario quitando el Password
                const { usuarioPassword, ...usuario } = user.toObject(); // En Mongoose usamos toObject()
                
                // Se crea el Token
                let token = jwt.sign({ user: usuario }, authConfig.secret, {
                    expiresIn: authConfig.expires
                });

                res.json({
                    status: true,
                    token: token
                });
            } else {
                res.status(401).json({ msg: "Email o Contraseña incorrecta" });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

const logOut = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the Authorization header
    jwt.sign(token, "", { expiresIn: 1 }, (logout, err) => {
        if (logout) {
            res.send({
                status: true,
                message: 'Has sido desconectado',
            });
        } else {
            res.send({ msg: 'Error' });
        }
    });     
}

const profileIn = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, authConfig.secret);
        res.json(decoded);

         next();  //Eliminar si no hay más middleware a ejecutar después
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Autenticación fallida"
        });
    }
}

module.exports = {signIn, logOut, profileIn};