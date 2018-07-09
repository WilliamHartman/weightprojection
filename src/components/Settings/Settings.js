import React, { Component } from 'react';
import './Settings.css';
import { getUserData } from './../../redux/reducer';
import { withRouter } from "react-router";
import { connect } from "react-redux";


class Settings extends Component {
    constructor(props){
        super(props)

        this.state = {

        }
    }

    componentDidMount = () => {
        if(!this.props.user.user_id){
            console.log('Not authorized. Redirecting to Login page.')
            this.props.history.push('/login');
        }
    }
    
    

    render (){
        console.log('settings for user: ', this.props.user)
        return (
            <div className="Settings">
                Settings
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.reducer.user
    }
  }
  
  export default withRouter(connect(mapStateToProps, { getUserData })(Settings));