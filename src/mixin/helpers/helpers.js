export default {
    methods: {
        Helper_Text_Shorter(text,count=25){

            let text_count=text.length;
            if(text_count<= count){
                return text
            }else{
                return text.substring(0,count)+ " ..." ;
            }

        },
    }
}