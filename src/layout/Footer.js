import React from 'react';
import './Layout.css';
import twitter from '../assets/img/social/twitter.svg';
import linkedin from '../assets/img/social/linkedin.svg';
import github from '../assets/img/social/github.svg';
import instagram from '../assets/img/social/instagram.svg';

const ImgLink = (props) => {
    return (
        <a className="social-icon" href={props.link} target="_blank">
            <img src={props.img} width="25" />
        </a>
    )
}

class Footer extends React.Component {
    render() {
        return (
            <footer>
                <span className="align-middle mr-auto">
                    © 2020 Daniel
                </span>
                <span className="float-right">
                    <ImgLink link="https://github.com/DanBAwesome" img={github} />
                    <ImgLink link="https://twitter.com/DanBAwesome" img={twitter} />
                    <ImgLink link="https://www.linkedin.com/in/daniel-boshoff-1897231ab/" img={linkedin} />
                    <ImgLink link="https://www.instagram.com/danbawesome/" img={instagram} />
                </span>
            </footer>
        )
    }
}

export default Footer;