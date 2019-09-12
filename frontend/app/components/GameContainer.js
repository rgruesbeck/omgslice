import { h, Component } from 'preact';
import GameOverlay from './GameOverlay';

const { p5 } = window;

class GameContainer extends Component {
	state = {
        visible: false,
		banner: Koji.config.settings.title,
		message: Koji.config.settings.instructions,
		startButton: Koji.config.settings.startButton,
		restartButton: '',
		viewLeaderBoardText: 'view leaderboard ->',
		submitScoreText: '',
		audio: true,
		score: 0,
		lives: 3
    };

    componentWillMount() {
        //Include all scripts here
        require('script-loader!app/utils.js');
        require('script-loader!app/sprite.js');
        require('script-loader!app/render.js');
        require('script-loader!app/index.js');

        document.body.style.backgroundColor = Koji.config.colors.backgroundColor;
        document.body.style.color = Koji.config.colors.primaryColor;
    }

    componentDidMount() {
        this.p5Game = new p5(null, document.getElementById('game-container'));

        this.audioCtx = window.getAudioContext();
        window.noLoop();

        window.setOverlay = state => { this.setState(state); }
    }

    componentWillUnmount() {
        window.remove();
    }

    startGame() {
        window.startGame();
    }

    restartGame() {
        window.location.reload();
    }
    
    toggleAudio() {
        if (this.audioCtx.state === 'running') {
            this.audioCtx.suspend()
            .then(() => {
                this.setAudio(this.audioCtx);
            });
        } else {
            this.audioCtx.resume()
            .then(() => {
                this.setAudio(this.audioCtx);
            });
        }
    }

    setAudio(ctx) {
        this.setState({
            audio: ctx.state === 'running' ? true : false
        })
    }

    viewLeaderBoard() {
		window.setAppView('leaderboard');
    }

    submitScore() {
		window.setScore(this.state.score);
		window.setAppView('setScore');
    }

    render() {
        return (
            <div id={'game-container'}>
                <GameOverlay
                    visible={this.state.visible}
                    score={this.state.score}
                    lives={this.state.lives}
                    banner={this.state.banner}
                    message={this.state.message}
                    startButton={this.state.startButton}
                    startGame={() => this.startGame()}
                    restartButton={this.state.restartButton}
                    restartGame={() => this.restartGame()}
                    audio={this.state.audio}
                    toggleAudio={() => this.toggleAudio()}
                    viewLeaderBoard={() => this.viewLeaderBoard()}
                    viewLeaderBoardText={this.state.viewLeaderBoardText}
                    submitScore={() => this.submitScore()}
                    submitScoreText={this.state.submitScoreText}
                />
            </div>
        );
    }
}

export default GameContainer;