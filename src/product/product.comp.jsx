import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';

import { readProduct, listRelated } from './api-product';
import { BASE_URL } from '../axios';
import Suggestions from './suggestions.comp';
import AddToCart from '../cart/add-cart.comp';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30
  },
  flex: {
    display: 'flex'
  },
  card: {
    padding: '24px 40px 40px'
  },
  subheading: {
    margin: '24px',
    color: theme.palette.openTitle
  },
  price: {
    padding: '16px',
    margin: '16px 0px',
    display: 'flex',
    backgroundColor: '#93c5ae3d',
    fontSize: '1.3em',
    color: '#375a53'
  },
  media: {
    height: 200,
    display: 'inline-block',
    width: '50%',
    marginLeft: '24px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  link: {
    color: '#3e4c54b3',
    fontSize: '0.9em'
  },
  addCart: {
    width: '35px',
    height: '35px',
    padding: '10px 12px',
    borderRadius: '0.25em',
    backgroundColor: '#5f7c8b'
  },
  action: {
    margin: '8px 24px',
    display: 'inline-block'
  }
}));

export default function Product() {
  const classes = useStyles();
  const { productId } = useParams();

  const [product, setProduct] = useState({
    quantity: 0,
    shop: {}
  });
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    readProduct({ productId, signal }).then(data => {
      if (!data?.isAxiosError) {
        return setProduct(data);
      }
      console.log({ errProd: data.response?.data });
      return setError(data.response?.data?.error);
    });

    return () => {
      abortController.abort();
      console.log('abort prod-comp');
    };
  }, [productId]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    listRelated({ productId, signal }).then(data => {
      if (!data?.isAxiosError) {
        return setSuggestions(data);
      }
      return setError(data.response?.data?.error);
    });

    return () => {
      abortController.abort();
      console.log('abort prod-related');
    };
  }, [productId]);

  const imageUrl = product._id
    ? `${BASE_URL}/api/product/image/${product._id}?${new Date().getTime()}`
    : `${BASE_URL}/api/products/defaultphoto`;

  if (error) return <p>Error!!..</p>;

  return (
    <div className={classes.root}>
      <Grid container spacing={10}>
        <Grid item xs={7} sm={7}>
          <Card className={classes.card}>
            <CardHeader
              title={product.name}
              subheader={
                product.quantity > 0
                  ? `(${product.quantity}) in Stock`
                  : 'Out of Stock'
              }
              action={
                <span className={classes.action}>
                  <AddToCart cartStyle={classes.addCart} item={product} />
                </span>
              }
            />
            <div className={classes.flex}>
              <CardMedia
                className={classes.media}
                image={imageUrl}
                title={product.name}
              />
              <Typography
                component="p"
                variant="subtitle1"
                className={classes.subheading}
              >
                {product.description}
                <br />
                <span className={classes.price}>$ {product.price}</span>
                <Link
                  to={`/shops/${product.shop._id}`}
                  className={classes.link}
                >
                  <span>
                    <Icon className={classes.icon}>shopping_basket</Icon>{' '}
                    {product.shop.name}
                  </span>
                </Link>
              </Typography>
            </div>
          </Card>
        </Grid>
        {suggestions.length > 0 && (
          <Grid item xs={5} sm={5}>
            <Suggestions products={suggestions} title="Related Products" />
          </Grid>
        )}
      </Grid>
    </div>
  );
}
