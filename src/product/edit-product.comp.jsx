import {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
// import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Avatar from '@material-ui/core/Avatar'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'

import auth from '../auth/auth-helper'
import { readProduct, updateProduct} from './api-product'
import { BASE_URL } from '../axios'

const useStyles = makeStyles(theme => ({
  card: {
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    maxWidth: 500,
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  }
}))

export default function EditProduct () {
  const classes = useStyles()
  const params = useParams()
  const navigate = useNavigate()

  const [values, setValues] = useState({
      name: '',
      description: '',
      image: '',
      category: '',
      quantity: '',
      price: '',
      redirect: false,
      error: ''
    })

    const jwt = auth.isAuthenticated()

    useEffect(() => {
      const abortController = new AbortController()
      const {signal} = abortController.signal

      readProduct({
        productId: params.productId
      }, signal).then((data) => {
        if (data?.isAxiosError) {
         return setValues({...values, error: data.message})
        } 
        return setValues({...values, id: data._id, name: data.name, description: data.description, category: data.category, quantity:data.quantity, price: data.price})
      })
    return ()=> {
      console.log('abort edit-prod read')
      abortController.abort()
    }
  }, [params.productId])

  const clickSubmit = () => {
    const {name, description, category, quantity, price, image} = values

    if(!name || !quantity || !price){
      return setValues({ ...values, error:'fill-up the required field!'})
    }

    const productData = new FormData()

    if (name) productData.append('name', name);
    if (description) productData.append('description', description);
    if (image) productData.append('image', image);
    
    if (category) productData.append('category', category);
    if (quantity) productData.append('quantity', quantity);
    if (price) productData.append('price', price);

    return updateProduct({
      shopId: params.shopId,
      productId: params.productId
    }, productData)
      .then((data) => {
      if (data?.isAxiosError) {
        return setValues({...values, error: data.message})
      } 
      setValues({...values, 'redirect': true})
      return navigate(`/seller/shop/edit/${params.shopId}`)
    })
  }

  const handleChange = event => {
    const {name, value, files} = event.target

    const inputValue = name === 'image' ? files[0] : value

    setValues({...values, [name]: inputValue })
  }

    const imageUrl = values.id
      ? `${BASE_URL}/api/product/image/${values.id}?${new Date().getTime()}`
      : `${BASE_URL}/api/products/defaultphoto`
    
    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Edit Product
          </Typography><br/>
          <Avatar src={imageUrl} className={classes.bigAvatar}/><br/>
          <input accept="image/*" name="image" onChange={handleChange} className={classes.input} id="icon-button-file" type="file" />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Change Image
              <FileUpload/>
            </Button>
          </label> <span className={classes.filename}>{values.image.name ?? ''}</span><br/>
          <TextField id="name" label="Name" className={classes.textField} name="name" value={values.name} onChange={handleChange} margin="normal"/><br/>
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            minRows="3"
            name="description"
            value={values.description}
            onChange={handleChange}
            className={classes.textField}
            margin="normal"
          /><br/>
          <TextField id="category" label="Category" className={classes.textField} name="category" value={values.category} onChange={handleChange} margin="normal"/><br/>
          <TextField id="quantity" label="Quantity" className={classes.textField} name="quantity" value={values.quantity} onChange={handleChange} type="number" margin="normal"/><br/>
          <TextField id="price" label="Price" className={classes.textField} name="price" value={values.price} onChange={handleChange} type="number" margin="normal"/><br/>
          {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}</Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Update</Button>
          <Link to={`/seller/shop/edit/${params.shopId}`} className={classes.submit}>
          <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>)
}