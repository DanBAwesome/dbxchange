import React from 'react';
import './Layout.css';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { InnerFooter } from '../shared/InnerFooter';

class Header extends React.Component {
    render() {
        return (
            <Navbar bg="light" expand="lg" className="absolute" collapseOnSelect>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        DBXchange
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="navbar" />
                <Navbar.Collapse id="navbar">
                    <Nav className="ml-auto">
                        <LinkContainer exact to="/">
                            <Nav.Link>Currency Pairs</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/exchange-rates">
                            <Nav.Link>Exchange Rates</Nav.Link>
                        </LinkContainer>

                        <InnerFooter mobile={true} />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Header;