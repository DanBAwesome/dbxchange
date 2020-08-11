import React from 'react';

function AvailableOptions(props) {
    return (
        <option value={props.option}>
            {props.option}
        </option>
    )
}

class Select extends React.Component {
    render() {
        const {options, currentItem, selectChange, placeholder} = this.props;

        return (
            <select onChange={selectChange} value={currentItem}>
                {placeholder ? <option value="" disabled>{placeholder}</option> : '' }
                {options.map((option, index) =>
                    <AvailableOptions key={index} option={option} />
                )}
            </select>
        )
    }
}

export default Select;