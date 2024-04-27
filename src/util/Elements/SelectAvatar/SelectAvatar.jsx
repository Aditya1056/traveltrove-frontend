import styles from './SelectAvatar.module.css';

const SelectAvatar = (props) => {

    const selectedImage = props.selectedImage;

    const selectedClasses = styles['avatar-div'] + ' ' + styles['selected'];
    const classes = styles['avatar-div'];

    return (
        <div className={styles['avatar-selector']}>
            <p>Select an avatar</p>
            <div className={styles['select-avatar']}>
                {
                    props.images.map((image) => {
                        return (
                            <div 
                                key={image} 
                                className={selectedImage === image ? selectedClasses : classes}  
                                onClick={() => {props.onClick(image)}} 
                            >
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/avatars/${image}`} alt={image}  />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default SelectAvatar;