import { useRef } from "react";

import { FaUpload } from "react-icons/fa6";
import { MdError } from "react-icons/md";

import styles from './ImageInput.module.css';

const ImageInput = (props) => {

    const ImageInputRef = useRef();

    let classes = styles['image-form-element'];

    if(props.invalidInput){
        classes += ` ${styles['error-element']}`;
    }

    const filePickerHandler = () => {
        ImageInputRef.current.click();
    }

    return (
        <>
            <input 
                type="file" 
                ref={ImageInputRef} 
                style={{display:"none"}} 
                accept=".png,.jpg,.jpeg" 
                onChange={props.onChange} 
            />
            <div className={classes} >
                <div className={styles['label']}>
                    {props.label}
                    {props.image1 && <sup>*</sup>}
                </div>
                <div className={styles['image-input-element']} >
                    <div className={styles['upload-btn']} onClick={filePickerHandler} >
                        <FaUpload className={styles['upload-icon']} />
                    </div>
                    <div className={styles['image-preview']}>
                        {props.previewUrl && <img src={props.previewUrl} alt="preview" />}
                        {!props.previewUrl && <p>Please select an image!</p> }
                    </div>  
                </div>
            </div>
            {
                props.invalidInput && (
                    <div className={styles.error} >
                        <p>{props.errorContent}</p>
                    </div>
                )
            }
        </>
    );

}

export default ImageInput;