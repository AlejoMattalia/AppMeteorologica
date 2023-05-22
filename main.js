let nombreCiudad = localStorage.getItem("ciudad") || "Buenos Aires";
const climaDias = [];

const funcionalidadClimaDIas = (climaDias) => {
    const contenedorDias = document.querySelector(".swiper-wrapper");

    const diasHTML = (info) => {

        //obtener el dia en numero
        let fechaCompleta = info.datetime;
        let dia = (fechaCompleta.substring(fechaCompleta.length - 2));

        //Obtener el dia de la semana
        const fecha = new Date(fechaCompleta);
        let diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
        let diaPalabra = diasSemana[fecha.getDay()];
        diaPalabra = diaPalabra.toUpperCase();

        //Obtener icono
        let icono = info.weather.description.toLowerCase();

        if (icono === "clear sky") {
            icono = info.weather.icon;
        }

        let imagenClima = "";

        if (icono === "thunderstorm with light rain" || icono === "thunderstorm with rain" || icono === "thunderstorm with heavy rain" || icono === "thunderstorm with light drizzle" || icono === "thunderstorm with drizzle" || icono === "thunderstorm with heavy drizzle" || icono === "thunderstorm with Hail" || icono === "light drizzle" || icono === "heavy drizzle" || icono === "light rain" || icono === "moderate rain" || icono === "heavy rain" || icono === "freezing rain" || icono === "light shower rain" || icono === "shower rain" || icono === "heavy shower rain" || icono === "unknown precipitation") {
            imagenClima = "img/iconosClima//lluvia.png";
        }

        else if (icono === "sleet" || icono === "heavy sleet" || icono === "mist" || icono === "smoke" || icono === "haze" || icono === "sand/dust" || icono === "fog" || icono === "freezing fog") {
            imagenClima = "img/iconosClima//neblinoso.png";
        }

        else if (icono === "clear sky") {
            icono = info.weather.icon;

            if (icono === "c01d") {
                imagenClima = "img/iconosClima//sol.png";
            }

            else if (icono === "c01n") {
                imagenClima = "img/iconosClima//luna.png";
            }
        }

        else if (icono === "few clouds" || icono === "scattered clouds" || icono === "broken clouds" || icono === "Overcast clouds") {
            icono = info.weather.icon;

            if (icono === "c02d" || icono === "c02d" || icono === "c03d") {
                imagenClima = "img/iconosClima//nubladoSol.png";
            }
            else if (icono === "c02n" || icono === "c02n" || icono === "c03n") {
                imagenClima = "img/iconosClima//nubeNoche.png";
            }
        }

        else if (icono === "overcast clouds") {
            imagenClima = "img/iconosClima//nube.png";
        }

        else if (icono === "light snow" || icono === "snow" || icono === "heavy snow" || icono === "mix snow/rain" || "snow shower" || icono === "heavy snow shower" || icono === "flurries") {
            imagenClima = "img/iconosClima//nieve.png";
        }



        return `<div class="swiper-slide tranding-slide">
                    <div class="w-100 d-flex flex-row justify-content-evenly">
                        <h3>${diaPalabra} ${dia}</h3>
                        <img src=${imagenClima} alt="Tranding" class="imagenClima">
                    </div>
                    <p>Temperatura máximia: ${info.max_temp}°c</p>
                    <p>Temperatura mínima: ${info.min_temp}°c</p>
                  </div>`;
    }

    const cargarDias = (array) => {
        contenedorDias.innerHTML = "";

        array.forEach(element => {
            contenedorDias.innerHTML += diasHTML(element);
        });
    }

    cargarDias(climaDias)
}

const buscarCiudad = () => {
    const buscador = document.querySelector("#input");
    const boton = document.querySelector(".boton");

    boton.addEventListener("click", (event) => {
        event.preventDefault()
        nombreCiudad = buscador.value;

        localStorage.clear();
        localStorage.setItem("ciudad", nombreCiudad);

        buscador.value = "";
        location.reload();
    });

    buscador.addEventListener("keypress", (event) => {
        if (event.keyCode === "13") {
            event.preventDefault()
            nombreCiudad = buscador.value;

            localStorage.clear();
            localStorage.setItem("ciudad", nombreCiudad);

            buscador.value = "";
            location.reload();
        }
    })

    return nombreCiudad;
}

const obtenerLatLonCiudad = (ciudad) => {
    const apiKey = "f72491b4cfe244f790fc56ef040b4e66";

    // return new Promise((resolve, reject) => {
    return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${ciudad}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const latitud = data.results[0].geometry.lat;
            const longitud = data.results[0].geometry.lng;

            return [latitud, longitud];
        })
    // })
}

// Obtener datos del clima
const obtenerDatosClima = (lat, lon, ciudad) => {
    const apiKey = `fed992c148eafef49b1615b4e17e2a8a`;

    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json());
}

//Obtener datos de los 7 dias siguiente
const obtenerDatos7Dias = (lat, lon, ciudad) => {
    const apiKey = `6b953baacc484986aa07d899f43a82a6`;

    return fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&city=${ciudad}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            climaDias.push(...data.data.slice(1));
        });
}

// Obtener provincia y país
const obtenerProvinciaPais = (ciudad) => {
    const apiKey = `f72491b4cfe244f790fc56ef040b4e66`;

    return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${ciudad}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const pais = data.results[0].components.country;

            return pais;
        });
}

//Calcular temperatura
const calcularTemperatura = (datosClima) => {
    const temperatura = Math.floor((datosClima.main.temp) - 273.15);
    return temperatura;
}
// Calcular humedad
const calcularHumedad = (datosClima) => {
    const humedad = datosClima.main.humidity;
    return humedad;
}
//Calcular viento por km/h
const calcularVientoKM = (datosClima) => {
    const angle = datosClima.wind.deg;
    const speed = datosClima.wind.speed;

    const vientoKMH = Math.floor((speed * Math.cos(angle * (Math.PI / 180)) * 3.6) + 5);

    return vientoKMH;
}

const calcularZonaHoraria = (lat, lon, ciudad) => {
    const apiKey = `02QDTCCEE1UE`;

    return fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lon}&city=${encodeURIComponent(ciudad)}`)
        .then(response => response.json())
        .then(data => {
            const { formatted } = data;
            const fecha = new Date(formatted);

            //Numero del dia
            const dia = fecha.getDate();

            //nombre del dia
            let dias_semana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const nombreDia = dias_semana[fecha.getDay()];

            //Nombre del mes
            let opciones_fecha = { month: 'long' };
            const mesNombre = fecha.toLocaleString('es-ES', opciones_fecha);

            //Hora
            let hora = fecha.getHours();


            //Minutos
            let minutos = fecha.getMinutes();

            if (minutos >= 0 && minutos < 10) {
                minutos = "0" + minutos;
            }
            if (hora >= 0 && hora < 10) {
                hora = "0" + hora;
            }

            return [dia, nombreDia, mesNombre, hora, minutos]
        })
}

//Fondo de la aplicacion
const fondoPantalla = (datosClima) => {
    const body = document.body;
    const tiempoDia = document.querySelector(".tiempoDia");
    const icono = document.querySelector(".icono")

    const estilosBody = () => {
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundPosition = "center center";
        body.style.backgroundSize = "cover";
        body.style.backgroundAttachment = "fixed";
    }

    const codigoIcono = datosClima.weather[0].icon;
    // codigoIcono = "01d";

    if (codigoIcono === "01d" || codigoIcono === "02d") {
        body.style.background = 'linear-gradient(rgba(138, 138, 138, 0.7), rgba(138, 138, 138, 0.7)), url("img/cielos/cieloDiaSoleado.jpg")';
        tiempoDia.innerHTML = "🌞SOLEADO";
        icono.src = "img/iconosClima/sol.png";
        estilosBody();
    }
    else if (codigoIcono === "03d" || codigoIcono === "04d") {
        body.style.background = 'linear-gradient(rgba(138, 138, 138, 0.5), rgba(138, 138, 138, 0.5)), url("img/cielos/cieloDiaNublado.jpg")';
        tiempoDia.innerHTML = "⛅POCAS NUBES";
        icono.src = "img/iconosClima/nubladoSol.png";
        estilosBody();
    }
    else if (codigoIcono === "09d" || codigoIcono === "10d" || codigoIcono === "11d" ||
        codigoIcono === "09n" || codigoIcono === "10n" || codigoIcono === "11n") {
        body.style.background = 'linear-gradient(rgba(138, 138, 138, 0.6), rgba(138, 138, 138, 0.6)), url("img/cielos/cieloDiaLluvia.jpg")';
        tiempoDia.innerHTML = "☔LLUVIA";
        icono.src = "img/iconosClima/lluvia.png";
        estilosBody();
    }
    else if (codigoIcono === "13d") {
        body.style.background = 'linear-gradient(rgba(138, 138, 138, 0.2), rgba(138, 138, 138, 0.2)), url("img/cielos/cieloDiaNieve.jpg")';
        tiempoDia.innerHTML = "⛄NIEVE";
        icono.src = "img/iconosClima/nieve.png";
        estilosBody();
    }
    else if (codigoIcono === "50d" || codigoIcono === "50n") {
        body.style.background = 'linear-gradient(rgba(138, 138, 138, 0.4), rgba(138, 138, 138, 0.4)), url("img/cielos/cieloDiaNeblina.jpg")';
        tiempoDia.innerHTML = "💨NEBLINA";
        icono.src = "img/iconosClima/neblinoso.png";
        estilosBody();
    }
    else if (codigoIcono === "01n" || codigoIcono === "02n") {
        body.style.background = 'linear-gradient(rgba(138, 138, 138, 0.2), rgba(138, 138, 138, 0.2)), url("img/cielos/cieloNocheDespejado.jpg")';
        tiempoDia.innerHTML = "🌚NOCHE DESPEJADA";
        icono.src = "img/iconosClima/luna.png";
        estilosBody();
    }
    else if (codigoIcono === "03n" || codigoIcono === "04n") {
        body.style.background = 'linear-gradient(rgba(138, 138, 138, 0.2), rgba(138, 138, 138, 0.2)), url("img/cielos/cieloNocheNublado.jpg")';
        tiempoDia.innerHTML = "🌒NOCHE NUBLADA";
        icono.src = "img/iconosClima/nubeNoche.png";
        estilosBody();
    }
    else if (codigoIcono === "13n") {
        body.style.background = 'linear-gradient(rgba(138, 138, 138, 0.4), rgba(138, 138, 138, 0.4)), url("img/cielos/cieloNocheNieve.jpg")';
        tiempoDia.innerHTML = "⛄NIEVE NOCHE";
        icono.src = "img/iconosClima/nieve.png";
        estilosBody();
    }
}

// Función principal
const principal = async () => {
    try {
        buscarCiudad()
        // Obtener ubicación actual del usuario
        const [latitud, longitud] = await obtenerLatLonCiudad(nombreCiudad);

        // Obtener datos del clima
        const datosClima = await obtenerDatosClima(latitud, longitud, nombreCiudad);

        // Obtener nombre de la ciudad
        let nombreCiudadApi = datosClima.name;

        // Obtener provincia y país
        const pais = await obtenerProvinciaPais(nombreCiudad);

        // Obtener temperatura, humedad y viento
        const temperatura = calcularTemperatura(datosClima);
        const humedad = calcularHumedad(datosClima);
        const viento = calcularVientoKM(datosClima);

        //Obtener dia, nombre del dia, mes, hora y minutos
        const [dia, nombreDia, mes, hora, minutos] = await calcularZonaHoraria(latitud, longitud, nombreCiudad);


        //Obtener datos de los 7 dias
        const datosClima7Dias = await obtenerDatos7Dias(latitud, longitud, nombreCiudad);

        function funcionalidad() {
            const paisHTML = document.querySelector(".pais");
            const iconoMundo = document.querySelector(".iconoMundo");
            const buscador = document.querySelector("form");
            const temperaturaHTML = document.querySelector(".temperatura");
            const humedadHTML = document.querySelector(".humedad");
            const vientoHTML = document.querySelector(".viento");
            const ciudadHTML = document.querySelector(".ciudad");
            const mesNombreHTML = document.querySelector(".mesNombre");
            const numDiaHTML = document.querySelector(".numDia");
            const diaNombreHTML = document.querySelector(".diaNombre");
            const horaHTML = document.querySelector(".hora");
            const minutosHTML = document.querySelector(".minutos");

            if (pais === "Estados Unidos de América") {
                paisHTML.innerHTML = "EE.UU";
            }
            else {
                paisHTML.innerHTML = pais;
            }


            if (pais.length >= 11 && pais.length < 16) {
                paisHTML.style.fontSize = "35px";
            }
            else if (pais.length >= 16) {
                paisHTML.style.fontSize = "25px";
                iconoMundo.style.width = "65px";
                buscador.style.marginLeft = "50px";
                buscador.style.marginRight = "100px";
            }

            // provinciaHTML.innerHTML = provincia;
            temperaturaHTML.innerHTML = temperatura;
            humedadHTML.innerHTML = humedad;
            vientoHTML.innerHTML = viento;
            ciudadHTML.innerHTML = nombreCiudadApi;
            mesNombreHTML.innerHTML = mes.toUpperCase();
            numDiaHTML.innerHTML = dia;
            diaNombreHTML.innerHTML = nombreDia;
            horaHTML.innerHTML = hora;
            minutosHTML.innerHTML = minutos;
        }


        funcionalidad();
        funcionalidadClimaDIas(climaDias)
        fondoPantalla(datosClima)

    } catch (error) {
        console.error(error);
    }
};



var TrandingSlider = new Swiper('.tranding-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
});

const main = document.querySelector(".main");
const cargando = document.querySelector(".cargando");
main.classList.add("ocultar");
principal()

setTimeout(() => {
    cargando.style.display = "none";
    main.classList.remove("ocultar");
}, 3000)







