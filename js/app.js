const formulario = document.querySelector('#formulario'),
	  divResultado = document.querySelector('.resultado');

const selectMoneda = document.querySelector('#moneda');
const selectCriptos = document.querySelector('#criptomonedas');

const objectBusqueda = {
	moneda : '',
	criptomoneda : ''
}

window.onload = () => {
	cargarCriptos();
	formulario.addEventListener('submit', buscarCotizacion);

	selectMoneda.addEventListener('change', leerValor);
	selectCriptos.addEventListener('change', leerValor);
};

async function cargarCriptos() {

	document.querySelector('#select-state').innerHTML = '<span class="resultado">Espere mientras se carga el campo de selección.</span>'

	const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
	let criptos;

	try{

		const respuesta = await fetch(url);
		const { Data } = await respuesta.json();

		Data.forEach(cripto => {

			const { CoinInfo : { Name, FullName } } = cripto;

			const option = document.createElement('option');
			option.value = Name;
			option.textContent = FullName;
			
			selectCriptos.appendChild(option);
		});
		
		document.querySelector('#select-state').remove();
	}catch(error) {
		console.log(error);
	}
}

function buscarCotizacion(e) {
	e.preventDefault();

	const { moneda, criptomoneda } = objectBusqueda;

	if(moneda === '' || criptomoneda === '') {
		mostrarAlerta('Todos los campos son obligatorios');
		return;
	}

	consultarAPI();
}

async function consultarAPI() {

	const { moneda, criptomoneda } = objectBusqueda;
	const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

	mostrarSpinner();
	
	try{

		const respuesta = await fetch(url);
		const resultado = await respuesta.json();

		mostrarCotizacion(resultado.DISPLAY[criptomoneda][moneda])
	}catch(error) {
		console.log(error);
	}
}

function mostrarCotizacion(cotizacion) {

	limpiarHTML();

	const { PRICE, HIGHDAY, LOWDAY, CHANGEPCTDAY, LASTUPDATE } = cotizacion;

	const precio = document.createElement('p');
	precio.classList.add('precio');
	precio.innerHTML = `Precio actual: <span>${PRICE}</span>`;

	const maximo = document.createElement('p');
	maximo.innerHTML = `<p>Maximo del dia: <span>${HIGHDAY}<span></p>`;

	const minimo = document.createElement('p');
	minimo.innerHTML = `<p>Minimo del dia: <span>${LOWDAY}<span></p>`;

	const variacion = document.createElement('p');
	variacion.innerHTML = `<p>Variación en el dia: <span>${CHANGEPCTDAY}%<span></p>`;

	const actualización = document.createElement('p');
	actualización.innerHTML = `<p>Ultima actualizacón: <span>${LASTUPDATE}<span></p>`;

	divResultado.appendChild(precio);
	divResultado.appendChild(maximo);
	divResultado.appendChild(minimo);
	divResultado.appendChild(variacion);
	divResultado.appendChild(actualización);
}

function mostrarAlerta(mensaje) {
	
	if(!document.querySelector('.error')){

		const alerta = document.createElement('p');
		alerta.classList.add('error');
		alerta.innerHTML = `<strong>${mensaje}</strong>`; 

		divResultado.appendChild(alerta);

		setTimeout(() => {
			alerta.remove();
		}, 3000);
	}
}

function leerValor(e) {
	objectBusqueda[e.target.name] = e.target.value;
}

function limpiarHTML(){
	while(divResultado.firstChild) {
		divResultado.removeChild(divResultado.firstChild);
	}
}

function mostrarSpinner() {

	limpiarHTML();

	const divSpinner = document.createElement('div');
	divSpinner.classList.add('sk-cube-grid');

	divSpinner.innerHTML = `
		<div class="sk-cube sk-cube1"></div>
		<div class="sk-cube sk-cube2"></div>
		<div class="sk-cube sk-cube3"></div>
		<div class="sk-cube sk-cube4"></div>
		<div class="sk-cube sk-cube5"></div>
		<div class="sk-cube sk-cube6"></div>
		<div class="sk-cube sk-cube7"></div>
		<div class="sk-cube sk-cube8"></div>
		<div class="sk-cube sk-cube9"></div>
	`;

	divResultado.appendChild(divSpinner);
};