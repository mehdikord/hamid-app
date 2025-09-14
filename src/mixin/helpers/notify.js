
export default {
    methods: {
        Notify_Generator(type = 'info',message,color='#fff',background='#04182d'){
            const Toast = this.$swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                showCloseButton:true,
                closeButtonHtml: '<i class="mdi mdi-close font-25"></i>',
                timer: 3000,
                color : color,
                iconColor : color,
                background : background,
                timerProgressBar: true,
                zIndex: 99999,
                didOpen: (toast) => {
                    toast.onmouseenter = this.$swal.stopTimer;
                    toast.onmouseleave = this.$swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: type,
                title: message
            });
        },

        Notify_Success(message){
            this.Notify_Generator('success',message,'#fff','#15a643')
        },
        Notify_Error(message){
            this.Notify_Generator('error',message,'#fff','#FB4141')
        },
        Notify_Info(message){
            this.Notify_Generator('info',message,'#fff','#4D55CC')
        },
        Notify_Warning(message){
            this.Notify_Generator('warning',message,'#212121','#FFA725')
        },
        Notify_Error_Server(){
            this.Notify_Error('خطا در دریافت اطلاعات');
        },
        Notify_Error_Validation(){
            this.Notify_Error('اطلاعات ارسالی ناقص است !');
        },
  }
}