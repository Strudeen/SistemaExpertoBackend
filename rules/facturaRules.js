const { Engine } = require('json-rules-engine')

let facturaEngine = new Engine()
facturaEngine.addRule({
    conditions: {
        any: 
        [
            {
                all:
                    [
                        // {
                        //     fact: 'nit/ci',
                        //     operator: 'equal',
                        //     value: '314744023'
                        // },
                        {
                            fact: 'nombre',
                            operator: 'equal',
                            value: 'AGENCIA BOLIVIANA DE ENERGÍA NUCLEAR'
                        },
                        // {
                        //     fact: 'direccion',
                        //     operator: 'equal',
                        //     value: 'AVENIDA ARICA NRO 100 ZONA PARCOPATA EDIFICIO CENTRO NUCLEAR'
                        // },
                        // {
                        //     fact: 'ciudad',
                        //     operator: 'equal',
                        //     value: 'EL ALTO'
                        // }
                    ]
            }, 
            {
                all:
                    [
                        // {
                        //     fact: 'nit/ci',
                        //     operator: 'equal',
                        //     value: '314744023'
                        // },
                        {
                            fact: 'nombre',
                            operator: 'equal',
                            value: 'AGENCIA BOLIVIANA DE ENERGÍA NUCLEAR'
                        },
                        // {
                        //     fact: 'direccion',
                        //     operator: 'equal',
                        //     value: 'AVENIDA ARICA NRO 100 ZONA PARCOPATA EDIFICIO CENTRO NUCLEAR'
                        // },
                        // {
                        //     fact: 'ciudad',
                        //     operator: 'equal',
                        //     value: 'EL ALTO'
                        // }
                    ]
            },
        ]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
        type: 'validado',
        params: {
            message: 'El documento está validado.'
        }
    }
});

module.exports = {facturaEngine};

/**
 * Define facts the engine will use to evaluate the conditions above.
 * Facts may also be loaded asynchronously at runtime; see the advanced example below
 */



// Run the engine to evaluate


/*
 * Output:
 *
 * Player has fouled out!
 */