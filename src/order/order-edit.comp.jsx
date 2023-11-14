import {useState, useEffect} from 'react'
// import PropTypes from 'prop-types'

import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'

import auth from '../auth/auth-helper'

import {getStatusValues, update, cancelOrder, processCharge} from './api-order'
import {BASE_URL, handleAxiosError} from '../axios'

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
    paddingBottom: 0
  },
  listImg: {
    width: '70px',
    verticalAlign: 'top',
    marginRight: '10px'
  },
  listDetails: {
    display: "inline-block"
  },
  listQty: {
    margin: 0,
    fontSize: '0.9em',
    color: '#5f7c8b'
  },
  textField: {
    width: '160px',
    marginRight: '16px'
  },
  statusMessage: {
    position: 'absolute',
    zIndex: '12',
    right: '5px',
    padding: '5px'
  }
}))
export default function ProductOrderEdit (props){
  const {updateOrders, shopId, order, orderIndex } = props

  const classes = useStyles()
  const [values, setValues] = useState({
      open: 0,
      statusValues: [],
      error: ''
  })
  const jwt = auth.isAuthenticated()
  useEffect(() => {
    const abortController = new AbortController()
    const {signal} = abortController

    getStatusValues(signal).then((data) => {
      // console.log({data})
      if (data.isAxiosError) {
        handleAxiosError(data)
        setValues({...values, error: "Could not get status"})
      } else {
        setValues({...values, statusValues: data, error: ''})
      }
    })
    return ()=>{
      abortController.abort()
    }
  }, [])

  const handleStatusChange = productIndex => event => {
    const { value } = event.target

    order.products[productIndex].status = value
    const product = order.products[productIndex]

    if (event.target.value === "Cancelled") {

      cancelOrder({
          shopId,
          productId: product.product._id
        }, {
          cartItemId: product._id,
          status: value,
          quantity: product.quantity
        })
        .then((data) => {
          if (data.isAxiosError) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            updateOrders(orderIndex, order)
            setValues({
              ...values,
              error: ''
            })
          }
        })

    } else if (event.target.value === "Processing") {
      processCharge({
          userId: jwt.user._id,
          shopId,
          orderId: order._id
        }, {
          cartItemId: product._id,
          status: value,
          amount: (product.quantity * product.product.price)
        })
        .then((data) => {
          if (data.isAxiosError) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            updateOrders(orderIndex, order)
            setValues({
              ...values,
              error: ''
            })
          }
        })
        // delivered?
    } else {
      update({
          shopId
        }, {
          cartItemId: product._id,
          status: value
        })
        .then((data) => {
          console.log({data1:data})
          if (data.isAxiosError) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            updateOrders(orderIndex, order)
            setValues({
              ...values,
              error: ''
            })
          }
        })
    }
  }

  console.log({values})
  console.log({products:order.products})

    return (
    <div>
      <Typography component="span" color="error" className={classes.statusMessage}>
        {values.error}
      </Typography>
      <List disablePadding style={{backgroundColor:'#f8f8f8'}}>
        {order.products.map((item, index) => {

          return <span key={item._id}>
                  { item.shop === shopId &&
                    <ListItem button className={classes.nested}>
                      <ListItemText
                        primary={<div>
                                    <img className={classes.listImg} src={`${BASE_URL}/api/product/image/${item.product._id}`} alt="product"/>
                                    <div className={classes.listDetails}>
                                      {item.product.name}
                                      <p className={classes.listQty}>{`Quantity: ${item.quantity}`}</p>
                                    </div>
                                  </div>}/>
                      <TextField
                        error={Boolean(values.error)}
                        id="select-status"
                        select
                        label="Update Status"
                        className={classes.textField}
                        value={item.status}
                        onChange={handleStatusChange(index)}
                        SelectProps={{
                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                        margin="normal"
                      >
                        {values.statusValues.map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </ListItem>
                  }
                  <Divider style={{margin: 'auto', width: "80%"}}/>
                </span>})
              }
      </List>
    </div>)
}
// ProductOrderEdit.propTypes = {
//   shopId: PropTypes.string.isRequired,
//   order: PropTypes.object.isRequired,
//   orderIndex: PropTypes.number.isRequired,
//   updateOrders: PropTypes.func.isRequired
// }
