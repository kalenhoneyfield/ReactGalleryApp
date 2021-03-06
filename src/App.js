import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import axios from 'axios'

// component imports
import PhotoContainer from './components/PhotoContainer'
import MainPage from './components/MainPage'
import SearchByRoute from './components/SearchByRoute'
import FourOhFour from './components/FourOhFour'
import FrontPageContainer from './components/FrontPageContainer'

//import small list of nouns
import nouns from './components/wordlist/wordList'

//import apiKey
import api_key from './config'

import './App.css';

//requirements for the project ask for the key to be in a config file
const APIKEY = process.env.REACT_APP_API_KEY || api_key
class App extends Component{

  constructor() {
    super();
    this.state = {
      photos: [],
      searchWord: '',
      dynTags: [],
      tags: '',
      date: ''
    }
  } 

  componentDidMount() {
    this.generateDynTags() 
  }

  performSearch = (query = `kittens`, pageNum = 1, perPage = 1) => {
    axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${APIKEY}&tags=${query}&per_page=${perPage}&page=${pageNum}&format=json&nojsoncallback=1`)
    .then(response => {
      this.setState({
        photos: response.data.photos.photo,
        searchWord: query
      })
      console.log('A Request to the API was just made')
    })
    .catch(error => {
      console.log('Error fetching and parsing data', error);
    })
  }

  //using a noun list, lets get three random words and use them for our tags
  generateDynTags = () => {
    const list = [ nouns[ Math.floor(Math.random() * nouns.length)], nouns[ Math.floor(Math.random() * nouns.length)], nouns[ Math.floor(Math.random() * nouns.length)] ]

    this.setState({
      dynTags: list
    })
  }

  //handle the pushing of the history
  handleHistoryPush = (path) => {
    this.props.history.push({
      pathname: path,
      state: { tag: path }
      })
  }

/*
  Render a default route, preferably a single picture to start with
  Set up 3+ routes for some simple easy click to display searches
  Allow for arbitrary search queries
  On no results, render a no results route
  On a 404 route render a 404 page
    Quandary : Should all routes be treated as a search query? Thus negating a 404? 
      Benefits: users can search by URL and bookmark arbitrarily 
      Cons: more technically savvy users may be confused
 */
  render(){
    return (
      <BrowserRouter>
        <div className="container">

          <MainPage 
            performSearch={this.performSearch} 
            dynTags={this.state.dynTags} 
            searchWord={this.state.searchWord} 
            history={this.props.history}
            handleHistoryPush={this.handleHistoryPush}
            />
    
            <Switch>
              <Route 
                exact
                path="/"
                render={ () => <FrontPageContainer /> }
              />
              <Route 
                path="/tags/:tag"
                render={ props => <SearchByRoute {...props} photos={this.state.photos} performSearch={this.performSearch} searchWord={this.state.searchWord}/> }
              />
              <Route 
                path="/search/:tag"
                render={ props => {
                  return <SearchByRoute {...props} photos={this.state.photos} performSearch={this.performSearch} searchWord={this.state.searchWord} />
                } }
              />
              {/* <Route 
                path="/search/:tag"
                render={ () => <PhotoContainer photos={this.state.photos}/> }
              /> */}
              <Route 
                render={ () => <FourOhFour /> }
              />
            </Switch>
    
        </div>
      </BrowserRouter>
    )
  }
  
}

export default App;
