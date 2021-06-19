import React from 'react';
import './ResultDisplays.scss';

export default function ResultDisplay(props) {
    return (
        <div id="display-box" className="card p-4 bg-light">
            <div className="card-title h5 fw-bold">{props.title}</div>
            <p>{props.subHeading}</p>
            {props.children}
        </div>
    );
}
