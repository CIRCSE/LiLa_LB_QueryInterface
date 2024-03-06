import React, {Component} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {withStyles} from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import {AutoSizer, Column, Table, WindowScroller} from 'react-virtualized';
import './MuiVirtualizedTable.css'

const styles = theme => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    table: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
            paddingRight: theme.direction === 'rtl' ? '0px !important' : undefined,
        },
        '& .ReactVirtualized__Table__Grid': {
            outline: "none"
        },


    },
    tableRow: {
        cursor: 'pointer',
        backgroundColor:'rgba(255, 255, 255, 0.51)'

    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: "#e0e0e0",
        },
    },
    tableCell: {
        flex: 1,
        cursor: 'pointer',
        fontWeight:'300'
    },
    noClick: {
        cursor: 'initial',
    },
    hide:{
        display: 'none'
    }
});

class MuiVirtualizedTable extends Component {


    static defaultProps = {
        headerHeight: 48,
        rowHeight: 50,
    };

    getRowClassName = ({index}) => {
        const {classes, onRowClick} = this.props;

        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: index !== -1,
        });
    };

    cellRenderer = ({cellData, columnIndex, ...other}) => {
        const {columns, classes, rowHeight, onRowClick} = this.props;
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell , classes.flexContainer, {
                    [classes.noClick]: onRowClick == null,
                },'noselect')}
                variant="body"
                style={{height: rowHeight, cursor:"default"}}
                align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
            >
                {cellData}
            </TableCell>
        );
    };

    headerRenderer = ({label, columnIndex}) => {
        const {headerHeight, columns, classes} = this.props;
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, classes.noClick,'noselect')}
                variant="head"
                style={{height: headerHeight}}
                align={columns[columnIndex].numeric || false ? 'right' : 'left'}
            >
                <span style={{cursor: "pointer",fontWeight:'bolder',color:'#37123C'}}>{label}</span>
            </TableCell>
        );
    };

    render() {

        const {classes, columns, rowHeight, headerHeight, ...tableProps} = this.props;
        return (
            <WindowScroller>
                {({height, isScrolling, registerChild, scrollTop}) => (
                    <AutoSizer>
                        {({height, width}) => (
                    <Table
                        height={height}
                        width={width}
                        rowHeight={rowHeight}
                        gridStyle={{
                            direction: 'inherit',
                        }}
                        headerHeight={headerHeight}
                        className={classes.table}
                        {...tableProps}
                        rowClassName={this.getRowClassName}
                    >
                        {columns.map(({dataKey, ...other}, index) => {

                            return (
                                <Column
                                    key={dataKey}

                                    className={other.hidable ? "" : classes.flexContainer}
                                    headerRenderer={headerProps =>
                                        this.headerRenderer({
                                            ...headerProps,
                                            columnIndex: index,
                                        })
                                    }
                                    cellRenderer={this.cellRenderer}
                                    dataKey={dataKey}
                                    {...other}
                                />
                            );
                        })}
                    </Table>
                        )}
                    </AutoSizer>
                )}
            </WindowScroller>

        );
    }
}

MuiVirtualizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            dataKey: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            numeric: PropTypes.bool,
            width: PropTypes.number.isRequired,
            hidable: PropTypes.bool,
        }),
    ).isRequired,
    headerHeight: PropTypes.number,
    onRowClick: PropTypes.func,
    rowHeight: PropTypes.number,
};


export default withStyles(styles)(MuiVirtualizedTable);