# Creando un site script

En este laboratorio veremos como crear site scripts  para luego incluirlos dentro de un site design.

Lo primero que haremos es crear una carpeta donde incluir los ficheros que contendran los site scripts.

## Creando listas, tipos de contenido y columnas de sitio

1. En la carpeta que hemos creado añadimos un nuevo fichero llamado speakers.json
1. Abrimos el fichero con cualquier editor de texto y añadimos
``` json
    {
        "$schema": "schema.json",
        "actions": [

        ],
        "bindata": {},
        "version": 1
    }
``` 
Con esto ya tenemos la base de nuestro site script, lo que haremos ahora es añadir acciones a nuestro script

3. Vamos a añadir una nueva columna de sitio para almacenar el puesto, para ello dentro de actions añadimos la siguiente acción con el verbo createSiteColumn

``` json
    {
      "verb": "createSiteColumn",
      "fieldType": "Text",
      "internalName": "Puesto",
      "displayName": "Puesto",
      "isRequired": true
    }
```

4. Ahora añadiremos otra columna de sitio para incluir la biografia del speaker, despues de la acción anterior añadimos

``` json
    ,
    {
      "verb": "createSiteColumn",
      "fieldType": "Note",
      "internalName": "Bio",
      "displayName": "Bio",
      "isRequired": false
    }
```

Ten en cuenta que cada acción que añadimos es un elemento dentro de un array, y estos elementos tienen que ir separados por coma ","

5. Ahora vamos a crear el tipo de contenido Speaker que contendrá las dos columnas de sitio que hemos creado, para ello tenemos que crear una acción utilizando el verbo createContentType que es lo que creará el tipo de contenido y dentro de ella crearemos 2 subacciones para añadir al tipo de contenido las columnas de sitio que hemos creado anteriormente, de la siguiente manera

``` json
    {
      "verb": "createContentType",
      "name": "Speaker",
      "id": "0x0100B609FEFDEFAA484299C6DE254182E666",
      "description": "Speakers list content type",
      "parentId": "0x01",
      "hidden": false,
      "subactions": [
        {
          "verb": "addSiteColumn",
          "internalName": "Puesto"
        },
        {
          "verb": "addSiteColumn",
          "internalName": "Bio"
        }
      ]
    }
```

## Crear un tema y desplegarlo en SPO

1. Vamos a crear un tema personalizado y subirlo a SPO. Crea un fichero y llamalo deployTheme.ps1.
1. Abrimos el fichero con cualquier editor de texto o con el ISE de Powershell y creamos una variable que contendrá la paleta de colores del tema.

``` json
    $themepalette = @{
    "themePrimary" = "#056b70";
    "themeLighterAlt" = "#f0f9f9";
    "themeLighter" = "#c4e6e8";
    "themeLight" = "#97d1d4";
    "themeTertiary" = "#48a4a9";
    "themeSecondary" = "#147c81";
    "themeDarkAlt" = "#046065";
    "themeDark" = "#035155";
    "themeDarker" = "#033c3f";
    "neutralLighterAlt" = "#f8f8f8";
    "neutralLighter" = "#f4f4f4";
    "neutralLight" = "#eaeaea";
    "neutralQuaternaryAlt" = "#dadada";
    "neutralQuaternary" = "#d0d0d0";
    "neutralTertiaryAlt" = "#c8c8c8";
    "neutralTertiary" = "#97d1d4";
    "neutralSecondary" = "#48a4a9";
    "neutralPrimaryAlt" = "#147c81";
    "neutralPrimary" = "#056b70";
    "neutralDark" = "#035155";
    "black" = "#033c3f";
    "white" = "#ffffff";
    "primaryBackground" = "#ffffff";
    "primaryText" = "#056b70";
    "bodyBackground" = "#ffffff";
    "bodyText" = "#056b70";
    "disabledBackground" = "#ffffff";
    "disabledText" = "#ffffff";
    }
``` 
3. Conectamos con el sitio de administración de SharePoint. Sustituye \<tenant\> por el nombre de tu tenant

``` PoweShell
$adminSiteUrl = "https://<tenant>-admin.sharepoint.com"
$cred = Get-Credential
Connect-SPOService $adminSiteUrl -Credential $cred
```

4. Añadimos el tema en SPO

``` PoweShell
Add-SPOTheme -Identity "SPS Theme" -Palette $themepalette -IsInverted $false
```

5. Ejecuta el fichero ps1

6. Ejecuta el comando Get-SPOTheme para devolver todos los temas desplegados y comprueba que se encuentra el que acabamos de crear

## Personalizar el sitio

1. Vamos a modificar nuestro script para que aplique el tema que hemos desplegado en el paso anterior, para ello vamos a añadir una nueva acción con el siguiente contenido

``` json
    {
      "verb": "applyTheme",
      "themeName": "SPS Theme"
    }
```

2. En nuestro sitio queremos que el menú de navegación contenga un nuevo enlace, así que vamos a añadirlo incluyendo la siguiente acción en nuestro script

``` json
    {
       "verb": "addNavLink",
       "url": "http://www.spsevents.org/city/Madrid/Madrid2019/home",
       "displayName": "SPS Madrid"
    }
```

3. También podemos eliminar opciones del menú de navegación, por ejemplo, vamos a eliminar el enlace a Páginas añadiendo la siguiente acción
``` json
    {
        "verb": "removeNavLink",
        "displayName": "Pages",
        "isWebRelative": true
    }
``` 
## Manejar usuarios externos

1. En nuestro sitio no vamos a permitir compartir con usuarios externos, por lo que vamos a deshabilitarlo desde nuestro script

2. Para ello vamos a añadir una nueva acción en nuestro script con el siguiente contenido

``` json
    {
      "verb": "setSiteExternalSharingCapability",
      "capability": "Disabled"
    }

```

## Unir el sitio a un hub

1. El último paso que vamos a realizar es unir el sitio al que apliquemos el diseño a un hub. Para ello lo primero que vamos a hacer es crear un sitio y registrarlo como hub.

2. Este paso podríamos hacerlo por la interfaz de usuario, pero vamos a hacerlo con PowerShell. Abre una ventana de PowerShell

3. Ejecuta el siguiente comando para conectarte a la administración de SharePoint

``` PoweShell
$adminSiteUrl = "https://<tenant>-admin.sharepoint.com"
$cred = Get-Credential
Connect-SPOService $adminSiteUrl -Credential $cred
```

4. Ejecuta el siguiente comando para crear un nuevo sitio de comunicación, modificando \<tenant> por el nombre de tu tenant y \<owner> por el usuario propietario del site

``` PoweShell
New-SPOSite -Url https://<tenant>.sharepoint.com/sites/SPSEvents -Title "SPS Events" -Owner <owner> -StorageQuota 1000 -Template "SITEPAGEPUBLISHING#0"
```

5. Ejecuta el siguiente comando para registrar el sitio como un hub site, sustituyendo \<hubSiteUrl> por la url del sitio que hemos creado en el paso anterior y \<owner> por el usuario propietario del hub
``` PoweShell
Register-SPOHubSite -Site <hubSiteUrl> -Principals <owner>
```

6. Al ejecutar el comando anterior se muestra por pantalla información del hub que hemos creado. Copia el ID que muestra que nos hará falta para incluirlo en nuestro scrip.

7. Abrimos el fichero que contiene nuestro script y añadimos una nueva acción para incluir el sitio en el hub que hemos creado, el contenido de esta acción será el siguiente. Hay que sustituir \<hubSiteID> por el ID que hemos copiado en el paso anterior

``` json
    {
      "verb": "joinHubSite",
      "hubSiteId": "<hubSiteID>"
    }

``` 

8. Guardamos el fichero con nuestro script. En el siguiente laboratorio veremos como desplegar este script y trabajar con los scripts y diseños de sitio con PowerShell