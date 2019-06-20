# Trabajando con con Site Designs en PowerShell

En este laboratorio veremos como podemos trabajar con Site Scripts y Site Designs desde PowerShell

## Desplegando Site Scripts y Site Designs

1. Lo primero que vamos a hacer es conectarnos al sitio de administración de SharePoint, para ello ejecuta el siguiente comando sustituyendo \<tenant> por el nombre de tu tenant

``` PoweShell
$adminSiteUrl = "https://<tenant>-admin.sharepoint.com"
$cred = Get-Credential
Connect-SPOService $adminSiteUrl -Credential $cred
```

2. Ahora vamos a leer el contenido de nuestro fichero json que contiene el script para meter el contenido a una variable, para ello ejecuta donde $siteScriptFile es el path del fichero speakers.json que hemos creado anteriormente

``` PoweShell
$siteScriptContent = Get-Content $siteScriptFile -Raw
```

3. Con el contenido de nuestro script vamos a desplegarlo a SPO con el siguiente comando, donde $siteScriptTitle es el título que vamos a poner a nuestro script

``` PoweShell
$siteScript = Add-SPOSiteScript -Title $siteScriptTitle -Content $siteScriptContent
```

4. Ahora tenemos que añadir nuestro script a nuestro diseño, pero primero vamos a crear unas variables que pasaremos como parámetro a la hora de añadir el script al diseño. Ejecutaremos lo siguiente

``` PoweShell
$webTemplate = "68" #CommunicationSite
$siteDesignTitle = "SPS Workshop Site Design"
$siteDesignDescription = "SPS Workshop Site Design Description"
```

4. Ahora tenemos que añadir nuestro script a nuestro diseño, para ello ejecutamos
``` PoweShell
Add-SPOSiteDesign -SiteScripts $siteScript.Id -Title $siteDesignTitle -WebTemplate $webTemplate -Description $siteDesignDescription 
```

## Ver información de Site Scripts y Site Desings deplegados
1. En este punto vamos a comprobar que realmente se ha desplegado nuestro diseño. Vamos a ejecutar el siguiente comando para ver todos los scripts que tenemos desplegados en SPO

``` PoweShell
Get-SPOSiteScript
```

2. Para ver todos los diseños que tenemos desplegados ejecutamos

``` PoweShell
Get-SPOSiteDesign
```

3. Siempre podemos filtrar esta información, por ejemplo, si queremos devolver únicamente los diseños con un título en particular ejecutamos

``` PoweShell
$siteDesign = Get-SPOSiteDesign | Where-Object {$_.Title -eq $siteDesignTitle} 
```

4. Lo mismo podemos hacer con los scripts

``` PoweShell
$siteScript = Get-SPOSiteScript | Where-Object {$_.Title -eq $siteScriptTitle} | Select -First 1
```

## Modificando Site Scripts y Site Desings

1. Para modificar

## Aplicando Site Designs desde PowerShell

1. Podemos aplicar site designs desde la interfaz de usuario a la hora de crear un site o bien aplicarlo una vez creado. Pero en ocasiones necesitamos aplicarlo programáticamente, esto lo podemos hacer con PowerShell ejecutando el siguiente comando

``` PoweShell
$siteUrl = "https://<tenant>.sharepoint.com/sites/<siteUrl>"
$siteDesignId = "<siteDesignId>"

Invoke-SPOSiteDesign -Identity $siteDesignId -WebUrl $siteUrl
``` 

## Limitando quien puede usar los Site Designs

1. Los site designs son públicos y visibles por todo el mundo por defecto, pero en algunas ocasiones queremos limitar quien puede ver y usar nuestros site designs. Estos permisos los podemos dar tanto a grupos como a usuarios, por ejemplo

``` PoweShell
$adminSiteUrl = "https://<tenant>-admin.sharepoint.com"
$siteDesignId = "<siteDesignId>"
$principals = "Security Group Name", "user@<tenant>.onmicrosoft.com"

$cred = Get-Credential
Connect-SPOService $adminSiteUrl -Credential $cred

Grant-SPOSiteDesignRights -Identity $siteDesignId -Principals $principals -Rights View

```

2. También podemos ver los permisos para un site design ejecutando

``` PoweShell
Get-SPOSiteDesignRights -Identity $siteDesignId
```

## Eliminando Site Scripts y Site Designs
1. Para eliminar un site script necesitaremos su id, una vez que lo hayamos obtenido ejecutamos el siguiente comando

``` PoweShell
Remove-SPOSiteScript -Identity $siteScriptId
```

2. Lo mismo ocurre con los site designs, para elimarlo ejecutaremos el siguiente comando

``` PoweShell
Remove-SPOSiteDesign -Identity $siteDesignId
```