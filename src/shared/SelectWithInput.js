import React from 'react';
import Select from './Select';

class SelectWithInput extends React.Component {
    
    onFocus(event) {
        event.target.select();
    }

    render() {
        const { placeholder, options, currentItem, value, selectChange, inputChange } = this.props;

        return (
            <div className="input-container">
                <Select options={options} currentItem={currentItem} selectChange={selectChange} />
                <input type="text" placeholder={placeholder ?? ''} value={value} onChange={inputChange} onFocus={this.onFocus} />
            </div>
        )
    }
}

export default SelectWithInput;