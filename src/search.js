import React from "react";
import { connect } from "react-redux";
import { searchUsers } from "./actions";
import { Link } from "react-router-dom";

class Search extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        console.log("user input in search: ", e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.dispatch(searchUsers(this.state.search));
    }

    render() {
        let results;

        if (this.props.noResults) {
            results = (
                <div id="results">
                    <h3>Apparently there's nobody here :-(</h3>Unfortunatly your
                    search for '{this.state.search}' returned no result.
                </div>
            );
        } else {
            results = (
                <div id="results">
                    {this.props.searchResults &&
                        this.props.searchResults.map((userSearch, index) => {
                            return (
                                <div key={index} className="other-users">
                                    <img
                                        className="friends-pic"
                                        src={
                                            userSearch.image ||
                                            "/images/placeholder.png"
                                        }
                                    />
                                    <h3>
                                        {userSearch.first} {userSearch.last}
                                    </h3>
                                    <Link to={`/user/${userSearch.id}`}>
                                        Visit {userSearch.first}{" "}
                                        {userSearch.last}'s profile
                                    </Link>
                                </div>
                            );
                        })}
                </div>
            );
        }

        return (
            <div className="content-component">
                <h1>Search for other people</h1>
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        type="text"
                        name="search"
                    />
                    <button>search</button>
                </form>
                {results}
            </div>
        );
    }
}

function mapStateToProps(state) {
    var resultsFromUserSearch = state.resultsFromUserSearch;
    var noResults = state.noResults;
    return {
        searchResults: resultsFromUserSearch,
        noResults: noResults
    };
}

export default connect(mapStateToProps)(Search);
