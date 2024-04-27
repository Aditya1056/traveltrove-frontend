import {Link} from 'react-router-dom';

import styles from './Button.module.css';

const Button = (props) => {

    const classes = `${styles.button} ${props.className}`;
    const linkClasses = `${styles.link} ${props.className}`;
    const anchorClasses = `${styles.anchor} ${props.className}`;

    if(props.href){
        return (
            <a href={props.to} className={anchorClasses} >{props.children}</a>
        );
    }

    if(props.to){
        return (
            <Link to={props.to} className={linkClasses} >{props.children}</Link>
        );
    }

    return (
        <button 
            type={props.type} 
            className={classes} 
            onClick={props.onClick} 
            disabled={props.disabled} 
        >
            {props.children}
        </button>
    );

}

export default Button;