export function checkValidEmail(email, name) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

    if (!emailPattern.test(email)) {
        return `Invalid Email`;
    }

    return email;
}

export function checkValidName(param, name) {
    const nameRegex = /[^a-zA-Z-]/;
    if(param.trim().length === 0 || param.trim() === ""){
        return `${name} not provided`;
    }

    if (nameRegex.test(param)) {
        return `Invalid ${name}`;
    }

    return param;
}

export function checkValidUsername(param) {
    const usernameRegex = /[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;

    if(param.trim().length === 0 || param.trim() === ""){
        return "Username not provided";
    }

    if (param.length < 3 || param.length > 50) {
        return 'Username has to at be least 3 characters but less than 50 characters';
    }

    if (usernameRegex.test(param)) {
        return 'Username cannot any contain special characters'
    }

    return param;
}

export function checkValidAge(dateOfBirth, varName) {
    if(!dateOfBirth){
        throw `${varName} not provided`;
    }
    if(typeof dateOfBirth !== 'string'){
        throw `${varName} must be a string`;
    }

    const [month, day, year] = dateOfBirth.split('/');
    const dob = new Date(year + "-" + month + "-" + day);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dob.getFullYear();
    const monthDifference = currentDate.getMonth() - dob.getMonth();

    if(monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dob.getDate())){
        age--;
    }
    if (age < 13) {
        return "You must be older than 13 to use this website.";
    } 
    return true;
}

export function checkYear(year){ 
    //year must be passed in as a number, Number(year), not as a string

    if(!year){
        return `Year not provided`;
    }
    if(typeof year !== 'number'){
        return `Year must be a number`;
    }
    const currentYear = new Date().getFullYear();
    if(year > currentYear || year < 1400 || year <=0){
        return `Invalid Year`;
    }
}

export function checkDate (date, varName){
    date = date.trim();
    if(date.length === 0 || date === ""){
        return `${varName} not provided`;
    }
    
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if(!regex.test(date)){
        return `Invalid Date`;
    }

    const [month, day, year] = date.split('/');
    if(month === "02"){
        if(day === "30"){
            return `Invalid Date`;
        }
        if(!((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))){
            if(day === "29"){
                return `Invalid Date`;
            }
        }
    }
    if(month === '04' || month === '06' || month === '09' || month === '11'){
        if (day === '31'){
            return `Invalid Date`;
        }
    }
    checkYear(Number(year));

    return date;

}

export function checkPhoneNumber(number, varName){
    number = number.trim();
    if(number.length === 0){
        return `${varName} not provided`;
    }
    if(isNaN(Number(number))){
        return `${varName} can only contain numbers`;
    }
    if(number.length !== 10){
        return `${varName} must be 10 digits long`;
    }
    return number;
}

export function checkDateOfBirth(dob, varName){
    if(!dob){
        return `${varName} not provided`;
    }
    checkDate(dob, varName);

    return dob;
}

export function checkValidPassword(password, name) {
    if (password.length <= 7) {
      return `${name} must be at least eight characters long.`;
    }
  
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  
    if (!uppercaseRegex.test(password)) {
      return `${name} must contain at least one capital letter.`;
    }
  
    if (!digitRegex.test(password)) {
      return `${name} must contain at least one digit.`;
    }
  
    if (!specialCharRegex.test(password)) {
      return `${name} must contain at least one special character.`;
    }
  
    return true;
  }