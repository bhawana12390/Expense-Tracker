import { makeStyles } from '@mui/styles';
import { red, green } from '@mui/material/colors';

const useStyles = makeStyles((theme) => ({
  avatarIncome: {
    color: '#fff',
    backgroundColor: green[500],
    // '&:hover': {
    //   backgroundColor: green[700],
    // },
  },
  avatarExpense: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    // '&:hover': {
    //   backgroundColor: red[700],
    // },
  },
  list: {
    maxHeight: '150px',
    overflow: 'auto',
  },
}));

export default useStyles;