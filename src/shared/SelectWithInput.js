import React from 'react';

function AvailableOptions(props) {
    return (
        <option value={props.option}>
            {props.option}
        </option>
    )
}

class SelectWithInput extends React.Component {
    
    onFocus(event) {
        event.target.select();
    }

    render() {
        const { placeholder, options, currentItem, value, selectChange, inputChange } = this.props;

        return (
            <div className="select-with-input">
                <select onChange={selectChange} value={currentItem}>
                    {options.map((option, index) =>
                        <AvailableOptions key={index} option={option} />
                    )}
                </select>
                <input type="text" placeholder={placeholder ?? ''} value={value} onChange={inputChange} onFocus={this.onFocus} />
            </div>
        )
    }
}

export default SelectWithInput;