import React, { Component } from 'react';
import { Field } from 'formik';

export class SearchInput extends Component {
    determineClasses() {
        let classList = '';
        if (this.props.searched) {
            if (this.props.valid) {
                classList = `${classList} searched-input`;
            } else {
                classList = `${classList} error-border`;
            }
        }
        return classList;
    }

    hidePlaceHolder = (e) => {
        const clickedInputBox = e.target;
        clickedInputBox.placeholder = '';
        if (this.props.searched) {
            this.props.clearText();
        }
    }

    showPlaceholder = (e) => {
        e.target.placeholder = this.props.placeholder;
    }

    render() {
        return (
            <div className="label-container">
                <label  htmlFor={this.props.inputId} className="form-label">
                    {this.props.label}
                </label>
                <Field  
                        type="text"
                        id={this.props.inputId}
                        className={this.determineClasses()}
                        placeholder={this.props.placeholder}
                        name={this.props.name}
                        onFocus={this.hidePlaceHolder}
                        onBlur={this.showPlaceholder}
                />
            </div>
        )
    }
}

export default SearchInput;
