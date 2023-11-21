import { useContext } from 'react';
import DataContext from './data-provider.ctx';

export default function useDataContext() {
  return useContext(DataContext);
}
