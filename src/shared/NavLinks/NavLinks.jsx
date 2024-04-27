import { useContext } from 'react';

import { NavLink, useLocation } from "react-router-dom";

import styles from './NavLinks.module.css';

import NavLinkItem from './NavLinkItem';
import Button from '../../util/UI/Button/Button';
import Avatar from '../../util/UI/Avatar/Avatar';

import { AuthContext } from '../../store/auth-context';

const NavLinks = (props) => {

    const auth = useContext(AuthContext);

    const profileClasses = `${styles['user-profile']} ${props.sideDrawer ? styles['in-drawer'] : undefined}`

    const classes = `${styles['nav-links']} ${props.sideDrawer ? styles['in-drawer'] : undefined}`;

    return (
        <ul className={classes}>
            <NavLinkItem to="/" name="Home" sideDrawer={props.sideDrawer} />
            {
                auth.isLoggedIn && 
                <>
                    <NavLinkItem to={`/${auth.userId}/places`} name="My places" sideDrawer={props.sideDrawer} />
                    <NavLinkItem to="/places/new" name="New place" sideDrawer={props.sideDrawer} />
                    <li className={profileClasses}>
                        <NavLink 
                            to={`/profile/${auth.userId}`} 
                            className={({isActive}) => {
                                return isActive ? styles.active : undefined;
                            }}
                            end
                        >
                            <Avatar 
                                image={auth.userImage} 
                                title={auth.userId}  
                                width={props.sideDrawer ? "50px" : "37px"} 
                                height={props.sideDrawer ? "50px" : "37px"} 
                            />
                        </NavLink>
                    </li>
                </>
            }
            {
                !auth.isLoggedIn && 
                <NavLinkItem to="/auth" name="Login" sideDrawer={props.sideDrawer} />
            }
        </ul>
    );
}

export default NavLinks;