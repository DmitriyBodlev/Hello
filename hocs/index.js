import * as R from 'ramda'
import firebase from "firebase";
import React, { PureComponent } from 'react'
///////////////////////////////////////////////////////////////////////////////////////////////////

const config = {
  apiKey: "AIzaSyCe6bMo9cVfby4sOdLNSbDeYNO82s5Flsw",
  authDomain: "skoropys-9de8c.firebaseapp.com",
  databaseURL: "https://skoropys-9de8c.firebaseio.com",
  projectId: "skoropys-9de8c",
  storageBucket: "skoropys-9de8c.appspot.com",
  messagingSenderId: "929737833861"
};

export const withFirebase = BaseComponent =>
  class extends PureComponent {
    constructor (props) {
      super(props)
      this.state = {
        fire: null,
        auth: null,
        db: null,
        storage: null,
      }
    }
    componentWillMount() {
      let fire = firebase;
      if (!firebase.apps.length) {
        fire = firebase.initializeApp(config);
      }
      const state = {
        fire,
        auth: fire.auth(),
        db: fire.database(),
        storage: R.is(Function, fire.storage) && firebase.storage(),
      }
      this.setState(state)
    }
    render () {
      const newProps = {
        db: this.state.db,
        fire: this.state.fire,
        auth: this.state.auth,
        storage: this.state.storage,
      }
      return <BaseComponent {...this.props} {...newProps} />
    }
  }

export default withFirebase
