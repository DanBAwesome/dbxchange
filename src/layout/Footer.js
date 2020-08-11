import React from 'react';
import { InnerFooter } from '../shared/InnerFooter';
import './Layout.css';

class Footer extends React.Component {
    render() {
        return (
            <footer>
                <InnerFooter />       
            </footer>
        )
    }
}

export default Footer;