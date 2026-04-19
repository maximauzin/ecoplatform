import './Input.css';

export default function Input({label, showLabel = true, value = "", onChange, name}) {
    return (
        <>
            {showLabel && (
                <label>{label}</label>
            )}
            <input 
                className='input-add'
                type="text" 
                value={value}
                onChange={onChange}
                name={name}
            />
        </>
    )
}