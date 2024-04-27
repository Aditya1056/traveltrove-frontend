import styles from './Avatar.module.css';

const Avatar = (props) => {

    return (
        <div className={styles['profile-pic']}>
            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/avatars/${props.image}`} alt={props.title} style={{width: props.width, height:props.height}} />
        </div>
    );
}

export default Avatar;