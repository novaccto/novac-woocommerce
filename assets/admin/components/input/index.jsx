import { __experimentalInputControl as InputControl, SelectControl } from '@wordpress/components';
import { useState, useEffect } from 'react';

export const CustomSelectControl = ({ labelName, initialValue, options, onChange }) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (newValue) => {
        setValue(newValue);
        onChange?.(newValue);
    };

    return (
        <SelectControl
            label={labelName || 'No Label Added'}
            value={value}
            options={options}
            onChange={handleChange}
        />
    );
};

export const InputWithSideLabel = ({ initialValue, labelName, isConfidential, onChange }) => {
    const [value, setValue] = useState(initialValue);
    const type = isConfidential ? 'password' : 'text';

    const handleChange = (nextValue) => {
        const newValue = nextValue ?? '';
        setValue(newValue);
        onChange?.(newValue);
    };

    return (
        <InputControl
            __unstableInputWidth="3em"
            label={labelName || 'Label'}
            value={value}
            type={type}
            labelPosition="edge"
            onChange={handleChange}
        />
    );
};

const Input = ({ initialValue, labelName, onChange, isConfidential, error }) => {
    const [value, setValue] = useState(initialValue);
    const type = isConfidential ? 'password' : 'text';

    const handleChange = (nextValue) => {
        setValue(nextValue);
        onChange?.(nextValue);
    };

    useEffect(() => {
        // Optional side effects when value changes
    }, [value]);

    return (
        <div style={{ marginBottom: '1rem' }}>
            <InputControl
                label={labelName || 'Label'}
                value={value}
                type={type}
                onChange={handleChange}
            />
            {error && (
                <p style={{ color: 'red', fontSize: '0.875em', marginTop: '0.25rem' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;