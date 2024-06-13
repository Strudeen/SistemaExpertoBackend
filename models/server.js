const express = require('express');
const { dbconnection } = require('../database/config');
const cors = require('cors');
const {crearPermisosAdmin} = require('../permisos');
const authentication = require("../middlewares/authentication");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.listen();
        this.connectionDB();
        this.routesPath = '/api';
        this.middlewares();
        this.routes();

    }


    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    listen() {
        this.app.listen(
            this.port, () => {
                console.log(`server running in port ${this.port}`);
            }
        );
    }
    async connectionDB() {
        await dbconnection();
        //await crearPermisosAdmin();
    }

    routes() {
        this.app.use(this.routesPath + '/authentication',authentication, require('../routes/authentication'));
        this.app.use(this.routesPath + '/medicamento',authentication, require('../routes/medicamento'));
        this.app.use(this.routesPath + '/laboratorio',authentication, require('../routes/laboratorio'));
        this.app.use(this.routesPath + '/paciente',authentication, require('../routes/paciente'));
        this.app.use(this.routesPath + '/file',authentication, require('../routes/files'));
        this.app.use(this.routesPath + '/rol',authentication, require('../routes/rol'));
        this.app.use(this.routesPath + '/usuario',authentication, require('../routes/usuario'));
        this.app.use(this.routesPath + '/inventario',authentication, require('../routes/inventario'));
        this.app.use(this.routesPath + '/receta',authentication, require('../routes/receta'));
        this.app.use(this.routesPath + '/almacen',authentication, require('../routes/almacen'));
        this.app.use(this.routesPath + '/almacenMedicamento',authentication, require('../routes/almacenMedicamento'));
        this.app.use(this.routesPath + '/inventarioMedicamento',authentication, require('../routes/inventarioMedicamento'));
        this.app.use(this.routesPath + '/motorDeInferencia',authentication, require('../routes/motorDeInferencia'));
        this.app.use(this.routesPath + '/pedidosInventario',authentication, require('../routes/pedidosInventario'));
        this.app.use(this.routesPath + '/pedidosAlmacen',authentication, require('../routes/pedidosAlmacen'));
        this.app.use(this.routesPath + '/compras',authentication, require('../routes/compras'));
        this.app.use(this.routesPath + '/alertasAlmacen',authentication, require('../routes/alertasAlmacen'));
        this.app.use(this.routesPath + '/alertasInventario',authentication, require('../routes/alertasInventario'));
        this.app.use(this.routesPath + '/reportes',authentication, require('../routes/reportes'));
        this.app.use(this.routesPath + '/reportesFarmacia',authentication, require('../routes/reportesFarmacia'));
    }

}

module.exports = Server;