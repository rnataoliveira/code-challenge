import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import spinner from '../spinner.svg'

class PersonsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      loading: false
    }
  }

  // Component Will Mount, then, when it's mounted it will do the fetch API
  componentDidMount() {
    this.setState({
      loading: true
    })

    fetch(`${process.env.REACT_APP_API}/persons`, {
      headers: {
        Authorization: `Bearer ${this.props.idToken}`
      }
    })
      .then(response => response.json())
      .then(persons => {
        this.setState({
          persons,
          loading: false
        })
      })
      .catch(error => console.error(`Fetch Error =\n`, error))
  }

  render() {
    return (
      <div>
        <h1 className="mt-5">Registered Persons</h1>
        <div className="row">
          {this.state.loading &&
            <div className="col text-center mt-5">
              <img src={spinner} width="150px" alt="Loading Spinner" />
            </div>}
          {!this.state.loading && this.state.persons.map((p, index) => (
            <div className="col-lg-4 col-md-6 mt-4" key={index}>
              <div className="card">
                <div className="card-body">
                  <div className="text-center">
                    <img className="rounded-circle" src={p.photo} width="80px" height="80px" alt="Person Avatar" />
                  </div>
                  <h5 className="card-title text-center mt-2">
                    {p.name}, <span className="text-muted">{p.age}</span>
                  </h5>
                  <div className="text-center">
                    <Link className="btn btn-outline-primary mr-2" to={`/persons/${p.id}`}>Details</Link>
                  </div>
                </div>
                <div className="card-footer">
                  <p className="card-text"><strong>{p.vaccinesCount}</strong> Vaccines</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  idToken: state.oidc.user.id_token
})

export default connect(mapStateToProps)(withRouter(PersonsList))