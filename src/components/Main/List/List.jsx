import React, { useContext } from "react";
import { List as MUIList, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, IconButton, Slide } from '@mui/material';
import { Delete, MoneyOff } from '@mui/icons-material';
import { red, green } from '@mui/material/colors';

import { ExpenseTrackerContext } from '../../../context/context';
import useStyles from "./styles";

const List = () => {
    const classes = useStyles();
    const { deleteTransaction, transactions } = useContext(ExpenseTrackerContext);


    return (
        <MUIList dense={false} className={classes.list}>
            {transactions.map((transaction) => (
                <Slide direction='down' in mountOnEnter unmountOnExit key={transaction.id}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar sx={{
                                bgcolor: transaction.type === 'Income' ? green[500] : red[500],
                                color: '#fff'
                            }}>
                                <MoneyOff />
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText primary={transaction.category} secondary={`$${transaction.amount} - ${transaction.date}`} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => deleteTransaction(transaction.id)}>
                                <Delete />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </Slide>
            ))}
        </MUIList>
    )
}

export default List;