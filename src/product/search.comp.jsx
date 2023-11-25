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

export default function Search({ categories }) {
  const classes = useStyles();
  const [values, setValues] = useState({
    category: '',
    search: '',
    results: []
  });

  const [searched, setSearched] = useState(false);

  const handleChange = event => {
    const { name, value } = event.target;

    setValues({ ...values, [name]: value });
  };

  const search = () => {
    if (values.search) {
      list({
        search: values.search,
        category: values.category
      }).then(data => {
        if (data.isAxiosError) {
          console.log({ errSearch: data.response.data.error });
        } else {
          setSearched(true);
          setValues({ ...values, results: data });
        }
      });
    }
  };

  const enterKey = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      search();
    }
  };

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
}
