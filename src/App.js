import React, { useState } from 'react'
import { Redirect, Switch, Route, Link, useHistory, useRouteMatch } from "react-router-dom"
import { Table, Form, Button, Alert, Navbar, Nav } from 'react-bootstrap'

const Home = () => (
  <div> 
    <h2>Notes app</h2> 
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p> 
  </div>
)

// Note component can access the url parameter using the useParams function
// How can we make it so we only pass in the one note we need?

const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}

const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2>
    <Table striped>
      <tbody>
        {notes.map(note =>
          <tr key={note.id}>
            <td>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
            </td>
            <td>
              {note.user}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>
)


const Users = () => (
  <div>
    <h2>TKTL notes app</h2>
    <ul>
      <li>Joshua Ong</li>
      <li>Matti Luukkainen</li>
      <li>John Smith</li>
      <li>Jane Doe</li>
    </ul>
  </div>
)

const Login = (props) => {
  // Component can access a history object which can be used to modify the browser's url programmatically
  const history = useHistory()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('ongjoshu')
    // The push call causes the browser's url to change to '/' and the app renders the corresponding component Home
    history.push('/')
  }

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type='text'
            name='username'
          />
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type='password'
          />
          <Button variant='primary' type='submit'>Login</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

/* Normally, browser loads a new page when URL changes, but with help from HTML5 history API, BrowserRouter
enables us to use the URL in the address bar of the browser for internal "routing" in a React app
Even if the URL in the address bar changes, the content is only manipulated using JS and the browser will not load new content from server
*/

// Inside the router, we define links that modify the address bar
// Components renders based on URL are defined with the help of Route component
// We wrap the components to be rendered based on the URL with a Switch component (renders the first component whose path matches)
// Order is important (never put "/" as the first route since every path will match to it)

// We define parameterized urls similar to how we do in Express 

const App = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'HTML is easy',
      important: true,
      user: 'Matti Luukkainen'
    },
    {
      id: 2,
      content: 'Browser can execute only Javascript',
      important: false,
      user: 'Matti Luukkainen'
    },
    {
      id: 3,
      content: 'Most important methods of HTTP-protocol are GET and POST',
      important: true,
      user: 'Joshua Ong'
    }
  ])

  const [user, setUser] = useState(null) 
  const [message, setMessage] = useState(null)

  const login = (user) => {
    setUser(user)
    setMessage(`welcome ${user}`)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
  }

  const padding = {
    padding: 5
  }

  const match = useRouteMatch('/notes/:id')
  const note = match 
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  // In Bootstrap, all contents of the application are typically rendered inside a container
  // We accomplish this by giving the root div element the container class attribute
  return (
    <div className="container">
      {(message && <Alert variant='success'>
        {message}
      </Alert>
      )}
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/">home</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/notes">notes</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">users</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user
                ? <em style={padding}>{user} logged in</em>
                : <Link style={padding} to="/login">login</Link>
              }
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Switch>
        <Route path="/notes/:id">
          <Note note={note} />
        </Route>
        <Route path="/notes">
          <Notes notes={notes} />
        </Route>
        <Route path="/users">
          {user ? <Users /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          <Login onLogin={login} />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      <div>
        <br />
        <em>Note app, Joshua Ong 2021</em>
      </div>
    </div>
  )
}

export default App