import { ChangeEventHandler, HTMLInputTypeAttribute } from "react"

type BasicInputProps = {
    labelClassName: string
    labelText: string,
    inputType: HTMLInputTypeAttribute | undefined
    inputName: string,
    inputId: string,
    inputValue: string | number | readonly string[] | undefined,
    inputOnChange: ChangeEventHandler<HTMLInputElement> | undefined
    required: boolean,
    inputPlaceholder?: string,
    inputClassName: string
    maxDateTime?: string;
}

export default function BasicInputWithLabel({ 
    labelClassName, 
    labelText,
    inputType, 
    inputName, 
    inputId, 
    inputValue,
    inputOnChange,  
    required,
    inputPlaceholder, 
    inputClassName,
    maxDateTime,
}: BasicInputProps) {
    return (
        <div className="rounded-xl flex flex-col-reverse">
            <input 
                type={inputType}
                name={inputName}
                id={inputId}
                value={inputValue}
                onChange={inputOnChange}
                required={required}
                placeholder={inputPlaceholder}
                className={inputClassName}
                max={maxDateTime}
            />
            <label
                htmlFor={inputId}
                className={labelClassName}
            >
                {labelText}
            </label>
        </div>
    )
}