import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { listByShop } from './api-product';
import { BASE_URL } from '../axios';
import DeleteProduct from './delete-product.comp';

const useStyles = makeStyles(theme => ({
  products: {
    padding: '24px'
  },
  addButton: {
    float: 'right'
  },
  leftIcon: {
    marginRight: '8px'
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  cover: {
    width: 110,
    height: 100,
    margin: '8px'
  },
  details: {
    padding: '10px'
  }
}));

export default function MyProducts(props) {
  const classes = useStyles();

  const { shopId } = props;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    listByShop({
      shopId,
      signal
    }).then(data => {
      console.log({ data });
      if (data.isAxiosError) {
        console.log(data.message);
      }
      return setProducts(data);
    });

    return () => {
      console.log('my-prod listByShop');
      abortController.abort();
    };
  }, [shopId]);

  const onRemoveProduct = product => {
    const filteredProducts = products.filter(prod => prod._id !== product._id);
    setProducts(filteredProducts);
  };

  return (
    <Card className={classes.products}>
      <Typography type="title" className={classes.title}>
        Products
        <span className={classes.addButton}>
          <Link to={`/seller/${shopId}/products/new`}>
            <Button color="primary" variant="contained">
              {/* <Icon className={classes.leftIcon}>add_box</Icon> */}
              New Product
            </Button>
          </Link>
        </span>
      </Typography>
      <List dense>
        {products.length &&
          products.map(product => {
            return (
              <span key={product._id}>
                <ListItem>
                  <CardMedia
                    className={classes.cover}
                    image={`${BASE_URL}/api/product/image/${
                      product._id
                    }?${new Date().getTime()}`}
                    title={product.name}
                  />
                  <div className={classes.details}>
                    <Typography
                      type="headline"
                      component="h2"
                      color="primary"
                      className={classes.productTitle}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      type="subheading"
                      component="h4"
                      className={classes.subheading}
                    >
                      Quantity: {product.quantity} | Price: ${product.price}
                    </Typography>
                  </div>
                  <ListItemSecondaryAction>
                    <Link
                      to={`/seller/${product.shop._id}/${product._id}/edit`}
                    >
                      <IconButton aria-label="Edit" color="primary">
                        <Edit />
                      </IconButton>
                    </Link>
                    <DeleteProduct
                      product={product}
                      shopId={shopId}
                      onRemoveProduct={onRemoveProduct}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </span>
            );
          })}
      </List>
    </Card>
  );
}

MyProducts.propTypes = {
  shopId: PropTypes.string.isRequired
}
