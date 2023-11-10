import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Avatar from '@material-ui/core/Avatar'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import Grid from '@material-ui/core/Grid'

import { readShop, updateShop } from './api-shop'
import auth from '../auth/auth-helper'
import { BASE_URL } from '../axios'
// import MyProducts from './../product/MyProducts'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    textAlign: 'center',
    paddingBottom: theme.spacing(2)
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

export default function EditShop ({match}) {
  const navigate = useNavigate()
  const classes = useStyles()
  
  const [values, setValues] = useState({
      name: '',
      description: '',
      image: '',
      redirect: false,
      error: '',
      id: ''
  })

  const jwt = auth.isAuthenticated()
  const params = useParams()

  useEffect(() => {
    const abortController = new AbortController()
    const {signal}= abortController

    readShop({
      shopId: params.shopId
    }, signal)
    .then((data) => {
      if (data.isAxiosError) {
       return setValues({...values, error: data.message})
      }      
      return setValues({...values, id: data._id, name: data.name, description: data.description, owner: data.owner.name})
    })

    return function cleanup(){
      abortController.abort()
    }
  }, [params.shopId])

 const handleChange = ev => {
    const { name, value, files } = ev.target;

    setValues({ ...values, error: '' });

    // console.log(values)

    const inputValue = name === 'image' ? files[0] : value;
    setValues({ ...values, [name]: inputValue });
  }

  const clickSubmit = () => {
    const { name, description, image } = values;

    if (!name) {
      return setValues({ ...values, error: 'name is required' });
    }

    const shopData = new FormData()

    if (name) shopData.append('name', name);
    if (description) shopData.append('description', description);
    if (image) shopData.append('image', image);

    return updateShop({
      shopId: params.shopId
    }, shopData)
     .then((data) => {
      if (data.isAxiosError) {
       return setValues({...values, error: data.message})
      } 
      navigate('/seller/shops')

      return setValues({...values, error:'', redirect: true})
    })
     .catch(err => {
        console.error({ err });
        setValues({ ...values, error: err });
      });
  }

    const logoUrl = values.id
      ? `${BASE_URL}/api/shops/logo/${values.id}?${new Date().getTime()}`
      : `${BASE_URL}/api/shops/defaultphoto`

    return (<div className={classes.root}>
      <Grid container spacing={8}>
        <Grid item xs={6} sm={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography type="headline" component="h2" className={classes.title}>
                Edit Shop
              </Typography>
              <br/>
              <Avatar src={logoUrl} className={classes.bigAvatar}/><br/>
              <input name="image" accept="image/*" onChange={handleChange} className={classes.input} id="icon-button-file" type="file" />
              <label htmlFor="icon-button-file">
                <Button variant="contained" color="default" component="span">
                  Change Logo
                  <FileUpload/>
                </Button>
              </label> <span className={classes.filename}>{values.image ? values.image.name : ''}</span><br/>
              <TextField id="name" name="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange} margin="normal"/><br/>
              <TextField
                id="multiline-flexible"
                name="description"
                label="Description"
                multiline
                minRows="3"
                value={values.description}
                onChange={handleChange}
                className={classes.textField}
                margin="normal"
              /><br/>
              <Typography type="subheading" component="h4" className={classes.subheading}>
                Owner: {values.owner}
              </Typography><br/>
              {
                values.error && (<Typography component="p" color="error">
                    <Icon color="error" className={classes.error}>error</Icon>
                    {values.error}
                  </Typography>)
              }
            </CardContent>
            <CardActions>
              <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Update</Button>
            </CardActions>
          </Card>
          </Grid>
          <Grid item xs={6} sm={6}>
        {/* <MyProducts shopId={params.shopId}/> */}
            
          </Grid>
        </Grid>
    </div>)
}
