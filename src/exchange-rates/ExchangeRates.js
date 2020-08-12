import React from 'react';
import SelectWithInput from '../shared/SelectWithInput';
import { currencies, success, parseJSON, hasBeenMoreThanDay, toFixed } from '../shared/utils';
import Select from '../shared/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class CurrencyItem extends React.Component {
    render() {
        const { name, value, removeClick } = this.props;
        return (
            <div className="currency-item">
                <span>{name}</span>
                <span>{value.toFixed(2)}</span>
                <span>
                    <button onClick={() => removeClick(name)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </span>
            </div>
        )
    }
}

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
        this.onValueChange = this.onValueChange.bind(this);
        this.addCurrency = this.addCurrency.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    onValueChange(event) {
        const value = Number(event.target.value);
        const { currency } = this.state;

        if (!value && value !== 0) {
            return;
        }

        currency.value = event.target.value;

        this.setState({ currency });
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

    removeItem(name) {
        const { selectedRates } = this.state;
        const index = selectedRates.indexOf(name);
        if (index !== -1) {
            selectedRates.splice(index, 1);
            this.setState({ selectedRates });

            localStorage.setItem("selectedCurrencies", JSON.stringify(selectedRates));
        }
    }

    updateResults(data) {
        const selectedCurrencies = JSON.parse(localStorage.getItem("selectedCurrencies")) ?? [];
        const { currency } = this.state;
        const { toggleLoading } = this.props;
        currency.name = data.base;
        this.setState({
            lastUpdated: data.date,
            rates: data.rates,
            selectedRates: selectedCurrencies
        });

        toggleLoading(false);
    }

    loadResults() {
        const { currency } = this.state;
        const { toggleLoading } = this.props;

        toggleLoading(true);

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
        const storedResult = JSON.parse(localStorage.getItem("exchageRates"));

        if (storedResult && !hasBeenMoreThanDay(storedResult.date)) {
            this.updateResults(storedResult);
            return;
        }
        this.loadResults();
    }

    addCurrency(event) {
        const { selectedRates } = this.state;
        const { value } = event.target;

        selectedRates.push(value)

        this.setState({
            selectedRates
        });

        localStorage.setItem("selectedCurrencies", JSON.stringify(selectedRates));
    }

    render() {
        const { currency, lastUpdated, selectedRates, rates } = this.state;
        const { loading } = this.props;

        return (
            <React.Fragment>
                <div className="card-header">
                    Exchange Rates
                </div>
                <div className="card-body" hidden={loading}>
                    <div className="updated-time">Last Updated At {lastUpdated} CET</div>
                    <div className="w-100 d-lg-inline-flex justify-content-around mb-3 d-block">
                        <SelectWithInput options={currencies}
                            currentItem={currency.name}
                            value={currency.value}
                            selectChange={this.onSelectChange}
                            inputChange={this.onValueChange} />
                        <div className="input-container">
                            <Select options={currencies.filter(x => selectedRates.indexOf(x) === -1)}
                                selectChange={this.addCurrency}
                                currentItem=""
                                placeholder="Add A Currency" />
                        </div>
                    </div>
                    <div className="rates-table">
                        {selectedRates.length > 0 ? selectedRates.map((rate, index) => {
                            return <CurrencyItem key={index} name={rate} value={rates[rate] * currency.value} removeClick={this.removeItem} />
                        }).filter(x => {
                            return x.props.name !== currency.name;
                        }) : <div>To Compare Rates, Add A Currency Using The Dropdown Above</div>}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ExchangeRates;