import React, { PropTypes } from 'react';


const Counter = ({ value, actions: { onIncrement, onDecrement } }) => (
  <div>
    <p>Clicked: {value} times</p>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

Counter.propTypes = {
  value: PropTypes.number.isRequired,

  actions: PropTypes.shape({
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired,
  }),
};


export default Counter;
