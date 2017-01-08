import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { counterIncrement, counterDecrement } from '~/actions';

import Counter from '~/components/Counter';

import style from './style';

const App = ({
  counter: value,
  counterIncrement: counterIncrementAction,
  counterDecrement: counterDecrementAction,
}) => (
  <div className={style.app}>
    <section className={style.content}>
      <header className={style.header}>
        <h1>Redux WSAT Counter example</h1>
        <p>Try multiple connection</p>
      </header>
      <main className={style.counter}>
        <Counter
          {...{
            value,
            actions: {
              onIncrement: counterIncrementAction,
              onDecrement: counterDecrementAction,
            },
          }}
        />
      </main>
    </section>
  </div>
);

App.propTypes = {
  counter: PropTypes.number.isRequired,

  counterIncrement: PropTypes.func.isRequired,
  counterDecrement: PropTypes.func.isRequired,
};

export default connect(
  ({ counter }) => ({ counter }),
  { counterIncrement, counterDecrement },
)(App);
