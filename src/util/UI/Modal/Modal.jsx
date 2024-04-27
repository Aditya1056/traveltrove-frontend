import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';

import styles from './Modal.module.css';

import Backdrop from '../Backdrop/Backdrop';

const ModalContent = (props) => {

    const classes = `${styles['modal-content']} ${props.className}`;

    return (
        <div className={classes}>
            {props.children}
        </div>
    );
}

const Modal = (props) => {

    const content = (
        <>
            <Backdrop onClick={props.closeModal} />
            <motion.div 
                initial={{opacity:0, y:"-20%"}} 
                animate={{opacity:1, y:"0%"}} 
                exit={{opacity:0, y:"-20%"}} 
                transition={{duration:0.3, type:"spring"}} 
                className={styles.modal} 
            >
                <ModalContent {...props} >
                    {props.children}
                </ModalContent>
            </motion.div>
        </>
    );

    return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
}

export default Modal;