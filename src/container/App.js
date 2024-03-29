import React, {Component} from 'react';
import Navigation from "../components/Navigation/Navigation";
import Logo from "../components/Logo/Logo";
import ImageLinkForm from "../components/ImageLinkForm/ImageLinkForm";
import Rank from "../components/Rank/Rank";
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";
import SignIn from "../components/SignIn/SignIn";
import Register from "../components/Register/Register";
import Particles from 'react-particles-js';
import './App.css';

const particleOptions ={
  particles: {
    number:{
      value:50,
      density: {
        enable:true,
        value_area:800
      }
    }
  }
}

const initialState={
        input: '',
        imageURL: '',
        box:{},
        route:'SignIn',
        isSigned: false,
        user:{
              id: "",
              name: "",
              email:"",
              password: "",
              entries: 0,
              joined: ""
          }
}

class App extends Component {

constructor(){
   super();
   this.state= initialState;
  }

   loadUser=(data)=>{
    this.setState({user:
      {
      id:data.id,
      name:data.name,
      email:data.email,
      password:data.password,
      entries: data.entries,
      joined: data.joined
     }
    })
  }  
 
onInputChange=(event)=>{
  this.setState({input: event.target.value});
}

calculateFaceLocation =(data)=>{
  const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box
  const image= document.getElementById("inputImage");
  const width=Number(image.width);
  const height= Number(image.height);
  console.log(width, height);
  return {
    leftCol :clarifaiFace.left_col * width,
    topRow : clarifaiFace.top_row *height,
    rightCol:  width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row *height)
  }
}

displayBoundingBox =(box) =>{
  this.setState({box:box});
}

onButtonDetect =(event)=>{
  this.setState({imageURL:this.state.input});
  fetch(" https://guarded-beyond-11751.herokuapp.com/ImageURL", 
  {
    method:"post",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
    input:this.state.input
    })
  })
  .then(response => response.json())
  .then(response =>{
    if (response){
      fetch("https://guarded-beyond-11751.herokuapp.com/Image", {
      method:"put",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
      id:this.state.user.id
      })
      })
      .then(response =>response.json())
      .then(count =>{
        this.setState(Object.assign(this.state.user,{
          entries: count,
        }))
      })
      .catch(console.log);
      }
    this.displayBoundingBox(this.calculateFaceLocation(response));
  })
  .catch(err => console.log(err));
}

onRouteChange = (route, isSigned) =>{
  if (route ==="home"){
    this.setState({isSigned:true})
  }
  else if  (route ==="SignOut"){
    this.setState(initialState);
 }
  this.setState({route: route});
}

render(){
  return(
    <div className="App">
    <Particles className="particles" params={particleOptions}/>
    <Navigation isSigned={this.state.isSigned} onRouteChange={this.onRouteChange}/>
    {this.state.route==='SignIn'?
      <SignIn  loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      : this.state.route==='home'?
      <div>
      <Logo />
      <Rank name={this.state.user.name} entries={this.state.user.entries}/>
      <ImageLinkForm onInputChange={this.onInputChange} onButtonDetect={this.onButtonDetect}/>
      <FaceRecognition box={this.state.box} imageURL={this.state.imageURL}/>
      </div>
      :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
    }
    </div>)

}
}
export default App;
