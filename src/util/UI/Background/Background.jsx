import ReactDOM from 'react-dom';

import styles from './Background.module.css';
import mountainImage from '../../../assets/Images/mountains.jpg';

const Background = (props) => {

    const backgroundContent = (
        <div className={styles.background}>
            <img src={mountainImage} alt="Mountain Scenery" />
        </div>
    );

    return ReactDOM.createPortal(backgroundContent, document.getElementById('background-hook'));
}

export default Background;