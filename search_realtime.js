

const selectButton = document.querySelector(".btn-info");
const tableList = document.querySelector(".tbody-userinfo");
const searchInput = document.querySelector(".input-search");
const radios = document.querySelectorAll("input[name='search-filter']");

let users = [];

async function getinfo() {
    try {

        const response = await fetch("./dbuser.json");

        if (!response.ok) {
            throw new Error("خطا در دریافت اطلاعات");
        }

        users = await response.json();

    } catch (error) {

        console.log(error);

    }
}

getinfo();

function renderUsers(userArray) {

    tableList.innerHTML = "";


    if (userArray.length === 0) {
        tableList.insertAdjacentHTML("beforeend", `
            <tr>
                <td colspan="6" style="text-align:center">
                    نتیجه ای یافت نشد
                </td>
            </tr>
        `);
        return;
    }

    userArray.forEach(user => {

        const { id, name, email, city, job, isMarried } = user;

        tableList.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${email}</td>
            <td>${city}</td>
            <td>${job}</td>
            <td>${isMarried ? "متاهل" : "مجرد"}</td>
        </tr>
        `);

    });

}

selectButton.addEventListener("click", function () {

    renderUsers(users);

});

function getFilterType() {

    const selected = document.querySelector("input[name='search-filter']:checked");

    return selected.value;

}

searchInput.addEventListener("input", function () {

    const searchValue = this.value.trim().toLowerCase();

    const filterType = getFilterType();

    const filteredUsers = users.filter(user => {

        const { name, email, city } = user;

        if (filterType === "name") {
            return name.toLowerCase().includes(searchValue);
        }

        if (filterType === "email") {
            return email.toLowerCase().includes(searchValue);
        }

        if (filterType === "city") {
            return city.toLowerCase().includes(searchValue);
        }

        if (filterType === "all") {

            const values = [...Object.values(user)];

            return values.some(value =>
                String(value).toLowerCase().includes(searchValue)
            );

        }


    });

    renderUsers(filteredUsers);

});

radios.forEach(radio => {

    radio.addEventListener("change", () => {

//         درصورت تغییر رادیو باتن دوباره سرچ انجام شود
        searchInput.dispatchEvent(new Event("input"));

    });

});
