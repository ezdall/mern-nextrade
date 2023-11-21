import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import queryString from 'query-string';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import useAxiosPrivate from '../auth/useAxiosPrivate';
import useDataContext from '../auth/useDataContext';
import { stripeUpdate } from './api-user';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  },
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.protectedTitle,
    fontSize: '1.1em'
  },
  subheading: {
    color: theme.palette.openTitle,
    marginLeft: '24px'
  }
}));

export default function StripeConnect() {
  const location = useLocation();
  const { auth: auth2 } = useDataContext();
  const axiosPrivate = useAxiosPrivate();

  // console.log({location})

  const classes = useStyles();
  const [values, setValues] = useState({
    error: false,
    connecting: false,
    connected: false
  });

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    // eslint-disable-next-line
    const { error, code } = queryString.parse(location.search);
    // return from stripe
    // ?scope=read_write&code=ac_MokNx6hHYzYIWeYnFhnOKforjz05gfaT

    if (error) {
      setValues(prevValues => ({ ...prevValues, error: true }));
    }

    if (code) {
      setValues(prevValues => ({
        ...prevValues,
        connecting: true,
        error: false
      }));
      // post call to stripe, get credentials and update user data

      stripeUpdate(code, signal, auth2.user, auth2.accessToken, axiosPrivate).then(data => {
        if (data.isAxiosError) {
          setValues(prevValues => ({
            ...prevValues,
            error: true,
            connected: false,
            connecting: false
          }));
        } else {
          setValues(prevValues => ({
            ...prevValues,
            connected: true,
            connecting: false,
            error: false
          }));
        }
      });
    }
    return () => {
      console.log('abort stripe-connect');
      abortController.abort();
    };
  }, []);

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Connect your Stripe Account
        </Typography>
        {values.error && (
          <Typography type="subheading" className={classes.subheading}>
            Could not connect your Stripe account. Try again later.
          </Typography>
        )}
        {values.connecting && (
          <Typography type="subheading" className={classes.subheading}>
            Connecting your Stripe account ...
          </Typography>
        )}
        {values.connected && (
          <Typography type="subheading" className={classes.subheading}>
            Your Stripe account successfully connected!
          </Typography>
        )}
      </Paper>
    </div>
  );
}
