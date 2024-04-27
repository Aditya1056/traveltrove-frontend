import { MdError } from "react-icons/md";

import styles from './Input.module.css';

const Input = (props) => {

    let classes = styles['form-element'];

    if(props.invalidInput){
        classes = classes + ` ${styles['error-input']}`;
    }

    return (
        <div className={classes} >
            <label htmlFor={props.id}>
                {props.label}
                {
                    props.image1 && 
                    <sup>*</sup>
                }
            </label>
            <br/>
            {
                props.type !== "text-area" && (
                    <input 
                        type={props.type} 
                        id={props.id} 
                        onChange={props.onChange} 
                        onBlur={props.onBlur} 
                        value={props.value} 
                        placeholder={props.placeholder ? props.placeholder : ''} 
                    />
                )
            }
            {
                props.type === "text-area" && (
                    <textarea  
                        id={props.id} 
                        onChange={props.onChange} 
                        onBlur={props.onBlur} 
                        value={props.value} 
                        placeholder={props.placeholder ? props.placeholder : ''} 
                    />
                )
            }
            {
                props.invalidInput && (
                    <div className={styles.error} >
                        <MdError />
                        <p>{props.errorContent}</p>
                    </div>
                )
            }
        </div>
    );
}

export default Input;