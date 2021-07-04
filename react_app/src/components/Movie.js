// La ligne ci dessous permet de lier la feuille de style dédiée à Movie.js pour que 
// quand le composant Movie est appelé (par App.js), le lien se fait tout de suite.
import './Movie.css';

import { useState } from 'react';

// les 3 lignes suivantes importent des compasants reactstrap. Elles peuvent être réunies en une seule car les 3 sont 'from 'reactstrap' '
// je les garde séparé pour l'instant pour bien identifier quels groupes de composants fonctionnent ensemble
// dans les composant 'tout fait' de reactstrap
import {
  Col,
  Card, CardImg, CardText, CardBody, CardTitle,
  Badge
} from 'reactstrap';


// On importe fontAwesome, la 1ere ligne est un composant, la suivante c'est les données qu'on passe au composant pour définir l'icon qui doit s'afficher.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faVideo, faStar } from '@fortawesome/free-solid-svg-icons'



/* Styles */

const CardStyle = {
  marginBottom: '2rem',
  height: 473
};


/* Component */

function Movie({data, isLiked, handleClickOnHeart}) {
//console.log('LIK: ', isLiked);

  // Définition des etats
  const [watchMovie, setWatchMovie] = useState(false);
  const [countWatchMovie, setCountWatchMovie] = useState(0);
  const [myRatingMovie, setMyRatingMovie] = useState(0);
  const [voteNumb, setVoteNumb] = useState(data.vote);
  const [userHasVoted, setUserHasVoted] = useState(false);


  // Callback des OnClicks
  const handleClick = () => {
    //console.log('handle watch ok');
    setCountWatchMovie(countWatchMovie + 1);
    if (!watchMovie){
      setWatchMovie(true);
    }
  };

  const handleRatingBtn = (value) => {
    if (!userHasVoted) {
      setVoteNumb(voteNumb + 1);
      setUserHasVoted(true);
    }
    if (value === -1 && myRatingMovie === 0){
      return;
    }
    if (value === 1 && myRatingMovie === 10){
      return;
    }
    setMyRatingMovie(myRatingMovie + value);
  }

  const handleRatingStar = (value) => {
    if (!userHasVoted) {
      setVoteNumb(voteNumb + 1);
      setUserHasVoted(true);
    }
    setMyRatingMovie(value);
  }




  /* Ligne 21 à 29 servent à définir un tableau stocké dans NoteStars. A la fin ce tableau stocke 10 composants FontAwesome en forme d'etoile
  les premières seront jaunes conformément à la note du film*/
  const newAverageNote = !userHasVoted? data.note : ((data.note * (voteNumb - 1)) + myRatingMovie) / voteNumb;
  const yellowed = Math.round(newAverageNote);
  const NoteStars = [];
  for (let i = 0; i < yellowed; i++){
    NoteStars.push(<FontAwesomeIcon key={`key-note-${i}`} color="#f1c40f" icon={faStar} />);   /* Ici on ajoute l'attribut color pour changer la couleur par défaut de l'étoile */
  }
  for (let i = 0; i < 10 - yellowed; i++){
    NoteStars.push(<FontAwesomeIcon key={`key-note-${yellowed + i}`} icon={faStar} />)
  }

  /* Ligne 33 à 36 servent à définir un tableau stocké dans VoteStars.
  A la fin ce tableau stocke 10 composants FontAwesome en forme d'etoile et de couleur noir (couleur par défaut) uniquement */
  const myRatingStars = [];
  for (let i = 0; i < myRatingMovie; i++){
    myRatingStars.push(<FontAwesomeIcon key={`key-vote-${i}`} color="#f1c40f" onClick={() => handleRatingStar(i + 1)} icon={faStar} />);
  }
  for (let i = 0; i < 10 - myRatingMovie; i++){
    myRatingStars.push(<FontAwesomeIcon key={`key-vote-${myRatingMovie + i}`} onClick={() => handleRatingStar(i + 1 + myRatingMovie)} icon={faStar} />);
  }
  
  const imgUrl = data.img? `https://image.tmdb.org/t/p/w342/${data.img}`: '../../generique.jpg'

  return (
        <Col xs="12" lg="6" xl="4">               {/* définition du responsive du composant Col, tel que prévu par la doc reactStrap et l'énoncé - Pour rappel, bootstrap utiliser les le principe du mobile first: les paramètres du plus petits écrans sont appliqués jusqu'à ce qu'on rencontre un breakpoint défini autrement (les règles des petits écrans se propagent aux plus grands tant que des derniers ne sont pas explicitement définis*/}
          <Card style={CardStyle}>                {/* Composant Card copier de la doc ReactStrap et 'alléger' des composant non utile ici */}
            <CardImg top width="100%" height="255px" src={ imgUrl } alt={ data.name } />   {/* puisque je n'ai pas éclaté les informations de mes films dans plusieurs variables au niveau de APP.js, data est un object, je dois donc préciser quelle propriété de cet objet je veux utiliser (ici data.img et data.name) */}
            <CardBody>
              <div>Like <FontAwesomeIcon onClick={handleClickOnHeart} color={isLiked? '#e74c3c': 'black'} className="pointable" icon={faHeart} /></div>
              <div>
                Nombre de vues
                <FontAwesomeIcon onClick={handleClick} color={watchMovie? '#e74c3c': 'black'} icon={faVideo} className="mx-2"/>          {/* mx-2 est une classe bootstrap qui définit les marges horizontales (de 0 à 6) - ici pour "aérer" l'icon de la camera */}
                <h6 className='inline'><Badge color="secondary">{ countWatchMovie }</Badge></h6>   {/* La doc reactStrap nous apprend que la taille d'un badge dépend directement des baises h? qui l'entourent. Ici <h6> pour la plus petite taille */}
              </div>                                                                                  {/* et par defaut les balises h imposent un retour à la ligne. Pour rester fidèle à la maquette, je lui passe un attribut className qui me sert à lui attribuer un classe et ainsi lui définir un display: inline dans la feuille de style Movie.css */}
              <div>
                Mon avis
                { myRatingStars }                     {/* Le tableau de 10 étoiles noires défini plus haut */}
                <h4 className='inline'>           {/* même principe que pour le 1er badge. Ici entourés de balises <h4> pour une taille plus grande. Et toujours besoin d'annuler le retour à la ligne par défaut de la balise h */}
                  <Badge onClick={() => handleRatingBtn(-1)} className="pointable" color="secondary">-</Badge>
                  <Badge onClick={() => handleRatingBtn(1)} className="pointable" color="secondary">+</Badge>
                </h4>
              </div>
              <div>
                Moyenne
                { NoteStars }                     {/* Le tableau de 10 étoiles jaunes puis noires défini plus haut */}
                ({ voteNumb })
              </div>
              <CardTitle className="mt-2" tag="h5">{ data.name }</CardTitle>
              <CardText>{ data.desc }</CardText>
            </CardBody>
          </Card>
        </Col>
  );
}


export default Movie;         // on exporte, par défaut, Movie pour l'utiliser dans App.js
