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
        async Helper_Downloader(url, fileName) {

            try {
                let path = this.$api_assets+url;
                // استفاده از مسیر پروکسی شده
                const proxyUrl = `/api${path}`;
                const response = await fetch(proxyUrl);

                if (!response.ok) throw new Error('Network response was not ok');

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = fileName || path.split('/').pop() || 'download';
                document.body.appendChild(link);
                link.click();

                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                }, 100);
            } catch (error) {
                console.error('Download error:', error);
            }
        }
    }
}