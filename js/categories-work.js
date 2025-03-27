let search = {
    page: 1,
    title: ''
};

async function fetchCategories() {
    try {

        console.log("qs", Qs.stringify(search));
        const query = Qs.stringify(search);
        const pagination = document.getElementById('pagination');

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
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td class="p-4">
            <img src="https://goose.itstep.click/images/100_${item.image}" alt="Apple Watch">
        </td>
        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
            ${item.title}
        </td>
        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
            ${item.urlSlug}
        </td>
        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
            ${item.priority}
        </td>
        <td class="px-6 py-4" id="${item.id}" >
            <a href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</a>
        </td>
</tr>
                        `;

        });

        searchDataPage();
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

fetchCategories();

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
    pagination.innerHTML = `
<li>
        <a href="#" data-page="${-1}" class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
</li>
`;
    for (let i = 1; i <= pages; i++) {
        if (i == currentPage) {
            pagination.innerHTML += `
                        <li>
          <a href="#" aria-current="page" data-page="${i}" class="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">${i}</a>
        </li>`;
        }
        else {
            pagination.innerHTML += `
         <li>
             <a href="#"  data-page="${i}" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${i}</a>
         </li>
         `;
        }
    }
    pagination.innerHTML += `
<li>
        <a href="#" data-page="${0}" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
</li>
`;

}

function SearchCategories() {
    const searchValue = document.getElementById('searchInput').value;
    search.title = searchValue;
    const url = new URL(window.location.href);
    if (searchValue) {
        
        url.searchParams.set('category', searchValue);
        history.pushState({}, '', url); 

    } else {
        url.searchParams.delete('category');
        history.pushState({}, '', url);
    }
    search.page = 1;

    fetchCategories();
}

async function DeleteCategory(categoryId) {
    
    const response = await axios.delete(`https://goose.itstep.click/api/Categories/delete/${categoryId}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    fetchCategories();
}

listCategories.addEventListener('click', function (event) {
    if (event.target.closest('tr')) {
        const clickedRow = event.target.closest('tr');

        const categoryId = clickedRow.querySelector('td:nth-child(5)').id;
        DeleteCategory(categoryId);
    }
});

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        search.title = category;
        fetchCategories();
    }
});