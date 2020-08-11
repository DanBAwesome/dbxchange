import React from 'react';
import { currencies, success, parseJSON, hasBeenMoreThanDay, toFixed } from '../shared/utils';
import SelectWithInput from '../shared/SelectWithInput';
import './CurrencyPairs.css';

class CurrencyPairs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lastUpdated: '',
            currencyPairs: '',
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

        currency1.value = event.target.value;
        currency2.value = toFixed(value * this.state.currencyPair, 2);
        this.setState({
            currency1,
            currency2
        })
    }

    onValue2Change(event) {
        let value = Number(event.target.value);
        const { currency1, currency2 } = this.state;

        if (!value && value !== 0) {
            return;
        }

        currency1.value = toFixed(value / this.state.currencyPair, 2);
        currency2.value = event.target.value;
        this.setState({
            currency1,
            currency2
        })
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

    render() {
        const { currency1, currency2, lastUpdated } = this.state;
        const { loading } = this.props;

        return (
            <React.Fragment>
                <div className="card-header">
                    Currency Pairs
                </div>
                <div className="card-body" hidden={loading}>
                    <div className="updated-time">Last Updated At {lastUpdated} UTC</div>
                    <div id="currencyPairs">
                        <SelectWithInput options={currencies.filter(x => x !== currency2.name)}
                            currentItem={currency1.name}
                            value={currency1.value}
                            selectChange={this.onSelect1Change}
                            inputChange={this.onValue1Change} />
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