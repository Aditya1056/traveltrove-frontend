import { useEffect, useReducer } from "react";

const initialInputState = {
    value: '',
    isTouched: false,
};

const inputReducer = (state, action) => {

    let newState = {...state};

    if(action.type === 'NEW_VAL'){
        newState.value = action.payload;
    }

    if(action.type === 'BLUR'){
        newState.isTouched = true;
    }

    if(action.type === 'RESET'){
        newState.value = '';
        newState.isTouched = false;
    }

    return newState;
}

const useInput = (validate, minLength, presentValue) => {

    let initialState = initialInputState;

    if(presentValue){
        initialState = {value: presentValue, isTouched: true};
    }

    const [inputState, dispatch] = useReducer(inputReducer, initialState);

    useEffect(() => {
        if(presentValue){
            dispatch({type:'NEW_VAL', payload: presentValue});
        }
    }, [presentValue]);

    const inputIsValid = validate({
        val: inputState.value, 
        minLength: minLength != undefined ? minLength : 1
    });

    const inputIsInvalid = !inputIsValid && inputState.isTouched;

    const inputChangeHandler = (event) => {
        dispatch({type:'NEW_VAL', payload: event.target.value});
    }

    const inputBlurHandler = () => {
        dispatch({type:'BLUR'});
    }

    const resetInput = () => {
        dispatch({type:'RESET'});
    }

    return {
        value:inputState.value,
        isValid: inputIsValid,
        hasError: inputIsInvalid,
        inputChangeHandler,
        inputBlurHandler,
        resetInput
    };
}

export default useInput;