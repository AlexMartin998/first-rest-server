'use strict';

console.clear();

const { serverModel } = require('./models');

serverModel.listen();

/* 










*/
// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S9: Alcances del RESTServer y mantenimiento de la colección de usuarios
 * Alcances del proyecto REST Server
	- Instalaciones:   npm i cors express dotenv mongoose
	- DB Super Cafe:  DB con 3 colecciones
		- Users
			- Integrar con Google Sign in
		- Categories
		- Products
		
 * MongoDB y MongoAtlas: 
	- Crear cuenta > Crear Clouster > Database Acces > Add New DB User
		user: alexNodeJS	 || 	password: LzsQszjJwjlhGtma		> Create
	
	- Concectar user con MongoDB Compass:
		- Database > Connect > MongoDB Compass > Copiar enlace > Editamos el <password> por el que pusimos al crear el user. > Lo editado copy and paste in MongoDB Compass > Connect
	
	- Monggose: Es un ODB que nos evita escribir sintaxis propia del SGDB NoSQL
		- Retorna una Promise
		- En el   mongoose.connect(URI)  <--  Con Mongoose 6 ya no es necesario los Objects de configuracion.
					https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options

	- User Model: Schema del user q sera guardado en la DB. Va en el Model
		- En MongDB guardamos Documents (Objects) y estos a su vez se guardan en Collections. El equivalente de un collection es una tabla en DB SQL.
		- Crear el Schema del Document: 
			- Require  Schema  y  model
				- Schema: Data la estructura/schema al document (obj)
				- model: Nos permitira exportar nuestro Schema

	- POST: Crear un User en la Collection
		- Configuramos el user.Controller xq tiene la logica
			
				const user = new User(body);		<-		instanciamos el Shema
				await user.save();							<-		guardamos en la DB

	- BcryptJS - Encriptando la contraseña
		- Encriptar la contrasena con un Hash de 1 sola via. Imposible de revertir
				npm i bcryptjs
					- Generamos el salt: Complejidad del hash, 10 por default
							const salt = bcryptjs.genSaltSync();
					- Hash de 1 sola via al password
							user.password = bcryptjs.hashSync(password, salt);

		- Evitar que se pueda modificar el  google: true  desde el front
			- Validar todos los endpoints monuciosamente. No confiar en el q hace el frontend  :v

	- Validar Campos Obligatorios - Email
			npm i express-validator 		<--		Es una gran collection of Middlewares
				- En el Route hacemos un  .check('toValidate', 'Error messg').isEmail()
							- toValidate <- key en el Schema q esta en el model
					- Se pasa como 2do parametro, si son varios middlewares usamos un Arr
						router.post(
							'/',
							[check('mail', "It's not a valid email.").isEmail()],
							postUser <- controller
						);
					- Esto guardara los errores en el mismo express-validator
					- Esos errores los validamos con un Middleware personalizado

	- Validar todos los campos necesarios
		- Validamos Si NO esta Empty:  
					check('name', 'Name is required.').not().isEmpty(),
		- Creamos el Middleware personalizado y solo lo pasamos al final de los 
			check() en el Route
		- En el mismo Arr de Middlewares, xq los  check()  tambien son Middlewares
		- Como los errores de las validaciones se guardan el el propio  express-validatos debemos  require  en el Middleware personalizado.
					const { validationResult } = require('express-validator');

	- Validar el ROLE contra la DB
		- Validar el rol que envian en la POST request contra la info de la DB.
			- Creamos una nueva coleccion:
				- MongoDB Compass > cafeDB > Create Collection > Set name > Create Collection
				- En la collection creada: Creamos directo desde Mongo Compass:
					- Add Data > Insert Document > Creamos com JSON > create
			- Creamos un nuevo Model:    role.model.db.js
				- Como lo creamos primero desde MongoDb Compass ahora le damos el Schema con la  key  que le dimos al crearlo. Luego lo estructuramos como queremos, pero ya no haria falta un  .save()  xq los document (objects) ya los creamos con mongo compass.
				- Remember:  En el   model('name'. nameSchema)
				  - name: Debe estar en Singular, porque en mongo lo guarda en plural
					- Por eso en mogo compass guardamos la collection directo en plural
		- Lo validamos con el  check()  en el Route. Pero lo hacemos como  .custom()
				- Aqui el   hrow new Error   NO va a romper la app xq lo va a manejar el
				  .custom(). Asi:  
			check('role').custom(async (role = '') => {
				const roleExist = await Role.findOne({ role });
				if (!roleExist) throw new Error(`The role ${role} is not valid in DB.`);
			}),
			
		- NO enviar el password:
			- En el   user.model.db.js   xq tiene el  Schema:
				- Vamos a hacer uso de un f(x) normal para poder utilizar  this
					- Modificamos el   .methods.toJSON    del Schema creado
					- .toObject() es un method de Mongoose q transforma algo en 1 Obj de JS.  
					- Descruturamos y solo retornamos lo que nos interesa.
								UserSchema.methods.toJSON = function () {
									const { __v, password, ...dataUser } = this.toObject();
									return dataUser;
								};

	- Custom validation - EmailExist?: Como el ejemplo anterior, pero aqui es tarea
		- Cortamos el code del controller, lo pasamos a un f(x) del helper
		- Esa f(x) lo utilizamos en el Route como un  custom
    - Esto para tener el codigo mas limpio y ordenado

	- PUT: Actualizar información del usuario
    - Destructuring los datos que NO quiero que el user pueda modificar, y los que si les hago un  rest  (...)   para que se agrupen.
					const { _id, password, google, mail, ...restData } = req.body;
		- A ese  rest  lo modifico/update en base al ID dinamico que recibo con el method de mongoose:   .findByIdAndUpdate(id, dataToUpdate);
					await User.findByIdAndUpdate(id, restData);

	- Validaciones adicionales en el PUT:
	  - Creo en Arr de Middlewares en el  Route
		  - Al Final de cada Arr de Middlewares en cada  endpoind  del route colocar el  middleware eprsonalizado   validateFields   q creamos para q el express-validator  capte los  err  y los almacene en el  validationResult, para que asi podamos enviarlos en formato JSON y no se rompa la app ante un error.
			- Challenge to myself: Solo el Admin pueda cambiar el   role   de cada user.

	- GET: Obtener todos los User con una Paginacion
	  - Los querys los recuperamos con el destructuring del   req.query
			- rute?something&moreThings 
				? <- para el primer query
				& <- para el resto de querys
	  - Implemento la paginacion con un methods de mongoose. Debemos establecer el 
			from   y el    limit.
				.find()  <-  Devuelve toda la data 
				.find().skip().limit()	<-  skip - desde   |   limit - hasta
	  - Devemos validar que sea un numero

	- Retornar número total de registros en una colección
	  - Para obtener el #total: User.countDocuments({ state: true })
				- .countDocuments()		<--		Devuelve el #total
				- { state: true } <--  Object para contar solo esos, key del Document db
	  - No vamos a eliminar useres de la db, sino q vamos a cambiar su  state  a false.
		- Para que sea mas eficiente debemos hacer un  Primise.all([P_1, P_2, P_n])
		  - Destructuramos los resultados del Promise.all en el Mismo Orden en el que colocamos en el Arr. Destructuring de un Arr q es lo q devuelve esto.
			- Esto ejecuta las promises en paralelo. Hacemos esto cuando una primise NO depende el resultado de la otra promise.
						const [total, users] = await Promise.all([
							User.countDocuments(activeUsers),
							User.find(activeUsers)
								.skip(+from)
								.limit(+limit),
						]);

	- Delete: Borrando un usuario de la base de datos
	  - Ensena 2 formas, cambiando el   state   y borrandolo fisicamente de la db
		  - 1. Cambiando el   state   del document
			  - Para cualquiera q este usando mi servicio REST el user ha sido eliminado, pero para mi, en mi DB, aun lo tengo xq solo se cambio el state.
					await User.findByIdAndUpdate(id, { state: false })  <- state changed
			- 2. Borrar fisicamente:
			 - await User.findByIdAndDelete(id)  <- SI elimina el user de la DB

	- Desplgar REST Server en Heroku
		- No vamos a poder consumir la API desplegada por algo de seguridad. Toca esperar a terminar la S10 para que funcione.
		- Actualizar el repo en GitHub y actualizar en Heroku, como en la S8

	- Variables de entorno personalizadas Heroku
	  - Haciendo esto ya funciono el REST Server desde heroku
	  - No subir el  .env  a GitHub 
			- Dejar de darle seguimiento en Git
						git rm .env --cached
						git add .
						git commit .....

			- Creamos un archivo q si se vaya a subir:  .example.env
			  - Suele tener solo la key de lo que deberia tener
			- Ahora, en Heroku debemos configurar las variables de entorno:
			  - Desde el dashboard: 
				  - deployed > setting > Cnofig Vars > Ponemos la kew y el value
				- Desplegar nuevamenete el proyecto
				  deployed > Deploy > Deploy Branch

			- Desde el CLI de Heroku
			 - 
	  - 
 */

	
	
	
	
	
	
	
	
		
// -------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
/** S8: REST Server
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
 */
