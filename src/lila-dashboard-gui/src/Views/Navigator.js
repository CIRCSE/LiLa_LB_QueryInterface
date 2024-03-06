import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import {ReactComponent as Sparql} from "../icons/sparql.svg"

// import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
// import PublicIcon from '@material-ui/icons/Public';
// import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
// import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
// import TimerIcon from '@material-ui/icons/Timer';
// import SettingsIcon from '@material-ui/icons/Settings';
// import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import {
    BrowserRouter as Router,
    // Switch,
    // Route,
    NavLink
} from "react-router-dom";
// import ReactDOM from "react-dom";

const categories = [
    {
        id: 'Options',
        children: [
            {id: '/query', icon: <PeopleIcon/>, text: 'Query Interface', active: true},
            {id: '/sparql', icon: <Sparql style={{width: "1em",height: "1em",fill: 'rgba(255, 255, 255, 0.7)'}}/>, text: 'Sparql Endpoint'}
        ],
    }
];

const styles = theme => ({
    categoryHeader: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    categoryHeaderPrimary: {
        color: theme.palette.common.white,
    },
    item: {
        paddingTop: 1,
        paddingBottom: 1,
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover,&:focus': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
    },
    itemCategory: {
        backgroundColor: '#232f3e',
        boxShadow: '0 -1px 0 #404854 inset',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    firebase: {
        fontSize: 24,
        color: theme.palette.common.white,
    },
    itemActiveItem: {
        color: '#4fc3f7',
    },
    itemPrimary: {
        fontSize: 'inherit',
    },
    itemIcon: {
        minWidth: 'auto',
        marginRight: theme.spacing(2),
    },
    divider: {
        marginTop: theme.spacing(2),
    },
});

function Navigator(props) {
    const {classes, ...other} = props;

    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
                    LiLa Dashboard
                </ListItem>
                <ListItem className={clsx(classes.item, classes.itemCategory)}>
                    <a href="https://lila-erc.eu" style={{color:'inherit',display:'flex',alignItems:'center',textDecoration:'none'}}>
                        <ListItemIcon className={classes.itemIcon}>
                        <HomeIcon/>
                    </ListItemIcon>
                    <ListItemText
                        classes={{
                            primary: classes.itemPrimary,
                        }}
                    >
                       LiLa Home Page
                    </ListItemText></a>
                </ListItem>
                <Router forceRefresh={true}>
                    {categories.map(({id, children}) => (
                        <React.Fragment key={id}>
                            <ListItem className={classes.categoryHeader}>
                                <ListItemText
                                    classes={{
                                        primary: classes.categoryHeaderPrimary,
                                    }}
                                >
                                    {id}
                                </ListItemText>
                            </ListItem>
                            {children.map(({id: childId, icon, text, active}) => (
                                <NavLink
                                    key={childId}
                                    to={childId}
                                    className={classes.item}
                                    style={{textDecoration: 'none'}}
                                    activeStyle={{
                                        fontWeight: "bold",
                                        color: "#4fc3f7"
                                    }}
                                >
                                    <ListItem>
                                        <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                                        <ListItemText
                                            classes={{
                                                primary: classes.itemPrimary,
                                            }}
                                        >
                                            {text}
                                        </ListItemText>
                                    </ListItem>
                                </NavLink>
                            ))}

                            <Divider className={classes.divider}/>
                        </React.Fragment>
                    ))}

                </Router>
            </List>

        </Drawer>
    );


}

Navigator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
