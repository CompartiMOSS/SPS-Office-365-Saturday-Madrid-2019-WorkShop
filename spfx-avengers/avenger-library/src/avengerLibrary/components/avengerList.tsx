import * as React from 'react';
import IAvenger from '../model/iavengers';

export interface IListAvengerProps {
    avengerCollection:IAvenger[];
}


export default class ListAvenger extends React.Component<IListAvengerProps, any> {
    
    constructor(props:IListAvengerProps) {
        super(props);
  
    }

    public render() {    
        
       const evengerCollection:IAvenger[]=this.props.avengerCollection;
    
        let i:number=0;       
return (

<div className="container">
<div className="row">
<div className="col-lg-12 my-3">
            <div className="pull-right">
                <div className="btn-group">
                </div>
            </div>
        </div>
    </div> 
    
    <div id="products" className="row view-group">
        {            
            evengerCollection.map((item:IAvenger)=>{
                i=i+1;
                return (
                    <div className="item col-xs-4 col-lg-4" key={item.id}>
                    <div className="thumbnail card">
                        <div className="img-event">
                            <img className="group list-group-image img-fluid" src={item.image} alt="" />
                        </div>
                        <div className="caption card-body">
                            <h4 className="group card-title inner list-group-item-heading">
                                {item.name}</h4>
                            <p className="group inner list-group-item-text">
                                {item.description}
                            </p>
                            <div className="row">                                
                                <div className="col-xs-12 col-md-6">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                );                
            })
        } 
   </div>                    
</div>);
    }

}