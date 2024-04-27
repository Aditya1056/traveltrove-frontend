import { useState } from 'react';

import {useNavigate} from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import styles from './SignupForm.module.css';

import Input from '../../util/UI/Input/Input';
import Button from '../../util/UI/Button/Button';
import useInput from '../../util/hooks/useInput';
import Background from '../../util/UI/Background/Background';
import ErrorBlock from '../../util/UI/ErrorBlock/ErrorBlock';
import LoadingSpinner from '../../util/UI/Loading/LoadingSpinner';
import SelectAvatar from '../../util/Elements/SelectAvatar/SelectAvatar';

import {emailValidator, minLengthValidator} from '../../util/helpers/input-validators';
import { fetchRequest, postRequest } from '../../util/http/http';


const SignupForm = (props) => {

    const navigate = useNavigate();
    
    const [selectedImage, setSelectedImage] = useState(null);

    const selectImageHandler = (image) => {
        setSelectedImage(image);
    }

    const {data, isPending: fetchIsPending, isError: fetchIsError, error: fetchError} = useQuery({
        queryKey:['avatars'],
        queryFn:({signal}) => {
            return fetchRequest({
                signal:signal, 
                url: import.meta.env.VITE_BACKEND_URL + '/api/users/avatars'
            });
        }
    });

    const {
        value: emailValue,
        isValid: emailIsValid,
        hasError: emailIsInvalid,
        inputChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        resetInput: resetEmail
    } = useInput(emailValidator, 6);
    
    const {
        value: passwordValue,
        isValid: passwordIsValid,
        hasError: passwordIsInvalid,
        inputChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        resetInput: resetPassword
    } = useInput(minLengthValidator, 6);

    const {
        value: nameValue,
        isValid: nameIsValid,
        hasError: nameIsInvalid,
        inputChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        resetInput: resetName
    } = useInput(minLengthValidator, 1);

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn:postRequest,
        onSuccess:() => {
            resetEmail();
            resetPassword();
            resetName();
            setSelectedImage(null);
            navigate('/auth');
        }
    });
    
    const formIsValid = emailIsValid && passwordIsValid && nameIsValid && selectedImage;
    
    const onSubmitHandler = (event) => {
        event.preventDefault();
        const data = {
            email: emailValue.trim().toLowerCase(),
            password: passwordValue.trim(),
            name: nameValue.trim(),
            image:selectedImage
        }
        mutate({
            url: import.meta.env.VITE_BACKEND_URL + '/api/users/signup',
            method:'POST',
            data:JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        });
    }
    
    return (
        <>
            <Background />
            <div className={styles['signup-content']}>
                <div className={styles['signup-content__header']}>
                    <h2>Welcome to Travel Trove</h2>
                </div>
                <div className={styles['signup-content__form']} >
                    <form onSubmit={onSubmitHandler} >
                        <Input 
                            type="email" 
                            id="email" 
                            label="Email" 
                            onChange={emailChangeHandler} 
                            onBlur={emailBlurHandler} 
                            value={emailValue}  
                            invalidInput={emailIsInvalid} 
                            errorContent="Please enter a valid E-mail!" 
                        />
                        <Input 
                            type="password" 
                            id="password" 
                            label="Password" 
                            onChange={passwordChangeHandler} 
                            onBlur={passwordBlurHandler} 
                            value={passwordValue} 
                            invalidInput={passwordIsInvalid} 
                            errorContent="Password must be at least 6 characters!" 
                        />
                        {
                            fetchIsPending && 
                            <LoadingSpinner size="40px" margin="15px" />
                        }
                        {
                            !fetchIsPending && !fetchIsError && 
                            <SelectAvatar 
                                images={data} 
                                onClick={selectImageHandler} 
                                selectedImage={selectedImage} 
                            />
                        }
                        <Input 
                            type="text" 
                            id="name" 
                            label="Name" 
                            onChange={nameChangeHandler} 
                            onBlur={nameBlurHandler} 
                            value={nameValue} 
                            invalidInput={nameIsInvalid} 
                            errorContent="Name Cannot be empty!" 
                        />
                        <div className={styles['form-actions']} >
                            {isPending && 
                                <div className={styles.pending}>
                                    <h3>Signing Up...</h3>
                                </div>
                            }
                            {!isPending && 
                                <Button 
                                    type="submit" 
                                    className={styles['signup-btn']} 
                                    disabled={!formIsValid} 
                                >
                                    Sign up
                                </Button>
                            }
                        </div>
                    </form>
                    {
                        isError &&
                        <ErrorBlock 
                            width="90%" 
                            height="120px" 
                            errorHeader="Signing Up Failed!" 
                            errorContent={error.message} 
                        />
                    }
                    {
                        fetchIsError &&
                        <ErrorBlock 
                            width="90%" 
                            height="120px"  
                            errorContent={fetchError.message} 
                        />
                    }
                </div>
            </div>
        </>
    );
}

export default SignupForm;
