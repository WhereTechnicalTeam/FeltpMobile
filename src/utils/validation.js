const isEmailValid = (email) => {
    let emailErrors = [];
    if(!isDefined(email)) return ['Email is required'];
    if(isEmpty(email)) emailErrors.push("Email is required");
    if(!matchEmailRegex(email)) emailErrors.push("Email format is invalid");
    return emailErrors;
}

const isPasswordValid = (password) => {
    let passwordErrors = [];
    if(!isDefined(password)) return ['Password is required'];
    if(isEmpty(password)) passwordErrors.push("Password is required");
    if(!isRequiredLength(password, 8)) passwordErrors.push("Password should be at least 8 characters");
    return passwordErrors;
}

const isPasswordConfirmed = (password, cpassword) => {
    let confirmPasswordErrors = [];
    if(!isDefined(cpassword)) return ['Confirm Password is required'];
    if(isEmpty(cpassword)) confirmPasswordErrors.push("Confirm Password is required");
    if(!isRequiredLength(cpassword, 8)) confirmPasswordErrors.push("Password should be at least 8 characters");
    if(password !== cpassword) confirmPasswordErrors.push("Passwords do not match");
    return confirmPasswordErrors;
}

const isPhoneNumberPresentValid = (phoneNumber) => {
    let phoneNumberErrors = [];
    if(!isDefined(phoneNumber)) return ['Phone number is required'];
    if(isEmpty(phoneNumber)) phoneNumberErrors.push("Phone number is required");
    if(!matchPhoneNumberRegex(phoneNumber)) phoneNumberErrors.push("Phone number is invalid");
    return phoneNumberErrors;
}

const isPhoneNumberValid = (phoneNumber) => {
    let phoneNumberErrors = [];
    if(!isDefined(phoneNumber) || isEmpty(phoneNumber)) return [];
    if(!matchPhoneNumberRegex(phoneNumber)) phoneNumberErrors.push("Phone number is invalid");
    return phoneNumberErrors;
}

const isTextValid = (text, min=1, max=1000, required=true) => {
    let textErrors = [];
    if((!isDefined(text) || isEmpty(text)) && required) return ['Input is required'];
    if(!isRequiredLength(text, min, max)) textErrors.push("Input length is incorrect");
    return textErrors;
}

const isAlphaTextValid = (text, min=1, max=1000, required=true) => {
    let textErrors = [];
    if((!isDefined(text) || isEmpty(text)) && required) return ['Input is required'];
    if(!isRequiredLength(text, min, max)) textErrors.push("Input length is incorrect");
    if(!matchAlphabetRegex(text)) textErrors.push("Input must contain only [a-z]");
    return textErrors;
}

const isNumericTextValid = (text, min=1, max) => {
    let textErrors = [];
    if(!isDefined(text) || isEmpty(text)) return ['Input is required'];
    if(!isRequiredLength(text, min, max)) textErrors.push("Input length is incorrect");
    if(!matchNumericRegex(text)) textErrors.push("Input must contain only [0-9]");
    return textErrors;
}

const isDateValid = (date, isPast = false) => {
    let dateErrors = [];
    if(!isDefined(date)) return ['Date is required'];
    if (Number.isNaN(Date.parse(date))) {
        dateErrors.push("Invalid Date");
    } else {
        if (isPast && Date.parse(date) > Date.now())  dateErrors.push("Date must be in the past");
    }
    return dateErrors;
}

const isEnumValid = (input, enumList) => {
    if(!isDefined(input)) return ['Input is required'];
    return enumList.includes(input);
}

const isEmpty = (input) => {
    return input.length <= 0;
}

const isRequiredLength = (input, min=1, max) => {
    if(max) {
        return input.length >= min && input.length <= max;
    } 
    return input.length >= min;
}

const isDefined = (text) => {
    return text !== undefined && text !== null;
}

const matchEmailRegex = (email) => {
    const emailRegex = /.+@.+\..+/;
    return emailRegex.test(email);
}

const matchPhoneNumberRegex = (phoneNumber) => {
    const phoneRegex = /^0[235][0-9]{8}$/;
    return phoneRegex.test(phoneNumber);
}

const matchAlphabetRegex = (text) => {
    const alphaRegex = /^\D+$/;
    return alphaRegex.test(text);
}

const matchNumericRegex = (text) => {
    const numericRegex = /^\d+$/;
    return numericRegex.test(text);
}

export {isEmailValid, isPasswordValid, isPasswordConfirmed, isPhoneNumberValid, 
    isAlphaTextValid, isTextValid, isEnumValid, isDateValid, isNumericTextValid, 
    isDefined, isPhoneNumberPresentValid, isEmpty};