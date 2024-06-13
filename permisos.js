const Permiso = require('./models/permisos');
const Rol = require('./models/roles');
const data = [];
const mongoose = require('mongoose');

const crearPermisosAdmin = async () => {
    // alamacen
    const listarAlamcen = await new Permiso({
        _id: new mongoose.Types.ObjectId(),
        nombre: 'listarAlamcen',
        descripcion: 'Permiso para listar Alamcenes',
        state: true
    }).save();
    data.push(listarAlamcen);

    const crearAlamcen = await new Permiso({
        _id: new mongoose.Types.ObjectId(),
        nombre: 'crearAlamcen',
        descripcion: 'Permiso para crear Alamcenes',
        state: true
    }).save();
    data.push(crearAlamcen);

    const editarAlamcen = await new Permiso({
        _id: new mongoose.Types.ObjectId(),
        nombre: 'editarAlamcen',
        descripcion: 'Permiso para editar Alamcenes',
        state: true
    }).save();
    data.push(editarAlamcen);

    const eliminarAlamcen = await new Permiso({
        _id: new mongoose.Types.ObjectId(),
        nombre: 'eliminarAlamcen',
        descripcion: 'Permiso para eliminar Alamcenes',
        state: true
    }).save();
    data.push(eliminarAlamcen);

    const rol = await Rol.findById('6571e1a1b73a7693bdd2ef37');

    for(let i = 0; i < 4; i++){
        rol.permisos.push({
            permisoId: data[i]._id,
            estado: true
        });
    }
    rol.save();
    
}

module.exports = {crearPermisosAdmin}
