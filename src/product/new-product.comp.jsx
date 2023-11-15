import { useState } from 'react';
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
  const navigate = useNavigate();
  const params = useParams();

  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    quantity: '',
    price: '',
    redirect: false,
    error: ''
  });

  const handleChange = ev => {
    const { name, value, files } = ev.target;

    const inputValue = name === 'image' ? files[0] : value;

    setValues({ ...values, [name]: inputValue });
  };

  const clickSubmit = () => {
    const { name, description, category, quantity, price, image } = values;

    if (!name || !quantity || !price) {
      return setValues({ ...values, error: 'fill-up the required field!' });
    }

    const productData = new FormData();

    if (name) productData.append('name', name);
    if (description) productData.append('description', description);
    if (image) productData.append('image', image);

    if (category) productData.append('category', category);
    if (quantity) productData.append('quantity', quantity);
    if (price) productData.append('price', price);

    return createProduct(
      {
        shopId: params.shopId
      },
      productData
    ).then(data => {
      if (data?.isAxiosError) {
        // console.log({data})
        handleAxiosError(data);
        return setValues({ ...values, error: data.message });
      }
      setValues({ ...values, error: '', redirect: true });
      return navigate(`/seller/shop/edit/${params.shopId}`);
    });
  };

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
          </label>{' '}
          <span className={classes.filename}>{values.image?.name ?? ''}</span>
          <br />
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            required
            name="name"
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
            required
            name="quantity"
            value={values.quantity}
            onChange={handleChange}
            type="number"
            margin="normal"
          />
          <br />
          <TextField
            id="price"
            label="Price"
            className={classes.textField}
            required
            name="price"
            value={values.price}
            onChange={handleChange}
            type="number"
            margin="normal"
          />
          <br />
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
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
          <Link
            to={`/seller/shop/edit/${params.shopId}`}
            className={classes.submit}
          >
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}
