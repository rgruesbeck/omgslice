import { h, Component } from 'preact';
import WebFont from 'webfontloader';
import GameContainer from './GameContainer';
import Leaderboard from './Leaderboard';
import SetScore from './SetScore';

export default class App extends Component {
	state = {
		score: 0,
		view: 'game',
	};

	style = {
		fontSize: `calc(16px + 1vw)`,
		fontFamily: Koji.config.settings.fontFamily
	}

    componentWillMount() {
		WebFont.load({
			google: {
				families: [Koji.config.settings.fontFamily]
			}
		});
	}

	componentDidMount() {
		window.setAppView = view => { this.setState({ view }); }
		window.setScore = score => { this.setState({ score }); }
	}

	render() {
		if (this.state.view === 'game') {
			return (
				<div style={this.style}>
					<GameContainer />
				</div>
			)
		}
		if (this.state.view === 'setScore') {
			return (
				<div style={this.style}>
					<SetScore score={this.state.score} />
				</div>
			)
		}
		if (this.state.view === 'leaderboard') {
			return (
				<div style={this.style}>
					<Leaderboard />
				</div>
			)
		}
		return null;
	}
}
