import React from 'react'
import ReactDom from 'react-dom'
import {Router, Route, hashHistory, Link, IndexRoute} from 'react-router'

let blogs = []
let blogCount = 0
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
                        <Link className="nav-link my-li" to="/home">Home <span
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

const homePage = `
        <h3>Welcome to Jci 's Blog!</h3>
        <blockquote class="blockquote">
            <p>This blog is for talk about programming. Personally, it 's special for <strong>javascript</strong>, <strong>HTML</strong>
                and <strong>CSS</strong> as also as <strong>clojure</strong>. Now this blog is deplog in github page, but
                finally, I will let it become a really personal blog (with database and back-end) with
                <strong>clojure</strong>, some code you cound find in github <a href="https://github.com/JciGi/JciBl"><em>“JciBl”</em></a>.<be/>
                If you interested in <strong>front-end</strong> develpment, there are some blog (<em>“Jci’s Blog”</em>)[<a
                href="http://google.com">google.com</a>] about it.<br/>
                As a newbie, maybe this blog is native tecknically, feedback for me,<strong>thank you</strong>!</p>
        </blockquote>`

const aboutPage=`
<h3>Who am I?</h3>
	<blockquote class="blockquote">
		<p>I am linjituan,this is my github <a href="https://www.google.com">jituan 's blog</a>,my wechat number is “linjituan520”,and my gmail is ‘jituanlin@gmail.com’,until now this blog is finish a little,welcome to feedback!</p>
	</blockquote>`
const Article = React.createClass({
    render(){
        return <div id="article" className="container article " dangerouslySetInnerHTML={this.props.content || this.props.route.content}>
        </div>
    }
})
const ArticleList = React.createClass({
    getInitialState(){
        return {
            groupList: (<p>load blog contents...</p>)
        }
    },
    hashHandler(){
        const getContent = () => {
            this.setState({
                groupList: <Article content={{__html: blogs[window.location.hash.substr(13).toString()]}}/>
            })
        }
        switch (window.location.hash) {
            case '#/blog':
                loadBlog('headUl', this.changeGroupList)
                break
            default:
                getContent()
        }
    },
    componentDidMount(){
        loadBlog('headUl', this.changeGroupList)
        window.addEventListener('hashchange', this.hashHandler)
    },
    componentWillUnmount(){
        window.removeEventListener('hashchange', this.hashHandler)
    },
    changeGroupList(contens){
        this.setState({
            groupList: contens
        })
    },
    render(){
        return this.state.groupList
    }
})
const Section = React.createClass({
    render(){
        return <div className="container section">
            {this.props.children}
        </div>
    }
})
const Head = React.createClass({
    render(){
        return <header>
            <Nav/>
        </header>
    }
})
const RootDiv = React.createClass({
    render(){
        return <div>
            <Head/>
            {this.props.children}
        </div>
    }
})

const getBlogRoute = () => {
    return <Route path='/blog' component={Section}>
        <IndexRoute component={ArticleList}/>
    </Route>
}
const MyRouter = React.createClass({
    render(){
        return <Router history={hashHistory}>
            <Route path='/' component={RootDiv}>
                <IndexRoute component={Article} content={{__html: homePage}}/>
                <Route path='home' component={Article} content={{__html: homePage}}/>
                {getBlogRoute()}
                <Route path='about' component={Article} content={{__html: aboutPage}}/>
            </Route>
        </Router>
    }
})
ReactDom.render(
    <MyRouter/>
    ,
    document.getElementById('root')
)
function loadBlog(queryType, callback) {
    const getHeads = () => blogs.map((x) => x.match(/^(.*)$/m)[0].match(/<h3>(.*?)<\/h3>/)[1])
    const getList = () => {
        return getHeads().map(
            (x, n) => <li className="list-group-item" key={n}><Link className='my-li' to={`blog/#blog_${n}`}>{x}</Link>
            </li>
        )
    }
    const loadBlogArray = () => {
        if (blogs.length === 0) {
            for (let i = 0; i < blogCount; i++) {
                let ajax = new XMLHttpRequest()
                ajax.onload = () => {
                    if (ajax.status === 200) {
                        blogs[i] = ajax.responseText
                        if (i === blogCount - 1) {
                            returnContents()
                        }
                    } else {
                        console.log(ajax.status)
                    }
                }
                ajax.open('GET', `doc/blog-${i}.html`, true)
                ajax.send(null)
            }
        } else {
            returnContents()
        }
    }
    const returnContents = () => {
        switch (queryType) {
            case 'headUl':
                let Result = React.createClass({
                    render(){
                        return <ul className="list-group">
                            {this.props.children}
                        </ul>
                    }
                })
                callback(<Result children={getList()}/>)
                break
            case 'blogHeadArray':
                callback(getHeads())
                break
        }
    }
    if (blogCount === 0) {
        let ajax = new XMLHttpRequest()
        ajax.onload = () => {
            if (ajax.status === 200) {
                blogCount = Number(ajax.responseText)
                loadBlogArray()
            } else {
                console.log(ajax.status)
            }
        }
        ajax.open('GET', 'doc/blog_count.js', true)
        ajax.send(null)
    } else {
        loadBlogArray()
    }
}

