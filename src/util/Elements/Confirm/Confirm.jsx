import styles from './Confirm.module.css';

import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import ErrorBlock from '../../UI/ErrorBlock/ErrorBlock';

const Confirm = (props) => {
    return (
        <Modal 
            className={styles['confirm-modal']} 
            closeModal={props.onCancel}  
        >
            <div className={styles['confirm-modal__header']} >
                <h3>{props.title}</h3>
            </div>
            <div className={styles['confirm-modal__content']} >
                <p>{props.message}</p>
            </div>
            <div className={styles['confirm-modal__footer']} >
                <form onSubmit={props.onSubmit} >
                    { !props.isPending && (
                        <>
                            <Button 
                                type="button" 
                                onClick={props.onCancel} 
                                className={styles['cancel-btn']} 
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className={styles['confirm-btn']} 
                            >
                                Confirm
                            </Button>
                        </>
                    )}
                    {props.isPending && <h3>Deleting...</h3>} 
                </form>
                {
                    props.isError && 
                    <ErrorBlock 
                        width="85%" 
                        height="150px" 
                        errorHeader="Deletion Failed!" 
                        errorContent={props.error.message} 
                    />
                } 
            </div>
        </Modal>
    );
}

export default Confirm;