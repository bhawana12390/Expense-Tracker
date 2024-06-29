import React from "react";
import { Grid } from '@mui/material';
// import { PushToTalkButton, PushToTalkButtonContainer } from "@speechly/react-ui";

import Details from "./components/Details/Details";
import Main from "./components/Main/Main";
import useStyles from "./styles";

const App = () => {
    const classes = useStyles();

    return (
        <div>
            <Grid container spacing={3} alignItems="center" justifyContent="center" style={{ height: '100vh', padding: '0 16px' }}>
                <Grid item xs={12} sm={4} className={classes.gridItem}>
                    <Details title="Income"/>
                </Grid>
                <Grid item xs={12} sm={4} className={classes.gridItem}>
                    <Main />
                </Grid>
                <Grid item xs={12} sm={4} className={classes.gridItem}>
                    <Details title="Expense"/>
                </Grid>
            </Grid>
            {/* <PushToTalkButtonContainer>
                <PushToTalkButton />
            </PushToTalkButtonContainer> */}
        </div>
    )
}

export default App