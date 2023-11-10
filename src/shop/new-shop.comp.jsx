import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import FileUpload from '@material-ui/icons/AddPhotoAlternate';

import { createShop } from './api-shop';
import auth from '../auth/auth-helper';

// style
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
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  input: {
    display: 'none'
  },
  filename: {
    marginLeft: '10px'
  }
}));

export default function NewShop() {
  const navigate = useNavigate();
  const authUser = auth.isAuthenticated().user;

  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    redirect: false,
    error: '' // string
  });

  console.log({ values });

  const handleChange = ev => {
    const { name, value, files } = ev.target;

    setValues({ ...values, error: '' });

    // console.log(values)

    const inputValue = name === 'image' ? files[0] : value;
    setValues({ ...values, [name]: inputValue });
  };

  const onClickSubmit = () => {
    const { name, description, image } = values;

    if (!name) {
      return setValues({ ...values, error: 'name is required' });
    }

    const shopData = new FormData();

    if (name) shopData.append('name', name);
    if (description) shopData.append('description', description);
    if (image) shopData.append('image', image);

    return createShop({userId: authUser._id},shopData)
      .then(data => {
        console.log({data});
        if (data?.isAxiosError) {
          return setValues({ ...values, error: data.message });
        }

        setValues({ ...values, error: '', redirect: true });
        return navigate('/seller/shops');
      })
      .catch(err => {
        // console.error({ err });
        setValues({ ...values, error: err });
      });
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            New Shop
          </Typography>
          <br />
          <input
            id="icon-button-file"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className={classes.input}
          />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Upload Logo
              <FileUpload />
            </Button>
          </label>
          <span className={classes.filename}>{values.image?.name ?? ''}</span>
          <br />
          <TextField
            id="name"
            name="name"
            label="Name"
            margin="normal"
            className={classes.textField}
            value={values.name}
            onChange={handleChange}
            required
          />
          <br />
          <TextField
            id="multiline-flexible"
            name="description"
            label="Description"
            multiline
            minRows="2"
            value={values.description}
            onChange={handleChange}
            className={classes.textField}
            margin="normal"
          />
          <br />
          {values.error && (
            <Typography component="p" color="error">
              {/* <Icon color="error" className={classes.error}>error: </Icon> */}
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={onClickSubmit}
            className={classes.submit}
          >
            Submit
          </Button>
          <Link to="/seller/shops" className={classes.submit}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}
