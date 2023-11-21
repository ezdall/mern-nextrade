import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { createUser } from './api-user';
import { handleAxiosError } from '../axios';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
}));

// just a sample regex
const nameRegex = /^[a-zA-Z0-9-_]{1,23}$/;
const passRegex = /^[a-zA-Z0-9]{4,24}$/;
const emailRegex = /^[a-zA-Z0-9]*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/

export default function Signup() {
  const classes = useStyles();

  // name
  const [name, setName] = useState('')
  const [validName, setValidName] = useState(false)

  // email
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)

  // pass
  const [password, setPassword] = useState('')
  const [validPass, setValidPass] = useState(false)

  //
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=> {
    const result = nameRegex.test(name)
    setValidName(result)
  }, [name])

  useEffect(()=> {
    const result = emailRegex.test(email)
    setValidEmail(result)
  }, [email])

  useEffect(()=>{
    const result = passRegex.test(password)
    setValidPass(result)
  },[password])

// reset error
  useEffect(() => {
    setError('')
  }, [name, email, password])


  const clickSubmit = () => {

    const vName = nameRegex.test(name)
    const vEmail = emailRegex.test(email)
    const vPass = passRegex.test(password)

    if(!vName || !vEmail || !vPass){
      return setError('valid fields are required')
    }

    return createUser({name, email,password}).then(data => {
      if (data?.isAxiosError) {
        handleAxiosError(data);
        console.log({data})
        return setError(data.response.data.error);
      }
      setError('')
      return setOpen(true);
    });
  };

  // console.log(validName)

  const handleClose = (e, r) => {
    console.log({ e, r });
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Sign Up
          </Typography>
          <TextField
            autoFocus
            id="name"
            name="name"
            label="Name"
            className={classes.textField}
            value={name}
            onChange={e=> setName(e.target.value)}
            error={(!!name && !validName) || !!error}
            required
            margin="normal"
          />
          <br />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            className={classes.textField}
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={(!!email && !validEmail) || !!error}
            required
            margin="normal"
          />
          <br />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            className={classes.textField}
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={(!!password && !validPass) || !!error}
            required
            margin="normal"
          />
          <br />
          {error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}
            disabled={!validName || !validEmail || !validPass}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/login">
            <Button color="primary" autoFocus variant="contained">
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}
