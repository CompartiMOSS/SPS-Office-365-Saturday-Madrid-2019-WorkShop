# xFx Un Framewrok para dominarlos a todos (SPS Madrid 2019 Workshop)

## Introduccion

En este workshop vamos a desarrollar un webpart spfx que podrá ejecutarse tanto en SharePoint como en Teams.

Dicho webpart, nos va a permitir etiquetar un Team, usando un TermSet de SharePoint, almacenando dicha información 'extra' en una Schema extension de Graph. Además, el webpart nos va a permitir buscar otros Teams etiquetados con los mismos Tags.

![teams-tagging](./assets/teams-tagging.png)

_Nota_: xFx todavía no existe como tal, pero es el nombre con el que se empieza a conocer entra la comunidad _OfficeDev PnP_ a la posibilidad de que el mismo modelo de desarrollo para SharePoint, sirva para otras plataformas, como ya ocurre con Teams, y en un futuro podría ser Office, etc.

## Creacion de una Schema Extension en MS Graph API

Para guardar los Tags asociados al Team, vamos a utilizar una Schema Extension en MS Graph API. Graph extensions permiten agregar informacion personalizada a entidades de Graph, como Users, Groups/Teams, Events, Mails, etc.

Para crear la extension, recomendamos usar la herramienta Graph Explorer [https://developer.microsoft.com/en-us/graph/graph-explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)

Primero asegurate de que das el permiso _Directory.AccessAsUser.All_ a Graph Explorer, y una vez hecho, debes hacer un POST a _https://graph.microsoft.com/v1.0/schemaExtensions_ con el siguiente _body_ (asegurate de actualizar los valores que correspondan)

| Parameter        | Type           | Description  |
| ------------- |-------------| -----|
| id | String | The unique identifier for the schema extension definition. You can assign a value in one of two ways: <ul><li>Concatenate the name of one of your verified domains with a name for the schema extension to form a unique string in this format, {domainName}_{schemaName}. As an example, contoso_mySchema. NOTE: Only verified domains under the following top-level domains are supported: .com,.net, .gov, .edu or .org.</li><li>Provide a schema name, and let Microsoft Graph use that schema name to complete the id assignment in this format: ext{8-random-alphanumeric-chars}_{schema-name}. An example would be extkvbmkofy_mySchema.</li></ul>This property cannot be changed after creation.
| owner | String | Aunque este parámetro es _optional_ cuando se usa el Graph Explorer, se debe establecer. El valor de dicho parámetro debe ser el _ClientId_ de cualquier aplicación registrada en el Azure Active Directory de nuestr Tenant. Sólo es necesario un registro básico, sin especificar nada relativo a permisos. Aquí tienes como registrar una App en Azure AD: [https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)|

```js
POST https://graph.microsoft.com/v1.0/schemaExtensions
content-type: application/json
{
    "id": "spsmad19TeamsTagging",
    "description": "Adding Tags to Teams",
    "owner": "bbb1b0ef-2f6b-4b50-bcc9-b6a062f202c2",
    "targetTypes": [
        "Group"
    ],
    "properties": [
        {
            "name": "tag1", "type": "String"
        },
        {
            "name": "tag2", "type": "String"
        },
        {
            "name": "tag3", "type": "String"
        }
    ]
}
```

En algunos casos, durante la semana previa al _workshop_ nos hemos encontrado con una respuesta 500 al crear la Schema Extension:
```json
{
    "error": {
        "code": "InternalServerError",
        "message": "Value cannot be null.\r\nParameter name: o",
        "innerError": {
            "request-id": "5ef53ad8-0bc8-436d-8385-5761b91c3e98",
            "date": "2019-06-17T06:38:56"
        }
    }
}
```

Sin embargo, a pesar del mensaje de error, la extensión acababa creándose. Puedes comprobar si la extensión se ha creado, con la siguiente query:
```js
https://graph.microsoft.com/v1.0/schemaExtensions?$filter=owner eq 'YOUR_OWNER_ID_HERE'
```

__Nota__: Lo más probable es que hayas creado la extensión utilizando un __id__ que no incluía un dominio verificado, por lo que el ID de la extensión se habrá autogenerado como: __ext{8-random-alphanumeric-chars}_{schema-name}__. Si no has obtenido el error 500, el _id_ generado se mostrará en la respuesta. Si obtuviste el error, entonces el ID lo puedes averiguar con la Query anterior que filtra las Schema extensions creadas por un owner.

__Copia y guarda el _id_ generado, ya que lo necesitaremos más adelante en nuestro código spfx__

## Creacion proyecto spfx

Antes de nada, debemos crear un proyecto spfx usando la plantilla de Yeoman:

```powershell
yo @microsoft/sharepoint --plusbeta
```
- Accept the default __react-teams-tagging__ as your solution name, and then select Enter.
- Select SharePoint Online only (latest), and then select Enter.
- Select Use the current folder as the location for the files.
- __Select Y to ensure that your web part is automatically deployed tenant wide when it's added to the tenant app catalog.__
- Select N on the question if solution contains unique permissions.
- Select WebPart as the client-side component type to be created.

- Enter __TeamsTagging__ for the web part name, and then select Enter.
- Enter _Webpart to Tag Teams based on a SharePoint TermSet_ as the description of the web part, and then select Enter.
- Enter __React__ option for the framework, and then select Enter to continue.

Despues de unos pocos minutos, tendremos disponible nuestro proyecto spfx base creado. Ya podemos pasar a editar nuestro codigo.

## Obteniendo datos de una Schema Extension en spfx

Nuestro webpart va a permitir seleccionar los tags de un TermSet específico en SharePoint, así que primero de todo vas a necesitar crear un TermSet específico en tu tenant de SharePoint (o reutilizar alguno existente, si lo prefieres). Coge el _id_ de ese TermSet, ya que también vamos a necesitar referenciarlo en nuestro código. El TermSet id será configurado como una propiedad de nuestro webpart, así que asegurate de actualizar la siguiente interfaz:

```ts
export interface ITeamsTaggingWebPartProps {
  termSetId: string;
}
```

Nuestro componente React va a necesitar realizar varias llamadas a la API Graph. Para ello, haremos uso del objeto _graphHttpClient_ disponible en el contexto. Para ello, debemos pasar ese objeto desde nuestro webpart, al componente spfx, así que primero de nada vamos a añadir una propiedad más a la interfaz del componente React, junto con el TermSet ID, que también pasará desde el webpart, al componente React (edita el fichero _ITeamsTaggingProps.ts_)

```ts
export interface ITeamsTaggingProps {
  termSetId: string;
  context: WebPartContext;
}
```

Ahora, podemos actualizar la function _render_ de nuestro webpart para pasar el termSetId y context (donde tendremos el graphHttpClient) a nuestro componente React:

```ts
  public render(): void {
    const element: React.ReactElement<ITeamsTaggingProps > = React.createElement(
      TeamsTagging,
      {
        termSetId: this.properties.termSetId,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }
```

Nuestro componente React va a mantener en el estado la lista de los Tags seleccionados, así como una lista de los Teams que tienen Tags similares, así que necesitamos crear un nuevo fichero: _./components/ITeamsTaggingState.ts_, con el siguiente código:

```ts
import { ITeamInfo } from "./ITeamsTaggingProps";
import { IPickerTerms } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";

export interface ITeamsTaggingState {
  similarTeams: ITeamInfo[];
  tags: IPickerTerms;
  tagsUpdatedResult: string;
}
```

La interfaz del webpart, va a hacer uso de los componentes React del PnP, en concreto del TaxonomyPicker, así que necesitamos instalar el paquete haciendo uso de _npm_, para ello ejecuta:

```powershell
npm install --save @pnp/spfx-controls-react
```

El webpart mostrará un Taxonomy picker para que el usuario seleccione los Tags (o vea los que se guardaron), además de un botón para guardar los nuevos tags seleccionados, y otro botón para buscar Teams que tienen los mismos Tags. Actualiza el método _render_ del componente React con el siguiente código:

```ts
  public render(): React.ReactElement<ITeamsTaggingProps> {

    let similarTeams: any;
    if (this.state.similarTeams.length > 0) {
      similarTeams = <div><h3>Similar teams:</h3><ul>
        {this.state.similarTeams.map(t => <li>{t.name} ({t.tags.map(tag => <span>{tag}, </span>)}) </li>)}
      </ul></div>;
    }

    return (
      <div className={styles.teamsTagging}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>

              <div>
                <TaxonomyPicker allowMultipleSelections={true}
                  termsetNameOrID={this.props.termSetId}
                  panelTitle="Select Term"
                  label="Select Tags for Team/Group..."
                  context={this.props.context}
                  onChange={this._onTaxPickerChange}
                  isTermSetSelectable={false}
                  initialValues={this.state.tags} />

                <DefaultButton
                  primary={true}
                  text="Update Team Tags"
                  onClick={this._updateTeamTags}
                />

                <p>{this.state.tagsUpdatedResult}</p>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <DefaultButton
                primary={true}
                text="Find similar Teams *"
                onClick={this._findSimilarTeams}
              />
              * (only using 1st tag)
              {similarTeams}
            </div>
          </div>
        </div>
      </div>
    );
  }
```

Para obtener los Tags almacenados, primero necesitamos hacer una llamada a MS Graph, cosa que haremos dentro del método de componente _componentDidMount_, que se ejecuta una vez el componente ya está montado, y que es el sitio idóneo para hacer llamadas asíncronas y obtener datos al "cargar" el componente:

```ts
  public componentDidMount(): void {
    this._getTeamTags().then((value) => {
      console.log(value);
      this.setState({
        tags: value
      });
    });
  }
```

Antes de ver la función _getTeamTags_, tan solo comentar que el Taxonomy picker necesita la siguiente información de un Term para poder enlazarlo al control:
- key: term id
- name: label del Term
- path: part to the Term
- termSet: id of the TermSet

Siendo así, vamos a necesitar un par de funciones para hacer una especie de Serialize / Deserailize de esta información, ya que la info almacenada en Graph, será un simple string por cada Term (en el ejemplo tendremos un máximo de 3 Tags/Terms):

```ts
  private _toIPickerTerm(input: string): IPickerTerm
  {
    const parts: string[] = input.split(this.separator);
    const pickerTerm: IPickerTerm = {
      key: parts[0],
      name: parts[1],
      path: parts[2],
      termSet: parts[3]
    };
    return pickerTerm;
  }

  private _serializeIPickerTerm(term: IPickerTerm): string {
    return `${term.key}${this.separator}${term.name}${this.separator}${term.path}${this.separator}${term.termSet}`;
  }
```

Al principio del componente añade el siguiente código para definir el _separator_ que utilizaremos a la hora de Serialize / Deserialize:
```ts
  private readonly separator: string = "__";
```

Ahora definimos la función para obtener datos de nuestra Schema extensión (actualiza el ID de tu Schema extension __SCHEMA_EXTENSION_ID__, tanto en la llamada, como en el objeto de respuesta):

```ts
  private async _getTeamTags(): Promise<IPickerTerms> {
    const groupId: Guid = this.props.context.pageContext.site.group.id;

    const response: HttpClientResponse = await this.props.context.graphHttpClient.get(
      `v1.0/groups/${groupId}/?$select=id,displayName,SCHEMA_EXTENSION_ID`,
      GraphHttpClient.configurations.v1);

    const responseJson: any = await response.json();

    let tags: IPickerTerms = [];
    if (responseJson.SCHEMA_EXTENSION_ID.tag1) tags.push(this._toIPickerTerm(responseJson.SCHEMA_EXTENSION_ID.tag1));
    if (responseJson.SCHEMA_EXTENSION_ID.tag2) tags.push(this._toIPickerTerm(responseJson.SCHEMA_EXTENSION_ID.tag2));
    if (responseJson.SCHEMA_EXTENSION_ID.tag3) tags.push(this._toIPickerTerm(responseJson.SCHEMA_EXTENSION_ID.tag3));

    return tags;
  }
```