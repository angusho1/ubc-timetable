import React from 'react';
import { useField } from 'formik';

function SearchInput({ label, ...props }) {
    const [field, meta, helpers] = useField(props);

    const determineClasses = () => {
        const _default = '';
        if (meta.error) {
            return `${_default} error-border`;
        } else if (meta.touched && field.value) {
            return `${_default} searched-input`;
        }
        return _default;
    }

    const hidePlaceHolder = (e) => {
        e.target.placeholder = '';
        helpers.setTouched(true);
        if (meta.touched) {
            helpers.setValue('');
        }
    }

    const showPlaceholder = (e) => {
        e.target.placeholder = props.placeholder;
    }
    
    return (
        <div className="col">
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
