import { useState } from 'react';

import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';

import { list } from './api-product';
import Products from './products.comp';

const useStyles = makeStyles(theme => ({
  card: {
    margin: 'auto',
    textAlign: 'center',
    paddingTop: 10,
    backgroundColor: '#80808024'
  },
  menu: {
    width: 200
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 130,
    verticalAlign: 'bottom',
    marginBottom: '20px'
  },
  searchField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
    marginBottom: '20px'
  },
  searchButton: {
    minWidth: '20px',
    height: '30px',
    padding: '0 8px',
    marginBottom: '20px'
  }
}));

const useStyles2 = makeStyles(theme => ({
  card: {
    margin: 'auto',
    textAlign: 'center',
    paddingTop: theme.spacing(2),
    backgroundColor: theme.palette.background.default // Use theme color
  },
  menu: {
    width: theme.spacing(25) // Use theme spacing for width
  },
  textField: {
    margin: theme.spacing(1),
    width: theme.spacing(16), // Use theme spacing for width
    verticalAlign: 'bottom',
    marginBottom: theme.spacing(2)
  },
  searchField: {
    margin: theme.spacing(1),
    width: theme.spacing(37), // Use theme spacing for width
    marginBottom: theme.spacing(2)
  },
  searchButton: {
    minWidth: theme.spacing(2.5),
    height: theme.spacing(3.75),
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius, // Add border radius
    color: theme.palette.primary.contrastText, // Button text color
    backgroundColor: theme.palette.primary.main // Button background color
  }
}));

export default function Search({ categories }) {
  const classes = useStyles();
  const [values, setValues] = useState({
    category: '',
    search: '',
    results: []
  });
  const [searched, setSearched] = useState(false);

  const handleChange = ev => {
    const { name, value } = ev.target;

    setValues({ ...values, [name]: value });
  };

  const search = () => {
    if (values.search) {
      list({
        search: values.search, // || undefined ?
        category: values.category
      }).then(data => {
        console.log({ data });
        if (data?.isAxiosError) {
          return console.log({ errSearch: data.response.data.error });
        }
        setSearched(true);
        return setValues(prev => ({ ...prev, results: data }));
      });
    }
  };

  const enterKey = event => {
    if (event.keyCode === 13) {
      // enter?
      event.preventDefault(); // refresh at search-box?
      search();
    }
  };

  // console.log({ values });

  return (
    <div>
      <Card className={classes.card}>
        <TextField
          id="select-category"
          select
          label="Select category"
          className={classes.textField}
          name="category"
          value={values.category || 'All'}
          onChange={handleChange}
          SelectProps={{
            MenuProps: {
              className: classes.menu
            }
          }}
          margin="normal"
        >
          <MenuItem value="All">All</MenuItem>
          {categories.length &&
            categories.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          id="search"
          label="Search products"
          type="search"
          onKeyDown={enterKey}
          name="search"
          onChange={handleChange}
          className={classes.searchField}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.searchButton}
          onClick={search}
        >
          <SearchIcon />
        </Button>
        <Divider />
        <Products products={values.results} searched={searched} />
      </Card>
    </div>
  );
}

Search.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};
