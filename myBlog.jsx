import React from 'react'
import ReactDom from 'react-dom'
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom'
import Nav from "./component.jsx"
let blogs = []
let lock = false
let callbacks = []

const Aa=React.createClass({
    render(){
        return <ul className="list-group">
            {this.props.children}
        </ul>
    }
})

const ArticleList = React.createClass({
    changeToGroupList(blogs){
        const heads = blogs.map((x) => x.match(/^(.*)$/m)[0].match(/<h3>(.*?)<\/h3>/)[1])
        const headList = heads.map(
            (head) => <li className="list-group-item" key={head}><Link className='my-li'
                                                                       to={`blog/${head}`}>{head}</Link>
            </li>)
        let Result = React.createClass({
            render(){
                return <Switch>
                    <Route exact path="/blog" render={
                        ()=><Aa children={this.props.children}/>
                    }>

                    </Route>
                    {heads.map(
                        (head, n) => <Route key={head} path={`/blog/${head}`}
                                            render={
                                                () => {
                                                    return <Article
                                                        getContentPromise={loadSinglePagePromise(`/doc/blogs/blog_${n}.html`)}
                                                        notContainer={true}
                                                    />
                                                }
                                            }
                        />
                    )}
                </Switch>
            }
        })
        this.setState({
            content: <Result children={headList}/>
        })
    },
    getInitialState(){
        return {
            content: (<p>loading blog contents...</p>)
        }
    },
    componentDidMount(){
        loadBlog(this.changeToGroupList)
    },
    render(){
        return <div className="container">
            {this.state.content}
        </div>
    }
})

const Article = React.createClass({
    getInitialState(){
        return {
            content: "loading..."
        }
    },
    changeContent(){

        this.props.getContentPromise
            .then(
                (contentString) => {
                    this.refs["contentDiv"].innerHTML = contentString
                }
            )

    },
    componentDidMount(){
        this.changeContent()
    },
    render(){
        return <div ref="contentDiv" id="article" className={this.props.notContainer?"article":"article container"}>
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
const homeUrl = "doc/blogs/home_page.html"
const aboutUrl = "doc/blogs/about_page.html"

const MyRouter = React.createClass({
    render(){
        return <BrowserRouter>
            <RootDiv>
                <Switch>
                    <Route exact path="/" render={() => <Article getContentPromise={loadSinglePagePromise(homeUrl)}/>}/>
                    <Route path='/about' render={() => <Article2 getContentPromise={loadSinglePagePromise(aboutUrl)}/>}/>
                    <Route path='/blog'
                           render={() =>{
                               return <ArticleList />}
                           }
                               />
                </Switch>
            </RootDiv>
        </BrowserRouter>
    }
})
class Article2 extends Article{}
ReactDom.render(
    <MyRouter/>,
    document.getElementById('root')
)
function loadBlog(callback) {
    if (lock === false && blogs.length !== 0) {
        callback(blogs)
        return
    }
    callbacks.push(callback)
    if (lock === false) loadOneBlog(0)
    function loadOneBlog(index) {
        lock = true
        new Promise(
            (resolve, reject) => {
                let ajax = new XMLHttpRequest()
                ajax.onload = () => {
                    if (ajax.status === 200) {
                        blogs.push(ajax.responseText)
                        resolve(index + 1)
                    } else {
                        reject(blogs)
                    }
                }
                ajax.open('GET', `doc/blogs/blog_${index}.html`, true)
                ajax.send(null)
            }
        )
            .then(
                index => loadOneBlog(index),
                blogs => {
                    callbacks.forEach(
                        (callback) => callback(blogs)
                    )
                    lock = false
                }
            )
    }
}

function loadSinglePagePromise(url) {
    return new Promise(
        (resolve, reject) => {
            let ajax = new XMLHttpRequest()
            ajax.onload = () => {
                if (ajax.status === 200) {
                    resolve(ajax.responseText)
                } else {
                    reject(ajax.status)
                }
            }
            ajax.open('GET', url, true)
            ajax.send(null)
        }
    )
}