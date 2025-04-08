

fileInput.addEventListener('change', async function () {
    console.log('in file input');
    const files = fileInput.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            fileList.push(file);
            CreateImage(file,null);
        }
    }
});

function CreateImage(file, src) {
    const imgElement = document.createElement('img');
    imgElement.classList.add('w-full', 'h-24', 'p-1', 'rounded-lg', 'shadow-lg');

    if (file) {
        let objectURL = URL.createObjectURL(file);
        imgElement.src = objectURL;
        imgElement.dataset.info = JSON.stringify(file);
    }
    
    if(src)
        imgElement.src = src;

    imgElement.setAttribute('draggable', 'true');
    imgElement.dataset.index = fileList.length - 1;
    imgElement.dataset.type = 'img';
    


    imgElement.addEventListener('dragstart', (e) => {
        // при переміщенні елемента, сетяться дані по індексу для його перестановки відповідно до розміщення інших елементів
        e.dataTransfer.setData('index', e.target.dataset.index);
    });

    imgElement.addEventListener('dblclick', (e) => {

        imgElement.remove();

        fileList.splice(fileList.indexOf(file), 1);

        updateImageIndexes();
    });

    imageContainer.appendChild(imgElement);
}

imageContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation(); //запобігає переданню події до іншиї елементів (parent)
});

imageContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // тут витягується індекс тої фото, який було засечено вище
    const draggedImageIndex = e.dataTransfer.getData('index');
    const toReplaceImage = e.target;

    if (toReplaceImage && toReplaceImage.tagName === 'IMG') {
        const toReplaceImageIndex = toReplaceImage.dataset.index;
        reorderImages(draggedImageIndex, toReplaceImageIndex);
    }
});

function reorderImages(draggedImageIndex, toReplaceImageIndex) {
    const images = Array.from(imageContainer.getElementsByTagName('img'));
    const draggedImage = images[draggedImageIndex];
    const toReplaceImage = images[toReplaceImageIndex];

    if (draggedImage && toReplaceImage) {

        if (draggedImageIndex < toReplaceImageIndex) {
            imageContainer.insertBefore(draggedImage, toReplaceImage.nextSibling);
        } else {
            imageContainer.insertBefore(draggedImage, toReplaceImage);
        }
        updateImageIndexes();
    }
}

function updateImageIndexes() {
    const images = Array.from(imageContainer.getElementsByTagName('img'));
    images.forEach((img, index) => {
        img.dataset.index = index;
    });
}