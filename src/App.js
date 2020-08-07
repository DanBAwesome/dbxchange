import React from 'react';
import logo from './logo.svg';
import './App.css';
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


function App() {
  return (
    <Router>
      <div className="App container">
        <Header />
        <div className="card">
          <Switch>
            <Route exact path="/">
              <CurrencyPairs />
            </Route>
            <Route path="/exchange-rates">
              <ExchangeRates />
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

export default App;
