import { useState, useEffect, useContext, useCallback } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import styles from './EditPlaceForm.module.css';

import Input from '../../util/UI/Input/Input';
import Button from '../../util/UI/Button/Button';
import LoadingSpinner from '../../util/UI/Loading/LoadingSpinner';
import ErrorBlock from '../../util/UI/ErrorBlock/ErrorBlock';
import ImageInput from '../../util/UI/ImageInput/ImageInput';

import useInput from '../../util/hooks/useInput';
import useImageInput from '../../util/hooks/useImageInput';

import { queryClient, fetchRequest, postRequest } from '../../util/http/http';
import { minLengthValidator, notNullValidator } from '../../util/helpers/input-validators';
import { AuthContext } from '../../store/auth-context';


const EditPlaceForm = (props) => {

    const placeId = useParams().placeId;
    const navigate = useNavigate();

    const auth = useContext(AuthContext);

    const [initialData, setInitialData] = useState({
        title: '',
        description: '',
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        address: '',
        creator:{},
        location: {
            lat: 0,
            lng: 0
        }
    });

    const convertUrlsToFiles = useCallback(async (data) => {
        const convertedData = { ...data };
        for (let i = 1; i <= 4; i++) {
            if (convertedData[`image${i}`]) {
                try {
                    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/' + convertedData[`image${i}`]);
                    const blob = await response.blob();
                    const mimeType = response.headers.get('content-type');
                    const fileType = mimeType.split('/')[1];
                    convertedData[`image${i}`] = new File([blob], `image${i}.${fileType}`, { type: mimeType });
                } catch (error) {
                    console.error(`Error converting image${i} URL to File object:`, error);
                }
            }
        }
        return convertedData;
    }, []);

    const {data, isPending, isError, error} = useQuery({
        queryKey:['user-place', {placeId: placeId}],
        queryFn: ({signal}) => {
            return fetchRequest({
                signal,
                url: import.meta.env.VITE_BACKEND_URL + `/api/places/${placeId}`,
                headers:{
                    'Authorization': 'Bearer ' + auth.token
                }
            });
        },
    });

    const {mutate, isError:postIsError, error:postError, isPending:postIsPending} = useMutation({
        mutationFn:postRequest,
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:['user-place']});
            queryClient.invalidateQueries({queryKey:['user-places']});
            navigate(`/${auth.userId}/places`);
        }
    });

    useEffect(() => {
        if (data) {
            convertUrlsToFiles(data)
            .then(convertedData => setInitialData(convertedData))
            .catch(error => console.error('Error converting URLs to files:', error));
        }
    }, [data]);

    const {
        value: titleValue,
        isValid: titleIsValid,
        hasError: titleIsInvalid,
        inputChangeHandler: titleChangeHandler,
        inputBlurHandler: titleBlurHandler,
        resetInput: titleReset

    } = useInput(minLengthValidator, 3, initialData.title);

    const {
        value: descriptionValue,
        isValid: descriptionIsValid,
        hasError: descriptionIsInvalid,
        inputChangeHandler: descriptionChangeHandler,
        inputBlurHandler: descriptionBlurHandler,
        resetInput: descriptionReset

    } = useInput(minLengthValidator, 1, initialData.description);

    const {
        value: image1Value,
        previewUrl: image1Preview,
        isValid: image1IsValid,
        hasError: image1IsInvalid,
        inputChangeHandler: image1ChangeHandler,
        resetInput: image1Reset

    } = useImageInput(initialData.image1);

    const {
        value: image2Value,
        previewUrl: image2Preview,
        isValid: image2IsValid,
        hasError: image2IsInvalid,
        inputChangeHandler: image2ChangeHandler,
        resetInput: image2Reset

    } = useImageInput(initialData.image2);

    const {
        value: image3Value,
        previewUrl: image3Preview,
        isValid: image3IsValid,
        hasError: image3IsInvalid,
        inputChangeHandler: image3ChangeHandler,
        resetInput: image3Reset

    } = useImageInput(initialData.image3);

    const {
        value: image4Value,
        previewUrl: image4Preview,
        isValid: image4IsValid,
        hasError: image4IsInvalid,
        inputChangeHandler: image4ChangeHandler,
        resetInput: image4Reset

    } = useImageInput(initialData.image4);

    const {
        value: addressValue,
        isValid: addressIsValid,
        hasError: addressIsInvalid,
        inputChangeHandler: addressChangeHandler,
        inputBlurHandler: addressBlurHandler,
        resetInput: addressReset

    } = useInput(minLengthValidator, 5, initialData.address);

    const {
        value: latitudeValue,
        isValid: latitudeIsValid,
        hasError: latitudeIsInvalid,
        inputChangeHandler: latitudeChangeHandler,
        inputBlurHandler: latitudeBlurHandler,
        resetInput: latitudeReset

    } = useInput(notNullValidator, null, initialData.location.lat);

    const {
        value: longitudeValue,
        isValid: longitudeIsValid,
        hasError: longitudeIsInvalid,
        inputChangeHandler: longitudeChangeHandler,
        inputBlurHandler: longitudeBlurHandler,
        resetInput: longitudeReset

    } = useInput(notNullValidator, null, initialData.location.lng);

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
            url: import.meta.env.VITE_BACKEND_URL + `/api/places/${placeId}`,
            method:'PATCH',
            data:formData,
            headers:{
                'Authorization':'Bearer ' + auth.token
            },
        });
    }
    
    const formIsValid = (titleIsValid && 
        descriptionIsValid && 
        image1IsValid && 
        addressIsValid && 
        latitudeIsValid && 
        longitudeIsValid);

    return (
        <div className={styles['place-form']} >
            {
                isPending && 
                <LoadingSpinner size="50px" margin="5rem" />
            }
            {
                isError && 
                <ErrorBlock errorContent={error.message} />
            }
            {
                initialData.title.length > 0 && 
                <>
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
                                !postIsPending && 
                                <>
                                    <Button 
                                    type="button" 
                                    className={styles['cancel-btn']} 
                                    onClick={() => {navigate(`/${auth.userId}/places`)}} 
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                    type="submit" 
                                    className={styles['submit-btn']} 
                                    disabled={!formIsValid} 
                                    >
                                        Submit
                                    </Button>
                                </>
                            }
                            {
                                postIsPending && 
                                <div className={styles.pending}>
                                    <h3>Submitting</h3>
                                </div>
                            }
                        </div>
                    </form>
                    {
                        postIsError && 
                        <ErrorBlock 
                            width="90%" 
                            height="120px" 
                            errorHeader="Updation Failed!" 
                            errorContent={postError.message} 
                        />
                    }
                </>
            }
        </div>
    );
}

export default EditPlaceForm;