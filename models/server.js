const express = require('express');
const { dbconnection } = require('../database/config');
const cors = require('cors');

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
    }

    routes() {
        this.app.use(this.routesPath + '/authentication', require('../routes/authentication'));
        this.app.use(this.routesPath + '/medicamento', require('../routes/medicamento'));
        this.app.use(this.routesPath + '/laboratorio', require('../routes/laboratorio'));
        this.app.use(this.routesPath + '/paciente', require('../routes/paciente'));
        this.app.use(this.routesPath + '/file', require('../routes/files'));
        this.app.use(this.routesPath + '/rol', require('../routes/rol'));
        this.app.use(this.routesPath + '/usuario', require('../routes/usuario'));
        this.app.use(this.routesPath + '/inventario', require('../routes/inventario'));
        this.app.use(this.routesPath + '/receta', require('../routes/receta'));
        this.app.use(this.routesPath + '/almacen', require('../routes/almacen'));
        this.app.use(this.routesPath + '/almacenMedicamento', require('../routes/almacenMedicamento'));
        this.app.use(this.routesPath + '/inventarioMedicamento', require('../routes/inventarioMedicamento'));
        this.app.use(this.routesPath + '/motorDeInferencia', require('../routes/motorDeInferencia'));
        this.app.use(this.routesPath + '/pedidosInventario', require('../routes/pedidosInventario'));
        this.app.use(this.routesPath + '/pedidosAlmacen', require('../routes/pedidosAlmacen'));
        this.app.use(this.routesPath + '/compras', require('../routes/compras'));
        this.app.use(this.routesPath + '/alertasAlmacen', require('../routes/alertasAlmacen'));
        this.app.use(this.routesPath + '/alertasInventario', require('../routes/alertasInventario'));
        this.app.use(this.routesPath + '/reportes', require('../routes/reportes'));
        this.app.use(this.routesPath + '/reportesFarmacia', require('../routes/reportesFarmacia'));
    }

}

module.exports = Server;