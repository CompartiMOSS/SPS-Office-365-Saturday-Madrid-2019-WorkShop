# Proyecto inicial
Descarga los templates de Bot Framework 4 para Visual Studio [aquí](https://marketplace.visualstudio.com/items?itemName=BotBuilder.botbuilderv4) e instálalos.
![descarga e instalación de la plantilla](images/descarga_instalación_vsix.png)
Abre Visual Studio → Crea un nuevo proyecto → escribe “Empty Bot” en la barra de búsqueda de templates → Clica en “Empty Bot” → Clica Next
![crear proyecto nuevo en VS2019](images/create_project.png)
Configura el proyecto nuevo, indica nombre del proyecto, ubicación y nombre de la solución.
![Configura el proyecto nuevo](images/config_nuevo_proyecto.png)
Como resultado tendremos una solución como la que se muestra abajo. Veremos una a una las clases que nos vienen dadas. 
![solución](images/solucion.png)
### 1.	Program
Se crea, instanciando la clase startup; construye y arranca el host web.
 ~~~
public static void Main(string[] args)
{
      CreateWebHostBuilder(args).Build().Run();
}

public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
           .UseStartup<Startup>();
~~~
### 2.	Startup
Como es de esperar, la aplicación se describe en base a los servicios que creamos en la clase Startup. De aquí, vemos interesante el configuration provider de credenciales, que veremos en el punto 3; el bot adapter, que editaremos más tarde; y la clase que implementa IBot, que veremos en el punto 5.# foto
### 3.	Configuration Credential Provider
Esta clase recupera las credenciales de nuestro bot (que crearemos más tarde) del appsettings.json y se las pasa al constructor base que hereda del padre para instanciarse.
El diagrama muestra los tres pasos que el SDK hará por nosotros para conseguir el token de autorización que utilizará para hablar con el Bot Connector.
![auth bot to bot connector](https://docs.microsoft.com/es-es/azure/bot-service/media/connector/auth_bot_to_bot_connector.png?view=azure-bot-service-4.0)
### 4.	Bot Controller
Se especifica la ruta [Route("api/messages")] para el controlador que atenderá peticiones que el botService le envíe. Tenemos un método post que delegará al bot framework adapter el procesamiento de la petición; adaptará la petición a una actividad que podremos controlar en la clase que implementa IBot.
### 5.	Empty Bot
Será el bot que hereda del adapter e implementa IBot. Actualmente, en el momento en que alguien se une a la conversación, envía un “Hello world”.

Vamos a probar que todo esto funciona.