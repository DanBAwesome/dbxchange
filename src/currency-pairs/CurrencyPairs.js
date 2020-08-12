import React from 'react';
import { currencies, success, parseJSON, hasBeenMoreThanDay, toFixed } from '../shared/utils';
import SelectWithInput from '../shared/SelectWithInput';
import './CurrencyPairs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

class CurrencyPairs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lastUpdated: '',
            currencyPair: '',
            currency1: {
                name: 'USD',
                value: 1
            },
            currency2: {
                name: 'GBP',
                value: 0
            }
        }

        this.onValue1Change = this.onValue1Change.bind(this);
        this.onValue2Change = this.onValue2Change.bind(this);
        this.onSelect1Change = this.onSelect1Change.bind(this);
        this.onSelect2Change = this.onSelect2Change.bind(this);
        this.loadResults = this.loadResults.bind(this);
        this.flipRates = this.flipRates.bind(this);
    }

    updateResults(data) {
        const { currency1, currency2 } = this.state;
        const { toggleLoading } = this.props;
        currency1.name = data.base;
        currency2.name = Object.keys(data.rates)[0];
        currency2.value = toFixed(currency1.value * data.rates[currency2.name], 2);
        this.setState({
            lastUpdated: data.date,
            currencyPair: data.rates[currency2.name],
            currency1,
            currency2
        });

        toggleLoading(false);
    }

    prependZeros(number, maxLength = 1) {
        number = number.toString();
        while (number.length < maxLength) {
            number = "0" + number;
        }

        return number;
    }

    componentDidMount() {
        let storedResult = JSON.parse(localStorage.getItem("currencyPair"));

        if (storedResult && !hasBeenMoreThanDay(storedResult.date)) {
            this.updateResults(storedResult);
            return;
        }
        this.loadResults();
    }

    loadResults() {
        const { currency1, currency2 } = this.state;
        const { toggleLoading } = this.props;

        toggleLoading(true);
        fetch(`https://alt-exchange-rate.herokuapp.com/latest?base=${currency1.name}&symbols=${currency2.name}`)
            .then(success)
            .then(parseJSON)
            .then((data) => {
                this.updateResults(data);
                localStorage.setItem("currencyPair", JSON.stringify(data));
                localStorage.setItem("date", data.date);
            })
            .catch((error) => {
                console.log(error.message);
            })
    }

    delayChange() {
        var timer = setInterval(() => { }, 1000);
    }

    onValue1Change(event) {
        let value = Number(event.target.value);
        const { currency1, currency2 } = this.state;

        if (!value && value !== 0) {
            return;
        }

        this.updateCurrency2(currency1, currency2, event.target.value);
    }

    onValue2Change(event) {
        let value = Number(event.target.value);
        const { currency1, currency2 } = this.state;

        if (!value && value !== 0) {
            return;
        }

        this.updateCurrency1(currency1, currency2, event.target.value);
    }

    onSelect1Change(event) {
        const value = event.target.value;
        const { currency1 } = this.state;
        currency1.name = value;

        this.setState({
            currency1
        });

        this.loadResults();
    }

    onSelect2Change(event) {
        const value = event.target.value;
        const { currency2 } = this.state;
        currency2.name = value;

        this.setState({
            currency2
        });

        this.loadResults();
    }

    updateCurrency1(currency1, currency2, value) {
        currency1.value = toFixed(Number(value) / this.state.currencyPair, 2);
        currency2.value = value;
        this.setState({
            currency1,
            currency2
        })
    }

    updateCurrency2(currency1, currency2, value) {
        currency1.value = value;
        currency2.value = toFixed(Number(value) * this.state.currencyPair, 2);
        this.setState({
            currency1,
            currency2
        })
    }

    flipRates(event) {
        const { currency1, currency2, currencyPair } = this.state;

        this.setState({
            currencyPair: 1 / currencyPair
        },
        () => { this.updateCurrency2(currency2, currency1, currency1.value);
                this.updateLocalStorage(currency2.name, currency1.name, this.state.currencyPair) });        
    }

    updateLocalStorage(base, pairName, pairRate) {
        const localStorageDate = localStorage.getItem("date");
        let currencyPair = {};
        currencyPair.base = base;
        currencyPair.rates = {};
        currencyPair.rates[pairName] = pairRate;
        currencyPair.date = localStorageDate;

        localStorage.setItem("currencyPair", JSON.stringify(currencyPair));
    }

    render() {
        const { currency1, currency2, lastUpdated } = this.state;
        const { loading } = this.props;

        return (
            <React.Fragment>
                <div className="card-header">
                    Currency Pairs
                </div>
                <div className="card-body" hidden={loading}>
                    <div className="updated-time">Last Updated At {lastUpdated} CET</div>
                    <div className="col-12" id="currencyPairs">
                        <SelectWithInput options={currencies.filter(x => x !== currency2.name)}
                            currentItem={currency1.name}
                            value={currency1.value}
                            selectChange={this.onSelect1Change}
                            inputChange={this.onValue1Change} />
                        <button onClick={this.flipRates} className="btn btn-sm mb-3"><FontAwesomeIcon icon={faExchangeAlt}></FontAwesomeIcon></button>
                        <SelectWithInput options={currencies.filter(x => x !== currency1.name)}
                            currentItem={currency2.name}
                            value={currency2.value}
                            selectChange={this.onSelect2Change}
                            inputChange={this.onValue2Change} />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default CurrencyPairs;