import styles from './ErrorBlock.module.css';

import { MdError } from "react-icons/md";

const ErrorBlock = (props) => {

    const width = props.width ? props.width : '500px';
    const height = props.height ? props.height : '200px';
    const errorHeader = props.errorHeader ? props.errorHeader : 'An Error Occurred!';
    const error = props.errorContent;

    return (
        <div className={styles.container} >
            <div className={styles['error-block']} style={{width, height}} >
                <div className={styles['error-block__header']} >
                    <MdError className={styles['error-icon']} />
                    <h3>{errorHeader}</h3>
                </div>
                <div className={styles['error-block__content']}>
                    <p>{error}</p>
                </div>
            </div>
        </div>
    );

}

export default ErrorBlock;