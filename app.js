'use strict';

// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** REST Server
 * Iniciando nuestro proyecto REST Server
	- Nos permiten enviar informacion a travez de endpoints en formato JSON.
	- Instalaciones necesarias:    npm i express dotenv 
	- Vamos a trabajar Express con Classes
	
 * Express basado en Classes
	- Un   ENDPOINT   es una ROUTE
	- Con Express:
		- res.status(#)  		<-  para enviar el status
		- res.json(object)	<- Para enviar data en formato JSON

	- HTTP request method:
		- CRUD:	
			- CREATE		-			POST
			- READ			-			GET
			- UPDATE		-			PUT
			- DELETE		-			DELETE

	- HTTP Status Code: Nuestros servicios siempre deben retornar un Response Code.
		- Ver el PDF

	- Usar Response Code con Express:
		- Las que tienen que ver con:
			- 200		<-		Successful
			- 300		<-		Rederiction
			- 400		<-		Client Error		<-	It's the frontend's fault
			- 500		<-		Server Error		<-	Resolver el Backend author

	- CORS - Middleware:     npm i cors
		- Nos permite proteger nuestro server de una manera superficial.
			- Podemos restringir las peticiones a ciertas urls, creando whitelist, etc.
		- Siempre se debe configurar el cors.
	
	- Separar las rutas y el controlador de la Class
		- Lo establecemos desde del Server como middleware, pero especificando la ruta.
			- Para que sea mas ordenado guardamos el path en el constructor

				- Routes:
					- Ya colocar su route especifico, sino que colocar un  '/'
					- Al route especifico lo establecemos en el Server

				- Controllers:
	
	- Recibir informacion:Con el Middleware:     this.app.use(express.json());
			- La obtenemos en el Controller del   req.body
			- Lo normal es destructurar lo que necesitamos para no utilizar otra cosa q nos puedan enviar. <- Pequena validacion inicial

	- Parametros de segmento y query: Son los parametros que pasamos a la url
		- Parametros de segmento Dinamicos	<-	/:id 
			- Lo recuperamos en el codigo con:  req.params.paramNameDinamico
					const id = req.params.id
		- Query Params: Los que se pasan con   ?   en la url en un GET
			- Los recuperamos con:   req.query
				- Es conveniente hacer una Destructuring para poder establecer valores por default en caso de que no me pasen.
	
	- Desplegar nuestro REST Server a produccion
		- Establecer el script   "start": "node app.js"		en el package.json
		- Subirlo a GitHub > Vincularlo a Heroku
		- Provar la API con Postman del REST Server en produccion 

	- Pro Tip: Ambiente de producción y desarrollo en Postman:
		- Nos permite generar variables de entorno
			- Para utilizar el mismo TAB y trabajar con la API en produccion y en development
				- Enviroment > Agregar > name > url inicial > ctrl + s
				- Con esto en el TAB abierto utilizo el enviroment:
						{{name}}/api/users
								- Pero solo va a funcionar si seleccionamos en Envirment de la
									parte superior derech. Asi cambiamos, seleccionando y tal
		-

 * 
 * 
 * 
 */

console.clear();

const { serverModel } = require('./models');

serverModel.listen();
