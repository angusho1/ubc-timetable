import React, { Component } from 'react';

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
            this.props.clearText(this.props.name);
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
                <input  type="text"
                        id={this.props.inputId}
                        className={this.determineClasses()}
                        placeholder={this.props.placeholder}
                        name={this.props.name}
                        value={this.props.value}
                        onChange={this.props.handleInputChange}
                        onFocus={this.hidePlaceHolder}
                        onBlur={this.showPlaceholder}
                />
            </div>
        )
    }
}

export default SearchInput;
