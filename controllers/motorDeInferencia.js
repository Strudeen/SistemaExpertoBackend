const { response, request } = require('express');
const { facturaEngine } = require('../rules/facturaRules');


const postOCR = async (req = request, res = response) => {
    let { texto } = req.body;

    console.log(req.body);



    texto = texto.toLowerCase();
    console.log(texto);
    const posicionInicial = texto.indexOf("señores: ") + 9;
    const posicionFinal = texto.indexOf("nuclear") + 7;
    const nombre = texto.substring(posicionInicial, posicionFinal);

    console.log(nombre);
    let facts = {
        nombre,
    }
    facturaEngine
        .run(facts)
        .then(({ events }) => {
            events.map(event => console.log(event.params.message))
        })
    res.json({ msg: "sexoooooooooo", texto });
}

module.exports = { postOCR };