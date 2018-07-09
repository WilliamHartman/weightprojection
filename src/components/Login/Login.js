import React, { Component } from 'react';
import './Login.css';
import { getUserData } from './../../redux/reducer';
import { withRouter } from "react-router";
import { connect } from "react-redux";


class Login extends Component {
    constructor(props){
        super(props)

        this.state = {

        }
    }

    componentDidMount = () => {

    }

    render (){
        return (
            <div className="Login">
                Login
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.reducer.user
    }
  }
  
  export default withRouter(connect(mapStateToProps, { getUserData })(Login));