export default {
    methods: {
        Validation_Check(errors=[],key){
            return !!(errors[key] && errors[key].length);
        },
        Validation_Errors(errors=[],key){
            return errors[key] && errors[key].length ? errors[key] : {};
        }
    }


}