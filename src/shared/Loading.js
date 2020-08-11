import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export const Loading = (props) => {
    const { loading } = props;
    return (
        <div id="loadingScreen" hidden={!loading}>
            <div>
                <FontAwesomeIcon icon={faSpinner} spin />&nbsp;Loading
            </div>
        </div>
    )
}