require('dotenv').config()


const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");



const main = async () => {
    // crear una instancia de mi clase fuera del ciclo DO WHILE para que no se reinicie la aplicación
    const busquedas = new Busquedas();

    let opt;


    do { // lanza la pregunta inquirerMenu no recibe argumentos y devuelve una promesa. Hacer pausa(), si no no se ve nada
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                // // Buscar la ciudad
                const lugares = await busquedas.ciudad(termino);

                // seleccionar el lugar
                const id = await listarLugares(lugares);

                // si Id es 0 cancela la busqueda
                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);

                // Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre)

                // datos de clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                // mostrar información o resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como está el clima:', clima.desc.green);
                
                break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                break;
        }


        // si la opt es diferente que 0 solo ahi pone la pausa
        if (opt !== 0) await pausa();

        // opcion diferente de 0
    } while (opt !== 0)


}

main();