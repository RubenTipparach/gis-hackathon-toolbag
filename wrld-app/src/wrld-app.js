import React from 'react';

import Wrld from 'wrld.js';
import $ from 'jquery';
import { Grid, Container, Segment } from 'semantic-ui-react';
import './index.css';

export default class WrldApp extends React.Component{
    
    constructor(props)
    {
        super(props);
        this.map = null;
    }

    render()
    {
        return (
            <div>
                    <div id="map"  className="mapStyle" ></div>

                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment inverted style={{margin: 10}}>
                                A card thing
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>);
        // return <div>stuff</div>;
    }

    componentDidMount()
    {
       this.map = Wrld.map("map", "99303d0a860e61dddbb976c9d437a098",{
            center: [46.8778, -96.7881],
            zoom: 16
        });

        var times = [Wrld.themes.time.Dawn,
            Wrld.themes.time.Day,
            Wrld.themes.time.Dusk,
            Wrld.themes.time.Night];

        this.map.themes.setTime(times[3]);
        $.get( "http://localhost:3001/api/FireEvents", ( data ) => {
            data.forEach((p) => {
                var marker = Wrld.marker([p.location.lat, p.location.lng], { title: p.address }).addTo(this.map);
            }, this);
            console.log( data );
          });
    }
}