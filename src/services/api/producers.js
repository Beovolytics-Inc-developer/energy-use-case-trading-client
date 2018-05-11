import Axios from 'axios';
import { getUserData } from './users';
import { SESSION_API_URL, LIMIT, CURRENT_MARKET_PRICE } from '../../constants';

export function getProducer(id) {
    const result = { data: { producer: {} } };

    return Axios.get(`${SESSION_API_URL}/producers/${id}/get`).then(response => {
        if (response.data && response.data.producer) {
            const { producer } = response.data;
            result.data.producer = {
                ...producer,
                location: locationTag`${producer.street}, ${producer.postcode} ${producer.city}, ${producer.country}`,
                annualProduction: producer.productionOfLastDay,
                purchased: producer.energyPurchased,
                marketPrice: CURRENT_MARKET_PRICE,
                ethereumAddress: producer.dlAddress
            };
        }
        return result;
    });
}

function locationTag(strings, ...values) {
    const formatted = values.map((value, index) => {
        if (!!value) {
            return `${value}${strings[index + 1] || ''}`;
        }
        return '';
    });

    return formatted.join('');
}

export function getProducerHistory(/* producerId, { page = 0 } = {} */) {
    return Promise.resolve({
        data: {
            strategies: [
                {
                    date: 'Sep 12',
                    value: 'Change amount of energy 3000 kWh'
                },
                {
                    date: 'Feb 22',
                    value: 'Price change 2.4 ct/kWh'
                },
                {
                    date: 'Feb 12',
                    value: 'Change amount of energy 2300 kWh'
                },
                {
                    date: 'Jan 14',
                    value: 'Price change 3 ct/kWh'
                }
            ]
        }
    });
    // return Axios.get(`${SESSION_API_URL}/producers/${producerId}/offer/history`, {
    //     params: { limit: LIMIT, offset: page * LIMIT }
    // });
}

export function selectProducer(producerId) {
    return Axios.post(`${SESSION_API_URL}/producers/select`, { producerID: producerId });
}

export function getProducers({ page = 0, filter = [] } = {}) {
    let filterQuery = '';
    for (let i = 0; i < filter.length; i++) {
        const type = filter[i];
        const nextSymbol = i === filter.length - 1 ? '' : '&';
        filterQuery += `type=${type}${nextSymbol}`;
    }
    return Axios.get(`${SESSION_API_URL}/producers/direct?${filterQuery}`, {
        params: { limit: LIMIT, offset: page * LIMIT }
    });
}

export function getCurrentProducer() {
    return getUserData().then(response => {
        const { data } = response;
        return getProducer(data && data.user && data.user.currentProducerId);
    });
}

export function getOwnedProducerOffer(userId) {
    return Axios.get(`${SESSION_API_URL}/user/${userId}/producer/getOwnedProducer`);
}

export function addOwnedProducerOffer(producerId, offer) {
    return Axios.post(`${SESSION_API_URL}/producers/${producerId}/set`, offer);
}
