import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { TbLocationShare } from "react-icons/tb";

import styles from './PlaceForm.module.css';

import Input from '../../util/UI/Input/Input';
import ImageInput from '../../util/UI/ImageInput/ImageInput';
import Button from '../../util/UI/Button/Button';
import Background from '../../util/UI/Background/Background';
import ErrorBlock from '../../util/UI/ErrorBlock/ErrorBlock';

import useInput from '../../util/hooks/useInput';
import useImageInput from '../../util/hooks/useImageInput';

import { queryClient, postRequest } from '../../util/http/http';
import { AuthContext } from '../../store/auth-context';
import { minLengthValidator, notNullValidator } from '../../util/helpers/input-validators';

const PlaceForm = (props) => {

    const auth = useContext(AuthContext);

    const {
        value: titleValue,
        isValid: titleIsValid,
        hasError: titleIsInvalid,
        inputChangeHandler: titleChangeHandler,
        inputBlurHandler: titleBlurHandler,
        resetInput: titleReset

    } = useInput(minLengthValidator, 3);

    const {
        value: descriptionValue,
        isValid: descriptionIsValid,
        hasError: descriptionIsInvalid,
        inputChangeHandler: descriptionChangeHandler,
        inputBlurHandler: descriptionBlurHandler,
        resetInput: descriptionReset

    } = useInput(minLengthValidator, 1);

    const {
        value: image1Value,
        previewUrl: image1Preview,
        isValid: image1IsValid,
        hasError: image1IsInvalid,
        inputChangeHandler: image1ChangeHandler,
        resetInput: image1Reset

    } = useImageInput();

    const {
        value: image2Value,
        previewUrl: image2Preview,
        isValid: image2IsValid,
        hasError: image2IsInvalid,
        inputChangeHandler: image2ChangeHandler,
        resetInput: image2Reset

    } = useImageInput();

    const {
        value: image3Value,
        previewUrl: image3Preview,
        isValid: image3IsValid,
        hasError: image3IsInvalid,
        inputChangeHandler: image3ChangeHandler,
        resetInput: image3Reset

    } = useImageInput();

    const {
        value: image4Value,
        previewUrl: image4Preview,
        isValid: image4IsValid,
        hasError: image4IsInvalid,
        inputChangeHandler: image4ChangeHandler,
        resetInput: image4Reset

    } = useImageInput();

    const {
        value: addressValue,
        isValid: addressIsValid,
        hasError: addressIsInvalid,
        inputChangeHandler: addressChangeHandler,
        inputBlurHandler: addressBlurHandler,
        resetInput: addressReset

    } = useInput(minLengthValidator, 5);

    const {
        value: latitudeValue,
        isValid: latitudeIsValid,
        hasError: latitudeIsInvalid,
        inputChangeHandler: latitudeChangeHandler,
        inputBlurHandler: latitudeBlurHandler,
        resetInput: latitudeReset

    } = useInput(notNullValidator, null);

    const {
        value: longitudeValue,
        isValid: longitudeIsValid,
        hasError: longitudeIsInvalid,
        inputChangeHandler: longitudeChangeHandler,
        inputBlurHandler: longitudeBlurHandler,
        resetInput: longitudeReset

    } = useInput(notNullValidator, null);

    const navigate = useNavigate();

    const {mutate, isError, isPending, error} = useMutation({
        mutationFn:postRequest,
        onSuccess:() => {
            titleReset();
            descriptionReset();
            image1Reset();
            image2Reset();
            image3Reset();
            image4Reset();
            addressReset();
            latitudeReset();
            longitudeReset();
            queryClient.invalidateQueries({queryKey: ['users']});
            queryClient.invalidateQueries({queryKey: ['user-places']});
            navigate(`/${auth.userId}/places`);
        }
    });

    const formIsValid = (titleIsValid && 
                        descriptionIsValid && 
                        image1IsValid && 
                        addressIsValid && 
                        latitudeIsValid && 
                        longitudeIsValid);

    const onSubmitHandler = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', titleValue.trim());
        formData.append('description', descriptionValue.trim());
        formData.append('images', image1Value);
        if(image2IsValid){
            formData.append('images', image2Value);
        }
        if(image3IsValid){
            formData.append('images', image3Value);
        }
        if(image4IsValid){
            formData.append('images', image4Value);
        }
        formData.append('address', addressValue.trim());
        formData.append(
            'location', 
            JSON.stringify(
                {
                    lat: +latitudeValue, 
                    lng: +longitudeValue
                }
            )
        );
        mutate({
            url: import.meta.env.VITE_BACKEND_URL + '/api/places', 
            method:'POST',
            data:formData,
            headers:{
                'Authorization':'Bearer ' + auth.token
            },
        });
    }

    return (
        <>
            <Background />
            <div className={styles['place-header']} >
                <TbLocationShare className={styles['location-share-icon']} />
                <h2>Share your favourite place here!</h2>
            </div>
            <div className={styles['place-form']} >
                <form onSubmit={onSubmitHandler} >
                    <Input 
                        type="text" 
                        id="title" 
                        label="Title" 
                        invalidInput={titleIsInvalid} 
                        value={titleValue} 
                        onChange={titleChangeHandler} 
                        onBlur={titleBlurHandler} 
                        errorContent="Title must be atleast 3 characters!" 
                    />
                    <Input 
                        type="text-area" 
                        id="description" 
                        label="Description" 
                        invalidInput={descriptionIsInvalid} 
                        value={descriptionValue} 
                        onChange={descriptionChangeHandler} 
                        onBlur={descriptionBlurHandler} 
                        errorContent="Description cannot be empty!" 
                    />
                    <ImageInput 
                        label="Image-1" 
                        image1 
                        onChange={image1ChangeHandler} 
                        previewUrl={image1Preview} 
                        invalidInput={image1IsInvalid}  
                        errorContent={"Image-1 cannot be empty!"} 
                    />
                    <ImageInput 
                        label="Image-2" 
                        onChange={image2ChangeHandler} 
                        previewUrl={image2Preview} 
                    />
                    <ImageInput 
                        label="Image-3" 
                        onChange={image3ChangeHandler} 
                        previewUrl={image3Preview} 
                    />
                    <ImageInput 
                        label="Image-4" 
                        onChange={image4ChangeHandler} 
                        previewUrl={image4Preview} 
                    />
                    <Input 
                        type="text" 
                        id="address" 
                        label="Address" 
                        invalidInput={addressIsInvalid} 
                        value={addressValue} 
                        onChange={addressChangeHandler} 
                        onBlur={addressBlurHandler} 
                        errorContent="Address must be atleast 5 characters!" 
                    />
                    <Input 
                        type="number" 
                        id="latitude" 
                        label="Latitude" 
                        invalidInput={latitudeIsInvalid} 
                        value={latitudeValue} 
                        onChange={latitudeChangeHandler} 
                        onBlur={latitudeBlurHandler} 
                        errorContent="Coordinates cannot be empty!" 
                    />
                    <Input 
                        type="number" 
                        id="longitude" 
                        label="Longitude" 
                        invalidInput={longitudeIsInvalid} 
                        value={longitudeValue} 
                        onChange={longitudeChangeHandler} 
                        onBlur={longitudeBlurHandler} 
                        errorContent="Coordinates cannot be empty!" 
                    />
                    <div className={styles['form-actions']} >
                        {
                            !isPending && 
                            <Button 
                                type="submit" 
                                className={styles['submit-btn']} 
                                disabled={!formIsValid} 
                            >
                                Submit
                            </Button>
                        }
                        {
                            isPending && 
                            <div className={styles.pending}>
                                <h3>Submitting</h3>
                            </div>
                        }
                    </div>
                </form>
                {
                    isError &&
                    <ErrorBlock 
                        width="90%" 
                        height="120px" 
                        errorHeader="Submission Failed!" 
                        errorContent={error.message} 
                    />
                }
            </div>
        </>
    );
}

export default PlaceForm;