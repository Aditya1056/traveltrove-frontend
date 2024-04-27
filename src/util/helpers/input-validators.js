
export const minLengthValidator = (data) => {

    const value = data.val.trim();
    const len = data.minLength;

    return (value.length < len ? false : true);
}

export const notNullValidator = (data) => {

    const value = data.val;
    if(!value || value == NaN){
        return false;
    }

    return true;
}

export const emailValidator = (data) => {

    const value = data.val.trim();
    const len = data.minLength;

    if(value.length >= len && value.includes('@')){
        return true;
    }

    return false;
}


