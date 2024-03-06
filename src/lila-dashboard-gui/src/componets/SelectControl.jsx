import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import CircularProgress from '@material-ui/core/CircularProgress';




class SelectControl extends Component {



    constructor(props) {
        super(props);
    }
    handleChange = (e)=>{
        this.props.onChangeValue(e.target.value)
    }



    render() {

        return (
            <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                    {this.props.icon}
                </Grid>
                <Grid item>
                    <FormControl disabled={this.props.disabled}>
                        {this.props.process?
                        <CircularProgress
                            variant="indeterminate"
                            disableShrink
                            style={{ color: '#686868',
                                animationDuration: '550ms',
                                left: 0,
                                position: "absolute",
                                marginTop: "-10px",
                                marginLeft: "-37px"}}
                            size={18}
                            thickness={4}
                        />:""}
                        <InputLabel htmlFor={"wfl_"+this.props.label} className={"noselect"}>Select {this.props.label}</InputLabel>
                        <NativeSelect
                            value={this.props.value}
                            onChange={(e) => {
                                this.handleChange(e)
                            }}
                            inputProps={{
                                name: "wfl_"+this.props.label,
                                id: "wfl_"+this.props.label,
                                style:{minWidth:"100px"}
                            }}
                        >
                            <option value={""} ></option>
                            {this.props.values}
                        </NativeSelect>
                    </FormControl>
                </Grid>

            </Grid>
        );
    }
}

export default SelectControl;