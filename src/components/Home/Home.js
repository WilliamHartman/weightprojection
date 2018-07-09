import React, { Component } from 'react';
import './Home.css';
import { getUserData } from './../../redux/reducer';
import { withRouter } from "react-router";
import { connect } from "react-redux";


class Home extends Component {
    constructor(props){
        super(props)

        this.state = {

        }
    }

    componentDidMount = () => {
        if(!this.props.user.user_id){
            console.log('Not authorized. Redirecting to Login page.')
            this.props.history.push('/login');
        } else {
            this.props.history.push('/dashboard');
        }
    }
    
    

    render (){
        console.log('Home for user: ', this.props.user)
        return (
            <div className="Home">
                Home
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.reducer.user
    }
  }
  
  export default withRouter(connect(mapStateToProps, { getUserData })(Home));