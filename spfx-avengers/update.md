# Actualizar versión de SPFx

## Introducción

Este punto es algo bastante común dentro de nuestra vida como desarrolladores de SPFx, que levante la mano quien en mitad de un proyecto no se ha presentado una nueva versión de SPFx. Ante esta salida siempre nos ocasiona dos dudas/preguntas Actualizamos SI/ Ni de broma. En este workshop no vamos a decir que es lo que debemos de hacer, pero como consejo y lo que hago en los proyectos que participo es subir siempre la versión de SPFx. Porque la subo, en primer lugar la nueva versión es posible que alguna issue corrija (aunque tambien puede llevar errores nuevos pero somos avengers y correremos ese riesgo), siempre esta de más ver que ningún método de los que estes utilizando se hayan quedado deprecados o se anuncie su discontinuación o bien los han reimplementado de nuevo (como ha pasado con algunos componentes). En definitiva que para saber si migramos o no lo mejor es ver que novedades tienes y si alguna de ellas ya las podemos aprovechar actualizar la versión.  Además del motivo de porque deberiamos de subir nuestra versión, pensar que si esta aplicación llega a ser duradera en el tiempo cuanto nos puede costar subir la versión de SPFx entre varias? Contra más novedades, más cambios, contra más cambios la probabilidad de que tengamos que cambiar parte de nuestro desarrollo se aumenta, por lo que cuanto antes lo agamos muchisimo mejor.

## Actualizar Yeoman
El primer paso para saber si tenemos nuestra plantilla de Yeoman desactualizada seria poner el siguiente comando:
```js
npm outdated --global
```
Si al ejecutar este comando nos indica que tenemos nuesta solución @microsoft/sharepoint no actualizada  procederemos a actualizarla para ello bastaria con poner el siguiente comando:
```js
npm install @microsoft/generator-sharepoint --global
```

## Opciones de migrar nuestra solución
Una vez, tenemos el yeoman instalado ya podemos actualizar nuestros desarrollo para ello vamos a ver que opciones tenemos:

1. De forma manual

Desde las primeras versión se ha podido migrar la versión modificando el fichero package.json que nos genera la plantilla de Yeoman tal y como escribir en un articulo hace ya un tiempo https://blogs.encamina.com/desarrollandosobresharepoint/como-actualizar-la-solucion-de-spfx/ Ahora bien que pasa cuando alguno de los paquetes no suben de versión, se sustituyen o bien se quitan. En este supuesto, la opción que tendriamos que hacer es crearnos una solución  ver el contenido que tiene el package.json y replicarlo en nuestro desarrollo. Una vez realizado esto que quedaría por hacer? Ver que no se ha roto nada... algo demasiado manual e inclusive costoso cuando se esta en la boragine de sacar un proyecto en forma: tiempo y calidad no se cuestionan. Quien se decida a realizarlo de esta forma en este enlace tienen bastante documentación de como encontrar paquetes obsoletos/nuevos/etc https://docs.microsoft.com/es-es/sharepoint/dev/spfx/toolchain/update-latest-packages 

2. Usando Office365Cli
Office365Cli es un aplicación multiplataforma  creada inicialmente para administrar Office 365 sin importar el sistema operativo o shell que se este utilizando. Poco a poco va cogiendo más funcionalidad y tambien permite administrar proyectos de SharePoint Framework de una forma más sencilla. Desde hace cuestión dentro de un año este proyecto Open Source tambien esta incorporado dentro del proyecto PnP.

Para empezar a utilizarla tendremos que instalar como un paquete npm más.
```js
npm install -g @pnp/office365-cli@latest
```
Una vez instalado lo que tenemos que hacer para utilizar esta herramienta es invocandola con o365 y ya los comando que necesitemos para saber toda la potencia que tiene esta herramienta podemos lanzar el siguiente comando para poder ver todos los cmdlets/acciones que hay actualmente en ella 
```js
o365 help
```
Ahora bien para obtener que acciones tenemos que actualizar en nuestra solución bastaria con irnos a nuestra solución y lanzar el siguiente comando
```js
o365 spfx project upgrade --output md > report.md
```
Como salida de dicha ejecución tendremos un fichero "report.md" con todos los comandos que debemos ejecutar en nuestra solución, asi como que modificaciones en los ficheros de código debemos de llevar a cabo para subir la versión

## Laboratorio
Vamos a subir una versión de Spfx de una solución ya existente, para ello nos clonaremos el repositorio el siguiente repositorio:
```js
git clone https://github.com/AdrianDiaz81/Global-Office-365-Developer-Bootcamp-BCN18.git .
```
Lanzaremos la siguiente instrucción
```js
o365 spfx project upgrade --output md > report.md
```
Y realizaremos todos los pasos que bienen incorporados en el report.md




