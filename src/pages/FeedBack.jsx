import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';

class FeedBack extends Component {
  constructor() {
    super();
    this.state = {
      getHash: '',
      score: 0,
      assertions: 0,
      message: '',
    };
    this.fetchGravatarApi = this.fetchGravatarApi.bind(this);
    this.getPlayer = this.getPlayer.bind(this);
    this.messageAssertion = this.messageAssertion.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRankingClick = this.handleRankingClick.bind(this);
  }

  componentDidMount() {
    const { email } = this.props;
    this.fetchGravatarApi(email);
    this.getPlayer();
  }

  getPlayer() {
    const objectState = JSON.parse(localStorage.getItem('state'));
    const { score, assertions } = objectState.player;
    this.setState({
      score,
      assertions,
    });
    this.messageAssertion(assertions);
  }

  messageAssertion(assertions) {
    const THREE = 3;

    if (assertions < THREE) {
      this.setState({ message: 'Podia ser melhor...' });
    }
    if (assertions >= THREE) {
      this.setState({ message: 'Mandou bem!' });
    }
  }

  fetchGravatarApi(email) {
    const hash = md5(email).toString();
    this.setState({
      getHash: `https://www.gravatar.com/avatar/${hash}`,
    });
  }

  handleClick() {
    const { history } = this.props;
    history.push('/');
  }

  handleRankingClick() {
    const { getHash } = this.state;
    const { history } = this.props;
    const playerStorage = JSON.parse(localStorage.getItem('state'));
    const { name, score } = playerStorage.player;
    const newRanking = {
      name,
      score,
      picture: getHash,
    };
    if (localStorage.getItem('ranking')) {
      const rankingStorage = JSON.parse(localStorage.getItem('ranking'));
      rankingStorage.push(newRanking);
      localStorage.setItem('ranking', JSON.stringify(rankingStorage));
    } else {
      localStorage.setItem('ranking', JSON.stringify([newRanking]));
    }

    history.push('/ranking');
  }

  render() {
    const { name } = this.props;
    const { getHash, score, message, assertions } = this.state;

    return (
      <div>
        <header>
          <h3 data-testid="feedback-text">{ message }</h3>
          <img
            src={ getHash }
            alt="Foto de perfil do usuário"
            data-testid="header-profile-picture"
          />
          <p data-testid="header-player-name">{ name }</p>
          <p data-testid="header-score">{ score }</p>
        </header>
        <section>
          <p data-testid="feedback-total-score">{ score }</p>
          <p data-testid="feedback-total-question">{ assertions }</p>
        </section>
        <button
          type="button"
          data-testid="btn-play-again"
          onClick={ this.handleClick }
        >
          Jogar novamente
        </button>
        <button
          type="button"
          data-testid="btn-ranking"
          onClick={ this.handleRankingClick }
        >
          Ver Ranking
        </button>
      </div>
    );
  }
}

FeedBack.propTypes = {
  email: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  name: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.login.name,
  email: state.login.email,
});

export default connect(mapStateToProps)(FeedBack);
