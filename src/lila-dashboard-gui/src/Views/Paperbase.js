import React from 'react';
import PropTypes from 'prop-types';
import {createMuiTheme, ThemeProvider, withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
// import Typography from '@material-ui/core/Typography';
// import Link from '@material-ui/core/Link';
import Navigator from './Navigator';
import Query from "./Query";
import Sparql from "./Sparql";
import Header from './Header';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

//
// function Copyright() {
//     return (
//         <Typography variant="body2" color="textSecondary" align="center">
//             {'Copyright © '}
//             <Link color="inherit" href="https://lila-erc.eu">
//                 LiLa ERC
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

let theme = createMuiTheme({
    palette: {
        primary: {
            light: '#63ccff',
            main: '#009be5',
            dark: '#006db3',
        },
    },
    typography: {
        h5: {
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: 0.5,
        },
    },
    shape: {
        borderRadius: 8,
    },
    props: {
        MuiTab: {
            disableRipple: true,
        },
    },
    mixins: {
        toolbar: {
            minHeight: 48,
        },
    },
});

theme = {
    ...theme,
    overrides: {
        MuiDrawer: {
            paper: {
                backgroundColor: '#18202c',
            },
        },
        MuiButton: {
            label: {
                textTransform: 'none',
            },
            contained: {
                boxShadow: 'none',
                '&:active': {
                    boxShadow: 'none',
                },
            },
        },
        MuiTabs: {
            root: {
                marginLeft: theme.spacing(1),
            },
            indicator: {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                backgroundColor: theme.palette.common.white,
            },
        },
        MuiTab: {
            root: {
                textTransform: 'none',
                margin: '0 16px',
                minWidth: 0,
                padding: 0,
                [theme.breakpoints.up('md')]: {
                    padding: 0,
                    minWidth: 0,
                },
            },
        },
        MuiIconButton: {
            root: {
                padding: theme.spacing(1),
            },
        },
        MuiTooltip: {
            tooltip: {
                borderRadius: 4,
            },
        },
        MuiDivider: {
            root: {
                backgroundColor: '#404854',
            },
        },
        MuiListItemText: {
            primary: {
                fontWeight: theme.typography.fontWeightMedium,
            },
        },
        MuiListItemIcon: {
            root: {
                color: 'inherit',
                marginRight: 0,
                '& svg': {
                    fontSize: 20,
                },
            },
        },
        MuiAvatar: {
            root: {
                width: 32,
                height: 32,
            },
        },
    },
};

const drawerWidth = 210;

const styles = {
    root: {
        display: 'flex',
        minHeight: '100vh',
        background: 'inherit',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: 0,
            flexShrink: 0,
        },
    },
    app: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'inherit',
    },
    main: {

    },
    footer: {
        padding: theme.spacing(2),
        // background: '#eaeff1',
        position: 'fixed',
        bottom: '0px',
        left: '0px',
        right: '0px',
    },
};

function Paperbase(props) {
    const {classes} = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CssBaseline/>
                <nav className={classes.drawer}>
                    <Navigator
                        PaperProps={{style: {width: drawerWidth}}}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                    />

                </nav>
                <div className={classes.app}>
                    <Header onDrawerToggle={handleDrawerToggle}/>
                    <main className={classes.main}>
                        <Router forceRefresh={true}>
                            <Switch>
                                <Route path="/">
                                    <Query/>
                                </Route>
                                <Route path="/query">
                                    <Query/>
                                </Route>
                                <Route path="/sparql">
                                    <Sparql/>
                                </Route>
                            </Switch>
                        </Router>
                    </main>

                </div>
            </div>


        </ThemeProvider>
    );
}

Paperbase.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Paperbase);
