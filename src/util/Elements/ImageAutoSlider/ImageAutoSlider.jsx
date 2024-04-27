import {useState, useEffect, useRef, useCallback} from 'react';

import { GoDot } from "react-icons/go";
import { GoDotFill } from "react-icons/go";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { MdOutlineArrowBackIos } from "react-icons/md";

import styles from './ImageAutoSlider.module.css';

const slideImageStyles = {
    width:'100%',
    height:'100%',
    objectFit:'cover'
}

const ImageAutoSlider = (props) => {

    const slideShowHeight = props.showDots ? "90%" : "100%";

    const timerRef = useRef(null);

    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slider = props.slider;
    
    const lastSlide = slider.length - 1;

    const goToNextSlide = useCallback(() => {
        const nextSlide = currentSlide === lastSlide ? 0 : currentSlide+1;
        setCurrentSlide(nextSlide);
    }, [currentSlide, lastSlide]);
    
    const goToPreviousSlide = () => {
        const prevSlide = currentSlide === 0 ? lastSlide : currentSlide-1;
        setCurrentSlide(prevSlide);
    }
    
    const goToSlide = (slideIndex) => {
        setCurrentSlide(slideIndex);
    }

    useEffect(() => {
        if(timerRef.current){
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            goToNextSlide();
        }, 2500);

        return () => {clearTimeout(timerRef.current)};
    },[goToNextSlide]);

    return (
        <div className={styles['image-slider']} style={{borderRadius: `${props.showArrows ? '10px 10px 0 0' : '0 10px 10px 0'}`}} >
            <div 
                className={styles['image-slider__slide-show']} 
                style={{height: slideShowHeight, transform: `translateX(${-currentSlide * 100}%)`}} 
            >
                {
                    slider.map((slide, slideIndex) => {
                        return (
                            <div key={slideIndex} className={styles['image-slider__slides']} >
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/${slider[slideIndex]}`} alt={`Places by ${props.name}`} />
                                <div className={styles['shadow-div']} />
                                {
                                    props.showArrows && slider.length > 1 && (
                                        <>
                                            <div className={styles['backward-arrow']} onClick={goToPreviousSlide} >
                                                <MdOutlineArrowBackIos />
                                            </div>
                                            <div className={styles['forward-arrow']} onClick={goToNextSlide} >
                                                <MdOutlineArrowForwardIos />
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        );
                    })
                }
            </div>
            {
                props.showDots && (
                    <div className={styles['image-slider__dots']}>
                        {slider.map((image, slideIndex) => {
                            return (
                                <span key={slideIndex} >
                                    {currentSlide !== slideIndex && <GoDot onClick={() => {goToSlide(slideIndex)}} />}
                                    {currentSlide === slideIndex && <GoDotFill />}
                                </span>
                            );
                        })}
                    </div>
                )
            }
        </div>
    );

}

export default ImageAutoSlider;