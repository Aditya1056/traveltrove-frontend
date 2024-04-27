import ReactDOM from 'react-dom';

import styles from './Backdrop.module.css';

const Backdrop = (props) => {

    const backDropContent = (
        <div className={styles.backdrop} onClick={props.onClick} />
    );

    return ReactDOM.createPortal(backDropContent, document.getElementById('backdrop-hook'));
}

export default Backdrop;