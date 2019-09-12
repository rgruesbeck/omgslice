import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import Koji from '@withkoji/vcc';

class SetScore extends Component {
    static propTypes = {
        score: PropTypes.number,
    };

    state = {
        email: '',
        name: '',
        isSubmitting: false,
    };

    componentDidMount() {
        //Activated with a delay so it doesn't lose focus immediately after click
        setTimeout(function () {
            this.nameInput.focus();
        }.bind(this), 100);

    }

    handleClose = () => {
        window.setAppView("game");
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.name != "") {
            this.setState({ isSubmitting: true });

            const body = {
                name: this.state.name,
                score: this.props.score,
                privateAttributes: {
                    email: this.state.email,
                },
            };

            fetch(`${Koji.config.serviceMap.backend}/leaderboard/save`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
                .then((response) => response.json())
                .then((jsonResponse) => {
                    console.log(jsonResponse);

                    window.setAppView('leaderboard');
                })
                .catch(err => {
                    console.log(err);
                });

        }
    }

    render() {
        return (
            <div style={{ position: "absolute", backgroundColor: Koji.config.colors.backgroundColor, width: "100vw", height: "100vh" }}>
                <div className="title"
                    style={{ color: Koji.config.colors.primaryColor }}>
                    {"Submit To Leaderboard"}
                </div>

                <div id={'leaderboard-set-score'} style={{ backgroundColor: Koji.config.colors.primaryColor, borderColor: Koji.config.colors.primaryColor }}>
                    <form
                        id={'score-form'}
                        onSubmit={this.handleSubmit}
                    >
                        <div className={'input-wrapper'}>
                            <label className={'label'} style={{ color: Koji.config.colors.tertiaryColor }}>
                                {"Score"}
                            </label>
                            <input
                                disabled
                                value={this.props.score}
                                style={{ color: Koji.config.colors.tertiaryColor, borderColor: Koji.config.colors.tertiaryColor }}
                            />
                        </div>

                        <div className={'input-wrapper'}>
                            <label className={'label'} style={{ color: Koji.config.colors.tertiaryColor }}>
                                {"Name"}
                            </label>
                            <input
                                onChange={(event) => {
                                    this.setState({ name: event.target.value });
                                }}
                                type={'text'}
                                value={this.state.name}
                                style={{ color: Koji.config.colors.tertiaryColor, borderColor: Koji.config.colors.tertiaryColor }}
                                ref={(input) => { this.nameInput = input; }}
                            />
                        </div>

                        {Koji.config.settings.emailInputEnabled ?
                            <div className={'input-wrapper'}>
                            <label style={{ color: Koji.config.colors.primaryColor }}>{'Your Email Address (Private)'}</label>
                            <input
                                onChange={(event) => {
                                    this.setState({ email: event.target.value });
                                }}
                                type={'email'}
                                value={this.state.email}
                                style={{ color: Koji.config.colors.primaryColor, borderColor: Koji.config.colors.primaryColor }}
                            />
                        </div>
                        :<span></span>}

                        <button
                            disabled={this.state.isSubmitting}
                            onClick={this.handleSubmit}
                            type={'submit'}
                            style={{ color: Koji.config.colors.primaryColor, backgroundColor: Koji.config.colors.tertiaryColor, cursor: 'pointer' }}
                        >
                           {this.state.isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </form>

                    <button className="dismiss-button"
                        onClick={this.handleClose}
                        style={{ color: Koji.config.colors.primaryColor, backgroundColor: Koji.config.colors.tertiaryColor, cursor: 'pointer' }}>
                        {"Cancel"}

                    </button>


                </div>
            </div>
        )
    }
}

export default SetScore;
