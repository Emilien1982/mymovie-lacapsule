import React from 'react';
import '../App.css';
import { 
  Button,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  ButtonGroup,
 } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faStar, faVideo} from '@fortawesome/free-solid-svg-icons'

function Movie(props) {

  var tabGlobalRating = []
  for(var i=0;i<10;i++){
      var color = {}
      if(i<props.globalRating){
          color = {color: '#f1c40f'}
      }
      tabGlobalRating.push(<FontAwesomeIcon style={color} icon={faStar} /> )
  }

  return (
    <Col xs="12" lg="6" xl="4">
    <Card style={{marginBottom:30}}>
    <CardImg top src={props.movieImg} alt={props.movieName} />
    <CardBody>
        <p>Like <FontAwesomeIcon style={{cursor:'pointer'}} icon={faHeart} /></p>
        <p>Nombre de vues  <FontAwesomeIcon icon={faVideo} /> <Badge color="secondary">2</Badge></p>
        <p>Mon avis 
        <FontAwesomeIcon icon={faStar} /> 
        <FontAwesomeIcon icon={faStar} /> 
        <FontAwesomeIcon icon={faStar} /> 
        <FontAwesomeIcon icon={faStar} /> 
        <FontAwesomeIcon icon={faStar} /> 
        <FontAwesomeIcon icon={faStar} /> 
        <FontAwesomeIcon icon={faStar} /> 
        <FontAwesomeIcon icon={faStar} /> 
        <FontAwesomeIcon icon={faStar} /> 
        <FontAwesomeIcon icon={faStar} /> 

        <ButtonGroup size="sm">
            <Button color="secondary">-</Button>
            <Button color="secondary">+</Button>
        </ButtonGroup>
        </p>
        <p>Moyenne
        {tabGlobalRating}
        ({props.globalCountRating})
        </p>
  <CardTitle>{props.movieName}</CardTitle>
        <CardText>{props.movieDesc}</CardText>
    </CardBody>
    </Card>
    </Col>


  );
}

export default Movie;
