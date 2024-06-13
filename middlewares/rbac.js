const Permiso = require('../models/permisos');
const Rol = require('../models/roles');
// middleware/rbacMiddleware.js
// Check if the user has the required permission for a route
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user ? req.user.rol : 'anonymous';
    
    Rol.findOne({ nombre: userRole })
      .populate({
        path: 'permisos',
        populate: { path: 'permisoId' },
        match: { estado: true }, // Filtra los permisos con estado true
      })
      .then(rol => {
        console.log(rol);
        if (!rol) {
          return res.status(404).send({ message: 'Rol no encontrado' });
        }
        const hasPermisison = rol.permisos.find(p => p.permisoId.nombre === permission && p.estado);
        if (hasPermisison) {
          return next();
        } else {
          return res.status(404).json({ message: "Acceso Denegado" });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({ message: 'Error al obtener el rol' });
      });
    console.log(req.user)

  };
};