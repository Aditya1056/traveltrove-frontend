import { useReducer, useEffect } from "react";

const initialInputState = {
    value: null,
    previewUrl:null
};

const inputReducer = (state, action) => {

    let newState = {...state};

    if(action.type === 'NEW_VAL'){
        newState.value = action.payload;
    }

    if(action.type === 'RESET'){
        newState.value = null;
        newState.previewUrl = null;
    }

    if(action.type === 'SET_PREVIEW'){
        newState.previewUrl = action.payload;
    }

    return newState;
};

const useImageInput = (presentValue) => {

    const [inputState, dispatch] = useReducer(inputReducer, initialInputState);

    useEffect(() => {
        if(presentValue){
            dispatch({type:'NEW_VAL', payload: presentValue});
        }
    }, [presentValue]);

    useEffect(() => {
        if(!inputState.value){
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            dispatch({type:'SET_PREVIEW', payload: fileReader.result});
        }
        fileReader.readAsDataURL(inputState.value);
    }, [inputState.value]);

    const inputIsInvalid = !inputState.value;

    const inputChangeHandler = (event) => {
        if(event.target.files && event.target.files.length === 1){
            dispatch({type:'NEW_VAL', payload: event.target.files[0]});
        }
    }

    const resetInput = () => {
        dispatch({type:'RESET'});
    }

    return {
        value:inputState.value,
        previewUrl: inputState.previewUrl,
        isValid: !inputIsInvalid,
        hasError: inputIsInvalid,
        inputChangeHandler,
        resetInput
    };
}

export default useImageInput;