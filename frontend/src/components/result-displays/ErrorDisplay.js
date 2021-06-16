import React from 'react';

export default function ErrorDisplay(props) {

    return (
        <div id="display-box" className="card p-4 bg-light visible">
            <span className="card-title fs-5 fw-bold">
                <i className="bi bi-exclamation-diamond text-danger fs-3 me-2 mt-0 pt-0" style={{ lineHeight: '0' }}></i>
                Search Not Found
            </span>
            <span>
                {props.error}
            </span>
        </div>
    );
}
