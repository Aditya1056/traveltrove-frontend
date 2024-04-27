import { useState, useContext } from 'react';

import { useMutation } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';

import { SiGooglemaps } from "react-icons/si";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";

import styles from './PlaceItem.module.css';

import Card from '../../util/UI/Card/Card';
import Button from '../../util/UI/Button/Button';
import ImageAutoSlider from '../../util/Elements/ImageAutoSlider/ImageAutoSlider';
import MapLocation from '../../util/Elements/MapLocation/MapLocation';
import Confirm from '../../util/Elements/Confirm/Confirm';
import ErrorBlock from '../../util/UI/ErrorBlock/ErrorBlock';

import { queryClient, postRequest } from '../../util/http/http';
import { AuthContext } from '../../store/auth-context';

const PlaceItem = (props) => {

    const [showMap, setShowMap] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const auth = useContext(AuthContext);

    const openMapHandler = () => {
        setShowMap(true);
    }

    const closeMapHandler = () => {
        setShowMap(false);
    }

    const openConfirmHandler = () => {
        setShowConfirm(true);
    }

    const closeConfirmHandler = () => {
        setShowConfirm(false);
    }

    const {mutate, isPending, isError, error} = useMutation({
        mutationFn:postRequest,
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey: ['user-places']});
            queryClient.invalidateQueries({queryKey: ['users']});
            setShowConfirm(false);
        }
    });

    const {mutate: addMutate, isPending: addPending, isError: addIsError, error: addError} = useMutation({
        mutationFn:postRequest,
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey: ['user-places']});
            queryClient.invalidateQueries({queryKey: ['user-profile']});
        }
    });

    const {mutate: removeMutate, isPending: removePending, isError: removeIsError, error: removeError} = useMutation({
        mutationFn:postRequest,
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey: ['user-places']});
            queryClient.invalidateQueries({queryKey: ['user-profile']});
        }
    });

    const confirmDeleteHandler = (event) => {
        event.preventDefault();
        mutate({
            url: import.meta.env.VITE_BACKEND_URL + `/api/places/${props.id}`,
            method:"DELETE",
            data:null,
            headers:{
                'Authorization':'Bearer ' + auth.token
            }
        });
    }
    
    const wishlistSubmitHandler = (event) => {
        event.preventDefault();
        addMutate({
            url: import.meta.env.VITE_BACKEND_URL + `/api/places/${props.id}/wishlist`,
            method:"POST",
            data:null,
            headers:{
                'Authorization':'Bearer ' + auth.token
            }
        });
    }

    const removeWishlistSubmitHandler = (event) => {
        event.preventDefault();
        removeMutate({
            url: import.meta.env.VITE_BACKEND_URL + `/api/places/remove/${props.id}/wishlist`,
            method:"POST",
            data:null,
            headers:{
                'Authorization':'Bearer ' + auth.token
            }
        });
    }

    return (
        <>
            <AnimatePresence>
                { 
                    showMap && 
                        <MapLocation 
                            onClose={closeMapHandler} 
                            center={props.location} 
                            zoom={13} 
                            address={props.address} 
                            title={props.title} 
                        /> 
                }
                { 
                    showConfirm && 
                        <Confirm 
                            title={props.title}  
                            message="Do you really want to delete this place?" 
                            onSubmit={confirmDeleteHandler}  
                            onCancel={closeConfirmHandler} 
                            isPending={isPending} 
                            isError={isError} 
                            error={error} 
                        />
                }
            </AnimatePresence>
            <li className={styles['place-item']} >
                <Card>
                    <div className={styles['place-item__image-slider']}>
                        <ImageAutoSlider slider={props.images} name={props.creator.name} showDots={true} showArrows={true} />
                    </div>
                    <div className={styles['place-item__place-details']}>
                        <h2>{props.title}</h2>
                        <i>{props.address}</i>
                        <p>{props.description}</p>
                    </div>
                    <div className={styles['place-item__place-actions']}>
                        <Button 
                            type="button"
                            onClick={openMapHandler} 
                            className={styles['map-btn']} 
                        >
                            <div>View on map</div>
                            <SiGooglemaps className={styles['map-icon']} />
                        </Button>
                        {
                            auth.userId !== props.creator._id && 
                            <>
                                {
                                    !props.wishlist && 
                                    <>
                                        {
                                            !props.wishlisted && 
                                            <form onSubmit={wishlistSubmitHandler} >
                                                <Button 
                                                    type="submit" 
                                                    className={styles['wishlist-btn']} 
                                                    disabled={addPending} 
                                                >
                                                    <div>Add to wishlist</div>
                                                    <IoMdHeartEmpty className={styles['heart-icon']} />
                                                </Button>
                                            </form>
                                        }
                                        {
                                            props.wishlisted && 
                                            <form onSubmit={removeWishlistSubmitHandler} >
                                                <Button 
                                                    type="submit" 
                                                    className={styles['wishlist-btn']} 
                                                    disabled={removePending} 
                                                >
                                                    <div>wishlisted</div>
                                                    <IoMdHeart className={styles['heart-icon']} />
                                                </Button>
                                            </form>
                                        }
                                    </>
                                }
                                {
                                    props.wishlist && 
                                    <form onSubmit={removeWishlistSubmitHandler} >
                                        <Button 
                                            type="submit" 
                                            className={styles['wishlist-btn']} 
                                            disabled={removePending} 
                                        >
                                            <div>Remove</div>
                                            <RxCrossCircled className={styles['remove-icon']} />
                                        </Button>
                                    </form>
                                }
                            </>
                        }
                        {
                            auth.userId === props.creator._id && 
                            <>
                                <Button 
                                    to={`/places/${props.id}`} 
                                    className={styles['edit-btn']} 
                                >
                                    <div>Edit</div>
                                    <FaEdit className={styles['edit-icon']} />
                                </Button>
                                <Button 
                                    type="button" 
                                    onClick={openConfirmHandler} 
                                    className={styles['delete-btn']} 
                                >
                                    <div>Delete</div>
                                    <MdDeleteForever className={styles['delete-icon']} />
                                </Button>
                            </>
                        }
                    </div>
                        {
                            addIsError && 
                            <ErrorBlock  errorContent={addError.message} />
                        }
                        {
                            removeIsError && 
                            <ErrorBlock  errorContent={removeError.message} />
                        }
                </Card>
            </li>
        </>
    );
}

export default PlaceItem;