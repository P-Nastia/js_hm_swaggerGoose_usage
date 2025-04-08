async function UploadImage(file, objectURL) {
    return new Promise((resolve, reject) => {
        let base64String;
        const img = new Image();
        img.onload = async function () {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                base64String = canvas.toDataURL(file.type);
                URL.revokeObjectURL(objectURL);


                const response = await axios.post(`${window.API_BASE_URL}/api/Products/upload`, {
                    image: base64String
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });

                const { data } = response;
                resolve(data);

            } catch (error) {
                reject(error);
            }
        };

        img.src = objectURL;
    });
}