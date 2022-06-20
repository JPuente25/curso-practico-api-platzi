const API_KEY = '1af41b623e681d424fd48b25d8b33e10';
const URL_TMDB = 'https://api.themoviedb.org/3'

const fetchApi = axios.create({
   baseURL: 'https://api.themoviedb.org/3',
   params:{
      'api_key': API_KEY,
   }
})

const lazyLoadingMovieContainer = (entries) => {
   entries.forEach((element)=> {
      if (element.isIntersecting){
         const url = element.target.getAttribute('data-img')
         element.target.setAttribute('src',url);
      }
      });
}

const observer = new IntersectionObserver(lazyLoadingMovieContainer);

const getCategoriesPreviewList  = async () => {
   try{
         const {data,status} = await fetchApi.get('/genre/movie/list');
         if(status === 200){
            createCategories(data,categoriesPreviewList);
         }        
   } catch(error){
      console.error(error);
   }
}

const getTrendingMoviesPreview = async () => {
   try{
         const {data,status} = await fetchApi.get('/trending/movie/day')
         if(status === 200){
            elementHTMLCreator({
               data:data,
               baseClass: 'movie-container',
               mainClass: 'movie-container-preview',
               parent: trendingMoviesPreviewList,
            });
         }
   } catch (error){
      console.error(error);
   }
}

const getMoviesByCategory = async (hash) => {
   try{
      const [trash, categoryDetails, pageNumber] = hash.split('=');
      let [categoryId, categoryName] = categoryDetails.split('-');
      categoryName = categoryName.split('?')[0];
      headerCategoryTitle.innerHTML = categoryName.replace('%20',' ');
      const {data,status} = await fetchApi.get('/discover/movie',{
         params: {
            'with_genres': categoryId,
            'page': pageNumber,             
         },
      })
      if(status === 200){
         elementHTMLCreator({
            data:data,
            baseClass: 'movie-container',
            mainClass: 'movie-container-category',
            parent: genericSection,
         });
         getPagination(data);
      }
   } catch (error){
      console.error(error);
   }
};

const searchMovie = async (hash) => {
   try{
      console.log(hash)
      let [trash,movieName,pageNumber] = hash.split('=');
      movieName = movieName.split('?page')[0];
      const {data,status} = await fetchApi.get('/search/movie',{
         params:{
            'query': movieName,
            'page': pageNumber,
         }
      })
      if(status === 200){
         elementHTMLCreator({
            data: data,
            baseClass: 'movie-container',
            parent: genericSection,
         })
         getPagination(data);
      }
   }catch (error){
      console.error(error);
   }
   
};

const trendingMovies = async () => {
   headerCategoryTitle.innerHTML = 'Tendencias';
   try{
      const {data, status} = await fetchApi.get('/trending/movie/day');
      if(status === 200){
         elementHTMLCreator({
            data: data,
            baseClass: 'movie-container',
            parent: genericSection,
         })
      }
   }catch (error){
      console.error(error);
   }
};

const getPagination = (data) => {
   const totalPages = data.total_pages;
   const actualPage = data.page;
   pagination.innerHTML = '';
   const minPage = 10;
   const firstPage = actualPage - minPage/2;
   const lastPage = data.page + minPage/2 - 1;
   
   if(actualPage !== 1){
      const buttonPrevious = createButtonMore('Anterior');
      buttonPrevious.addEventListener('click',() => paginationPageJump(actualPage-1));
   }

   if(actualPage > minPage/2){
      createPaginationButtons(firstPage,lastPage,totalPages, actualPage);
   } else {
      createPaginationButtons(1,minPage,totalPages, actualPage);
   }

   if(lastPage < totalPages - 1){
      const buttonNext = createButtonMore('Siguiente');
      buttonNext.addEventListener('click',() => paginationPageJump(actualPage+1));
   } 
}

// const createButtonMore = (text) => {
//    const buttonMore = document.createElement('button');
//    buttonMore.classList.add('pagination-button','pagination-button--more');
//    buttonMore.innerHTML = text;
//    pagination.appendChild(buttonMore);
//    return buttonMore;
// }

// const createPaginationButtons = (
//    firstPage,
//    lastPage,
//    totalPages,
//    ) => {
//    for(let i = firstPage; i <= Math.min(lastPage,totalPages); i++){
//       const paginationButton = createButton(i);

//       paginationButton.addEventListener('click', () => {
//          paginationPageJump(paginationButton.innerHTML)
//       });
//    }
// } 

// const paginationPageJump = (pagina) => {
//    if(location.hash.includes('?page=')){
//       const splitHash = location.hash.split('?page=');
//       splitHash[1] = pagina;
//       location.hash = splitHash.join('?page=');
//    }
// }

// const createButton = (number) => {
//    const paginationButton = document.createElement('button');
//    paginationButton.classList.add('pagination-button');
//    paginationButton.innerHTML = number;
//    pagination.appendChild(paginationButton);
//    return paginationButton;
// }