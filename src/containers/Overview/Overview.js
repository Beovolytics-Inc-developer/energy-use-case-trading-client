import React from 'react';
import { connect } from 'react-redux';
import { defineMessages } from 'react-intl';
import { NavigationCardsPanel, RecentTransactions } from '../../components';
import { performGetRecentTransactions } from '../../action_performers/transactions';
import './Overview.css';
import PropTypes from 'prop-types';
import { PATHS } from '../../services/routes';

const currentBalanceData = {
    date: 'Mar 14, 2018',
    amount: '4,03€'
}; // TODO: remove

const messages = defineMessages({
    myProducer: {
        id: 'app.navigationCardsPanel.myProducer',
        defaultMessage: 'My Producer'
    },
    sellEnergy: {
        id: 'app.navigationCardsPanel.sellEnergy',
        defaultMessage: 'Sell Energy'
    },
    buyEnergy: {
        id: 'app.navigationCardsPanel.buyEnergy',
        defaultMessage: 'Buy Energy'
    },
    recentTransactionsTitle: {
        id: 'app.overviewPage.recentTransactions.title',
        defaultMessage: 'Most Recent Transactions'
    },
    recentTransactionsHeaderDate: {
        id: 'app.overviewPage.recentTransactions.headerDate',
        defaultMessage: 'Date'
    },
    recentTransactionsHeaderTransaction: {
        id: 'app.overviewPage.recentTransactions.headerTransaction',
        defaultMessage: 'Transactions'
    },
    recentTransactionsHeaderAmount: {
        id: 'app.overviewPage.recentTransactions.headerAmount',
        defaultMessage: 'Amount'
    },
    recentTransactionsCurrentBalance: {
        id: 'app.overviewPage.recentTransactions.currentBalance',
        defaultMessage: 'Current Balance'
    },
    recentTransactionsMore: {
        id: 'app.overviewPage.recentTransactions.more',
        defaultMessage: 'More'
    }
});

export class Overview extends React.Component {
    static mapStateToProps(state) {
        return {
            loading: state.Transactions.recentTransactions.loading,
            recentTransactions: state.Transactions.recentTransactions.data
        };
    }

    componentDidMount() {
        performGetRecentTransactions();
    }

    prepareLabels() {
        const { formatMessage } = this.context.intl;
        const entries = Object.keys(messages).map(key => [key, messages[key]]);

        return entries.reduce((labels, [labelName, messageDescriptor]) => {
            return {
                ...labels,
                [labelName]: formatMessage(messageDescriptor)
            };
        }, {});
    }

    navigateTo(route) {
        this.context.router.history.push(route);
    }

    openWattcoinPage() {
        this.navigateTo(PATHS.wattcoin.path);
    }

    render() {
        const labels = this.prepareLabels(messages);

        const navigationCards = [
            {
                type: PATHS.myProducer.id,
                title: labels.myProducer,
                path: PATHS.myProducer.path
            },
            {
                type: PATHS.buyEnergy.id,
                title: labels.buyEnergy,
                path: PATHS.buyEnergy.path
            },
            {
                type: PATHS.sellEnergy.id,
                title: labels.sellEnergy,
                path: PATHS.sellEnergy.path
            }
        ];

        return (
            <div className="overview-page">
                <NavigationCardsPanel
                    navigationCards={navigationCards}
                    onCardClick={route => {
                        this.navigateTo(route);
                    }}
                    labels={labels}
                />
                <div className="overview-content-container">
                    <RecentTransactions
                        transactions={this.props.recentTransactions}
                        currentBalance={currentBalanceData}
                        labels={labels}
                        onButtonClick={() => this.openWattcoinPage()}
                    />
                </div>
            </div>
        );
    }
}

Overview.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        }).isRequired
    }),
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};
Overview.propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.array
};
Overview.defaultProps = {
    loading: false,
    data: []
};

export default connect(Overview.mapStateToProps)(Overview);
