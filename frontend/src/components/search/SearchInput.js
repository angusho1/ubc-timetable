import React from 'react';
import { useField } from 'formik';

function SearchInput({ label, ...props }) {
    const [field, meta, helpers] = useField(props);

    const determineClasses = () => {
        if (meta.error) {
            return 'error-border';
        } else if (meta.touched && field.value) {
            return 'searched-input';
        }
        return '';
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
        <div className="col-lg-4 col-sm-12 col-4">
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
