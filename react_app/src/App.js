// La ligne ci dessous permet de lier la feuille de style dédiée à App.js pour que 
// quand le composant App est appelé (par index.js), le lien se fait tout de suite.
import './App.css';


// les 2 lignes suivantes importent des compasants reactstrap. Elles peuvent être réunies en une seule car les 2 sont 'from 'reactstrap' '
// je les garde séparé pour l'instant pour bien identifier quels groupes de composants fonctionnent ensemble
// dans les composant 'tout fait' de reactstrap
import { Container, Row, Col } from 'reactstrap';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';

// J'importe mon composant Movie que j'ai définie dans Movie.js (d'où je l'ai exporté par défaut - ce qui explique cette syntaxe)
import Movie from './components/Movie';
import { useState, useEffect } from 'react';


/* STYLES - pour des styles définis 'inline' (vs sur la feuille de style CSS) */  
const AppStyle = {
  backgroundColor: 'black'
  // pour que l'app ait un fond noir
};

const NavLinkStyle = {
  color: "whitesmoke",
  // pour que les liens de la navBar soient blanc cassé
};

const DeleteBtnStyle = {
  cursor: 'pointer'
}


/* /* DATA 
// Ici on code des informations des films 'en dur'. Plus tard on les récupèrera probablement d'un base de données
// nb: LES NUMBERS RENSEIGNES ICI SONT INUTILES CAR ILS SONT GENERES ALEATOIREMENT A LA DEFINITON DE MovieList (juste en dessous)
// la propriété 'view' n'était pas explicitement demandé dans l'enoncé mais elle a du sens pour remplir le bagde 'nombre de vues' du composant Movie
const MovieData = [
  {
    name: 'StarWars',
    desc: 'Movie description',
    img: 'starwars.jpg',
    note: 4.8,
    vote: 27,
  },
  {
    name: 'Maleficent',
    desc: 'Movie description',
    img: 'maleficent.jpg',
    note: 2.5,
    vote: 27,
  },
  {
    name: 'Jumanji',
    desc: 'Movie description',
    img: 'jumanji.jpg',
    note: 7.9,
    vote: 27,
  },
  {
    name: 'Once upon a time in Holywood',
    desc: 'Movie description',
    img: 'once_upon.jpg',
    note: 5.3,
    vote: 27,
  },
  {
    name: 'Frozen',
    desc: 'Movie description',
    img: 'frozen.jpg',
    note: 4.2,
    vote: 27,
  },
  {
    name: 'Bad boys 3',
    desc: 'Movie description',
    img: 'badboy3.jpg',
    note: 6.9,
    vote: 27,
  },
  {
    name: 'Terminator',
    desc: 'Movie description',
    img: 'terminator.jpg',
    note: 9.8,
    vote: 27,
  }
] */

/* Component */
function App() {
  /* States and StateSetters */
  const [wishList, setWishList] = useState([]);
  //console.log('WISH: ', wishList);  

  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    // get the popular movies
    const loadPopular = async () => {
      const rawData = await fetch('/new-movies');
      //console.log('RAW: ', rawData);
      if (rawData.status !== 200){
        console.log('Erreur dans le fetch de la DB: ' + rawData.statusText);
        return;
      }
      const data = await rawData.json();
      //console.log('MOVIES: ', data.movies);
      setMovieList(
        data.movies.map(
          ({id, title, overview, backdrop_path, vote_average, vote_count}) => {
            return {
              webServiceId: id,
              name: title,
              desc: overview.length <= 80? overview : overview.slice(0, 80) + '...',
              img: backdrop_path? backdrop_path : null,     // il s'agit que du "endpoint", l'url de base est ajouté au niveau du backend sur la route post
              note: vote_average,
              vote: vote_count
            }
          })
      )
    };
    loadPopular();

    // get the wishlist from the DB
    const getWishlist = async () => {
      const wishlistRaw = await fetch('/wishlist-movie');
      const wishlistObj = await wishlistRaw.json();
      //console.log('WISH: ', wishlistObj.movieList);
      setWishList(wishlistObj.movieList.map(movie => movie.webServiceId));
    }
    getWishlist();
  }, [])
//console.log('MOVIELIST: ', movieList);
//console.log('WISHLIST: ', wishList);

  /* WishList popover */
  const [popoverOpen, setPopoverOpen] = useState(false);
  const toggle = () => setPopoverOpen(!popoverOpen);


  /* StateSetters */
  const handleClickToggleMovie = async (movieId) => {
    //console.log('IN TOOGGLE !');
    let {name, img} = movieList.filter(movie => movie.webServiceId === movieId)[0];

    if (wishList.includes(movieId)) {
      // on veut retirer le film de la wishlist
      //console.log('IN DELETE');
      setWishList(wishList.filter(e => e!== movieId));
      const deleteResult = await fetch(`/wishlist-movie/${movieId}`, {method: 'DELETE'});
      //console.log('REsult: ', deleteResult);
      if (deleteResult.status !== 200){
        console.log('Erreur sur le fetch de suppression de la wishList: ' + deleteResult.statusText);
      }

    } else {
      // on veut ajouter le film dans la wishlist
      setWishList([...wishList, movieId]);
      //console.log('NAME & IMG: ', name, img);
      //console.log('URL: ', `name=${encodeURIComponent(name)}&img=${img}&webServiceId=${movieId}`);
      const addResult = await fetch('/wishlist-movie', {
        method:"POST",
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `name=${encodeURIComponent(name)}&img=${img}&webServiceId=${movieId}`
      });
      //console.log('ADD: ', addResult);
      if (addResult.status !== 201){
        console.log('Erreur sur le fetch d ajout a la wishList: ' + addResult.statusText);
      }
    }
  }

  const wishlistItems = wishList.map(movieId => {
    const {name, img} = movieList.filter(movie => movie.webServiceId === movieId )[0];
    return <ListGroupItem key={`key-wish-${movieId}`} style={{display: 'flex'}}>
              <div className='w-25'><img className='w-100' src={img?`https://image.tmdb.org/t/p/w92/${img}` : '../../logo.png'} alt={name}/></div>
              <div className='w-75 ps-2'>
                {name}
                <span className="float-end" style={DeleteBtnStyle} onClick={() => handleClickToggleMovie(movieId)}>
                  X
                </span>
              </div>
            </ListGroupItem>
  });

  const Movies = movieList.map((movie) => {
    //console.log('LIKAPP: ', wishList.includes(index));
    return <Movie
      isLiked = {wishList.includes(movie.webServiceId)}
      handleClickOnHeart={() => handleClickToggleMovie(movie.webServiceId)}
      key={`key-movie-${movie.webServiceId}`} 
      data={ 
        {name: movie.name,
        desc: movie.desc,
        img: movie.img,
        note: movie.note,
        vote: movie.vote
        }
    }/>;
  });


  return (
    <div style={ AppStyle }>
      <Container>                           {/* composant Container importé plutot via reactStrap et qui équivaut à un <div class="container"><div/> */}
        <Row>                               {/* même principe avec <div class="row"><div/>*/}
          <Col>
            <Nav style={ {marginTop: '0.5rem'} }>     {/* code de la nabar, copier depuis la doc reactStrap */}
              <img src="logo.png" alt="Logo" />
              <NavItem>
                <NavLink style={ NavLinkStyle } href="#">Last Releases</NavLink>
              </NavItem>
              <NavItem>
                <div>
                  <Button id="Popover1" type="button">
                    Film{wishList.length > 1? 's': ''} {wishList.length}
                  </Button>
                  <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                    <PopoverHeader>Wishlist</PopoverHeader>
                    <PopoverBody>
                    <ListGroup>
                      {wishlistItems}
                    </ListGroup>
                    </PopoverBody>
                  </Popover>
                </div>
                <NavLink style={ NavLinkStyle } href="#"></NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>
        <Row>
          {Movies}                     {/* on injecte nous variable MovieList définie plus haut, elle contient tout nos composant Movie, chacun avec les infos d'un seul film */}
        </Row>
      </Container>
    </div>
    
  );
}

export default App;     // on exporte, par défaut, App pour l'utiliser dans index.js

// MERITE UNE BONNE REFACTO