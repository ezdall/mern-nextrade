import { useState } from 'react';
// import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import AddCartIcon from '@material-ui/icons/AddShoppingCart';
import DisabledCartIcon from '@material-ui/icons/RemoveShoppingCart';

import cart from './cart-helper';

const useStyles = makeStyles(() => ({
  iconButton: {
    width: '28px',
    height: '28px'
  },
  disabledIconButton: {
    color: '#7f7563',
    width: '28px',
    height: '28px'
  }
}));

export default function AddToCart(props) {
  const { item, cartStyle } = props;

  const [redirect, setRedirect] = useState(false) 

  const classes = useStyles();

  const addToCart = () => {
    cart.addItem(item, () => {
      setRedirect(true);
    });
  };

if(redirect){
  return <Navigate to='/cart' />
}

  return (
    <span>
      {item.quantity >= 0 ? (
        <IconButton color="secondary" dense="dense" onClick={addToCart}>
          <AddCartIcon className={cartStyle || classes.iconButton} />
        </IconButton>
      ) : (
        <IconButton disabled color="secondary" dense="dense">
          <DisabledCartIcon
            className={cartStyle || classes.disabledIconButton}
          />
        </IconButton>
      )}
    </span>
  );
}

// AddToCart.propTypes = {
//   item: PropTypes.object.isRequired,
//   cartStyle: PropTypes.string
// }