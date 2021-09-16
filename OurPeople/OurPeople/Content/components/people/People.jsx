import React from 'react';
import PropTypes from 'prop-types';
import * as Reactstrap from 'reactstrap';

export function PeopleList(props) {
	let [state, updateState] = React.useState({
		people: props.initialPeople,
		page: props.page,
		hasMore: true,
		loadingMore: false,
	});

	function loadMoreClicked(evt) {
		let nextPage = state.page + 1;
		let people = state.people;
		updateState(prevState => ({
			...prevState,
			page: nextPage,
			loadingMore: true,
		}));

		let url = '/people/page-' + (state.page + 1);
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.onload = () => {
			let data = JSON.parse(xhr.responseText);
			updateState(prevState => ({
				...prevState,
				people: people.concat(data.people),
				hasMore: data.hasMore,
				loadingMore: false,
			}));
		};
		xhr.send();
		evt.preventDefault();
	}

	let peopleNodes = state.people.map(staff => (
		<Staff data={staff}>{staff.text}</Staff>
	));

	function renderMoreLink() {
		if (state.loadingMore) {
			return <em>Loading...</em>;
		} else if (state.hasMore) {
			return (
				<Reactstrap.Button onClick={loadMoreClicked}>
					Load More
				</Reactstrap.Button>
			);
		} else {
			return <em>No more people</em>;
		}
	}

	return (
		<div>
			<p className="lead">
				This is an example of ReactJS.NET's server-side rendering. The
				initial state of this people list is rendered server-side, and
				additional data is loaded via AJAX and rendered client-side.
			</p>
			<div className="people">
				<h1>Our People</h1>
				<ol className="peopleList">{peopleNodes}</ol>
				{renderMoreLink()}
				<hr />
			</div>
		</div>
	);
}

class Staff extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
	};

	render() {
		return (
			<li>
				<Avatar data={this.props.data} />
				<strong>{this.props.data.name}</strong>
				{': '}
				{this.props.children}
			</li>
		);
	}
}

class Avatar extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
	};

	render() {
		return (
			<img
				src={this.getPhotoUrl(this.props.data)}
				alt={'Photo of ' + this.props.data.name}
				width={50}
				height={50}
				className="staffPhoto mr-1"
			/>
		);
	}

	getPhotoUrl = data => {
		return (
			'https://avatars.githubusercontent.com/' +
			data.githubUsername +
			'?s=50'
		);
	};
}
