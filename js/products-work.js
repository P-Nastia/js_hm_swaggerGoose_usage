
async function fetchProducts() {
    try {

        const response = await axios.get(`${window.API_BASE_URL}/api/Products/list`, {
            headers: {
                'Accept': '*/*'
            }
        });
        const { data } = response;
        const listCategories = document.getElementById('listProducts');
        listCategories.innerHTML = "";

        data.forEach(item => {
            listCategories.innerHTML += `
                        <tr id="${item.id}"  class="bg-white border-b  border-gray-200 hover:bg-gray-50 ">
        <td class="p-4">
            <img src="${window.API_BASE_URL}/images/100_${item.images[0]}" alt="Apple Watch">
        </td>
        <td class="px-6 py-4 font-semibold text-gray-900 ">
            ${item.name}
        </td>
        <td class="px-6 py-4 font-semibold text-gray-900 ">
            ${item.categoryName}
        </td>
        <td class="px-6 py-4 font-semibold text-gray-900 ">
            ${item.priority}
        </td>
        <td class="px-6 py-4 font-semibold text-gray-900 ">
            ${item.price} UAH
        </td>
        <td class="px-6 py-4" >
           <a href="#" class="font-medium text-red-600 dark:text-blue-500 hover:underline">
           <i class="fa fa-3x fa-pencil-square-o" aria-hidden="true"></i>
        </a>
        <a href="#" data-delete="${item.id}" data-delete-name="${item.name}" data-modal-target="deleteModal" data-modal-toggle="deleteModal" class=" font-medium text-red-600 dark:text-blue-500 hover:underline">
           <i class="fa fa-3x fa-trash" aria-hidden="true"></i>
        </a>
        </td>
</tr>
                        `;

        });
        document.querySelectorAll('[data-modal-target]').forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal-target');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.remove('hidden');
                }
            });
        });

        document.querySelectorAll('[data-modal-hide]').forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal-hide');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        deleteDataItem();
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function deleteDataItem() {
    document.querySelectorAll('[data-delete]').forEach(element => {
        element.addEventListener('click', event => {
            event.preventDefault();
            const link = event.target.closest('a[data-delete]');

            const deleteId = link.getAttribute('data-delete');
            const deleteName = link.getAttribute('data-delete-name');

            let elementQuestion = document.getElementById('question');
            elementQuestion.textContent = `Ви впевнені, що хочете видалити '${deleteName}?'`;
            elementQuestion.setAttribute('data-content', deleteId);
            let deleteBt = document.getElementById('deleteBt');
            deleteBt.setAttribute('data-content', "product");
        });
    });
}
fetchProducts();
document.addEventListener('load', (e) => {
    fetchProducts();
})
