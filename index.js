"use strict";

// https://www.reddit.com/r/javascript/comments/332v73/is_anyone_using_es6_in_a_large_project_hows_it/cqh2u7i
import hex from 'hex-rgb';

const rgb = (str) => hex(str).map(x => x / 255);

import React from 'react';
import ReactDOM from 'react-dom';

// http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes
// stopgap until ES7 allows property initializers
// https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html
class BaseComponent extends React.Component {
	_bind(...methods) {
		methods.forEach((method) => this[method] = this[method].bind(this));
	}
}

// https://facebook.github.io/react/docs/two-way-binding-helpers.html
class NoLink extends BaseComponent {
	constructor(props) {
		super(props);
		this.state = {
			message: '#abde13',
			someStyle: {
				color: 'white',
				backgroundColor: '#C594C5'
			}
		};
		this._bind('handleChange');
	}

	handleChange(event) {
		this.setState({message: event.target.value, someStyle: {color: 'white', backgroundColor: event.target.value}});
	}

	render() {
		var message = this.state.message;
		return (
			<div>
				<input style={this.state.someStyle} type="text" value={message} onChange={this.handleChange}/>
				<input type="text" value={rgb(message)} readOnly/>
			</div>
		)
	}
}

ReactDOM.render(
	<NoLink txt="some text"/>,
	document.getElementById('app')
);


/* Raw react.js */

import ContactItem from './ContactItem';
import ContactForm from './ContactForm';
import ContactView from './ContactView';

/* Constants */

var CONTACT_TEMPLATE = {name: '', email: '', description: '', errors: null};

/* Actions */

function updateNewContact(contact) {
	setState({ newContact: contact });
}

function submitNewContact() {
	var contact = Object.assign({}, state.newContact, {key: state.contacts.length + 1, errors: {}});

	if(!contact.name) {
		contact.errors.name = ["Please enter your contact's name"];
	}

	if(!/.+@.+\..+/.test(contact.email)) {
		contact.errors.email = ["Please enter you contact's email"];
	}

	var changes = {newContact: contact};
	if (Object.keys(contact.errors).length === 0)
		Object.assign(changes, {contacts: state.contacts.concat(contact)});

	setState(changes);
}

function navigated() {
	var location = window.location.hash.replace(/^#\//, '').split('/');
	if(location[0] === '') removeHash();
	console.log(location);
	setState({location: location});
}

// http://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-with-javascript-without-page-refresh/5298684#5298684
function removeHash() {
	window.history.replaceState('', document.title, window.location.pathname);
}

/* Model */

var state = {};

function setState(changes) {
	Object.assign(state, changes);

	var component;

	switch(state.location[0]) {
		case 'addcontact':
			component = React.createElement(ContactView, Object.assign({}, state, {
				onNewContactChange: updateNewContact,
				onNewContactSubmit: submitNewContact
			}));
			break;
		default:
			component = <h1>Home</h1>;
	}

	ReactDOM.render(component, document.querySelector('#raw-reactjs'));
}

setState({
	contacts: [
		{key: 1, name: 'John Doe', email: 'john.doe@example.com', description: 'Some guy'},
		{key: 2, name: 'Joe Pesci', email: 'joe.pesci@example.com'},
		{key: 3, name: 'Bigfoot Silva'}
	],
	newContact: Object.assign({}, CONTACT_TEMPLATE),
	location: window.location.hash
});

window.addEventListener('hashchange', navigated);
