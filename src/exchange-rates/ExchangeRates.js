import React from 'react';
import SelectWithInput from '../shared/SelectWithInput';
import { currencies, success, parseJSON, hasBeenMoreThanDay } from '../shared/utils';

class ExchangeRates extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lastUpdated: '',
            currency: {
                name: 'USD',
                value: 1
            },
            rates: '',
            selectedRates: []
        }

        this.onSelectChange = this.onSelectChange.bind(this);
    }

    onSelectChange(event) {
        const value = event.target.value;
        const { currency } = this.state;
        currency.name = value;

        this.setState({
            currency
        })

        this.loadResults();
    }

    updateResults(data) {
        const { currency } = this.state;
        currency.name = data.base;
        this.setState({
            lastUpdated: data.date,
            rates: data.rates,
            currency
        })
    }

    loadResults() {
        const { currency } = this.state;

        fetch(`https://alt-exchange-rate.herokuapp.com/latest?base=${currency.name}`)
            .then(success)
            .then(parseJSON)
            .then((data) => {
                this.updateResults(data);
                localStorage.setItem("exchageRates", JSON.stringify(data));
                localStorage.setItem("date", data.date);
            })
            .catch((error) => {
                console.log(error.message);
            })
    }
    
    componentDidMount() {
        let storedResult = JSON.parse(localStorage.getItem("exchageRates"));

        if (storedResult && !hasBeenMoreThanDay()) {
            return this.updateResults(storedResult);
        }
        this.loadResults();
    }

    render() {
        const { currency, lastUpdated } = this.state;

        return(
            <div className="card-body">
                <div className="updated-time">Last Updated At {lastUpdated} UTC</div>
                <SelectWithInput options={currencies}
                    currentItem={currency.name}
                    value={currency.value}
                    selectChange={this.onSelectChange}
                    inputChange={this.onValueChange} />
            </div>
        )
    }
}

export default ExchangeRates;