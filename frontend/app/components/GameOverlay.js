import { h, Component } from 'preact';

export default class GameOverlay extends Component {
	state = {
        prevScore: 0
    };

    style = {
        container: {
            width: `100%`,
            position: `absolute`,
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            justifyContent: `center`,
            backgroundColor: `rgba(0,0,0,0)`,
            color: Koji.config.colors.primaryColor,
            fontSize: `calc(16px + 1vw)`,
            fontFamily: Koji.config.settings.fontFamily,
            textShadow: `2px 2px ${Koji.config.colors.secondaryColor}`,
            userSelect: `none`,
            transition: `opacity 1.5s`
        },
        row: {
            display: `flex`,
            flexDirection: `row`,
            justifyContent: `space-between`,
            width: `100%`,
        },
        text: {
            width: `100%`,
            marginTop: `0.25em`,
            paddingLeft: `0.25em`,
            paddingRight: `0.25em`
        },
        icon: {
            position: `absolute`,
            right: `0.25em`,
            fontSize: `1.5em`,
            padding: `5px`,
            backgroundColor: `${Koji.config.colors.tertiaryColor}`,
            borderRadius: `2em`,
            boxShadow: `0px 20px 40px -20px rgba(0,0,0,0.75)`,
            cursor: `pointer`
        },
        message: {
            fontSize: `1.25em`,
            textAlign: `center`,
            marginTop: `1vh`,
            marginBottom: `1vh`
        },
        banner: {
            fontSize: `15vw`,
            marginTop: `10vh`,
            marginBottom: `1vh`,
            textShadow: `4px 4px ${Koji.config.colors.secondaryColor}`,
        },
        button: {
            fontSize: `calc(1.5em + 2vw)`,
            backgroundColor: Koji.config.colors.tertiaryColor,
            margin: `2vh`,
            padding: `0.5em 1em`,
            borderRadius: `2em`,
            textShadow: `4px 4px ${Koji.config.colors.secondaryColor}`,
            boxShadow: `0px 20px 40px -20px rgba(0,0,0,0.75)`,
            cursor: `pointer`
        }
    }

	render() {

        return (
            <div id={'game-overlay'} style={{...this.style.container, ...{ opacity: this.props.visible ? 1 : 0 }}}>
                <div style={this.style.row}>
                    <div style={this.style.text}>Score: {this.props.score}</div>
                    <div style={this.style.text} onClick={this.props.toggleAudio}>
                        <i style={this.style.icon} class="material-icons">
                            { this.props.audio ? 'volume_up' : 'volume_off' }
                        </i>
                    </div>
                </div>
                <div style={this.style.row}>
                    <div style={this.style.text}>Lives: {this.props.lives}</div>
                </div>
                <div style={this.style.banner}>{this.props.banner}</div>
                <div style={this.style.message} dangerouslySetInnerHTML={{
                    __html: this.props.message
                }} />
                {
                    this.props.startButton &&
                     <div
                        style={this.style.button}
                        onClick={this.props.startGame}>
                        {this.props.startButton}
                     </div>
                }
                {
                    this.props.restartButton &&
                     <div
                        style={this.style.button}
                        onClick={this.props.restartGame}>
                        {this.props.restartButton}
                     </div>
                }
                <div style={{...this.style.message, ...{ cursor: `pointer` }}} onClick={this.props.viewLeaderBoard}>{this.props.viewLeaderBoardText}</div>
                <div style={{...this.style.message, ...{ cursor: `pointer` }}} onClick={this.props.submitScore}>{this.props.submitScoreText}</div>
            </div>
        );
	}
}