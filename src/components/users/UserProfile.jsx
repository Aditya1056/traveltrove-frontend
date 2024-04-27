import { useContext, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

import { VscTriangleUp } from "react-icons/vsc";
import { FiEdit2 } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

import styles from './UserProfile.module.css';

import PlacesList from "../places/PlacesList";
import Avatar from "../../util/UI/Avatar/Avatar";
import Button from "../../util/UI/Button/Button";
import SelectAvatar from "../../util/Elements/SelectAvatar/SelectAvatar";
import ErrorBlock from "../../util/UI/ErrorBlock/ErrorBlock";

import { AuthContext } from "../../store/auth-context";
import { postRequest } from "../../util/http/http";
import { queryClient } from "../../util/http/http";

const UserProfile = (props) => {

    const user = props.userData;

    const auth = useContext(AuthContext);

    const [showWishlist, setShowWishlist] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAvatars, setShowAvatars] = useState(false);

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn:postRequest,
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:['user-profile', {userId: auth.userId}]});
            auth.changeUserImage(selectedImage);
            closeAvatarsHandler();
        }
    });

    const selectImageHandler = (image) => {
        setSelectedImage(image);
    }

    const openWishlistHandler = () => {
        setShowWishlist(true);
    }
    
    const closeWishlistHandler = () => {
        setShowWishlist(false);
    }

    const openAvatarsHandler = () => {
        setShowAvatars(true);
    }

    const closeAvatarsHandler = () => {
        setShowAvatars(false);
        setSelectedImage(null);
    }

    const avatarSubmitHandler = (event) => {
        event.preventDefault();
        const data={
            image: selectedImage
        }
        mutate({
            url: import.meta.env.VITE_BACKEND_URL + '/api/users/update/profile',
            method:'PATCH',
            data:JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth.token 
            }
        });
    }

    return (
        <>
            <div 
                style={{
                    width:"100%", 
                    marginTop:"2rem",
                    display:"flex", 
                    justifyContent:"center",
                    alignItems:"center",
                }} 
                >
                <div 
                    style={{
                        width:"13rem",
                        paddingTop:"1rem",
                        paddingBottom:"1rem",
                        display:"flex", 
                        flexDirection:"column",
                        justifyContent:"center",
                        alignItems:"center",
                        borderRadius:"10px",
                        boxShadow:"1px 1px 3px grey",
                        color:"#99bce0",
                    }} 
                >
                    <Avatar 
                        image={user.image} 
                        title={user.name} 
                        width="90px" 
                        height="90px" 
                    />
                    <h2 
                        style={{
                            width:"90%", 
                            textAlign:"center",
                            marginTop:"1.5rem",
                            marginBottom:"1.5rem",
                            paddingLeft:"5px",
                            paddingRight:"5px",
                            overflow:"auto",
                            whiteSpace:"nowrap"
                        }}
                    >
                        {user.name}
                    </h2>
                    <p  
                        style={{
                            width:"90%", 
                            textAlign:"center",
                            paddingLeft:"5px",
                            paddingRight:"5px",
                            overflow:"auto",
                            whiteSpace:"nowrap"
                        }}
                    >
                        {user.places} places shared yet!
                    </p>
                </div>
            </div>
            <div className={styles['avatar-actions']}>
                {
                    !showAvatars && 
                    <Button
                        type="button" 
                        disabled={false} 
                        className={styles['change-avatar-btn']}
                        onClick={openAvatarsHandler}  
                    >
                        <div>Change Avatar</div>
                        <FiEdit2 className={styles['pencil-icon']} />
                    </Button>
                }
                {
                    showAvatars && 
                    <Button
                        type="button" 
                        disabled={false} 
                        className={styles['close-avatar-btn']}
                        onClick={closeAvatarsHandler}  
                    >
                        <div>Cancel</div>
                        <RxCross2 className={styles['cross-icon']} />
                    </Button>
                }
            </div>
            {
                showAvatars && 
                <div className={styles['change-avatar']}>
                    <motion.form 
                        initial={{opacity:0, height:0}} 
                        animate={{opacity:1, height:'auto'}} 
                        transition={{duration:0.3, type:"tween"}}
                        onSubmit={avatarSubmitHandler} 
                    >
                        <SelectAvatar 
                            images={props.avatars} 
                            onClick={selectImageHandler} 
                            selectedImage={selectedImage} 
                        />
                        <Button 
                            type="submit" 
                            disabled={!!!selectedImage || isPending} 
                            className={styles['avatar-submit-btn']}
                        >
                            Submit
                        </Button>
                        {
                            isError && 
                            <ErrorBlock errorContent={error.message} />
                        }
                    </motion.form>
                </div>
            }
            <div className={styles['show-wishlist']} >
                <Button 
                    type="button" 
                    disabled={false} 
                    onClick={showWishlist ? closeWishlistHandler : openWishlistHandler}
                    className={styles['show-wishlist-btn']} 
                    >
                    <div>Wishlist ({user.wishList.length})</div>
                    <motion.div 
                        className={styles['action-icon']} 
                        animate={{rotate: showWishlist ? 180 : 0}} 
                        transition={{duration: 0.4, type: "spring"}}
                    >
                        <VscTriangleUp className={styles['up-icon']} />
                    </motion.div>
                </Button>
            </div>
            <AnimatePresence>
                {
                    showWishlist && 
                    <PlacesList wishlist items={user.wishList}  />
                }
            </AnimatePresence>
            <div className={styles['actions']} >
                <Button 
                    type="button" 
                    onClick={auth.logout} 
                    disabled={false} 
                    className={styles['logout-btn']} 
                >
                    Logout
                </Button>
            </div>
        </>
    );
}

export default UserProfile;