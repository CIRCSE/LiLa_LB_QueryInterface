import React, {Component} from 'react';
import Iframe from "./Iframe";
import "./Sparql.css"
class Sparql extends Component {

    constructor(props) {
        super(props);
    }


    render() {


        const iframe = '<iframe src="https://lila-erc.eu/sparql/" class="iframeLayout" ></iframe>';


        return (
            <div>
                {/*<h1>Sparql</h1>*/}
                <div className="iframeContainer">
                <Iframe iframe={iframe} className="iframeLayout" />
                </div>
            </div>
        );
    }
}

export default Sparql;