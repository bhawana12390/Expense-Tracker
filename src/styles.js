import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  gridIem: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  desktop: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  mobile: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  main: {
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '5%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
  },
  last: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(3),
      paddingBottom: '200px',
    },
  },
  grid: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    '& > *': {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        minWidth: '200px',
        textAlign: 'center',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
  card: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(2),
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    minWidth: '200px',
    margin: theme.spacing(2),
  },
}));