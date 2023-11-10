import {useState} from 'react'
// import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import auth from '../auth/auth-helper'
import { removeProduct } from './api-product'

export default function DeleteProduct(props) {
  const {shopId, product, onRemoveProduct} = props

  const [open, setOpen] = useState(false)
  
  const jwt = auth.isAuthenticated()

  const clickButton = () => {
    setOpen(true)
  }

  const deleteProduct = () => {
    removeProduct({
      shopId,
      productId: product._id
    }).then((data) => {
      if (data.error) {
        return console.log(data.error)
      } 

        setOpen(false)
       return onRemoveProduct(product)
      
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }

    return (<span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon/>
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
          <Button onClick={deleteProduct} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>)

}
// DeleteProduct.propTypes = {
//   shopId: PropTypes.string.isRequired,
//   product: PropTypes.object.isRequired,
//   onRemove: PropTypes.func.isRequired
// }

