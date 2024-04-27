import { useContext } from 'react';

import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { FaHome } from "react-icons/fa";
import { SiYourtraveldottv } from "react-icons/si";
import { TbLocationShare } from "react-icons/tb";
import { FiLogIn } from "react-icons/fi";

import styles from './NavLinkItem.module.css';

import { AuthContext } from '../../store/auth-context';

const NavLinkItem = (props) => {

    const location = useLocation();

    const auth = useContext(AuthContext);

    let iconContent;

    if(props.to === '/'){
        iconContent = (<FaHome className={styles.icon} />);
    }
    else if(props.to === `/${auth.userId}/places`){
        iconContent = (<SiYourtraveldottv className={styles.icon} />);
    }
    else if(props.to === '/places/new'){
        iconContent = (<TbLocationShare className={styles.icon} />);
    }
    else if(props.to === '/auth'){
        iconContent = (<FiLogIn className={styles.icon} />);
    }

    const classes = `${styles['nav-link']} ${props.sideDrawer ? styles['in-drawer'] : undefined}`;

    return (
        <li className={classes}>
            <NavLink 
                to={props.to} 
                className={({isActive}) => 
                    isActive ? styles.active: undefined
                } 
                end
            >
                <span className={styles['nav-link__text']}>{props.name}</span>
                {iconContent}
            </NavLink>

            <AnimatePresence>
                {
                    
                    (location.pathname === props.to && !props.sideDrawer) && 
                        (<motion.div 
                            key="tab" 
                            layoutId="tab-indicator" 
                            className={styles['nav-link__active-bar']} 
                        />)
                }
            </AnimatePresence>
        </li>
    );
}

export default NavLinkItem;