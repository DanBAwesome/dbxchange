const millisecondsInDay = 86400000;

export const currencies = ["AUD", "BGN", "BRL", "CAD", "CHF",
    "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HRK", "HUF",
    "IDR", "ILS", "INR", "ISK", "JPY", "KRW", "MXN", "MYR",
    "NOK", "NZD", "PHP", "PLN", "RON", "RUB", "SEK", "SGD",
    "THB", "TRY", "USD", "ZAR"];

export function success(response) {
    if (response.ok) {
        return response;
    }

    throw new Error('Request Was Either 404 or 500');
}

export const parseJSON = (response) => response.json();

const prependZeros = (number, maxLength) => {
    number = number.toString();
    while (number.length < maxLength) {
        number = "0" + number;
    }

    return number;
}

const yyyymmddFormat = (date) => {
    return date.getUTCFullYear() + "-" + (prependZeros(date.getUTCMonth() + 1, 2)) + "-" + prependZeros(date.getUTCDate(), 2);
}

export const toFixed = (number, length) => Number.parseFloat(number).toFixed(length);

export function hasBeenMoreThanDay(date) {
    const localDate = new Date(date).setHours(16);
    if ((new Date().getTime() - localDate) >= millisecondsInDay) {
        return true;
    }

}