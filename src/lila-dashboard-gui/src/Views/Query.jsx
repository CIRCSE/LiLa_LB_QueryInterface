import React, {Component} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {DragDropContext} from 'react-beautiful-dnd';
import {Droppable} from 'react-beautiful-dnd';
import {Draggable} from 'react-beautiful-dnd';
import {Code, GroupWork, ArrowForward, ArrowBack, BubbleChart, CallMerge, Favorite, Close, Extension, DeviceHub, GetApp, HelpOutline, Assessment, MenuBook, List, ChatBubbleOutline} from "@material-ui/icons";
import * as Papa from 'papaparse';
import MuiVirtualizedTable from "../componets/MuiVirtualizedTable";
import $ from "jquery";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import "./Query.css"
import {ReactComponent as Gender} from "../icons/gender.svg"
import {ReactComponent as Sparql} from "../icons/sparql.svg"
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';

import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faCubes} from '@fortawesome/free-solid-svg-icons'
import QuerySearch from "../componets/QuerySearch";
import SelectControl from "../componets/SelectControl";
import Link from "@material-ui/core/Link";

import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from "clsx";
import {getEtymonQuery, getIGVLLQuery, getLatinAffectusPolarity, getLatinWordnetQuery, getLewisShortQuery, getWflQuery, translatePrefix} from "../utils/Queries";
import IconButton from "@material-ui/core/IconButton";

const _ = require('underscore')
const uuidv4 = require('uuid/v4');
const particlesJS = require('particles.js')

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    padding: grid * 2,
    margin: `0 ${grid}px 0 0`,
    marginTop: '5px',
    // change background colour if dragging
    // background: isDragging ? 'lightgrey' : 'transparent',
    // styles we need to apply on draggables
    ...draggableStyle,
});


const getItemStyleExpanded = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    padding: grid * 2,
    margin: `5px ${grid}px 0 0`,
    // change background colour if dragging
    //background: isDragging ? 'lightgrey' : 'transparent',

    // styles we need to apply on draggables
    ...draggableStyle,
});


const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'rgba(187,187,187,0.43)' : 'transparent',
    display: 'flex',
    flexWrap: isDraggingOver ? 'none' : 'wrap',
    height: 'auto',
    minHeight: '70px',
    padding: grid,
    overflow: 'hidden',
    borderRadius: '4px'

});

const getListStyleTarget = isDraggingOver => ({
    background: isDraggingOver ? 'rgba(187,187,187,0.43)' : 'rgba(187,187,187,0.17)',
    display: 'flex',
    flexWrap: isDraggingOver ? 'none' : 'wrap',
    height: 'auto',
    minHeight: '90px',
    padding: grid,
    overflow: 'hidden',
    borderRadius: '4px'

});


const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://lila-erc.eu">
                LiLa ERC
            </Link>{' '}
            {new Date().getFullYear()}
            {''}
        </Typography>
    );
}


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function CloseIcon() {
    return null;
}

class Query extends Component {


    useStyles = undefined

    constructor(props) {
        super(props);


        this.selectPrefix = React.createRef();
        this.selectSuffix = React.createRef();
        this.selectBase = React.createRef();
        this.selectGender = React.createRef();
        this.selectPos = React.createRef();
        this.selectInflection = React.createRef();


        this.useStyles = makeStyles({
            card: {
                minWidth: 275,
            },
            bullet: {
                display: 'inline-block',
                margin: '0 2px',
                transform: 'scale(0.8)',
            },
            title: {
                fontSize: 14,
            },
            pos: {
                marginBottom: 12,
            },
        });

        this.state = {
            setName: "",
            items: [],
            selected: [],
            queryResults: [],
            resultCSV: "",
            lemmaSearch: "",
            prefix: "",
            prefixes: [],
            suffix: "",
            suffixes: [],
            gender: "",
            genders: [],
            base: "",
            basis: [],
            pos: "",
            poss: [],
            inflection: "",
            inflections: "",
            progressSuffix: false,
            progressPrefix: false,
            progressBase: false,
            progressGender: false,
            progressPos: false,
            progressInflection: false,
            showResults: 'block',
            runningQuery: 'none',
            injectValues: [],
            controlDisabled: false,
            draggableDisable: false,
            currentSparqlQuery: "",
            showNotification: false,
            notificationMessage: "",
            useRegex: false,
            onDragging: false,
            dialogOpen: false,
            lexicaldialogOpen: false,
            lexicaldialogResource: "",
            lexicaldialogContent: ""

        };
    }

    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };


    handleToggleDialog() {
        let dialogStatus = this.state.dialogOpen
        this.setState({dialogOpen: !dialogStatus})
    }

    handleToggleLexicalDialog() {
        let lexicaldialogStatus = this.state.lexicaldialogOpen
        this.setState({lexicaldialogOpen: !lexicaldialogStatus})
    }


    componentDidMount() {

        window.particlesJS.load('particles-js', 'assets/particles.json')
        this.setState({items: this.getQueryItems()})
    }

    getList = id => this.state[this.id2List[id]];


    getQueryItems = () => {
        let items = []
        items.push({
            id: "queryModule",
            content: "Lemma",
            icon: <Code style={{fontSize: "2em"}}/>,
            commonQuery: "SELECT ?subject ?poslink ?pos (group_concat(distinct ?wr ; separator=\" \") as ?wrs) WHERE { \n" +
                "  ?subject <http://www.w3.org/ns/lemon/ontolex#writtenRep> ?object ; \n" +
                "           <http://lila-erc.eu/ontologies/lila/hasPOS> ?poslink . \n" +
                "  ?poslink <http://www.w3.org/2000/01/rdf-schema#label> ?pos .\n" +
                "  ?subject <http://www.w3.org/ns/lemon/ontolex#writtenRep> ?wr .\n" +
                "  FILTER regex(?object, \"injectValue\",\"i\")} \n" +
                "GROUP BY  ?subject ?poslink ?pos\n" +
                "ORDER BY ?wrs "
        })
        items.push({
            id: "prefixModule",
            content: "Prefix",
            icon: <ArrowForward style={{fontSize: "2em"}}/>,
            commonQuery: "SELECT ?prefisso  ?labelPrefix  WHERE { \n" +
                "      injectValue\n" +
                "      \t\t?subject <http://lila-erc.eu/ontologies/lila/hasPrefix> ?prefisso.\n" +
                "  \t\t\t?prefisso <http://www.w3.org/2000/01/rdf-schema#label> ?labelPrefix.\n" +
                "    \t\t?prefisso <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://lila-erc.eu/ontologies/lila/Prefix> .\n" +
                "\t\n" +
                "nestedQuery\n" +
                "\t\t} GROUP BY ?prefisso ?labelPrefix ORDER BY ?labelPrefix "
        })
        items.push({
            id: "suffixModule",
            content: "Suffix",
            icon: <ArrowBack style={{fontSize: "2em"}}/>,
            commonQuery: "SELECT ?suffisso ?labelSuffix  WHERE { \n" +
                "      injectValue\n" +
                "      \t\t?subject <http://lila-erc.eu/ontologies/lila/hasSuffix> ?suffisso.\n" +
                "  \t\t\t?suffisso <http://www.w3.org/2000/01/rdf-schema#label> ?labelSuffix.\n" +
                "    \t\t?suffisso <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://lila-erc.eu/ontologies/lila/Suffix> .\n" +
                "\t\n" +
                "nestedQuery\n" +
                "\t\t} GROUP BY ?suffisso ?labelSuffix ORDER BY ?labelSuffix "
        })
        items.push({
            id: "baseModule",
            content: "Base",
            icon: <GroupWork style={{fontSize: "2em"}}/>,
            commonQuery: "SELECT ?base ?labelBase  WHERE { \n" +
                "      injectValue\n" +
                "      \t\t?subject <http://lila-erc.eu/ontologies/lila/hasBase> ?base.\n" +
                "  \t\t\t?base <http://www.w3.org/2000/01/rdf-schema#label> ?labelBase.\n" +
                "    \t\t?base <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://lila-erc.eu/ontologies/lila/Base> .\n" +
                "\t\n" +
                "nestedQuery\n" +
                "\t\t} GROUP BY ?base ?labelBase ORDER BY ?labelBase "
        })
        items.push({
            id: "genderModule",
            content: "Gender",
            icon: <Gender style={{width: "2em"}}/>,
            commonQuery: "SELECT ?gender ?labelGender  WHERE { \n" +
                "      injectValue\n" +
                "\t?subject <http://lila-erc.eu/ontologies/lila/hasGender> ?gender.\n" +
                "\t?gender <http://www.w3.org/2000/01/rdf-schema#label> ?labelGender.\n" +
                "  \t?gender <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#NamedIndividual> .    \n" +
                "nestedQuery\n" +
                "} GROUP BY ?gender ?labelGender ORDER BY ?labelGender "
        })
        items.push({
            id: "posModule",
            content: "PoS",
            icon: <Extension style={{fontSize: "2em"}}/>,
            commonQuery: "SELECT ?pos ?labelPos  WHERE { \n" +
                "      injectValue\n" +
                "\t?subject <http://lila-erc.eu/ontologies/lila/hasPOS> ?pos.\n" +
                "\t?pos <http://www.w3.org/2000/01/rdf-schema#label> ?labelPos.\n" +
                "  \t?pos <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#NamedIndividual> .    \n" +
                "nestedQuery\n" +
                "} GROUP BY ?pos ?labelPos ORDER BY ?labelPos "
        })
        items.push({
            id: "inflectionModule",
            content: "Inflection",
            icon: <DeviceHub style={{fontSize: "2em"}}/>,
            commonQuery: "SELECT ?inflection ?labelInflection  WHERE { \n" +
                "      injectValue\n" +
                "\t?subject <http://lila-erc.eu/ontologies/lila/hasInflectionType> ?inflection.\n" +
                "\t?inflection <http://www.w3.org/2000/01/rdf-schema#label> ?labelInflection.\n" +
                "  \t?inflection <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#NamedIndividual> .    \n" +
                "nestedQuery\n" +
                "} GROUP BY ?inflection ?labelInflection ORDER BY ?inflection "
        })

        return items
    }


    onDragEnd = result => {
        let me = this
        const {source, destination} = result;
        this.setState({onDragging: false})
        // dropped outside the list
        if (!destination) {
            return;
        }
        // reorder
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = {items};

            if (source.droppableId === 'droppable2') {
                state = {selected: items};
                this.setState(state, () => {
                    // reloadcontroldata
                    me.reloadControlData()
                });
            } else {
                this.setState(state);
            }


        } else { // move
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                items: result.droppable,
                selected: result.droppable2
            }, () => {
                me.reloadControlData()
                // reloadcontrolData
            });
        }
    };

    closeNotification = () => {
        this.setState({showNotification: false})
    };

    copyModule(module) {
        if (this.state.draggableDisable) {
            return
        }
        let me = this
        let items = this.state.items;
        let selected = this.state.selected;
        items = _.without(items, module);
        selected.push(module)

        this.setState({
            items: items,
            selected: selected
        }, () => {
            me.reloadControlData()
            //me.getResults()
        });

    }

    reverseCopyModule(module) {
        if (this.state.draggableDisable) {
            return
        }
        //  console.log(module)
        let me = this
        let items = this.state.items;
        let selected = this.state.selected;
        selected = _.without(selected, module);
        items.push(module)

        this.setState({
            items: items,
            selected: selected
        }, () => {
            me.reloadControlData()
            // me.getResults()
        });

    }

    checkOptionsCompatibility(optList, selectorValue, callback) {
        let isGood = false

        optList.forEach((opt) => {
            if (opt.props.value === this.state[selectorValue]) {
                isGood = true
            }
        })

        if (isGood) {
            callback(true)
        } else {
            this.setState({[selectorValue]: ""}, () => {
                callback(true)
            })
        }
    }


    reloadControlData() {
        let me = this

        let injectValues = []
        let remaingControlToUpdate = this.state.selected.length
        this.state.selected.forEach((item, index) => {
            if (item.id === 'queryModule') {
                if (me.state.lemmaSearch.length) {
                    let querystring = me.state.lemmaSearch.toLocaleLowerCase().replace(/j/g, "i").replace(/v/g, "u")
                    if (!me.state.useRegex) {
                        querystring = querystring.replace(/[^A-Za-z0-9]/g, "")
                        querystring = "^" + querystring
                    }
                    injectValues.push("?subject <http://www.w3.org/ns/lemon/ontolex#writtenRep> ?wrp . FILTER regex(?wrp, \"" + querystring + "\",\"i\") . ")
                }
                remaingControlToUpdate--
                if (remaingControlToUpdate === 0) {
                    me.getResults()
                }
            }

            if (item.id === 'prefixModule') {
                let startingInjection = [...injectValues]
                if (me.state.prefix.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasPrefix> <" + me.state.prefix + "> . ")
                }
                me.setState({progressPrefix: true}, () => {
                    me.loadSelectOptions(item.commonQuery, index > 0 ? startingInjection : [], 'prefisso', 'labelPrefix', optList => {
                        me.setState({progressPrefix: false});
                        me.setState({prefixes: optList}, () => {

                            me.checkOptionsCompatibility(optList, "prefix", () => {
                                remaingControlToUpdate--
                                if (remaingControlToUpdate === 0) {
                                    me.getResults()
                                }
                            })
                        })
                    })
                })
            } else if (item.id === 'suffixModule') {
                let startingInjection = [...injectValues]
                if (me.state.suffix.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasSuffix> <" + me.state.suffix + "> . ")
                }
                me.setState({progressSuffix: true}, () => {
                    me.loadSelectOptions(item.commonQuery, index > 0 ? startingInjection : [], 'suffisso', 'labelSuffix', optList => {
                        me.setState({progressSuffix: false});
                        me.setState({suffixes: optList}, () => {
                            me.checkOptionsCompatibility(optList, "suffix", () => {
                                remaingControlToUpdate--
                                if (remaingControlToUpdate === 0) {
                                    me.getResults()
                                }
                            })
                        })
                    })
                })
            } else if (item.id === 'baseModule') {
                let startingInjection = [...injectValues]
                if (me.state.base.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasBase> <" + me.state.base + "> .")
                }
                me.setState({progressBase: true}, () => {
                    me.loadSelectOptions(item.commonQuery, index > 0 ? startingInjection : [], 'base', 'labelBase', optList => {
                        me.setState({progressBase: false});
                        me.setState({basis: optList}, () => {
                            me.checkOptionsCompatibility(optList, "base", () => {
                                remaingControlToUpdate--
                                if (remaingControlToUpdate === 0) {
                                    me.getResults()
                                }
                            })
                        })
                    })
                })
            } else if (item.id === 'genderModule') {
                let startingInjection = [...injectValues]
                if (me.state.gender.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasGender> <" + me.state.gender + "> . ")
                }
                me.setState({progressGender: true}, () => {
                    me.loadSelectOptions(item.commonQuery, index > 0 ? startingInjection : [], 'gender', 'labelGender', optList => {
                        me.setState({progressGender: false});
                        me.setState({genders: optList}, () => {
                            me.checkOptionsCompatibility(optList, "gender", () => {
                                remaingControlToUpdate--
                                if (remaingControlToUpdate === 0) {
                                    me.getResults()
                                }
                            })
                        })
                    })
                })
            } else if (item.id === 'posModule') {
                let startingInjection = [...injectValues]
                if (me.state.pos.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasPOS> <" + me.state.pos + "> . ")
                }
                me.setState({progressPos: true}, () => {
                    me.loadSelectOptions(item.commonQuery, index > 0 ? startingInjection : [], 'pos', 'labelPos', optList => {
                        me.setState({progressPos: false});
                        me.setState({poss: optList}, () => {
                            me.checkOptionsCompatibility(optList, "pos", () => {
                                remaingControlToUpdate--
                                if (remaingControlToUpdate === 0) {
                                    me.getResults()
                                }
                            })
                        })
                    })
                })
            } else if (item.id === 'inflectionModule') {
                let startingInjection = [...injectValues]
                if (me.state.inflection.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasInflectionType> <" + me.state.inflection + "> . ")
                }
                me.setState({progressInflection: true}, () => {
                    me.loadSelectOptions(item.commonQuery, index > 0 ? startingInjection : [], 'inflection', 'labelInflection', optList => {
                        me.setState({progressInflection: false});
                        me.setState({inflections: optList}, () => {
                            me.checkOptionsCompatibility(optList, "inflection", () => {
                                remaingControlToUpdate--
                                if (remaingControlToUpdate === 0) {
                                    me.getResults()
                                }
                            })
                        })
                    })
                })
            }
        })

    }


    loadSelectOptions(query, injectValues, uriField, labelField, callback) {
        let injectedQuery = query.replace(/nestedQuery/g, "")
        let injections = ""
        injectValues.forEach((injection) =>
            injections += injection
        )
        injectedQuery = injectedQuery.replace(/injectValue/g, injections)

        this.executeSparql(injectedQuery, [uriField, labelField], options => {
            let optionList = []
            options.forEach((o) => {
                optionList.push(<option key={uuidv4()} value={o[uriField]}>{o[labelField]}</option>)
            })
            callback(optionList)
        })

        //  let options = this.executeSparql(query.replace(/nestedQuery/g, "").replace(/injectValue/g, ""), [uriField, labelField] )

    }


    executeSparqlByEndpoint(query, endpoint, callback) {

        console.log();
        $.ajax({
            url: 'https://lila-erc.eu/sparql/' + endpoint + '/query?format=csv&query=' + encodeURIComponent(query),
            async: true,
            dataType: "text",
            success: function (data) {
                let results = Papa.parse(data, {header: true, skipEmptyLines: true});


                //console.log(results.data);
                //
                // data.results.bindings.forEach((elem) =>{
                //
                //     let result = {}
                //     fields.forEach((field) => {
                //         if (elem.hasOwnProperty(field)){
                //             result[field] = elem[field].value
                //         }
                //     })
                //     results.push(result)
                // })
                callback(results.data)
                //callback(results)
            }

        });
    }

    executeSparql(query, fields, callback) {
        $.ajax({
            //  url: 'https://lila-erc.eu/sparql/lemmaBank/query?format=csv&query=' + encodeURIComponent(query),
            url: 'https://lila-erc.eu/sparql/lila_knowledge_base/query?format=csv&query=' + encodeURIComponent(query),
            async: true,
            dataType: "text",
            success: function (data) {

                let results = Papa.parse(data, {header: true, skipEmptyLines: true});
                //
                // data.results.bindings.forEach((elem) =>{
                //
                //     let result = {}
                //     fields.forEach((field) => {
                //         if (elem.hasOwnProperty(field)){
                //             result[field] = elem[field].value
                //         }
                //     })
                //     results.push(result)
                // })
                callback(results.data)
                //callback(results)
            }

        });
    }


    handleChange(property, val) {
        let me = this
        this.setState({[property]: val}, () => {
            me.reloadControlData()
            //me.getResults()
        })

    }

    downloadResults() {
        if (this.state.resultCSV.length > 0) {
            let hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:attachment/text,' + encodeURI(this.state.resultCSV);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'query.csv';
            hiddenElement.click();
        }
    }

    copySparqlInClipBoard() {
        if (this.state.currentSparqlQuery.length > 0) {
            console.log("copy");
            let el = document.createElement('textarea');
            // Set value (string to be copied)
            el.value = this.state.currentSparqlQuery
            // Set non-editable to avoid focus and move outside of view
            el.setAttribute('readonly', '');
            el.style = {position: 'absolute', left: '-9999px'};
            document.body.appendChild(el);
            // Select text inside element
            el.select();
            // Copy text to clipboard
            document.execCommand('copy');
            // Remove temporary element
            document.body.removeChild(el);


            this.setState({notificationMessage: "Sparql query has been copied to clipboard"}, () => {
                this.setState({showNotification: true})
            })
        }
    }


    handleChangeString(property, val, regex) {
        let me = this


        this.setState({[property]: val, useRegex: regex}, () => {
            if (me.timeout) clearTimeout(me.timeout);
            me.timeout = setTimeout(function () {
                me.reloadControlData()
                //  me.getResults()
            }.bind(this), 1500)
        })


    }


    getResults() {
        let me = this
        let injectValues = []
        this.state.selected.forEach((item, index) => {
            if (item.id === 'queryModule') {
                if (me.state.lemmaSearch.length) {
                    let querystring = me.state.lemmaSearch.toLocaleLowerCase().replace(/j/g, "i").replace(/v/g, "u")
                    if (!me.state.useRegex) {
                        querystring = querystring.replace(/[^A-Za-z0-9]/g, "")
                        querystring = "^" + querystring
                    }
                    injectValues.push("?subject <http://www.w3.org/ns/lemon/ontolex#writtenRep> ?wrp . FILTER regex(?wrp, \"" + querystring + "\",\"i\") . ")
                }
            }
            if (item.id === 'prefixModule') {
                if (me.state.prefix.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasPrefix> <" + me.state.prefix + "> . ")
                }
            }
            if (item.id === 'suffixModule') {
                if (me.state.suffix.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasSuffix> <" + me.state.suffix + "> . ")
                }
            }
            if (item.id === 'baseModule') {
                if (me.state.base.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasBase> <" + me.state.base + "> .")
                }
            }
            if (item.id === 'genderModule') {
                if (me.state.gender.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasGender> <" + me.state.gender + "> . ")
                }
            }
            if (item.id === 'posModule') {
                if (me.state.pos.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasPOS> <" + me.state.pos + "> . ")
                }
            }
            if (item.id === 'inflectionModule') {
                if (me.state.inflection.length) {
                    injectValues.push("?subject <http://lila-erc.eu/ontologies/lila/hasInflectionType> <" + me.state.inflection + "> . ")
                }
            }
        })

        let mainQuery = "SELECT ?subject ?wrs  ?pos ?lexicons where {\n" +
            "  {" +
            "SELECT ?subject ?poslink ?pos (group_concat(distinct ?wr ; separator=\" \") as ?wrs) (group_concat(distinct ?lexicon ; separator=\" \") as ?lexicons) WHERE { \n" +
            "      injectValue\n" +
            "  ?subject <http://lila-erc.eu/ontologies/lila/hasPOS> ?poslink . \n" +
            "  ?poslink <http://www.w3.org/2000/01/rdf-schema#label> ?pos .\n" +
            "  ?subject <http://www.w3.org/ns/lemon/ontolex#writtenRep> ?wr .\n" +
            "optional {\n" +
            "    ?le <http://www.w3.org/ns/lemon/ontolex#canonicalForm>  ?subject.\n" +
            "    ?lexicon <http://www.w3.org/ns/lemon/lime#entry> ?le  .\n" +
            "  }" +
            "} GROUP BY  ?subject ?poslink ?pos\n" +
            "  }\n" +
            "} order by ?wrs"


        if (injectValues.length === 0) {
            return
        }

        injectValues.sort();

        if (_.isEqual(_.sortBy(this.state.injectValues), _.sortBy(injectValues))) {
            return;
        }


        let injections = ""
        injectValues.forEach((injection) =>
            injections += injection
        )
        mainQuery = mainQuery.replace(/injectValue/g, injections)


        console.log(mainQuery);
        this.setState({showResults: 'none'}, () => {
            me.setState({runningQuery: 'flex'})
            me.setState({controlDisabled: true})
            me.setState({draggableDisable: true})
        })


        this.executeSparql(mainQuery, ['subject', 'pos', 'wrs', 'lexicons'], options => {
            let results = []
            let CSVdump = "URI,lemma,pos\n";
            console.log(options);
            options.forEach((o) => {

                CSVdump += o.subject + "," + o.wrs + "," + o.pos + "\n"

                let resources = []
                let lexcalRes = o.lexicons.split(' ')
                lexcalRes.forEach(lr => {
                    if (lr.includes("Brill")) {
                        resources.push(<Tooltip title="Open Brill EDL " placement="top"><MenuBook onClick={() => {
                            this.openLexicalResources(lr, o.subject)
                        }} style={{cursor: "pointer"}}/></Tooltip>)
                    } else if (lr.includes("WFL")) {
                        resources.push(<Tooltip title="Open WFL " placement="top">
                            <div><FontAwesomeIcon icon={faCubes} style={{width: "22px", height: "22px", cursor: "pointer", marginTop: "2px"}} onClick={() => {
                                this.openLexicalResources(lr, o.subject)
                            }}/></div>
                        </Tooltip>)
                    } else if (lr.includes("LatinAffectus")) {
                        resources.push(<Tooltip title="Open LatinAffectus " placement="top"><Favorite onClick={() => {
                            this.openLexicalResources(lr, o.subject)
                        }} style={{cursor: "pointer"}}/></Tooltip>)
                    } else if (lr.includes("IGVLL")) {
                        resources.push(<Tooltip title="Open Index Graecorum Vocabulorum " placement="top"><List onClick={() => {
                            this.openLexicalResources(lr, o.subject)
                        }} style={{cursor: "pointer"}}/></Tooltip>)
                    } else if (lr.includes("LatinWordNet")) {
                        resources.push(<Tooltip title="Open LatinWordNet " placement="top"><ChatBubbleOutline onClick={() => {
                            this.openLexicalResources(lr, o.subject)
                        }} style={{cursor: "pointer"}}/></Tooltip>)
                    } else if (lr.includes("LewisShort")) {
                        resources.push(<Tooltip title="Open LewisShort " placement="top">
                            <div><FontAwesomeIcon icon={faBook} style={{width: "18px", height: "18px", cursor: "pointer", marginTop: "2px"}} onClick={() => {
                                this.openLexicalResources(lr, o.subject)
                            }}/></div>
                        </Tooltip>)
                    }
                    // ChatBubble wordnet  ChatBubbleOutlineIcon
                    // Cubes wfl
                    // index grecorum list
                    // vallex StarOutline
                })

                results.push(
                    {
                        id: o.subject,
                        lemma: o.wrs,
                        pos: o.pos,
                        lexicalResources: resources,
                        lodview: <Tooltip title="Open data sheet" placement="top"><a target='_blank' rel="noopener noreferrer" href={o.subject} style={{color: "#000"}}><Assessment style={{transform: "rotate(90deg)"}}/></a></Tooltip>,
                        lodlive: <Tooltip title="Open graph view" placement="top"><a target='_blank' rel="noopener noreferrer" href={"https://lila-erc.eu/lodlive/app_en.html?" + o.subject} style={{color: "#000"}}><BubbleChart/></a></Tooltip>
                    })
            })
            me.setState({queryResults: results, resultCSV: CSVdump}, () => {
                me.setState({
                    injectValues: injectValues,
                    controlDisabled: false,
                    draggableDisable: false,
                    runningQuery: 'none',
                    currentSparqlQuery: mainQuery
                }, () => {
                    me.setState({showResults: 'block'})
                })
            })
        })
        // me.setState({queryResults: results})


    }


    openLexicalResources = (lexicon, subject) => {
        let me = this

        if (lexicon.includes("Brill")) {
            this.executeSparql(getEtymonQuery(lexicon, subject), "lexicalResources", (etymons) => {

                let dialogContent = []
                let etyms = []
                let cognate = ""
                etymons.forEach(etym => {
                    cognate = etym.cognateLemma
                    etyms.push({language: etym.etymonLanguage, etymon: etym.etymon})
                })

                if (cognate.length > 0) {
                    dialogContent.push(<div style={{marginLeft: "5px", marginTop: "10px"}}>Cognate of <a href={cognate} rel="noreferrer" target={'_blank'}>{translatePrefix(cognate)}</a> :</div>)
                }

                etyms.map(ety => {
                    dialogContent.push(<li>{"Language " + ety.language + ": " + ety.etymon}</li>)
                })
                this.setState({lexicaldialogResource: "de Vaan M., Etymological Dictionary of Latin and the Other Italic Languages. Brill, 2011.", lexicaldialogContent: dialogContent}, () => {
                    me.handleToggleLexicalDialog()
                })

            })
        } else if (lexicon.includes("WFL")) {
            let dialogContent = []
            console.log(getWflQuery(lexicon, subject));


            this.executeSparql(getWflQuery(lexicon, subject), "lexicalResources", (results) => {
                let dialogContent = []
                let sourceContent = []
                let targetContent = []
                let rulesSource = []
                console.log(results);
                try {
                    dialogContent.push(<h3>Formation of {results[0].lemmaLabel}:</h3>)

                    results.forEach(rule => {

                        if (rule.lemma === rule.lemma3) {
                            console.log(rule);
                            let derivedFrom = ""
                            let ruleString = <span><a href={rule.lemma2} target={"_blank"}>{rule.lemmaLabel2}</a></span>

                            if (rule.derivLemmaLabel.length > 0) {
                                derivedFrom = <span>plus <a href={rule.derivLemma} target={"_blank"}>{rule.derivLemmaLabel}</a> </span>
                            }

                            sourceContent.push(<li style={{listStyle: "none", marginLeft: "24px"}}>{derivedFrom} {rule.affixPrefixLabel !== undefined ? rule.affixPrefixLabel.length > 0 ? <span> involving <a href={rule.involve} target={"_blank"}>{rule.affixPrefixLabel}</a></span> : "" : ""} -> {ruleString} ({rule.ruleType.split("/")[rule.ruleType.split("/").length - 1].replace(/([A-Z])/g, " $1").trim()})</li>)

                        } else if (rule.lemma !== rule.lemma3) {
                            let ruleString = <span><a href={rule.lemma3} target={"_blank"}>{rule.lemmaLabel3}</a> </span>
                            targetContent.push(<li style={{listStyle: "none", marginLeft: "24px"}}>{ruleString} {rule.affixPrefixLabel !== undefined ? rule.affixPrefixLabel.length > 0 ? <span> involving <a href={rule.involve} target={"_blank"}>{rule.affixPrefixLabel}</a></span> : "" : ""} -> ({rule.ruleType.split("/")[rule.ruleType.split("/").length - 1].replace(/([A-Z])/g, " $1").trim()})</li>)
                        }


                    })
                    if (targetContent.length > 0) {
                        dialogContent.push(<li style={{listStyle: "none"}}>derived from: </li>)
                        dialogContent = dialogContent.concat(targetContent)
                    }
                    if (sourceContent.length > 0) {
                        dialogContent.push(<li style={{listStyle: "none", marginTop: "10px"}}>derivatives:</li>)
                        dialogContent = dialogContent.concat(sourceContent)
                    }

                    this.setState({lexicaldialogResource: "Word Formation Latin.", lexicaldialogContent: dialogContent}, () => {
                        me.handleToggleLexicalDialog()
                    })
                } catch (e) {
                    console.log(e);
                    alert("Something wrong with data")
                }
            })
        } else if (lexicon.includes("LatinAffectus")) {
            this.executeSparql(getLatinAffectusPolarity(lexicon, subject), "lexicalResources", (polarities) => {
                let dialogContent = []
                let polars = []
                polarities.forEach(polarityItem => {
                    polars.push({polarityValue: parseFloat(polarityItem.polarityValue), polarity: polarityItem.polarity})
                })
                polars.map(polar => {
                    dialogContent.push(<span><li>{"Polarity " + polar.polarity}</li><li>{"Polarity Value " + polar.polarityValue}</li></span>)
                })
                this.setState({lexicaldialogResource: "LatinAffectus - sentiment lexicon for latin.", lexicaldialogContent: dialogContent}, () => {
                    me.handleToggleLexicalDialog()
                })

            })


        } else if (lexicon.includes("IGVLL")) {
            this.executeSparql(getIGVLLQuery(lexicon, subject), "lexicalResources", (entries) => {
                let dialogContent = []
                let etrs = []
                entries.forEach(entry => {
                    etrs.push({etymon: entry.etymo, belief: entry.belief, cognate: entry.cognate, subterms: entry.subterms})
                })
                etrs.map(entry => {
                    dialogContent.push(<ul>
                        {entry.belief.length > 0 ? <li>{entry.belief}</li> : ""}
                        <li>{"etymon " + entry.etymon}</li>
                        {entry.cognate.length > 0 ? <li>{"cognate " + entry.cognate}</li> : ""}
                        {entry.subterms.length > 0 ? <li>{"subterms " + entry.subterms}</li> : ""}
                    </ul>)
                })
                this.setState({lexicaldialogResource: "Index Graecorum Vocabulorum in Linguam Latinam.", lexicaldialogContent: dialogContent}, () => {
                    me.handleToggleLexicalDialog()
                })

            })
        } else if (lexicon.includes("LatinWordNet")) {
            console.log(getLatinWordnetQuery(lexicon, subject));
            this.executeSparql(getLatinWordnetQuery(lexicon, subject), "lexicalResources", (WNsenses) => {
                let dialogContent = []
                let senses = []
                WNsenses.forEach(sensesItem => {

                    let collectedSenses = _.findWhere(senses, {id: sensesItem.sense});
                    let sense = {id: sensesItem.sense, definition: sensesItem.def, princetonLink: sensesItem.synLink, functors: sensesItem.func, relations: []}
                    if (collectedSenses != undefined) {
                        sense = collectedSenses
                    } else {
                        senses.push(sense);
                    }
                    sense.relations.push({relType: sensesItem.pTLabel, princetonLink: sensesItem.relSyn, definition: sensesItem.defRel})
                })

                dialogContent.push(<ol>
                    {senses.map(sense => {
                        return <li><a href={sense.princetonLink} target={"_blank"}>{sense.definition}</a>
                            <ul>
                                {sense.functors.length > 0 ? <li>{sense.functors}</li> : ""}

                                {sense.relations.map(rel => {
                                    //    return <li>{rel.relType} - <a style={{color:"orange"}} href={rel.princetonLink} target={"_black"}>{rel.definition}</a> </li>
                                })}</ul>
                        </li>
                    })}
                </ol>)

                this.setState({lexicaldialogResource: "Latin Wordnet extended with Latin Vallex", lexicaldialogContent: dialogContent}, () => {
                    me.handleToggleLexicalDialog()
                })


            })
        } else if (lexicon.includes("LewisShort")) {
            console.log(getLewisShortQuery(lexicon, subject));
            this.executeSparql(getLewisShortQuery(lexicon, subject), "lexicalResources", (LSDefinition) => {
                let dialogContent = []
                let lexicalEntries = {}
                let seeAlsoLemma = {}

                dialogContent.push(<h3>Definitions:</h3>)
                LSDefinition.forEach(defs => {
                    if (defs.defsString.trim().length > 0) {
                        if (lexicalEntries[defs.le] === undefined) {
                            lexicalEntries[defs.le] = {}
                        }

                        lexicalEntries[defs.le].label = defs.leLabel.replace(/LS lexical entry for '/g, "")
                        if (lexicalEntries[defs.le].definitions === undefined) {
                            lexicalEntries[defs.le].definitions = []
                        }
                        lexicalEntries[defs.le].definitions.push(defs.defsString)
                    }
                    if (defs.seeAlsoLemma.length > 0){
                        seeAlsoLemma[defs.seeAlsoLemma] = defs.seeAlsoLemmaLabel
                    }
                })

                if (Object.keys(lexicalEntries).length === 0) {
                    dialogContent = []
                    dialogContent.push(<h4>No English translation provided by the Lexical Entry</h4>)
                } else {
                    for (const leID in lexicalEntries) {

                        let defs = []

                        lexicalEntries[leID].definitions.forEach(value => {
                            defs.push(<li style={{marginLeft: "10px", marginBottom: "5px"}}>{value}</li>)
                        })

                        dialogContent.push(<li style={{listStyle: "none", fontWeight: "100"}}>{(lexicalEntries[leID].label + ":").replace(/':/, ":")} {defs}</li>)
                    }
                }
                if (Object.keys(seeAlsoLemma).length > 0) {
                    dialogContent.push(<hr  style={{borderTop:"1px solid rgb(199, 199, 199)"}}/>)
                    dialogContent.push(<h4 style={{marginBottom:"0px",marginTop:"5px"}}>See also:</h4>)
                    for (const lemmaid in seeAlsoLemma) {
                        dialogContent.push(<li style={{listStyle: "none", fontWeight: "100"}}><a href={lemmaid}>{seeAlsoLemma[lemmaid]}</a> </li>)
                    }
                }


                this.setState({lexicaldialogResource: "Charlton T. Lewis, Charles Short. A Latin Dictionary. OUP, 1879.", lexicaldialogContent: dialogContent}, () => {
                    me.handleToggleLexicalDialog()
                })

            })
        }


        // alert("lexicon " + lexicon + " subj " + subject)

    }

    dragStartHandle = () => {
        let selectedOld = [...this.state.selected]
        this.setState({onDragging: true, selected: selectedOld})
    }


    render() {
        let me = this
        const classes = this.useStyles;
        // const bull = <span className={classes.bullet}>•</span>;

        return (
            <div style={{position: 'relative', background: 'inherit'}}>
                <a href="https://lila-erc.eu" style={{position: 'absolute', top: '0px', right: '10px'}}><img src={"./elements/cropped-lila-logo.png"} style={{width: '70px'}}/></a>
                <div>

                    <h1 className="noselect" style={{backgroundColor: 'transparent', fontFamily: 'moonbold', fontSize: "2em", color: "#fff", marginRight: '100px'}}>Lemma Bank Query Interface <HelpOutline style={{fontSize: "20px", color: '#37123C'}} onClick={() => {
                        this.handleToggleDialog()
                    }}/></h1>

                    {/*<Typography className={classes.title} color="textSecondary" gutterBottom>*/}
                    {/*    Query pipeline*/}
                    {/*</Typography>*/}
                    <h3 className="noselect" style={{fontFamily: 'moonbold', fontSize: "1.5em", color: '#37123C'}}>
                        Query modules available
                    </h3>

                    <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.dragStartHandle} onDragUpdate={this.dragStartHandle} style={{display: 'flex'}}>
                        <Droppable droppableId="droppable" direction="horizontal">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)} className="droppableZone">
                                    {this.state.items.map((item, index) => (

                                        <Draggable
                                            isDragDisabled={this.state.draggableDisable}
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (

                                                <div
                                                    className={"noselect item"}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                    onClick={(e) => this.copyModule(item)}
                                                >

                                                    {item.icon}
                                                    {item.content}


                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <h3 className="noselect" style={{fontFamily: 'moonbold', fontSize: "1.5em", color: '#37123C'}}>
                            Query modules selected
                        </h3>

                        <Droppable droppableId="droppable2" direction="horizontal">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyleTarget(snapshot.isDraggingOver)} className="droppableZone">

                                    {this.state.selected.length === 0 ?
                                        <div className={"dropzonePlaceHolder"}>
                                            <span style={{fontWeight: 300, fontSize: '12px', fontStyle: 'italic', display: 'flex', alignItems: 'center'}}>Drag or click on modules to compose your query</span>
                                        </div>
                                        : ""}


                                    {this.state.selected.map((item, index) => (

                                        <Draggable
                                            isDragDisabled={this.state.draggableDisable}
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshotElem) => (
                                                <div
                                                    className={"noselect itemExpanded"}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyleExpanded(
                                                        snapshotElem.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                    //onClick={(e) => this.reverseCopyModule(item)}
                                                >

                                                    {item.id === 'prefixModule' ? <SelectControl disabled={this.state.controlDisabled} ref={this.selectPrefix} process={this.state.progressPrefix} label="Prefix" icon={<ArrowForward/>} value={this.state.prefix} values={this.state.prefixes} onChangeValue={(val) => {
                                                            this.handleChange("prefix", val)
                                                        }}/> :
                                                        item.id === 'queryModule' ? <QuerySearch disabled={this.state.controlDisabled} value={this.state.lemmaSearch} onChangeValue={(val, regex) => {
                                                                this.handleChangeString("lemmaSearch", val, regex)
                                                            }}/> :
                                                            item.id === 'suffixModule' ? <SelectControl disabled={this.state.controlDisabled} ref={this.selectSuffix} process={this.state.progressSuffix} label="Suffix" icon={<ArrowBack/>} value={this.state.suffix} values={this.state.suffixes} onChangeValue={(val) => {
                                                                    this.handleChange("suffix", val)
                                                                }}/> :
                                                                item.id === 'baseModule' ? <SelectControl disabled={this.state.controlDisabled} ref={this.selectBase} process={this.state.progressBase} label="Base" icon={<GroupWork/>} value={this.state.base} values={this.state.basis} onChangeValue={(val) => {
                                                                        this.handleChange("base", val)
                                                                    }}/> :
                                                                    item.id === 'genderModule' ? <SelectControl disabled={this.state.controlDisabled} ref={this.selectGender} process={this.state.progressGender} label="Gender" icon={<Gender style={{width: "2em"}}/>} value={this.state.gender} values={this.state.genders} onChangeValue={(val) => {
                                                                            this.handleChange("gender", val)
                                                                        }}/> :
                                                                        item.id === 'posModule' ? <SelectControl disabled={this.state.controlDisabled} ref={this.selectPos} process={this.state.progressPos} label="PoS" icon={<Extension/>} value={this.state.pos} values={this.state.poss} onChangeValue={(val) => {
                                                                                this.handleChange("pos", val)
                                                                            }}/> :
                                                                            item.id === 'inflectionModule' ? <SelectControl disabled={this.state.controlDisabled} ref={this.selectInflection} process={this.state.progressInflection} label="Inflection" icon={<DeviceHub/>} value={this.state.inflection} values={this.state.inflections} onChangeValue={(val) => {
                                                                                this.handleChange("inflection", val)
                                                                            }}/> : ""}

                                                    <span style={{
                                                        cursor: "pointer",
                                                        marginLeft: "-21px",
                                                        marginTop: "-38px",
                                                        zIndex: "1000"
                                                    }} onClick={(e) => this.reverseCopyModule(item)}
                                                    ><Close/></span>
                                                </div>

                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>

                            )}
                        </Droppable>


                        {/*<Droppable droppableId="droppable3" direction="horizontal">*/}
                        {/*    {(provided, snapshot) => (*/}
                        {/*        <div*/}
                        {/*            ref={provided.innerRef}*/}
                        {/*            style={getListStyle(snapshot.isDraggingOver)} className="droppableZone">*/}
                        {/*            {this.state.selected.map((item, index) => (*/}

                        {/*                <Draggable*/}
                        {/*                    isDragDisabled={this.state.draggableDisable}*/}
                        {/*                    key={item.id}*/}
                        {/*                    draggableId={item.id}*/}
                        {/*                    index={index}>*/}
                        {/*                    {(provided, snapshotElem) => (*/}
                        {/*                        <div*/}
                        {/*                            ref={provided.innerRef}*/}
                        {/*                            {...provided.draggableProps}*/}
                        {/*                            {...provided.dragHandleProps}*/}
                        {/*                            style={ getItemStyle(*/}
                        {/*                                snapshotElem.isDragging,*/}
                        {/*                                provided.draggableProps.style*/}
                        {/*                            )}*/}
                        {/*                            //onClick={(e) => this.reverseCopyModule(item)}*/}
                        {/*                        >*/}

                        {/*                            {item.icon}*/}
                        {/*                            {item.content}*/}
                        {/*                        </div>*/}

                        {/*                    )}*/}
                        {/*                </Draggable>*/}
                        {/*            ))}*/}
                        {/*            {provided.placeholder}*/}
                        {/*        </div>*/}
                        {/*    )}*/}
                        {/*</Droppable>*/}


                    </DragDropContext>


                    {/*<Typography className={classes.pos} color="textSecondary">*/}
                    {/*    adjective*/}
                    {/*</Typography>*/}
                    {/*<Typography variant="body2" component="p">*/}
                    {/*    well meaning and kindly.*/}
                    {/*    <br />*/}
                    {/*    {'"a benevolent smile"'}*/}
                    {/*</Typography>*/}

                    <Typography className={clsx(classes.title, "noselect")} color="textSecondary" gutterBottom style={{display: 'flex', color: '#000000', marginTop: '8px', marginBottom: '12px'}}>
                        Results: {this.state.queryResults.length}
                        <Tooltip title="Download results as csv file" placement="top">
                            <GetApp style={{marginLeft: "15px", cursor: "pointer"}} onClick={() => {
                                this.downloadResults()
                            }}/></Tooltip>
                        <Tooltip title="Copy Sparql query" placement="top">
                            <Sparql onClick={() => {
                                this.copySparqlInClipBoard()
                            }} className={"MuiSvgIcon-root"} style={{width: "2em", cursor: "pointer"}}/></Tooltip>
                    </Typography>
                    {/*<Button variant="contained" color="default" size="small">Run Query</Button>*/}
                    <Paper className="paperStyle" style={{backgroundColor: 'transparent', boxShadow: '0 0 0 0', display: this.state.runningQuery}}>
                        <CircularProgress

                            style={{
                                color: '#686868',
                                animationDuration: '1200ms',

                            }}
                            size={80}
                            thickness={4}
                        />
                    </Paper>
                    <Paper style={{height: 400, width: '100%', backgroundColor: 'transparent', boxShadow: '0 0 0 0', display: this.state.showResults}}>
                        <MuiVirtualizedTable
                            rowCount={this.state.queryResults.length}
                            rowGetter={({index}) => this.state.queryResults[index]}
                            columns={[
                                {
                                    width: 450,
                                    label: 'Lemma',
                                    dataKey: 'lemma',
                                },
                                {
                                    width: 300,
                                    label: 'PoS',
                                    dataKey: 'pos',
                                    hidable: true
                                },
                                {
                                    width: 250,
                                    label: '',
                                    numeric: true,
                                    dataKey: 'lexicalResources',
                                },
                                {
                                    width: 100,
                                    label: '',
                                    dataKey: 'lodview',
                                },
                                {
                                    width: 100,
                                    label: '',
                                    dataKey: 'lodlive',
                                },
                            ]}
                        />
                    </Paper>
                    <footer className={classes.footer} style={{paddingTop: '10px'}}>
                        <Copyright/>
                    </footer>

                    <Snackbar
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                        open={this.state.showNotification}
                        onClose={this.closeNotification}
                        autoHideDuration={1000}>
                        <Alert severity="success">
                            {this.state.notificationMessage}
                        </Alert>
                    </Snackbar>

                </div>

                <Dialog onClose={() => {
                    this.handleToggleDialog()
                }} aria-labelledby="customized-dialog-title" open={this.state.dialogOpen}>
                    <MuiDialogTitle id="customized-dialog-title" onClose={() => {
                        this.handleToggleDialog()
                    }} style={{fontFamily: 'moonbold'}}>
                        <Typography variant={"h6"} style={{fontFamily: 'moonbold'}}> LEMMA BANK QUERY INTERFACE</Typography>
                    </MuiDialogTitle>
                    <MuiDialogContent dividers>
                        <Typography variant={"button"} style={{fontFamily: 'moonbold'}}>
                            Welcome to the LiLa: Linking Latin query interface!
                        </Typography>
                        <p>
                            <Typography variant={"subtitle2"}>
                                Here you can query the LiLa collection of Latin lemmas, which is used to connect linguistic resources and tools with Linked Data technology.
                            </Typography></p>
                        <p>
                            <Typography variant={"button"} style={{fontFamily: 'moonbold'}}>
                                QUERY MODULES AVAILABLE
                            </Typography>
                            <Typography variant={"subtitle2"}>
                                Compose your own query by dragging and dropping any combination of these modules into the QUERY MODULES SELECTED box below. For every selected module, a drop-down menu of options will allow you to refine the query. In multi-module queries, the options of one module depend on the preceding module (e.g. if your first module is 'PoS' with option 'interjection', a following 'Gender' module won't display any options as interjections have no gender).
                            </Typography></p>
                        <p>
                            <Typography variant={"button"} style={{fontFamily: 'moonbold'}}>
                                RESULTS
                            </Typography>

                            <Typography variant={"subtitle2"}>
                                Click on the download button <GetApp style={{width: "0.8em", marginBottom: "-8px"}}/> to save the results of your query as a CSV file. Alternatively, click on the RDF icon <Sparql style={{width: "1em", marginBottom: "0px"}}/> to copy the underlying SPARQL query.
                                In the results table, click on the sheet icon <Assessment style={{transform: "rotate(90deg)", width: "0.8em", marginBottom: "-8px"}}/> to view the complete lemma description or click on the three-dot icon <BubbleChart style={{width: "0.8em", marginBottom: "-8px"}}/> to view the lemma in our graph interface.
                            </Typography></p>
                    </MuiDialogContent>

                </Dialog>


                <Dialog onClose={() => {
                    this.handleToggleLexicalDialog()
                }} aria-labelledby="customized-dialog-title" open={this.state.lexicaldialogOpen}>
                    <MuiDialogTitle id="customized-dialog-title" onClose={() => {
                        this.handleToggleLexicalDialog()
                    }} style={{fontFamily: 'moonbold'}}>
                        <Typography variant={"h6"} style={{fontFamily: 'moonbold'}}> Lexical Resource</Typography>

                        <IconButton
                            aria-label="close"
                            onClick={() => {
                                this.handleToggleLexicalDialog()
                            }}
                            style={{
                                position: 'absolute',
                                right: 8,
                                top: 8
                            }}
                        ><Close/>
                        </IconButton>
                    </MuiDialogTitle>
                    <MuiDialogContent dividers>
                        <Typography variant={"button"} style={{fontFamily: 'moonbold'}}>
                            {this.state.lexicaldialogResource}
                        </Typography>
                        <p>
                            <Typography variant={"subtitle2"}>
                                {this.state.lexicaldialogContent}
                            </Typography>
                        </p>

                    </MuiDialogContent>

                </Dialog>

            </div>

        );
    }
}

export default Query;
