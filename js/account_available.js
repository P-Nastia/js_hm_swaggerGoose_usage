
var accountNav = document.getElementById('account');

function ChangeMenu() {
    
    accountNav.innerHTML = `
    <button id="accountButton" type="button" class="flex text-lg bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 " id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
        <span class="sr-only">Open user menu</span>
        <img id="accountImage" class="account-image rounded-full" src="/images/no-avatar.png" alt="user photo">
    </button>
            
    </div>`;

    const token = localStorage.getItem("token");

    axios.get('https://goose.itstep.click/api/Account/profile', {
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(resp => {
            const { data } = resp;
            const { photo } = data;
            document.getElementById("accountImage").src = `https://goose.itstep.click/images/${photo}`;
            
        })
        .catch(err => {
            console.log('Error', err)
        })

    document.getElementById('accountButton').addEventListener('click', () => {
        location.href = '/user/profile.html';
    })

    return;
}

