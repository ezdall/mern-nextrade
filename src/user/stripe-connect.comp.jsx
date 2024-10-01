import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import queryString from 'query-string';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import useAxiosPrivate from '../auth/useAxiosPrivate';
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
  const classes = useStyles();

  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const [values, setValues] = useState({
    error: false,
    connecting: false,
    connected: false
  });

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    const { signal } = abortController;

    // reads ?code=xxxxx
    const { error, code } = queryString.parse(location.search);

    console.log({ code, error });

    if (error) {
      return setValues({ ...values, error: true });
    }

    if (code) {
      setValues({
        ...values,
        connecting: true,
        error: false
      });
    }

    stripeUpdate({
      code,
      signal,
      axiosPrivate2: axiosPrivate,
      userId: user?._id
    })
      .then(data => {
        if (data?.isAxiosError) {
          console.log({ err: data });
          setValues({
            ...values,
            error: true,
            connected: false,
            connecting: false
          });
        } else if (isMounted) {
          console.log({ mount: data });
          setValues(prev => ({
            ...prev,
            error: false,
            connected: true,
            connecting: false
          }));
        }
      })
      .catch(err => {
        console.log(err.response);

        setValues({
          ...values,
          error: true,
          connected: false,
          connecting: false
        });
      });

    return () => {
      isMounted = false;
      if (isMounted) {
        abortController.abort();
        console.log('abort stripe-connect');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id, axiosPrivate, location.search]);

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
