import validator from "validator";

export const userRegistrationValidation = (data) => {

    const errors = [];

    //User role validation
    if (!data.userRole || validator.isEmpty(data.userRole)) {
        errors.push("User role is required");
    }

    //User email validation
    if (!data.email || validator.isEmpty(data.email)) {
        errors.push("Email is required");
    }
    if (!validator.isEmail(data.email)) {
        errors.push("Email is not valid one");
    }
    if (data.email.length > 100) {
        errors.push("Email is too long");
    }

    // Password validation
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!data.password || validator.isEmpty(data.password)) {
        errors.push("Password is required");
    }
    if (!passwordRegex.test(data.password)) {
        errors.push("Password is not strong");
    }

    //Name validation
    if (!data.name || validator.isEmpty(data.name)) {
        errors.push("Name is required");
    }

    //Contact number validation
    if (!data.contactNumber || validator.isEmpty(data.contactNumber)) {
        errors.push("Contact number is required");
    }


    return errors;
}


export const userLoginValidation = (data) => {

    const errors = [];

    //User email validation
    if (!data.email || validator.isEmpty(data.email)) {
        errors.push("Username is required");
        return errors;
    }
    if (!validator.isEmail(data.email)) {
        errors.push("Invalid username or password");
    }

    // Password validation
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!data.password || validator.isEmpty(data.password)) {
        errors.push("Password is required");
        return errors;
    }
    if (!passwordRegex.test(data.password)) {
        errors.push("Invalid username or password");
    }


    return errors;
}

export const forgotPasswordValidation = (data) => {

    const errors = [];

    //User email validation
    if (!data.email || validator.isEmpty(data.email)) {
        return errors.push("Email is required");
    }
    if (!validator.isEmail(data.email)) {
        return errors.push("Email is not valid one");
    }
    if (data.email.length > 100) {
        return errors.push("Email is too long");
    }

    return errors;
}

export const resetPasswordValidation = (password) =>{

    let error;
    
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if(!password || validator.isEmpty(password)){
        return error = "Password is required";
    }
    if(!passwordRegex.test(password)){
        return error = "Password is not strong";
    }

}