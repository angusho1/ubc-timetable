import React, { useState } from 'react';
import { useField } from 'formik';

function SearchInput({ label, ...props }) {
    const [field, meta] = useField(props);
    const [hasFocused, setHasFocused] = useState(false);

    const determineClasses = () => {
        if (meta.error) {
            return 'error-border';
        } else if ((meta.touched || hasFocused) && field.value) {
            return 'searched-input';
        }
        return '';
    }

    const hidePlaceHolder = (e) => {
        const clickedInputBox = e.target;
        clickedInputBox.placeholder = '';
        setHasFocused(true);
        // if (props.searched) {
            // props.clearText();
        // }
    }

    const showPlaceholder = (e) => {
        e.target.placeholder = props.placeholder;
    }

    return (
        <div className="label-container">
            <label  htmlFor={props.inputId} className="form-label">
                {label}
            </label>
            <input  
                    type="text"
                    {... props}
                    {... field}
                    className={determineClasses()}
                    onFocus={hidePlaceHolder}
                    onBlur={showPlaceholder}
            />
        </div>
    )
}

export default SearchInput;
