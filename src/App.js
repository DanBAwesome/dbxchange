import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Loading } from './shared/Loading';
import Header from './layout/Header';
import Footer from './layout/Footer';
import CurrencyPairs from './currency-pairs/CurrencyPairs';
import ExchangeRates from './exchange-rates/ExchangeRates';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { render } from '@testing-library/react';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };

    this.toggleLoading = this.toggleLoading.bind(this);
  }

  toggleLoading(isLoading) {
    this.setState({ loading: isLoading });
  }

  render() {
    const { loading } = this.state;

    return (
      <Router>
        <div className="App container">
          <Header />
          <div className="card">
            <Loading loading={loading} />
            <Switch>
              <Route exact path="/">
                <CurrencyPairs loading={loading} toggleLoading={this.toggleLoading} />
              </Route>
              <Route path="/exchange-rates">
                <ExchangeRates loading={loading} toggleLoading={this.toggleLoading} />
              </Route>
            </Switch>
            <div className="disclaimer">
              Exchange Rates are collected from the <a
                href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/"
                target="_blank">
                European Central Bank
              </a>
            </div>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
