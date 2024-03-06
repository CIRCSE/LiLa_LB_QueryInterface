import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import Search from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class QuerySearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            useRegex : false
        }
    }
    handleChange = (e)=>{

        this.props.onChangeValue(e.target.value,this.state.useRegex)
    }

     toggleChecked = () => {
        let me = this
        let prev = this.state.useRegex
         this.setState({useRegex:!prev},()=>{
             me.props.onChangeValue(this.props.value,this.state.useRegex)
         })

    };

    render() {
        return (
            <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                    <Search/>
                </Grid>
                <Grid item style={{alignItems: "flex-end",display: "flex"}}>
                    <TextField id="input-with-icon-grid"
                               value={this.props.value}
                               disabled={this.props.disabled}
                               label="Search lemma"
                               onChange={event => {
                                    this.handleChange(event)
                               }}
                    />

                       <Switch size="small" color="primary" checked={this.state.useRegex} onChange={()=>{this.toggleChecked()}} />
                       <span>Regex</span>

                </Grid>
            </Grid>
        );
    }
}

export default QuerySearch;