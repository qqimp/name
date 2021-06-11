import refs from "./refs.js";
// console.log(refs);
const { searchForm, searchResults, countriesList, modalContent, modal } = refs;
import countriesListItem from "../template/countriesListItem.hbs";
import modalCountryItem from "../template/modalCountryItem.hbs";
import countrySearchItem from "../template/countrySearchItem.hbs";

window.addEventListener("DOMContentLoaded", getAllCountries);

searchForm.addEventListener("submit", (event) => {
  // <!-- отменяем дефолтное событие браузера - отправку формы -->
  event.preventDefault();
  console.dir(event.target);

  // <!-- получаем значение из инпута с  name="search" и сохраняем в переменную searchName -->
  let searchName = event.target.elements.search.value;

  // <!-- вызываем функцию searchCountry для запроса и отрисовки страны по введенному значению, передаем в ее вызов полученное из формы значение значение  -->
  searchCountry(searchName);
  // <!-- зачищаем форму после отправки запроса -->
  searchForm.reset();
});

window.addEventListener("keydown", (e) => {
  //   console.log(e.code)
  if (e.code === "Escape") {
    modal.classList.add("is-hidden");
    modalContent.innerHTML = "";
  }
});

modal.addEventListener("click", (e) => {
  if (e.target.id === "modal") {
    modal.classList.add("is-hidden");
    modalContent.innerHTML = "";
  }
});

function getAllCountries() {
  let url = `https://restcountries.eu/rest/v2/all`;

  fetch(url)
    .then((response) => {
      //   console.log(response);
      return response.json();
      // преобразуем полученный ответ в формат json
      // и возвращаем его
    })
    .then((data) => {
      //   console.log(data);
      // вызываем шаблон countriesListItem, передаем в него полученную data и записываем результат в переменную items
      let items = countriesListItem(data);
      //   console.log(items);

      // встраиваем созданную шаблоном разметку items в `<ul class="coutries-list" id="coutries-list"></ul>` - вспоминаем, как назвали деструктуризированную из объекта refs переменную с ссылкой на этот ul
      //   для встраивания разметки используем метод insertAdjacentHTML
      countriesList.insertAdjacentHTML("afterbegin", items);
      // теперь создаем переменную countries и записываем в нее преобразование коллекции "детей" вышеуказанного списка стран в полноценный массив с помощью [...SPREAD]
      const countries = [...countriesList.children];
      // перебираем через forEach созданный массив стран и на каждую вешаем слушателя по клику

      countries.forEach((country) => {
        country.addEventListener("click", (event) => {
          // console.dir(event.currentTarget)
          let name = event.currentTarget.textContent.trim();
          // записываем в переменную name значение свойства textContent с применением метода trim(), чтобы убить лишние пробелы из целевого элемента события

          // снова добавляем переменную с адресом запроса
          let url = `https://restcountries.eu/rest/v2/name/${name}`;

          // делаем новый запрос через метод fetch(url)
          //   обрабатываем методами then

          fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              // console.log(data)
              // при получении данных о стране, передаем их в вызов шаблона modalCountryItem
              //   результат встраиваем в `<div class="modal-content" id="modal-content"></div>` - его переменная должна быть деструктуризирована из refs
              let item = modalCountryItem(data);
              //   console.log(item)
              // у `<div class="modal is-hidden" id="modal">` - переменная, там же из refs
              modalContent.insertAdjacentHTML("afterbegin", item);
              //   удаляем класс "is-hidden" для отображения
              modal.classList.remove("is-hidden");
            });
        });
      });
    });
}

function searchCountry(searchName) {
  let url = `https://restcountries.eu/rest/v2/name/${searchName}`;

  fetch(url)
    .then((response) => {
      console.log(response);

      // возвращаем ответ в формате json
      return response.json();
    })
    .then((data) => {
      console.log(data);

      // передаем полученную data в вызов countrySearchItem
      let item = countrySearchItem(data)
      console.log(item)
      // встраиваем разметку из countrySearchItem в
      //   `<ul class="search-results" id="search-results"></ul>` методом insertAdjacentHTML
      searchResults.insertAdjacentHTML("afterbegin", item)

      // теперь создаем переменную countries и записываем в нее преобразование коллекции "детей" вышеуказанного списка стран в полноценный массив с помощью [...SPREAD]
        const countries = [...searchResults.children];
      // перебираем через forEach созданный массив стран и на каждую вешаем слушателя по клику

      countries.forEach((country) => {
        country.addEventListener("click", (event) => {
          // записываем в переменную name значение свойства textContent с применением метода trim(), чтобы убить лишние пробелы из целевого элемента события
            let name = event.currentTarget.textContent.trim()
          // добавляем переменную с адресом запроса
          let url = `https://restcountries.eu/rest/v2/name/${name}`;

          // делаем новый запрос через метод fetch(url)
          // обрабатываем методами then
          fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
                console.log(data)
              // при получении данных о стране, передаем их в вызов шаблона modalCountryItem
              let item = modalCountryItem(data);
              // результат встраиваем в `<div class="modal-content" id="modal-content"></div>` - его переменная должна быть деструктуризирована из refs
              // у `<div class="modal is-hidden" id="modal">` - переменная, там же из refs
              modalContent.insertAdjacentHTML("afterbegin", item)
              // удаляем класс "is-hidden" для отображения
              modal.classList.remove("is-hidden");
            });
        });
      });
    });
}
