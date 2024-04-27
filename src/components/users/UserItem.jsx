import { useContext } from 'react';

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { MdOutlineShareLocation } from "react-icons/md";

import styles from './UserItem.module.css';

import Card from '../../util/UI/Card/Card';
import Avatar from '../../util/UI/Avatar/Avatar';
import ImageAutoSlider from '../../util/Elements/ImageAutoSlider/ImageAutoSlider';

import { AuthContext } from '../../store/auth-context';

const UserItem = (props) => {

    const auth = useContext(AuthContext);

    return (
        <motion.li 
            className={styles['user-item']} 
            style={{
                border: props.id === auth.userId ? "3px solid #427eff" : "none"
            }} 
            variants={{
                hidden:{opacity:0},
                visible:{opacity:1}
            }}
            whileHover={{
                scale:1.03, 
                boxShadow:"0 0 5px rgb(116, 120, 148)", 
                transition:{duration: 0.2}
            }} 
        >
            <Card>
                <Link to={`/${props.id}/places`}>
                    <div className={styles['user-content']} >
                        <div className={styles['user-image']} >
                            <Avatar image={props.image} title={props.name} width="80px" height="80px" />
                        </div>
                        <div className={styles['user-details']}>
                            <h2 
                                style={{
                                    color: props.id === auth.userId ? '#b6ccfa' : '#cbd2e5'
                                }} 
                            >
                                {props.name}
                            </h2>
                            <div> 
                                <MdOutlineShareLocation className={styles['location-icon']} /> 
                                <p>{`${props.placeCount} ${props.placeCount === 1 ? 'place' : 'places'}`}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles['user-slider']}>
                        <ImageAutoSlider 
                            slider={props.slider} 
                            name={props.name} 
                            showDots={false} 
                            showArrows={false} 
                        />
                    </div>
                </Link>
            </Card>
        </motion.li>
    );
}

export default UserItem;