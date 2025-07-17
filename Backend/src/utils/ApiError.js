class ApiError extends Error{
    
    constructor(
        statusCode,
        message="Something went wrong",
        errors = [],
        errorstack = ""


    ){  
        //overriding all these variable with our variable 
        super(message);
        this.statusCode = statusCode;
        this.data = null
        this.errors = errors;
        this.success = false;
        this.errorstack = errorstack;
    
    }




}


module.exports = ApiError;