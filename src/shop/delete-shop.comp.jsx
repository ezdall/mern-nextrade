import {useState, useEffect, useRef} from 'react'
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
import { removeShop } from './api-shop'
import { handleAxiosError} from '../axios'

export default function DeleteShop(props) {
  const {shop, onRemoveShop} = props
  const dialogRef = useRef()

  const [open, setOpen] = useState(false)
  
  const jwt = auth.isAuthenticated()



  const clickButton = () => {
    setOpen(true)
    // dialogRef.current.open()
  }

  const deleteShop = () => {

    removeShop({
      shopId: shop._id
    })
    .then((data) => {
      if (data?.isAxiosError) {
        console.log(data.message)
        return handleAxiosError(data)
      } 
      setOpen(false)
       // dialogRef.current.close()
      return onRemoveShop(shop)
    })
  }

  const handleRequestClose = () => {
    // dialogRef.current.close()
    setOpen(false)
  }

    return (<span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon/>
      </IconButton>

{/*  replace with useRef */}
    {/* dialog box open={open} */}
      <Dialog ref={dialogRef} open={open} onClose={handleRequestClose}>
        <DialogTitle>{`Delete ${shop.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your shop {shop.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteShop} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>)
}

// DeleteShop.propTypes = {
//   shop: PropTypes.object.isRequired,
//   onRemove: PropTypes.func.isRequired
// }