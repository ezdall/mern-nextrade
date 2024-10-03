import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import useDataContext from '../auth/useDataContext';
// import useAxiosPrivate from '../auth/useAxiosPrivate';
// import { saveCartItems } from './cart-helper';

const useStyles = makeStyles(theme => ({
  card: {
    margin: '24px 0px',
    padding: '16px 40px 60px 40px',
    backgroundColor: '#80808017'
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.openTitle,
    fontSize: '1.2em'
  },
  price: {
    color: theme.palette.text.secondary,
    display: 'inline'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: 0,
    width: 50
  },
  productTitle: {
    fontSize: '1.15em',
    marginBottom: '5px'
  },
  subheading: {
    color: 'rgba(88, 114, 128, 0.67)',
    padding: '8px 10px 0',
    cursor: 'pointer',
    display: 'inline-block'
  },
  cart: {
    width: '100%',
    display: 'inline-flex'
  },
  details: {
    display: 'inline-block',
    width: '100%',
    padding: '4px'
  },
  content: {
    flex: '1 0 auto',
    padding: '16px 8px 0px'
  },
  cover: {
    width: 160,
    height: 125,
    margin: '8px'
  },
  itemTotal: {
    float: 'right',
    marginRight: '40px',
    fontSize: '1.5em',
    color: 'rgb(72, 175, 148)'
  },
  checkout: {
    float: 'right',
    margin: '24px'
  },
  total: {
    fontSize: '1.2em',
    color: 'rgb(53, 97, 85)',
    marginRight: '16px',
    fontWeight: '600',
    verticalAlign: 'bottom'
  },
  continueBtn: {
    marginLeft: '10px'
  },
  itemShop: {
    display: 'block',
    fontSize: '0.90em',
    color: '#78948f'
  },
  removeButton: {
    fontSize: '0.8em'
  }
}));

export default function CartItems({ checkout, setCheckout }) {
  const classes = useStyles();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);

  const {
    cart,
    totalCost,
    removeProduct,
    updateCart: updateCartQty
  } = useDataContext();

  const handleQuantityChange = (prodId, event) => {
    const quantity = Number(event.target.value);

    updateCartQty(prodId, quantity);
  };

  const removeItem = prodId => removeProduct(prodId);

  const openCheckout = () => setCheckout(true);

  // const onSave = () => {
  //   const updCart = cart.map(item => ({
  //     ...item,
  //     product: item.product._id
  //   }));

  //   saveCartItems({
  //     userId: user._id,
  //     axiosPrivate2: axiosPrivate,
  //     cart: updCart
  //   }).then(data => {
  //     if (!data?.isAxiosError) {
  //       // console.log(data);
  //

  //       if (cartId) navigate(`/cart/${cartId}`);
  //     } else {
  //       console.log(data?.response?.data);
  //     }
  //   });
  // };

  // console.log({ cart: cart.map(s => s.product._id) });

  return (
    <Card className={classes.card}>
      <Typography type="title" className={classes.title}>
        Shopping Cart
      </Typography>
      {cart?.length ? (
        <span>
          {cart.map(item => {
            return (
              <span key={item.product._id}>
                <Card className={classes.cart}>
                  <CardMedia
                    className={classes.cover}
                    image={`/api/product/image/${item.product._id}`}
                    title={item.product.name}
                  />
                  <div className={classes.details}>
                    <CardContent className={classes.content}>
                      <Link to={`/product/${item.product._id}`}>
                        <Typography
                          type="title"
                          component="h3"
                          className={classes.productTitle}
                          color="primary"
                        >
                          {item.product.name}
                        </Typography>
                      </Link>
                      <div>
                        <Typography
                          type="subheading"
                          component="h3"
                          className={classes.price}
                          color="primary"
                        >
                          $ {item.product.price}
                        </Typography>
                        <span className={classes.itemTotal}>
                          ${item.product.price * item.quantity}
                        </span>
                        <span className={classes.itemShop}>
                          Shop: {item.product.shop.name}
                        </span>
                      </div>
                    </CardContent>
                    <div className={classes.subheading}>
                      Quantity:
                      <TextField
                        value={item.quantity}
                        onChange={ev =>
                          handleQuantityChange(item.product._id, ev)
                        }
                        type="number"
                        inputProps={{
                          min: 1
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                        margin="normal"
                      />
                      <Button
                        className={classes.removeButton}
                        color="primary"
                        onClick={() => removeItem(item.product._id)}
                      >
                        x Remove
                      </Button>
                    </div>
                  </div>
                </Card>
                <Divider />
              </span>
            );
          })}
          <div className={classes.checkout}>
            <span className={classes.total}>Total: ${totalCost()}</span>
            {!checkout &&
              totalCost() !== 0 &&
              (user ? (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={openCheckout}
                >
                  Checkout
                </Button>
              ) : (
                <Link to="/login" state={{ from: location }}>
                  <Button color="primary" variant="contained">
                    Sign in to checkout
                  </Button>
                </Link>
              ))}
            <Link to="/" className={classes.continueBtn}>
              <Button variant="contained">Continue Shopping</Button>
            </Link>
          </div>
        </span>
      ) : (
        <Typography variant="subtitle1" component="h3" color="primary">
          No items added to your cart.
        </Typography>
      )}
    </Card>
  );
}

CartItems.propTypes = {
  checkout: PropTypes.bool.isRequired,
  setCheckout: PropTypes.func.isRequired
};
