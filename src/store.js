import {createStore, combineReducers, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import reducer from './redux/reducer'
//import reducer2 from './redux/reducer2'



const reducers = combineReducers({
   reducer, 
//   reducer2
});

export default createStore(reducers, applyMiddleware(promiseMiddleware()));