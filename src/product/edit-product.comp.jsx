import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import FileUpload from '@material-ui/icons/AddPhotoAlternate';

import useAxiosPrivate from '../auth/useAxiosPrivate';
import { readProduct, updateProduct } from './api-product';
import { BASE_URL } from '../axios';

const useStyles = makeStyles(theme => ({
  card: {
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    maxWidth: 500,
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  filename: {
    marginLeft: '10px'
  }
}));

export default function EditProduct() {
  const classes = useStyles();
  const { productId, shopId } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    quantity: '',
    price: ''
  });

  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    readProduct({
      productId,
      signal
    }).then(data => {
      if (!data?.isAxiosError) {
        return setValues(prev => ({
          ...prev,
          ...data,
          id: data._id
        }));
      }
      return setError(data.response?.data?.error);
    });

    return () => {
      console.log('abort edit-prod read');
      abortController.abort();
    };
  }, [productId]);

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

    return updateProduct({
      productData,
      shopId,
      productId,
      axiosPrivate2: axiosPrivate
    }).then(data => {
      if (data?.isAxiosError) {
        return setError(data.message);
      }
      return setRedirect(true);
    });
  };

  const handleChange = event => {
    const { name, value, files } = event.target;

    setError('');

    const inputValue = name === 'image' ? files[0] : value;

    setValues({ ...values, [name]: inputValue });
  };

  const imageUrl = values._id
    ? `${BASE_URL}/api/product/image/${values._id}?${new Date().getTime()}`
    : `${BASE_URL}/api/products/defaultphoto`;

  const { category } = values;

  if (redirect) {
    return <Navigate to={`/seller/shop/edit/${shopId}`} />;
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Edit Product
          </Typography>
          <br />
          <Avatar src={imageUrl} className={classes.bigAvatar} />
          <br />
          <input
            accept="image/*"
            name="image"
            onChange={handleChange}
            className={classes.input}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Change Image
              <FileUpload />
            </Button>
          </label>
          <span className={classes.filename}>{values.image.name}</span>
          <br />
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            name="name"
            required
            value={values.name}
            onChange={handleChange}
            error={!!error}
            margin="normal"
          />
          <br />

          <TextField
            id="multiline-flexible" // "description"
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
            className={classes.textField}
            name="category"
            value={values.category}
            onChange={handleChange}
            margin="normal"
          />

          <br />
          <TextField
            id="quantity"
            label="Quantity"
            className={classes.textField}
            name="quantity"
            value={values.quantity}
            onChange={handleChange}
            error={!!error}
            type="number"
            margin="normal"
          />
          <br />
          <TextField
            id="price"
            label="Price"
            className={classes.textField}
            name="price"
            value={values.price}
            onChange={handleChange}
            error={!!error}
            type="number"
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
            Update
          </Button>
          <Link to={`/seller/shop/edit/${shopId}`} className={classes.submit}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}
