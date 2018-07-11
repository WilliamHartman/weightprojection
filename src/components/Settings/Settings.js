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
    
    fitbitConnected = () => {
        if(this.props.fitbit_connected){
            return 'Y'
        } else {
            return 'N'
        }
    }

    render (){
        console.log('settings for user: ', this.props.user)
        return (
            <div className="Settings">
                <div className="settings-name">{this.props.user.given_name} {this.props.user.family_name}</div>
                <div className="settings-fitbit-container">
                    <div className="settings-fitbit-title">Fitbit Connection</div>
                    <div className="settings-fitbit-middle">
                        <div className="settings-fitbit-connected">Connected: </div>
                        <div className="settings-fitbit-check">{this.fitbitConnected()}</div>
                    </div>
                </div>
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