import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FileUpload from '@material-ui/icons/AddPhotoAlternate';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

import { createProduct } from './api-product';
import { handleAxiosError } from '../axios';
// import useDataContext from '../auth/useDataContext';
import useAxiosPrivate from '../auth/useAxiosPrivate';

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
    fontSize: '1.2em'
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

export default function NewProduct() {
  const classes = useStyles();
  const { shopId } = useParams();
  const auth = useSelector(state => state.auth);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    quantity: '',
    price: ''
  });

  const [error, setError] = useState('');
  // const [redirect, setRedirect] = useState(false);

  const handleChange = ev => {
    const { name, value, files } = ev.target;
    setError('');

    const inputValue = name === 'image' ? files[0] : value;

    setValues({ ...values, [name]: inputValue });
  };

  const clickSubmit = () => {
    const { name, description, category, quantity, price, image } = values;

    if (!name || !quantity || !price) {
      return setError('fill-up the required field!');
    }

    const productData = new FormData();

    if (name) productData.append('name', name);
    if (description) productData.append('description', description);
    if (image) productData.append('image', image);

    if (category) productData.append('category', category);
    if (quantity) productData.append('quantity', quantity);
    if (price) productData.append('price', price);

    return createProduct({
      productData,
      shopId,
      axiosPrivate2: axiosPrivate
    })
      .then(data => {
        if (data?.isAxiosError) {
          // handleAxiosError(data);
          return setError(data.response?.data);
        }
        setError('');
        return navigate(`/seller/shop/edit/${shopId}`);
        // return setRedirect(true);
      })
      .catch(err => setError(err));
  };

  // if (redirect) {
  //   return <Navigate to={`/seller/shop/edit/${shopId}`} />;
  // }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            New Product
          </Typography>
          <br />
          <input
            name="image"
            accept="image/*"
            onChange={handleChange}
            className={classes.input}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Upload Photo
              <FileUpload />
            </Button>
          </label>
          <span className={classes.filename}>{values.image?.name ?? ''}</span>
          <br />
          <TextField
            id="name"
            label="Name"
            name="name"
            required
            error={!!error}
            className={classes.textField}
            value={values.name}
            onChange={handleChange}
            margin="normal"
          />
          <br />
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            minRows="2"
            name="description"
            value={values.description}
            onChange={handleChange}
            className={classes.textField}
            margin="normal"
          />
          <br />
          <TextField
            id="category"
            label="Category"
            type="text"
            name="category"
            className={classes.textField}
            value={values.category}
            onChange={handleChange}
            margin="normal"
          />
          <br />
          <TextField
            id="quantity"
            label="Quantity"
            type="number"
            name="quantity"
            required
            error={!!error}
            className={classes.textField}
            value={values.quantity}
            onChange={handleChange}
            margin="normal"
          />
          <br />
          <TextField
            id="price"
            label="Price"
            type="number"
            name="price"
            required
            className={classes.textField}
            error={!!error}
            value={values.price}
            onChange={handleChange}
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
          >
            Submit
          </Button>
          <Link to={`/seller/shop/edit/${shopId}`} className={classes.submit}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}
