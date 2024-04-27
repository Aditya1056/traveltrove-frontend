import styles from './LoadingSpinner.module.css';

const LoadingSpinner = (props) => {

    const size = props.size;
    let margin = undefined;

    if(props.margin){
        margin = props.margin;
    }

    return (
        <div className={styles.outer} >
            <div className={styles['loading-spinner']} style={{width: size, height: size, marginTop:margin, marginBottom: margin}} />
        </div>
    );
}

export default LoadingSpinner;