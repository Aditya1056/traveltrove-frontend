import ReactDOM from 'react-dom';

import { motion } from 'framer-motion';

import { IoMdClose } from "react-icons/io";

import styles from './SideDrawer.module.css';

import NavLinks from '../NavLinks/NavLinks';

const SideDrawer = (props) => {

    const drawerContent = (
        <motion.div 
            initial={{x:'-100%'}} 
            animate={{x:0,}} 
            exit={{x:'-100%'}} 
            transition={{duration:0.2, type:"tween"}} 
            className={styles['side-drawer']} 
            onClick={props.closeDrawer} 
        >
            <div className={styles['side-drawer__close-icon']}>
                <IoMdClose className={styles['close-icon']} onClick={props.closeDrawer} />
            </div>
            <div className={styles['side-drawer__nav-links']}>
                <NavLinks sideDrawer={true} />
            </div>
        </motion.div>
    );
    
    return ReactDOM.createPortal(drawerContent, document.getElementById('drawer-hook'));
    
}

export default SideDrawer;