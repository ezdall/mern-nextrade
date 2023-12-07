import { useState, memo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// import useDataContext from '../auth/useDataContext';
import useAxiosPrivate from '../auth/useAxiosPrivate';
import { removeProduct } from './api-product';

function DeleteProduct({ shopId, product, onRemoveProduct }) {
  const axiosPrivate = useAxiosPrivate();
  const auth = useSelector(state => state.auth);

  const [open, setOpen] = useState(false);

  const clickButton = () => {
    setOpen(true);
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  const deleteProduct = () => {
    removeProduct({
      shopId,
      productId: product._id,
      axiosPrivate2: axiosPrivate
    }).then(data => {
      if (data?.isAxiosError) {
        return console.log({ errDelProd: data.response?.data });
      }
      setOpen(false);
      return onRemoveProduct(product);
    });
  };

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
    name: PropTypes.string.isRequired
  }).isRequired,
  shopId: PropTypes.string.isRequired,
  onRemoveProduct: PropTypes.func.isRequired
};

const MemoDeleteProduct = memo(DeleteProduct);
export default MemoDeleteProduct;
