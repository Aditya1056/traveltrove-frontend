import { motion } from 'framer-motion';

import styles from './PlacesList.module.css';

import PlaceItem from './PlaceItem';
import Card from '../../util/UI/Card/Card';

const PlacesList = (props) => {

    const places = props.items;

    if(places.length === 0){
        return (
            <>
            {
                props.wishlist && 
                <div className={styles['no-places']}>
                    <Card>
                        <h3>No places wishlisted yet!</h3>
                    </Card>
                </div>
            }
            {
                !props.wishlist && 
                <div className={styles['no-places']}>
                    <Card>
                        <h3>No places shared yet!</h3>
                    </Card>
                </div>
            }
            </>
        );
    }

    return (
        <ul 
            className={styles['places-list']} 
        >
            {
                places.map((place) => {
                    return (
                        <PlaceItem 
                            key={place._id} 
                            id={place._id} 
                            images={place.images} 
                            title={place.title} 
                            description={place.description} 
                            address={place.address} 
                            creator={place.creator} 
                            location={place.location} 
                            wishlisted={place.wishlisted} 
                            wishlistedBy={place.wishlistedBy} 
                            wishlist={props.wishlist} 
                        />
                    );
                })
            }
        </ul>
    );
}

export default PlacesList;