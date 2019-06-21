import * as React from 'react';
import styles from './AvengerPeoplePicker.module.scss';
import { IAvengerPeoplePickerProps } from './IAvengerPeoplePickerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ListAvenger } from 'avenger-library';​
import IAvengers from 'avenger-library/lib/avengerLibrary/model/iavengers';
export default class AvengerPeoplePicker extends React.Component<IAvengerPeoplePickerProps, {}> {
public avengerCollection:IAvengers[]=[];
  constructor(props:any) {
    super(props);
    const hulkAvenger:IAvengers= {
      id: "2",
      name: "Hulk",
      image: "https://i.kinja-img.com/gawker-media/image/upload/s--gA6KuMPG--/c_scale,f_auto,fl_progressive,q_80,w_800/qtlzkj1nt13ybo6e3an8.jpg",
      description: "Hulk con el mismo tacto que un servidor"
    };
    const viudaNegra:IAvengers=    {
      id: "5",
      name: "Viuda Negra",
      image: "http://es.web.img3.acsta.net/newsv7/18/12/30/15/11/1409920.jpg",
      description: "A quién se parece :)"
    };
    const capitanAmerica:IAvengers={    
      id: "4",
      name: "Capitan Azure",
      image: "https://img-cdn.hipertextual.com/files/2018/11/avengers-infinity-war-captain-america.jpg?strip=all&lossy=1&quality=70&resize=740%2C490&ssl=1",
      description: "Os suena este??"
    };
    this.avengerCollection.push(hulkAvenger);
    this.avengerCollection.push(viudaNegra);
    this.avengerCollection.push(capitanAmerica);

  }
  public render(): React.ReactElement<IAvengerPeoplePickerProps> {
 
    return (

      <div className={ styles.avengerPeoplePicker }>
              <ListAvenger avengerCollection={this.avengerCollection}></ListAvenger>
      </div>
    );
  }
}
