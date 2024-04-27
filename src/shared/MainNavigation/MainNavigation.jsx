import { useState } from 'react';

import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { IoMenu } from "react-icons/io5";

import styles from './MainNavigation.module.css';

import NavLinks from '../NavLinks/NavLinks';
import SideDrawer from '../SideDrawer/SideDrawer';
import Backdrop from '../../util/UI/Backdrop/Backdrop';
import mountainImage from '../../assets/Images/mountains.jpg';

const MainNavigation = () => {

    const [sideDrawerState, setSideDrawerState] = useState(false);
    const location = useLocation();

    const openSideDrawerHandler = () => {
        setSideDrawerState(true);
    }
    
    const closeSideDrawerHandler = () => {
        setSideDrawerState(false);
    }

    return (
        <>
            <AnimatePresence>
                {sideDrawerState && <SideDrawer closeDrawer={closeSideDrawerHandler} />}
            </AnimatePresence>
            {sideDrawerState && <Backdrop onClick={closeSideDrawerHandler} />}
            <div className={styles['main-nav']}>
                <div className={styles['main-nav__header']} >
                    <div className={styles['main-nav__content']}>
                        <IoMenu  className={styles['menu-icon']} onClick={openSideDrawerHandler} />
                        <h1>Travel Trove</h1>
                    </div>
                    <div className={styles['main-nav__navigation']}>
                        <NavLinks sideDrawer={false} />
                    </div>
                </div>
                {
                    location.pathname === '/' && (
                        <div className={styles['main-nav__footer']} >
                            <img src={mountainImage} alt="Mountain Scenery" />
                            <div className={styles['shadow-div']} />
                            <div className={styles['main-nav__footer-text']}>
                                <p>Explore the world, one traveler's tale at a time.</p>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default MainNavigation;