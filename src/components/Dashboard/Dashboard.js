import React, { Component } from 'react';
import './Dashboard.css';
import { getUserData } from './../../redux/reducer';
import { withRouter } from "react-router";
import { connect } from "react-redux";


class Dashboard extends Component {
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
        return (
            <div className="Dashboard">
                Dashboard
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.reducer.user
    }
  }
  
  export default withRouter(connect(mapStateToProps, { getUserData })(Dashboard));