
function INIT(data) {
    tinymce.init({
        selector: '#description',

        plugins: [
            'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
            'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
            'media', 'table', 'emoticons', 'help'
        ],
        toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
            'forecolor backcolor emoticons | help',
        menu: {
            favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
        },
        menubar: 'favs file edit view insert format tools table help',


        setup: function (editor) {
            editor.on('init', function () {
                if (data) {
                    editor.setContent(data.description);
                }
            });
        },
        plugins: 'wordcount',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
    });
}
