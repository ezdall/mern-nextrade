import { useState } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import useDataContext from '../auth/useDataContext';
import useAxiosPrivate from '../auth/useAxiosPrivate';
import { removeProduct } from './api-product';

export default function DeleteProduct(props) {
  const { shopId, product, onRemoveProduct } = props;

  const { auth: auth2 } = useDataContext();
  const axiosPrivate = useAxiosPrivate();

  const [open, setOpen] = useState(false);

  const clickButton = () => {
    setOpen(true);
  };

  const deleteProduct = () => {
    removeProduct({
      shopId,
      axiosPrivate,
      productId: product._id,
      accessToken2: auth2.accessToken
    }).then(data => {
      if (data.isAxiosError) {
        return console.log({ errDelProd: data.response.data.error });
      }

      setOpen(false);
      return onRemoveProduct(product);
    });
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  console.log({product})

  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{`Delete ${product.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your product {product.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteProduct}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}

DeleteProduct.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  shopId: PropTypes.string.isRequired,
  onRemoveProduct: PropTypes.func.isRequired
}
