import {motion} from 'framer-motion';

import styles from './UsersList.module.css';

import UserItem from "./UserItem";

const UsersList = (props) => {

    const users = props.items;

    if (users.length === 0) {
        return (
            <div className={styles['fallback']}>
                <h3>Be the first one to share your favourite places!</h3>
            </div>
        );
    }

    return (
        <motion.ul 
            className={styles['users-list']} 
            variants={{
                hidden:{opacity: 0},
                visible:{opacity: 1, transition:{staggerChildren: 0.2}} 
            }} 
            initial="hidden" 
            animate="visible" 
            transition={{duration:0.1, type:"spring"}} 
        >
            {users.map((user) => {
                return (
                    <UserItem
                        key={user._id} 
                        id={user._id} 
                        name={user.name} 
                        image={user.image} 
                        placeCount={user.places} 
                        slider={user.slider} 
                    />
                );
            })}
        </motion.ul>
    );
};

export default UsersList;
