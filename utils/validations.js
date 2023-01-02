export const ValidateEmail = (email)=> /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

export const IsNumber = (string) => /^[0-9]*\.?[0-9]*$/.test(string);