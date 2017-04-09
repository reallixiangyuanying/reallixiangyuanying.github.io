import React from 'react'
import { Link} from 'react-router-dom'
const Nav = React.createClass({
    brandStyle: {
        color: "#a29e9e"
    },
    render(){
        return <nav className="navbar navbar-toggleable-md navbar-light bg-faded ">
            <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <a className="navbar-brand" href="#"><i style={this.brandStyle}>Jituan 's Blog</i></a>
            <div className="collapse navbar-collapse mx-auto " id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item ">
                        <Link className="nav-link my-li" to="/">Home <span
                            className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link my-li" to="/blog">Blog</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link my-li" to="/about">About</Link>
                    </li>
                </ul>
            </div>
        </nav>
    }
})


module.exports=Nav
