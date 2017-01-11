import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';

import { counterIncrement, counterDecrement } from '~/actions';

import Counter from '~/components/Counter';

import style from './style';

class App extends PureComponent {
  static propTypes = {
    counter: PropTypes.number.isRequired,
    wsStatus: PropTypes.oneOf(['initing', 'inited', 'closed']),

    counterIncrement: PropTypes.func.isRequired,
    counterDecrement: PropTypes.func.isRequired,
  }

  state = { status: this.props.wsStatus }

  componentWillReceiveProps({ wsStatus }) {
    if (this.props.wsStatus === wsStatus) {
      return;
    }

    if (wsStatus === 'inited') {
      this.setState({ status: 'pending' });

      setTimeout(
        () => this.setState((state, { wsStatus: status }) => ({ status })),
        this.timeout,
      );

      return;
    }

    this.setState({ status: wsStatus });
  }

  timeout = 2000

  render() {
    const { counter, ...actions } = this.props;
    const { status } = this.state;

    if (status === 'pending') {
      return (
        <div>
          <p>Please wait {this.timeout} ms after socket connection</p>
        </div>
      );
    }

    if (status === 'closed') {
      return (
        <div>
          <p>Socket was closed</p>
        </div>
      );
    }

    if (status === 'initing') {
      return (
        <div>
          <p>Waiting for socket initing</p>
        </div>
      );
    }

    return (
      <div className={style.app}>
        <section className={style.content}>
          <header className={style.header}>
            <h1>Redux WSAT Counter example</h1>
            <p>Try multiple connection</p>
          </header>
          <main>
            <Counter
              {...{
                value: counter,
                actions: {
                  onIncrement: actions.counterIncrement,
                  onDecrement: actions.counterDecrement,
                },
              }}
            />
          </main>
        </section>
      </div>
    );
  }
}

export default connect(
  ({ counter, app: { wsStatus } }) => ({ counter, wsStatus }),
  { counterIncrement, counterDecrement },
)(App);
