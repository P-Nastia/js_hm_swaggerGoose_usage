let search = {
    page: 1,
    title: ''
};


document.addEventListener('DOMContentLoaded', function () {

    let searchParams = {
        page: new URLSearchParams(window.location.search).get('page') || 1,
        title: new URLSearchParams(window.location.search).get('title') || '',
    };

    document.getElementById('title').value = searchParams.title;

    search = {
        ...search, ...searchParams
    };

    fetchCategories();
})

const formSearch = document.getElementById('formSearch');

formSearch.addEventListener('submit', (event) => {

    event.preventDefault();

    const formData = new FormData(formSearch);
    const values = {};
    for (const [name, value] of formData.entries()) {
        values[name] = value;
    }
    search = { ...search, ...values, page: 1 };

    search = Object.fromEntries(
        Object.entries(search).filter(([_, value]) => value !== null && value !== undefined && value !== "")
    );

    console.log("url", `${window.location.href}?${Qs.stringify(search)}`)

    history.pushState(null, null, `?${Qs.stringify(search)}`);


    fetchCategories();
})

async function fetchCategories() {
    try {

        console.log("qs", Qs.stringify(search));
        const query = Qs.stringify(search);
      

        const response = await axios.get(`https://goose.itstep.click/api/Categories/search?${query}`, {
            headers: {
                'Accept': '*/*'
            }
        });
        const { data } = response;
        const { categories, pages, total, currentPage } = data;

        loadPagination(pages, currentPage);

        const listCategories = document.getElementById('listCategories');
        listCategories.innerHTML = "";

        categories.forEach(item => {
            listCategories.innerHTML += `
                        <tr id="${item.id}"  class="bg-white border-b  border-gray-200 hover:bg-gray-50 ">
        <td class="p-4">
            <img src="https://goose.itstep.click/images/100_${item.image}" alt="Apple Watch">
        </td>
        <td class="px-6 py-4 font-semibold text-gray-900 ">
            ${item.title}
        </td>
        <td class="px-6 py-4 font-semibold text-gray-900 ">
            ${item.urlSlug}
        </td>
        <td class="px-6 py-4 font-semibold text-gray-900 ">
            ${item.priority}
        </td>
        <td class="px-6 py-4" >
           <a href="/pages/admin/categories/editCategory.html?id=${item.id}" class="font-medium text-red-600 dark:text-blue-500 hover:underline">
           <i class="fa fa-3x fa-pencil-square-o" aria-hidden="true"></i>
        </a>
        <a href="#" data-delete="${item.id}" data-delete-name="${item.title}" data-modal-target="deleteModal" data-modal-toggle="deleteModal" class=" font-medium text-red-600 dark:text-blue-500 hover:underline">
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
        searchDataPage();
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
            deleteBt.setAttribute('data-content', "category");
        });
    });
}

function searchDataPage() {
    document.querySelectorAll('[data-page]').forEach(element => {
        element.addEventListener('click', event => {

            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            if (page == -1) {
                search.page--;
            }
            else if (page == 0) {
                search.page++;
            }
            else
                search.page = page;
            fetchCategories();
            window.scrollTo(0, 0);
        });
    });
}

function loadPagination(pages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = `
<li>
        <a href="#" data-page="${-1}" class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ">Previous</a>
</li>
`;
    for (let i = 1; i <= pages; i++) {
        if (i == currentPage) {
            pagination.innerHTML += `
                        <li>
          <a href="#" aria-current="page" data-page="${i}" class="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 ">${i}</a>
        </li>`;
        }
        else {
            pagination.innerHTML += `
         <li>
             <a href="#"  data-page="${i}" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">${i}</a>
         </li>
         `;
        }
    }
    pagination.innerHTML += `
<li>
        <a href="#" data-page="${0}" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">Next</a>
</li>
`;

}


async function EditCategory(categoryId) {
    const response = await axios.get(`https://goose.itstep.click/api/Categories/get/${categoryId}`, {
        headers: {
            'Accept': '*/*'
        }
    });
    const { data } = response;
    console.log(data);
    const json= JSON.stringify(data);
    localStorage.setItem('categoryEdit', json);
    location.href = '/pages/admin/categories/editCategory.html';
}
