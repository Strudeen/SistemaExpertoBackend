const jwt = require('jsonwebtoken');
const authConfig = require('../config/authentication');
const Usuario = require('../models/usuarios'); // Asegúrate de que el modelo está correctamente importado

module.exports = (req, res, next) => {

    // Comprobar que existe el token
    if (!req.headers.authorization) {
        return res.status(401).json({ msg: "Acceso no autorizado" });
    } else {

        // Comprobar la validez de este token
        let token = req.headers.authorization.split(" ")[1];

        // Comprobar la validez de este token
        jwt.verify(token, authConfig.secret, (err, decoded) => {

            if (err) {
                return res.status(500).json({ msg: "Ha ocurrido un problema al decodificar el token", err });
            } else {
                
                // Utilizar Mongoose para encontrar el usuario y sus roles
                Usuario.findById(decoded.user._id).then(user => {
                    if (!user) {
                        return res.status(404).json({ msg: "Usuario no encontrado" });
                    }

                    //console.log(user.roles);

                    req.user = user;
                    next();
                }).catch(err => {
                    console.error(err);
                    res.status(500).json({ msg: "Error al buscar el usuario en la base de datos", err });
                });
            }
        });
    }
};
