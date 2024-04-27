import { useContext } from 'react';

import {useNavigate} from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { RiUserAddLine } from "react-icons/ri";

import styles from './LoginForm.module.css';

import Input from '../../util/UI/Input/Input';
import Button from '../../util/UI/Button/Button';
import useInput from '../../util/hooks/useInput';
import Background from '../../util/UI/Background/Background';
import ErrorBlock from '../../util/UI/ErrorBlock/ErrorBlock';

import {emailValidator, minLengthValidator} from '../../util/helpers/input-validators';
import { postRequest } from '../../util/http/http';
import { AuthContext } from '../../store/auth-context';

const LoginForm = (props) => {

    const navigate = useNavigate();
    const auth = useContext(AuthContext);

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

    const {mutate, isPending, isError, error} = useMutation({
        mutationFn:postRequest,
        onSuccess:(data) => {
            resetEmail();
            resetPassword();
            auth.login(data.userId, data.userImage, data.token, data.expiration);
            navigate('/');
        }
    });

    const formIsValid = emailIsValid && passwordIsValid;

    const onSubmitHandler = (event) => {
        event.preventDefault();
        const data = {
            email: emailValue.trim().toLowerCase(),
            password: passwordValue.trim()
        }
        mutate({
            url: import.meta.env.VITE_BACKEND_URL + '/api/users/login',
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
            <div className={styles['login-content']}>
                <div className={styles['login-content__header']}>
                    <h2>Travel Trove - Log In</h2>
                </div>
                <div className={styles['login-content__form']} >
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
                            errorContent="Password must be atleast 6 characters!" 
                        />
                        <div className={styles['form-actions']} >
                            {
                                !isPending && 
                                <Button 
                                    type="submit" 
                                    className={styles['login-btn']} 
                                    disabled={!formIsValid} 
                                >
                                    Login
                                </Button>
                            }
                            {
                                isPending && 
                                <div className={styles['pending']}>
                                    <h3>Logging In</h3>
                                </div>
                            }
                        </div>
                    </form>
                    {
                        isError &&
                        <ErrorBlock 
                            width="90%" 
                            height="120px" 
                            errorHeader="Login Failed!" 
                            errorContent={error.message} 
                        />
                    }
                </div>
                <div className={styles['login-content__footer']}>
                    <p>Don't have an account?</p>
                    <Button to="/auth/signup" className={styles['signup-link']} >
                        <div>
                            <span>Sign-up</span>
                            <RiUserAddLine />
                        </div>
                    </Button>
                </div>
            </div>
        </>
    );

}

export default LoginForm;