import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Edit from '@material-ui/icons/Edit';
import Person from '@material-ui/icons/Person';
import Divider from '@material-ui/core/Divider';

import DeleteUser from './delete-user.comp';
import auth from '../auth/auth-helper';
import { handleAxiosError } from '../axios';

import { read } from './api-user';

// import config from './../../config/config';
// import stripeButton from './../assets/images/stripeButton.png';
// import MyOrders from './../order/MyOrders';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  },
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.protectedTitle
  },
  stripe_connect: {
    marginRight: '10px'
  },
  stripe_connected: {
    verticalAlign: 'super',
    marginRight: '10px'
  },
  auctions: {
    maxWidth: 600,
    margin: '24px',
    padding: theme.spacing(3),
    backgroundColor: '#3f3f3f0d'
  }
}));

export default function Profile() {
  const classes = useStyles();
  const navigate = useNavigate();
  const params = useParams();

  // const match = undefined;

  const { user:authUser, accessToken } = auth.isAuthenticated();

  const [user, setUser] = useState({});
  const [isError, setIsError] = useState(false);
  // const [redirectToSignin, setRedirectToSignin] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    setIsError(false);

    read({ userId: params.userId }, signal, accessToken).then(data => {
      if (data?.isAxiosError) {
        handleAxiosError(data, ()=>navigate('/login', { replace: true }));
        return setIsError(true);
      }

      console.log({ data });
      return setUser(data.user);
    });

    return () => abortController.abort();
  }, [navigate, params.userId]);

  // console.log(user);

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
          {authUser && String(authUser._id) === String(user._id) && (
            <ListItemSecondaryAction>
              {/* {user.seller &&
                  (user.stripe_seller ? (
                    <Button
                      variant="contained"
                      disabled
                      className={classes.stripe_connected}
                    >
                      Stripe connected
                    </Button>
                  ) : (
                    <a
                      href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${config.stripe_connect_test_client_id}&scope=read_write`}
                      className={classes.stripe_connect}
                    >
                      <img src={stripeButton} />
                    </a>
                  ))} */}
              <Link to={`/user/edit/${user._id}`}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>
              </Link>
               <DeleteUser userId={user._id} />
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={`Joined: ${new Date(user.createdAt).toDateString()}`}
          />
        </ListItem>
      </List>
      {/* <MyOrders /> */}
      <Paper className={classes.auctions} elevation={4}>
        <Typography type="title" color="primary">
          Auctions you bid in
        </Typography>
      </Paper>
    </Paper>
  );
}
